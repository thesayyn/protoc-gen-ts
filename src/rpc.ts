import * as type from './type.js';
import {
    ClassDeclaration,
    ClassElement,
    Expression,
    factory,
    Identifier,
    ParameterDeclaration, Statement,
    SyntaxKind,
    TypeNode, TypeReferenceNode,
} from 'typescript';
import { FileDescriptorProto, MethodDescriptorProto, ServiceDescriptorProto } from './compiler/descriptor.js';
import { ConfigParameters } from './index.js';

/**
 * Returns grpc-node compatible service description
 */
function createServiceDefinition(rootDescriptor: FileDescriptorProto, serviceDescriptor: ServiceDescriptorProto): Expression
{
    return factory.createObjectLiteralExpression(
        serviceDescriptor.method.map((methodDescriptor: MethodDescriptorProto) => {
            return factory.createPropertyAssignment(
                methodDescriptor.name,
                factory.createObjectLiteralExpression(
                    [
                        factory.createPropertyAssignment(
                            "path",
                            factory.createStringLiteral(
                                getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor),
                            ),
                        ),
                        factory.createPropertyAssignment(
                            "requestStream",
                            methodDescriptor.client_streaming
                                ? factory.createTrue()
                                : factory.createFalse(),
                        ),
                        factory.createPropertyAssignment(
                            "responseStream",
                            methodDescriptor.server_streaming
                                ? factory.createTrue()
                                : factory.createFalse(),
                        ),
                        factory.createPropertyAssignment(
                            "requestSerialize",
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    createParameter(
                                        "message",
                                        getRPCInputType(rootDescriptor, methodDescriptor),
                                    ),
                                ],
                                undefined,
                                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createIdentifier("Buffer"),
                                        "from",
                                    ),
                                    undefined,
                                    [
                                        factory.createCallExpression(
                                            factory.createPropertyAccessExpression(
                                                factory.createIdentifier("message"),
                                                "serialize",
                                            ),
                                            undefined,
                                            undefined,
                                        ),
                                    ],
                                ),
                            ),
                        ),
                        factory.createPropertyAssignment(
                            "requestDeserialize",
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    createParameter(
                                        "bytes",
                                        factory.createTypeReferenceNode(
                                            factory.createIdentifier("Buffer"),
                                            undefined,
                                        ),
                                    ),
                                ],
                                undefined,
                                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        getRPCInputType(rootDescriptor, methodDescriptor).typeName as Identifier,
                                        "deserialize",
                                    ),
                                    undefined,
                                    [
                                        factory.createNewExpression(
                                            factory.createIdentifier("Uint8Array"),
                                            undefined,
                                            [factory.createIdentifier("bytes")],
                                        ),
                                    ],
                                ),
                            ),
                        ),
                        factory.createPropertyAssignment(
                            "responseSerialize",
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    createParameter(
                                        "message",
                                        factory.createTypeReferenceNode(
                                            getRPCOutputType(rootDescriptor, methodDescriptor).typeName,
                                            undefined,
                                        ),
                                    ),
                                ],
                                undefined,
                                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createIdentifier("Buffer"),
                                        "from",
                                    ),
                                    undefined,
                                    [
                                        factory.createCallExpression(
                                            factory.createPropertyAccessExpression(
                                                factory.createIdentifier("message"),
                                                "serialize",
                                            ),
                                            undefined,
                                            [],
                                        ),
                                    ],
                                ),
                            ),
                        ),
                        factory.createPropertyAssignment(
                            "responseDeserialize",
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    createParameter(
                                        "bytes",
                                        factory.createTypeReferenceNode(
                                            factory.createIdentifier("Buffer"),
                                            undefined,
                                        ),
                                    ),
                                ],
                                undefined,
                                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        getRPCOutputType(rootDescriptor, methodDescriptor).typeName as Identifier,
                                        "deserialize",
                                    ),
                                    undefined,
                                    [
                                        factory.createNewExpression(
                                            factory.createIdentifier("Uint8Array"),
                                            undefined,
                                            [factory.createIdentifier("bytes")],
                                        ),
                                    ],
                                ),
                            ),
                        ),
                    ],
                    true,
                ),
            );
        }),
        true,
    );
}

/**
 * Returns interface definition of the service description
 */
