import * as type from '../type.js';
import ts, {
    ClassDeclaration,
    ClassElement, Expression,
    factory,
    Identifier,
    MethodDeclaration,
    ModifierFlags, ParameterDeclaration, Statement,
    SyntaxKind, TypeNode, TypeReferenceNode,
} from 'typescript';
import { FileDescriptorProto, MethodDescriptorProto, ServiceDescriptorProto } from '../compiler/descriptor.js';
import { ConfigParameters } from '../index.js';
import { match } from 'ts-pattern';

const types = {
    void: factory.createTypeReferenceNode('void'),
    never: factory.createTypeReferenceNode('never'),
    undefined: factory.createTypeReferenceNode('undefined'),
};
const tokens = {
    asterisk: factory.createToken(SyntaxKind.AsteriskToken),
};

/**
 * Returns grpc-node compatible service description
 */
function createServiceDefinition(rootDescriptor: FileDescriptorProto, serviceDescriptor: ServiceDescriptorProto): Expression
{
    return factory.createObjectLiteralExpression(
        serviceDescriptor.method.map((methodDescriptor: MethodDescriptorProto) => {
            return factory.createPropertyAssignment(
                methodDescriptor.name,
                factory.createStringLiteral(
                    getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor),
                ),
            );
        }),
        true,
    );
}

/**
 * Returns interface definition of the service description
 */
export function createDefinition(
    rootDescriptor: FileDescriptorProto,
    serviceDescriptor: ServiceDescriptorProto,
    grpcIdentifier: Identifier,
): ClassDeclaration
{
    return factory.createClassDeclaration(
        undefined,
        [
            factory.createModifier(SyntaxKind.ExportKeyword),
            factory.createModifier(SyntaxKind.AbstractKeyword),
        ],
        factory.createIdentifier(`${serviceDescriptor.name}Service`),
        undefined,
        undefined,
        [
            factory.createPropertyDeclaration(
                undefined,
                [factory.createModifier(SyntaxKind.StaticKeyword)],
                "definition",
                undefined,
                undefined,
                createServiceDefinition(rootDescriptor, serviceDescriptor),
            ),
        ],
    );
}

/**
 * Create typed parameter
 */
function createParameter(name: string, typename: TypeNode, optional: boolean = false): ParameterDeclaration
{
    return factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        name,
        optional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
        typename,
    );
}

function createMetadataAndCallOptionsParameters(grpcIdentifier: Identifier): [ ParameterDeclaration, ParameterDeclaration ]
{
    return [
        createParameter(
            "metadata",
            factory.createTypeReferenceNode(factory.createQualifiedName(grpcIdentifier, "Metadata")),
            true,
        ),
        createParameter(
            "options",
            factory.createTypeReferenceNode(factory.createQualifiedName(grpcIdentifier, "CallOptions")),
            true,
        ),
    ];
}

/**
 * Returns grpc-node compatible client streaming call method
 */
