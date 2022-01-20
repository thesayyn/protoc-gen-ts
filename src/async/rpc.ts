import * as type from '../type.js';
import ts, { ModifierFlags, SyntaxKind } from 'typescript';
import descriptor from '../compiler/descriptor.js';
import { ConfigParameters } from '../index.js';
import { match } from 'ts-pattern';

const types = {
    void: ts.factory.createTypeReferenceNode('void'),
    never: ts.factory.createTypeReferenceNode('never'),
    undefined: ts.factory.createTypeReferenceNode('undefined'),
};
const tokens = {
    asterisk: ts.factory.createToken(SyntaxKind.AsteriskToken),
};

/**
 * Returns grpc-node compatible service description
 */
function createServiceDefinition(rootDescriptor: descriptor.FileDescriptorProto, serviceDescriptor: descriptor.ServiceDescriptorProto): ts.Expression
{
    return ts.factory.createObjectLiteralExpression(
        serviceDescriptor.method.map((methodDescriptor: descriptor.MethodDescriptorProto) => {
            return ts.factory.createPropertyAssignment(
                methodDescriptor.name,
                ts.factory.createStringLiteral(
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
    rootDescriptor: descriptor.FileDescriptorProto,
    serviceDescriptor: descriptor.ServiceDescriptorProto,
    grpcIdentifier: ts.Identifier,
): ts.ClassDeclaration
{
    return ts.factory.createClassDeclaration(
        undefined,
        [
            ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
            ts.factory.createModifier(ts.SyntaxKind.AbstractKeyword),
        ],
        ts.factory.createIdentifier(`${serviceDescriptor.name}Service`),
        undefined,
        undefined,
        [
            ts.factory.createPropertyDeclaration(
                undefined,
                [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
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
function createParameter(name: string, typename: ts.TypeNode, optional: boolean = false): ts.ParameterDeclaration
{
    return ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        name,
        optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        typename,
    );
}

function createMetadataAndCallOptionsParameters(grpcIdentifier: ts.Identifier): [ ts.ParameterDeclaration, ts.ParameterDeclaration ]
{
    return [
        createParameter(
            "metadata",
            ts.factory.createTypeReferenceNode(ts.factory.createQualifiedName(grpcIdentifier, "Metadata")),
            true,
        ),
        createParameter(
            "options",
            ts.factory.createTypeReferenceNode(ts.factory.createQualifiedName(grpcIdentifier, "CallOptions")),
            true,
        ),
    ];
}

/**
 * Returns grpc-node compatible service interface.
 */
export function createGrpcInterfaceType(
    rootDescriptor: descriptor.FileDescriptorProto,
    grpcIdentifier: ts.Identifier,
    config: ConfigParameters,
): ts.Statement[]
{
    const messageParameter = createParameter(
        "message",
        ts.factory.createTypeReferenceNode("P"),
    );

    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);

    const callOptionsParameterOpt = createParameter(
        "options",
        ts.factory.createTypeReferenceNode(ts.factory.createQualifiedName(grpcIdentifier, "CallOptions")),
        true,
    );
    const callbackParameter = createParameter(
        "callback",
        ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(grpcIdentifier, "requestCallback"),
            [ts.factory.createTypeReferenceNode("R")],
        ),
    );
    const unaryReturnType = ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(grpcIdentifier, "ClientUnaryCall")
    );
    const streamReturnType = ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(grpcIdentifier, "ClientReadableStream"),
        [ts.factory.createTypeReferenceNode("R")],
    );
    const writableReturnType = ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(grpcIdentifier, "ClientWritableStream"),
        [ts.factory.createTypeReferenceNode("P")],
    );
    const chunkReturnType = ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(grpcIdentifier, "ClientDuplexStream"),
        [
            ts.factory.createTypeReferenceNode("P"),
            ts.factory.createTypeReferenceNode("R"),
        ],
    );
    const promiseReturnType = ts.factory.createTypeReferenceNode("Promise", [
        ts.factory.createTypeReferenceNode("R"),
    ]);

    // interface GrpcUnaryInterface<P, R> {
    //   (message: P, metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>) : grpc_1.ClientUnaryCall;
    //   (message: P, metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>) : grpc_1.ClientUnaryCall;
    //   (message: P, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>) : grpc_1.ClientUnaryCall;
    //   (message: P, callback: grpc_1.requestCallback<todoObject>) : grpc_1.ClientUnaryCall;
    // }
    const unaryIface = ts.factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcUnaryServiceInterface",
        [
            ts.factory.createTypeParameterDeclaration("P"),
            ts.factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            ts.factory.createCallSignature(
                undefined,
                [
                    messageParameter,
                    metadataParameter,
                    callOptionsParameter,
                    callbackParameter,
                ],
                unaryReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, metadataParameter, callbackParameter],
                unaryReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, callOptionsParameter, callbackParameter],
                unaryReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, callbackParameter],
                unaryReturnType,
            ),
        ],
    );

    // interface GrpcPromiseServerInterface<P, R> {
    //   (request: P, metadata?: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<R> {
    //   (request: P, options?: grpc_1.CallOptions): Promise<R> {
    // }
    const promiseIface = ts.factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcPromiseServiceInterface",
        [
            ts.factory.createTypeParameterDeclaration("P"),
            ts.factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, metadataParameter, callOptionsParameterOpt],
                promiseReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, callOptionsParameterOpt],
                promiseReturnType,
            ),
        ],
    );

    // interface GrpcStreamInterface<P, R> {
    //   (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
    //   (message: P, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
    // }
    const streamIface = ts.factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcStreamServiceInterface",
        [
            ts.factory.createTypeParameterDeclaration("P"),
            ts.factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, metadataParameter, callOptionsParameterOpt],
                streamReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [messageParameter, callOptionsParameterOpt],
                streamReturnType,
            ),
        ],
    );

    // interface GrpcWritableStreamInterface<P, R> {
    //   (metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    //   (metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    //   (options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    //   (callback: grpc_1.requestCallback<_Object>): grpc_1.ClientWritableStream<P>;
    // }
    const writableIface = ts.factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpWritableServiceInterface",
        [
            ts.factory.createTypeParameterDeclaration("P"),
            ts.factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            ts.factory.createCallSignature(
                undefined,
                [metadataParameter, callOptionsParameter, callbackParameter],
                writableReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [metadataParameter, callbackParameter],
                writableReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [callOptionsParameter, callbackParameter],
                writableReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [callbackParameter],
                writableReturnType,
            ),
        ],
    );

    // interface GrpcChunkInterface<P, R> {
    //   (metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
    //   (options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
    // }
    const chunkIface = ts.factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcChunkServiceInterface",
        [
            ts.factory.createTypeParameterDeclaration("P"),
            ts.factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            ts.factory.createCallSignature(
                undefined,
                [metadataParameter, callOptionsParameterOpt],
                chunkReturnType,
            ),
            ts.factory.createCallSignature(
                undefined,
                [callOptionsParameterOpt],
                chunkReturnType,
            ),
        ],
    );

    return [unaryIface, streamIface, writableIface, chunkIface, promiseIface];
}