export function createUnimplementedService(
    rootDescriptor: FileDescriptorProto,
    serviceDescriptor: ServiceDescriptorProto,
    grpcIdentifier: Identifier,
): ClassDeclaration
{
    const members: ClassElement[] = [
        factory.createPropertyDeclaration(
            undefined,
            [factory.createModifier(SyntaxKind.StaticKeyword)],
            "definition",
            undefined,
            undefined,
            createServiceDefinition(rootDescriptor, serviceDescriptor),
        ),
        factory.createIndexSignature(
            undefined,
            undefined,
            [ createParameter("method", factory.createTypeReferenceNode(factory.createIdentifier('string'))) ],
            factory.createTypeReferenceNode(
                factory.createQualifiedName(grpcIdentifier, "UntypedHandleCall"),
            ),
        ),
    ];

    for (const methodDescriptor of serviceDescriptor.method)
    {
        const parameters = [];
        const callType: string|Error = [ new Error('unknown method type'), 'UnaryCall', 'ReadableStream', 'WritableStream', 'DuplexStream' ][Number(isUnary(methodDescriptor)) + Number(isClientStreaming(methodDescriptor)) + Number(isServerStreaming(methodDescriptor)) + Number(isBidi(methodDescriptor))];

        if (callType instanceof Error)
        {
            throw callType;
        }

        parameters.push(
            createParameter(
                'call',
                factory.createTypeReferenceNode(
                    factory.createQualifiedName(
                        grpcIdentifier,
                        factory.createIdentifier(`Server${callType}`),
                    ),
                    [
                        getRPCInputType(rootDescriptor, methodDescriptor),
                        getRPCOutputType(rootDescriptor, methodDescriptor),
                    ],
                ),
            ),
        );

        if (isUnary(methodDescriptor) || isClientStreaming(methodDescriptor)) {
            parameters.push(
                createParameter(
                    "callback",
                    factory.createTypeReferenceNode(
                        factory.createQualifiedName(
                            grpcIdentifier,
                            factory.createIdentifier("sendUnaryData"),
                        ),
                        [getRPCOutputType(rootDescriptor, methodDescriptor)],
                    ),
                ),
            );
        }

        members.push(
            factory.createMethodDeclaration(
                undefined,
                [factory.createModifier(SyntaxKind.AbstractKeyword)],
                undefined,
                methodDescriptor.name,
                undefined,
                undefined,
                parameters,
                factory.createTypeReferenceNode('void'),
                undefined,
            ),
        );
    }

    return factory.createClassDeclaration(
        undefined,
        [
            factory.createModifier(SyntaxKind.ExportKeyword),
            factory.createModifier(SyntaxKind.AbstractKeyword),
        ],
        factory.createIdentifier(
            `Unimplemented${serviceDescriptor.name}Service`,
        ),
        undefined,
        undefined,
        members,
    );
}

/**
 * Returns grpc-node compatible client unary promise method
 */