function createRpcMethod(
    rootDescriptor: FileDescriptorProto,
    serviceDescriptor: ServiceDescriptorProto,
    methodDescriptor: MethodDescriptorProto,
    grpcIdentifier: Identifier,
): MethodDeclaration
{
    const { client_streaming = false, server_streaming = false, name } = methodDescriptor;

    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
    const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);

    const requestParameter = createParameter(
        'request',
        client_streaming
            ? factory.createTypeReferenceNode('AsyncIterable', [ requestType ])
            : requestType
    );
    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);
    const type = match<[ boolean, boolean ], string>([ client_streaming, server_streaming ])
        .with([ false, false ], () => 'Unary')
        .with([ true, false ], () => 'ClientStream')
        .with([ false, true ], () => 'ServerStream')
        .with([ true, true ], () => 'BidiStream')
        .exhaustive();

    const makeRequestCall = factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createSuper(),
            `make${type}Request`,
        ),
        [ requestType, responseType ],
        [
            factory.createStringLiteral(getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor)),
            factory.createIdentifier('request'),
            factory.createIdentifier('metadata'),
            factory.createIdentifier('options'),
        ],
    )

    // public async {{serverStreaming? * }}{{ method }}<RequestType, ResponseType>(request: {{clientStreaming ? AsyncIterable<RequestType> : RequestType }}, metadata?: Metadata, options?: CallOptions): {{serverStreaming? AsyncGenerator<ResponseType, void, undefined> : Promise<ResponseType> }}
    // {
    //      {{serverStreaming? yield* : return }} super.make{{ type }}Request<RequestType, ResponseType>({{ path }}, request, metadata, options);
    // }
    return factory.createMethodDeclaration(
        [
            factory.createDecorator(
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(grpcIdentifier, 'methodDescriptor'),
                    [ requestType, responseType ],
                    [
                        factory.createObjectLiteralExpression([
                            factory.createPropertyAssignment(
                                'path',
                                factory.createStringLiteral(
                                    getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor),
                                ),
                            ),
                            factory.createPropertyAssignment(
                                'requestStream',
                                methodDescriptor.client_streaming
                                    ? factory.createTrue()
                                    : factory.createFalse(),
                            ),
                            factory.createPropertyAssignment(
                                'responseStream',
                                methodDescriptor.server_streaming
                                    ? factory.createTrue()
                                    : factory.createFalse(),
                            ),
                        ]),
                    ],
                )
            ),
        ],
        factory.createModifiersFromModifierFlags(ModifierFlags.Public | ModifierFlags.Async),
        server_streaming
            ? tokens.asterisk
            : undefined,
        name,
        undefined,
        undefined,
        [
            requestParameter,
            metadataParameter,
            callOptionsParameter,
        ],
        server_streaming
            ? factory.createTypeReferenceNode('AsyncGenerator', [ responseType, types.void, types.undefined ])
            : factory.createTypeReferenceNode('Promise', [ responseType ]),
        factory.createBlock(
            [
                server_streaming
                    ? factory.createExpressionStatement(
                        factory.createYieldExpression(tokens.asterisk, makeRequestCall)
                    )
                    : factory.createReturnStatement(makeRequestCall)
            ],
            true,
        ),
    );
}

export function createServiceClient(
    rootDescriptor: FileDescriptorProto,
    serviceDescriptor: ServiceDescriptorProto,
    grpcIdentifier: Identifier,
    params: ConfigParameters,
): ClassDeclaration {
    const members: ClassElement[] = [
        // Add definition
        factory.createPropertyDeclaration(
            undefined,
            [ factory.createModifier(SyntaxKind.StaticKeyword) ],
            'serviceName',
            undefined,
            undefined,
            factory.createStringLiteral(serviceDescriptor.name),
        ),

        // Add constructor
        factory.createConstructorDeclaration(
            undefined,
            undefined,
            [
                createParameter('address', factory.createKeywordTypeNode(SyntaxKind.StringKeyword)),
            ],
            factory.createBlock(
                [
                    factory.createExpressionStatement(
                        factory.createCallExpression(
                            factory.createSuper(),
                            undefined,
                            [ factory.createIdentifier('address') ]
                        )
                    ),
                ],
                true,
            ),
        ),

        // Add methods
        ...serviceDescriptor.method.flatMap((methodDescriptor: MethodDescriptorProto) => createRpcMethod(
            rootDescriptor,
            serviceDescriptor,
            methodDescriptor,
            grpcIdentifier,
        )),
    ];

    return factory.createClassDeclaration(
        undefined,
        [
            factory.createModifier(SyntaxKind.ExportKeyword)
        ],
        factory.createIdentifier(`${serviceDescriptor.name}Client`),
        undefined,
        [
            factory.createHeritageClause(SyntaxKind.ExtendsKeyword, [
                factory.createExpressionWithTypeArguments(
                    factory.createPropertyAccessExpression(grpcIdentifier, 'BaseClient'),
                    [],
                ),
            ]),
        ],
        members,
    );
}

function getRPCOutputType(rootDescriptor: FileDescriptorProto, methodDescriptor: MethodDescriptorProto): TypeReferenceNode
{
    return factory.createTypeReferenceNode(type.getTypeReference(rootDescriptor, methodDescriptor.output_type) as Identifier);
}
function getRPCInputType(rootDescriptor: FileDescriptorProto, methodDescriptor: MethodDescriptorProto): TypeReferenceNode
{
    return factory.createTypeReferenceNode(type.getTypeReference(rootDescriptor, methodDescriptor.input_type) as Identifier);
}
function getRPCPath(rootDescriptor: FileDescriptorProto, serviceDescriptor: ServiceDescriptorProto, methodDescriptor: MethodDescriptorProto): string
{
    return `/${rootDescriptor.package ? `${rootDescriptor.package}.` : ''}${serviceDescriptor.name}/${methodDescriptor.name}`;
}