/**
 * Returns grpc-node compatible client streaming call method
 */
function createRpcMethod(
    rootDescriptor: descriptor.FileDescriptorProto,
    serviceDescriptor: descriptor.ServiceDescriptorProto,
    methodDescriptor: descriptor.MethodDescriptorProto,
    grpcIdentifier: ts.Identifier,
): ts.MethodDeclaration
{
    const { client_streaming = false, server_streaming = false, name } = methodDescriptor;

    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
    const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);

    const requestParameter = createParameter(
        'request',
        client_streaming
            ? ts.factory.createTypeReferenceNode('AsyncIterable', [ requestType ])
            : requestType
    );
    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);
    const type = match<[ boolean, boolean ], string>([ client_streaming, server_streaming ])
        .with([ false, false ], () => 'Unary')
        .with([ true, false ], () => 'ClientStream')
        .with([ false, true ], () => 'ServerStream')
        .with([ true, true ], () => 'BidiStream')
        .exhaustive();

    const makeRequestCall = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
            ts.factory.createSuper(),
            `make${type}Request`,
        ),
        [ requestType, responseType ],
        [
            ts.factory.createStringLiteral(getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor)),
            ts.factory.createIdentifier('request'),
            ts.factory.createIdentifier('metadata'),
            ts.factory.createIdentifier('options'),
        ],
    )

    // public async {{serverStreaming? * }}{{ method }}<RequestType, ResponseType>(request: {{clientStreaming ? AsyncIterable<RequestType> : RequestType }}, metadata?: Metadata, options?: CallOptions): {{serverStreaming? AsyncGenerator<ResponseType, void, never> : Promise<ResponseType> }}
    // {
    //      {{serverStreaming? yield* : return }} super.make{{ type }}Request<RequestType, ResponseType>({{ path }}, request, metadata, options);
    // }
    return ts.factory.createMethodDeclaration(
        [
            ts.factory.createDecorator(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(grpcIdentifier, 'methodDescriptor'),
                    [ requestType, responseType ],
                    [
                        ts.factory.createObjectLiteralExpression([
                            ts.factory.createPropertyAssignment(
                                'path',
                                ts.factory.createStringLiteral(
                                    getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor),
                                ),
                            ),
                            ts.factory.createPropertyAssignment(
                                'requestStream',
                                methodDescriptor.client_streaming
                                    ? ts.factory.createTrue()
                                    : ts.factory.createFalse(),
                            ),
                            ts.factory.createPropertyAssignment(
                                'responseStream',
                                methodDescriptor.server_streaming
                                    ? ts.factory.createTrue()
                                    : ts.factory.createFalse(),
                            ),
                        ]),
                    ],
                )
            ),
        ],
        ts.factory.createModifiersFromModifierFlags(ModifierFlags.Public | ModifierFlags.Async),
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
            ? ts.factory.createTypeReferenceNode('AsyncGenerator', [ responseType, types.void, types.undefined ])
            : ts.factory.createTypeReferenceNode('Promise', [ responseType ]),
        ts.factory.createBlock(
            [
                server_streaming
                    ? ts.factory.createExpressionStatement(
                        ts.factory.createYieldExpression(tokens.asterisk, makeRequestCall)
                    )
                    : ts.factory.createReturnStatement(makeRequestCall)
            ],
            true,
        ),
    );
}