function createUnaryRpcPromiseMethod(
    rootDescriptor: FileDescriptorProto,
    methodDescriptor: MethodDescriptorProto,
    grpcIdentifier: Identifier,
) {
    const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);

    // super.put(message, metadata, options, (error: grpc_1.ServiceError, response: Result) => {
    //   if (error) {
    //     reject(error);
    //   } else {
    //      resolve(response);
    //   }
    // }
    const promiseBody = factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createSuper(),
            methodDescriptor.name,
        ),
        undefined,
        [
            factory.createIdentifier("message"),
            factory.createIdentifier("metadata"),
            factory.createIdentifier("options"),
            factory.createArrowFunction(
                undefined,
                undefined,
                [
                    createParameter(
                        "error",
                        factory.createTypeReferenceNode(factory.createQualifiedName(grpcIdentifier, "ServiceError")),
                    ),
                    createParameter("response", responseType),
                ],
                undefined,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                    [
                        factory.createIfStatement(
                            factory.createIdentifier("error"),
                            factory.createBlock([
                                factory.createExpressionStatement(
                                    factory.createCallExpression(
                                        factory.createIdentifier("reject"),
                                        undefined,
                                        [factory.createIdentifier("error")],
                                    ),
                                ),
                            ]),
                            factory.createBlock([
                                factory.createExpressionStatement(
                                    factory.createCallExpression(
                                        factory.createIdentifier("resolve"),
                                        undefined,
                                        [factory.createIdentifier("response")],
                                    ),
                                ),
                            ]),
                        ),
                    ],
                    true,
                ),
            ),
        ],
    );

    // {
    //    if (!metadata) metadata = new grpc_1.Metadata;
    //    if (!options) options = {};
    //    return new Promise((resolve, reject) => PROMISE_BODY)
    // }
    const functionBody = factory.createBlock([
        factory.createIfStatement(
            factory.createPrefixUnaryExpression(
                SyntaxKind.ExclamationToken,
                factory.createIdentifier("metadata"),
            ),
            factory.createBlock([
                factory.createExpressionStatement(
                    factory.createBinaryExpression(
                        factory.createIdentifier("metadata"),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createNewExpression(
                            factory.createPropertyAccessExpression(
                                grpcIdentifier,
                                "Metadata",
                            ),
                            undefined,
                            undefined,
                        ),
                    ),
                ),
            ]),
        ),
        factory.createIfStatement(
            factory.createPrefixUnaryExpression(
                SyntaxKind.ExclamationToken,
                factory.createIdentifier("options"),
            ),
            factory.createBlock([
                factory.createExpressionStatement(
                    factory.createBinaryExpression(
                        factory.createIdentifier("options"),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createObjectLiteralExpression([]),
                    ),
                ),
            ]),
        ),
        factory.createReturnStatement(
            factory.createNewExpression(
                factory.createIdentifier("Promise"),
                undefined,
                [
                    factory.createArrowFunction(
                        undefined,
                        undefined,
                        [
                            createParameter("resolve", factory.createTypeReferenceNode('() => void')),
                            createParameter("reject", factory.createTypeReferenceNode('() => void'))
                        ],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        promiseBody,
                    ),
                ],
            ),
        ),
    ]);

    const messageParameter = createParameter("message", requestType);
    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);
    const returnType = factory.createTypeReferenceNode("Promise", [
        responseType,
    ]);

    return [
        factory.createPropertyDeclaration(
            undefined,
            undefined,
            methodDescriptor.name,
            undefined,
            factory.createTypeReferenceNode("GrpcPromiseServiceInterface", [
                requestType,
                responseType,
            ]),

            factory.createArrowFunction(
                undefined,
                undefined,
                [
                    messageParameter,
                    createParameter(
                        "metadata",
                        factory.createUnionTypeNode([
                            metadataParameter.type!,
                            callOptionsParameter.type!,
                        ]),
                        true,
                    ),
                    callOptionsParameter,
                ],
                returnType,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                functionBody,
            ),
        ),
    ];
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
 * Returns grpc-node compatible service interface.
 */
export function createGrpcInterfaceType(
    rootDescriptor: FileDescriptorProto,
    grpcIdentifier: Identifier,
    config: ConfigParameters,
): Statement[]
{
    const messageParameter = createParameter(
        "message",
        factory.createTypeReferenceNode("P"),
    );

    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);

    const callOptionsParameterOpt = createParameter(
        "options",
        factory.createTypeReferenceNode(factory.createQualifiedName(grpcIdentifier, "CallOptions")),
        true,
    );
    const callbackParameter = createParameter(
        "callback",
        factory.createTypeReferenceNode(
            factory.createQualifiedName(grpcIdentifier, "requestCallback"),
            [factory.createTypeReferenceNode("R")],
        ),
    );
    const unaryReturnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientUnaryCall")
    );
    const streamReturnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientReadableStream"),
        [factory.createTypeReferenceNode("R")],
    );
    const writableReturnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientWritableStream"),
        [factory.createTypeReferenceNode("P")],
    );
    const chunkReturnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientDuplexStream"),
        [
            factory.createTypeReferenceNode("P"),
            factory.createTypeReferenceNode("R"),
        ],
    );
    const promiseReturnType = factory.createTypeReferenceNode("Promise", [
        factory.createTypeReferenceNode("R"),
    ]);

    // interface GrpcUnaryInterface<P, R> {
    //   (message: P, metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>) : grpc_1.ClientUnaryCall;
    //   (message: P, metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>) : grpc_1.ClientUnaryCall;
    //   (message: P, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>) : grpc_1.ClientUnaryCall;
    //   (message: P, callback: grpc_1.requestCallback<todoObject>) : grpc_1.ClientUnaryCall;
    // }
    const unaryIface = factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcUnaryServiceInterface",
        [
            factory.createTypeParameterDeclaration("P"),
            factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            factory.createCallSignature(
                undefined,
                [
                    messageParameter,
                    metadataParameter,
                    callOptionsParameter,
                    callbackParameter,
                ],
                unaryReturnType,
            ),
            factory.createCallSignature(
                undefined,
                [messageParameter, metadataParameter, callbackParameter],
                unaryReturnType,
            ),
            factory.createCallSignature(
                undefined,
                [messageParameter, callOptionsParameter, callbackParameter],
                unaryReturnType,
            ),
            factory.createCallSignature(
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
    const promiseIface = factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcPromiseServiceInterface",
        [
            factory.createTypeParameterDeclaration("P"),
            factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            factory.createCallSignature(
                undefined,
                [messageParameter, metadataParameter, callOptionsParameterOpt],
                promiseReturnType,
            ),
            factory.createCallSignature(
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
    const streamIface = factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcStreamServiceInterface",
        [
            factory.createTypeParameterDeclaration("P"),
            factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            factory.createCallSignature(
                undefined,
                [messageParameter, metadataParameter, callOptionsParameterOpt],
                streamReturnType,
            ),
            factory.createCallSignature(
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
    const writableIface = factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpWritableServiceInterface",
        [
            factory.createTypeParameterDeclaration("P"),
            factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            factory.createCallSignature(
                undefined,
                [metadataParameter, callOptionsParameter, callbackParameter],
                writableReturnType,
            ),
            factory.createCallSignature(
                undefined,
                [metadataParameter, callbackParameter],
                writableReturnType,
            ),
            factory.createCallSignature(
                undefined,
                [callOptionsParameter, callbackParameter],
                writableReturnType,
            ),
            factory.createCallSignature(
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
    const chunkIface = factory.createInterfaceDeclaration(
        undefined,
        undefined,
        "GrpcChunkServiceInterface",
        [
            factory.createTypeParameterDeclaration("P"),
            factory.createTypeParameterDeclaration("R"),
        ],
        undefined,
        [
            factory.createCallSignature(
                undefined,
                [metadataParameter, callOptionsParameterOpt],
                chunkReturnType,
            ),
            factory.createCallSignature(
                undefined,
                [callOptionsParameterOpt],
                chunkReturnType,
            ),
        ],
    );

    return [unaryIface, streamIface, writableIface, chunkIface, promiseIface];
}

/**
 * Returns grpc-node compatible client unary method
 */
function createUnaryRpcMethod(
    rootDescriptor: FileDescriptorProto,
    methodDescriptor: MethodDescriptorProto,
    grpcIdentifier: Identifier,
) {
    const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
    const messageParameter = createParameter("message", requestType);

    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);

    const callbackParameter = createParameter(
        "callback",
        factory.createTypeReferenceNode(
            factory.createQualifiedName(grpcIdentifier, "requestCallback"),
            [responseType],
        ),
    );
    const returnType = factory.createTypeReferenceNode(factory.createQualifiedName(
        grpcIdentifier,
        "ClientUnaryCall",
    ));

    //   addTodo: GrpcInterface<addTodoParams, todoObject> = (message: addTodoParams, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<todoObject>, options?: grpc_1.CallOptions | grpc_1.requestCallback<todoObject>, callback?: grpc_1.requestCallback<todoObject>) : grpc_1.ClientUnaryCall => {
    //     return super.addTodo(message, metadata, options, callback);
    // }
    return [
        factory.createPropertyDeclaration(
            undefined,
            undefined,
            methodDescriptor.name,
            undefined,
            factory.createTypeReferenceNode("GrpcUnaryServiceInterface", [
                requestType,
                responseType,
            ]),
            factory.createArrowFunction(
                undefined,
                undefined,
                [
                    messageParameter,
                    createParameter(
                        "metadata",
                        factory.createUnionTypeNode([
                            metadataParameter.type!,
                            callOptionsParameter.type!,
                            callbackParameter.type!,
                        ]),
                    ),
                    createParameter(
                        "options",
                        factory.createUnionTypeNode([
                            callOptionsParameter.type!,
                            callbackParameter.type!,
                        ]),
                        true,
                    ),
                    createParameter(
                        "callback",
                        factory.createTypeReferenceNode(
                            factory.createQualifiedName(grpcIdentifier, "requestCallback"),
                            [responseType],
                        ),
                        true,
                    ),
                ],
                returnType,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                    [
                        factory.createReturnStatement(
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createSuper(),
                                    methodDescriptor.name,
                                ),
                                undefined,
                                [
                                    factory.createIdentifier("message"),
                                    factory.createIdentifier("metadata"),
                                    factory.createIdentifier("options"),
                                    factory.createIdentifier("callback"),
                                ],
                            ),
                        ),
                    ],
                    true,
                ),
            ),
        ),
    ];
}

/**
 * Returns grpc-node compatible client streaming call method
 */
function createClientStreamingRpcMethod(
    rootDescriptor: FileDescriptorProto,
    methodDescriptor: MethodDescriptorProto,
    grpcIdentifier: Identifier,
): ClassElement[] {
    const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);

    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);

    const callbackParameter = createParameter(
        "callback",
        factory.createTypeReferenceNode(
            factory.createQualifiedName(grpcIdentifier, "requestCallback"),
            [ responseType ],
        ),
    );
    const returnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientWritableStream"),
        [ requestType ],
    );

    //     put(metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<_Object>,
    //         options?: grpc_1.CallOptions | grpc_1.requestCallback<_Object>,
    //         callback?: grpc_1.requestCallback<_Object>): grpc_1.ClientWritableStream<Put> {
    return [
        factory.createPropertyDeclaration(
            undefined,
            undefined,
            methodDescriptor.name,
            undefined,
            factory.createTypeReferenceNode("GrpWritableServiceInterface", [
                requestType,
                responseType,
            ]),

            factory.createArrowFunction(
                undefined,
                undefined,
                [
                    createParameter(
                        "metadata",
                        factory.createUnionTypeNode([
                            metadataParameter.type!,
                            callOptionsParameter.type!,
                            callbackParameter.type!,
                        ]),
                    ),
                    createParameter(
                        "options",
                        factory.createUnionTypeNode([
                            callOptionsParameter.type!,
                            callbackParameter.type!,
                        ]),
                        true,
                    ),
                    createParameter(
                        "callback",
                        factory.createUnionTypeNode([ callbackParameter.type! ]),
                        true,
                    ),
                ],
                returnType,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                    [
                        factory.createReturnStatement(
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createSuper(),
                                    methodDescriptor.name,
                                ),
                                undefined,
                                [
                                    factory.createIdentifier("metadata"),
                                    factory.createIdentifier("options"),
                                    factory.createIdentifier("callback"),
                                ],
                            ),
                        ),
                    ],
                    true,
                ),
            ),
        ),
    ];
}