export function createServiceClient(
    rootDescriptor: descriptor.FileDescriptorProto,
    serviceDescriptor: descriptor.ServiceDescriptorProto,
    grpcIdentifier: ts.Identifier,
    params: ConfigParameters,
): ts.ClassDeclaration {
    const members: ts.ClassElement[] = [
        // Add definition
        ts.factory.createPropertyDeclaration(
            undefined,
            [ ts.factory.createModifier(ts.SyntaxKind.StaticKeyword) ],
            'serviceName',
            undefined,
            undefined,
            ts.factory.createStringLiteral(serviceDescriptor.name),
        ),

        // Add constructor
        ts.factory.createConstructorDeclaration(
            undefined,
            undefined,
            [
                createParameter('address', ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
            ],
            ts.factory.createBlock(
                [
                    ts.factory.createExpressionStatement(
                        ts.factory.createCallExpression(
                            ts.factory.createSuper(),
                            undefined,
                            [ ts.factory.createIdentifier('address') ]
                        )
                    ),
                ],
                true,
            ),
        ),

        // Add methods
        ...serviceDescriptor.method.flatMap((methodDescriptor: descriptor.MethodDescriptorProto) => createRpcMethod(
            rootDescriptor,
            serviceDescriptor,
            methodDescriptor,
            grpcIdentifier,
        )),
    ];

    return ts.factory.createClassDeclaration(
        undefined,
        [
            ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)
        ],
        ts.factory.createIdentifier(`${serviceDescriptor.name}Client`),
        undefined,
        [
            ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                ts.factory.createExpressionWithTypeArguments(
                    ts.factory.createPropertyAccessExpression(grpcIdentifier, 'BaseClient'),
                    [],
                ),
            ]),
        ],
        members,
    );
}

function getRPCOutputType(rootDescriptor: descriptor.FileDescriptorProto, methodDescriptor: descriptor.MethodDescriptorProto): ts.TypeReferenceNode
{
    return ts.factory.createTypeReferenceNode(type.getTypeReference(rootDescriptor, methodDescriptor.output_type) as ts.Identifier);
}
function getRPCInputType(rootDescriptor: descriptor.FileDescriptorProto, methodDescriptor: descriptor.MethodDescriptorProto): ts.TypeReferenceNode
{
    return ts.factory.createTypeReferenceNode(type.getTypeReference(rootDescriptor, methodDescriptor.input_type) as ts.Identifier);
}
function getRPCPath(rootDescriptor: descriptor.FileDescriptorProto, serviceDescriptor: descriptor.ServiceDescriptorProto, methodDescriptor: descriptor.MethodDescriptorProto): string
{
    return `/${rootDescriptor.package ? `${rootDescriptor.package}.` : ''}${serviceDescriptor.name}/${methodDescriptor.name}`;
}