/**
 * Returns grpc-node compatible server streaming call method
 */
function createServerStreamingRpcMethod(
    rootDescriptor: FileDescriptorProto,
    methodDescriptor: MethodDescriptorProto,
    grpcIdentifier: Identifier,
): ClassElement[] {
    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
    const messageParameter = createParameter("message", requestType);

    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);

    const returnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientReadableStream"),
        [ requestType ],
    );

    return [
        factory.createPropertyDeclaration(
            undefined,
            undefined,
            methodDescriptor.name,
            undefined,
            factory.createTypeReferenceNode("GrpcStreamServiceInterface", [
                requestType,
                requestType,
            ]),

            factory.createArrowFunction(
                undefined,
                undefined,
                [
                    messageParameter,
                    createParameter(
                        "metadata",
                        factory.createUnionTypeNode([
                            metadataParameter.type!,
                            callOptionsParameter.type!,
                        ]),
                        true,
                    ),
                    createParameter(
                        "options",
                        factory.createUnionTypeNode([ callOptionsParameter.type! ]),
                        true,
                    ),
                ],
                returnType,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                    [
                        factory.createReturnStatement(
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createSuper(),
                                    methodDescriptor.name,
                                ),
                                undefined,
                                [
                                    factory.createIdentifier("message"),
                                    factory.createIdentifier("metadata"),
                                    factory.createIdentifier("options"),
                                ],
                            ),
                        ),
                    ],
                    true,
                ),
            ),
        ),
    ];
}

/**
 * Returns grpc-node compatible client streaming call method
 */
function createBidiStreamingRpcMethod(
    rootDescriptor: FileDescriptorProto,
    methodDescriptor: MethodDescriptorProto,
    grpcIdentifier: Identifier,
): ClassElement[] {
    const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
    const requestType = getRPCInputType(rootDescriptor, methodDescriptor);

    const [ metadataParameter, callOptionsParameter ] = createMetadataAndCallOptionsParameters(grpcIdentifier);

    const returnType = factory.createTypeReferenceNode(
        factory.createQualifiedName(grpcIdentifier, "ClientDuplexStream"),
        [
            requestType,
            responseType,
        ],
    );

    return [
        factory.createPropertyDeclaration(
            undefined,
            undefined,
            methodDescriptor.name,
            undefined,
            factory.createTypeReferenceNode("GrpcChunkServiceInterface", [
                requestType,
                responseType,
            ]),

            factory.createArrowFunction(
                undefined,
                undefined,
                [
                    createParameter(
                        "metadata",
                        factory.createUnionTypeNode([
                            metadataParameter.type!,
                            callOptionsParameter.type!,
                        ]),
                        true,
                    ),
                    createParameter(
                        "options",
                        factory.createUnionTypeNode([ callOptionsParameter.type! ]),
                        true,
                    ),
                ],
                returnType,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                    [
                        factory.createReturnStatement(
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createSuper(),
                                    methodDescriptor.name,
                                ),
                                undefined,
                                [
                                    factory.createIdentifier("metadata"),
                                    factory.createIdentifier("options"),
                                ],
                            ),
                        ),
                    ],
                    true,
                ),
            ),
        ),
    ];
}

export function createServiceClient(
    rootDescriptor: FileDescriptorProto,
    serviceDescriptor: ServiceDescriptorProto,
    grpcIdentifier: Identifier,
    params: ConfigParameters,
): ClassDeclaration {
    const members: ClassElement[] = [
        // Add constructor
        factory.createConstructorDeclaration(
            undefined,
            undefined,
            [
                createParameter(
                    "address",
                    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
                ),
                createParameter(
                    "credentials",
                    factory.createTypeReferenceNode(
                        factory.createQualifiedName(
                            grpcIdentifier,
                            "ChannelCredentials",
                        ),
                    ),
                ),
                createParameter(
                    "options",
                    factory.createTypeReferenceNode("Partial", [
                        factory.createTypeReferenceNode(factory.createQualifiedName(grpcIdentifier, "ChannelOptions")),
                    ]),
                    true,
                ),
            ],

            factory.createBlock(
                [
                    factory.createExpressionStatement(factory.createCallExpression(factory.createSuper(), undefined, [
                        factory.createIdentifier("address"),
                        factory.createIdentifier("credentials"),
                        factory.createIdentifier("options"),
                    ])),
                ],
                true,
            ),
        ),
        // Add methods
        ...serviceDescriptor.method.flatMap((methodDescriptor: MethodDescriptorProto) => getGeneratorForMethod(methodDescriptor, params)(
            rootDescriptor,
            methodDescriptor,
            grpcIdentifier,
        )),
    ];

    return factory.createClassDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        factory.createIdentifier(`${serviceDescriptor.name}Client`),
        undefined,
        [
            factory.createHeritageClause(SyntaxKind.ExtendsKeyword, [
                factory.createExpressionWithTypeArguments(
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            grpcIdentifier,
                            "makeGenericClientConstructor",
                        ),
                        undefined,
                        [
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier(
                                    `Unimplemented${serviceDescriptor.name}Service`,
                                ),
                                "definition",
                            ),
                            factory.createStringLiteral(serviceDescriptor.name),
                            factory.createObjectLiteralExpression(),
                        ],
                    ),
                    [],
                ),
            ]),
        ],
        members,
    );
}

type GeneratorFunction = (rootDescriptor: FileDescriptorProto, methodDescriptor: MethodDescriptorProto, grpcIdentifier: Identifier) => ClassElement[];
function getGeneratorForMethod(methodDescriptor: MethodDescriptorProto, params: { unary_rpc_promise?: boolean }): GeneratorFunction {
    switch (true)
    {
        case isUnary(methodDescriptor) && !params.unary_rpc_promise:
        {
            return createUnaryRpcMethod;
        }

        case isUnary(methodDescriptor):
        {
            return createUnaryRpcPromiseMethod;
        }

        case isClientStreaming(methodDescriptor):
        {
            return createClientStreamingRpcMethod;
        }

        case isServerStreaming(methodDescriptor):
        {
            return createServerStreamingRpcMethod;
        }

        case isBidi(methodDescriptor):
        default:
        {
            return createBidiStreamingRpcMethod;
        }
    }
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

function isUnary(methodDescriptor: MethodDescriptorProto): boolean
{
    return !methodDescriptor.client_streaming && !methodDescriptor.server_streaming;
}
function isClientStreaming(methodDescriptor: MethodDescriptorProto): boolean
{
    return methodDescriptor.client_streaming && !methodDescriptor.server_streaming;
}
function isServerStreaming(methodDescriptor: MethodDescriptorProto): boolean
{
    return !methodDescriptor.client_streaming && methodDescriptor.server_streaming;
}
function isBidi(methodDescriptor: MethodDescriptorProto): boolean
{
    return methodDescriptor.client_streaming && methodDescriptor.server_streaming;
}
