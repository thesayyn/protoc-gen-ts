import * as type from "./type";
import * as descriptor from "./compiler/descriptor";
import * as ts from "typescript";
import * as comment from "./comment";

/**
 * Returns grpc-node compatible service description
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 */
function createServiceDefinition(
  rootDescriptor: descriptor.FileDescriptorProto,
  serviceDescriptor: descriptor.ServiceDescriptorProto,
) {
  return ts.factory.createObjectLiteralExpression(
    serviceDescriptor.method.map(
      (methodDescriptor: descriptor.MethodDescriptorProto) => {
        return ts.factory.createPropertyAssignment(
          methodDescriptor.name,
          ts.factory.createObjectLiteralExpression(
            [
              ts.factory.createPropertyAssignment(
                "path",
                ts.factory.createStringLiteral(
                  getRPCPath(
                    rootDescriptor,
                    serviceDescriptor,
                    methodDescriptor,
                  ),
                ),
              ),
              ts.factory.createPropertyAssignment(
                "requestStream",
                methodDescriptor.client_streaming
                  ? ts.factory.createTrue()
                  : ts.factory.createFalse(),
              ),
              ts.factory.createPropertyAssignment(
                "responseStream",
                methodDescriptor.server_streaming
                  ? ts.factory.createTrue()
                  : ts.factory.createFalse(),
              ),
              ts.factory.createPropertyAssignment(
                "requestSerialize",
                ts.factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    createParameter(
                      "message",
                      getRPCInputType(rootDescriptor, methodDescriptor),
                    ),
                  ],
                  undefined,
                  ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                  ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                      ts.factory.createIdentifier("Buffer"),
                      "from",
                    ),
                    undefined,
                    [
                      ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                          ts.factory.createIdentifier("message"),
                          "serialize",
                        ),
                        undefined,
                        undefined,
                      ),
                    ],
                  ),
                ),
              ),
              ts.factory.createPropertyAssignment(
                "requestDeserialize",
                ts.factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    createParameter(
                      "bytes",
                      ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("Buffer"),
                        undefined,
                      ),
                    ),
                  ],
                  undefined,
                  ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                  ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                      getRPCInputTypeExpr(rootDescriptor, methodDescriptor),
                      "deserialize",
                    ),
                    undefined,
                    [
                      ts.factory.createNewExpression(
                        ts.factory.createIdentifier("Uint8Array"),
                        undefined,
                        [ts.factory.createIdentifier("bytes")],
                      ),
                    ],
                  ),
                ),
              ),
              ts.factory.createPropertyAssignment(
                "responseSerialize",
                ts.factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    createParameter(
                      "message",
                      getRPCOutputType(rootDescriptor, methodDescriptor),
                    ),
                  ],
                  undefined,
                  ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                  ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                      ts.factory.createIdentifier("Buffer"),
                      "from",
                    ),
                    undefined,
                    [
                      ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                          ts.factory.createIdentifier("message"),
                          "serialize",
                        ),
                        undefined,
                        [],
                      ),
                    ],
                  ),
                ),
              ),
              ts.factory.createPropertyAssignment(
                "responseDeserialize",
                ts.factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    createParameter(
                      "bytes",
                      ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("Buffer"),
                        undefined,
                      ),
                    ),
                  ],
                  undefined,
                  ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                  ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                      getRPCOutputTypeExpr(rootDescriptor, methodDescriptor),
                      "deserialize",
                    ),
                    undefined,
                    [
                      ts.factory.createNewExpression(
                        ts.factory.createIdentifier("Uint8Array"),
                        undefined,
                        [ts.factory.createIdentifier("bytes")],
                      ),
                    ],
                  ),
                ),
              ),
            ],
            true,
          ),
        );
      },
    ),
    true,
  );
}

/**
 * Returns interface definition of the service description
 */
export function createUnimplementedServer(
  rootDescriptor: descriptor.FileDescriptorProto,
  serviceDescriptor: descriptor.ServiceDescriptorProto,
  grpcIdentifier: ts.Identifier,
) {
  const members: Array<ts.ClassElement> = [
    ts.factory.createPropertyDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
      "definition",
      undefined,
      undefined,
      createServiceDefinition(rootDescriptor, serviceDescriptor),
    ),
    ts.factory.createIndexSignature(
      undefined,
      undefined,
      [
        createParameter(
          "method",
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ),
      ],
      ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(grpcIdentifier, "UntypedHandleCall"),
      ),
    ),
  ];

  for (const methodDescriptor of serviceDescriptor.method) {
    const parameters = [];
    let callType: string;

    if (isUnary(methodDescriptor)) {
      callType = "ServerUnaryCall";
    } else if (isClientStreaming(methodDescriptor)) {
      callType = "ServerReadableStream";
    } else if (isServerStreaming(methodDescriptor)) {
      callType = "ServerWritableStream";
    } else if (isBidi(methodDescriptor)) {
      callType = "ServerDuplexStream";
    }

    parameters.push(
      createParameter(
        "call",
        ts.factory.createTypeReferenceNode(
          ts.factory.createQualifiedName(
            grpcIdentifier,
            ts.factory.createIdentifier(callType),
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
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(
              grpcIdentifier,
              ts.factory.createIdentifier("sendUnaryData"),
            ),
            [getRPCOutputType(rootDescriptor, methodDescriptor)],
          ),
        ),
      );
    }

    members.push(
      ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.AbstractKeyword)],
        undefined,
        methodDescriptor.name,
        undefined,
        undefined,
        parameters,
        ts.factory.createTypeReferenceNode("void"),
        undefined,
      ),
    );
  }

  return comment.addDeprecatedJsDoc(
    ts.factory.createClassDeclaration(
      undefined,
      [
        ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
        ts.factory.createModifier(ts.SyntaxKind.AbstractKeyword),
      ],
      ts.factory.createIdentifier(
        `Unimplemented${serviceDescriptor.name}Service`,
      ),
      undefined,
      undefined,
      members,
    ),
    serviceDescriptor.options?.deprecated,
  );
}

/**
 * Returns grpc-node compatible client unary promise method
 */
function createUnaryRpcPromiseMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.Identifier,
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
  const promiseBody = ts.factory.createCallExpression(
    ts.factory.createElementAccessExpression(
      ts.factory.createSuper(),
      ts.factory.createStringLiteral(methodDescriptor.name),
    ),
    undefined,
    [
      ts.factory.createIdentifier("message"),
      ts.factory.createIdentifier("metadata"),
      ts.factory.createIdentifier("options"),
      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          createParameter(
            "error",
            ts.factory.createQualifiedName(grpcIdentifier, "ServiceError"),
          ),
          createParameter("response", responseType),
        ],
        undefined,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createIfStatement(
              ts.factory.createIdentifier("error"),
              ts.factory.createBlock([
                ts.factory.createExpressionStatement(
                  ts.factory.createCallExpression(
                    ts.factory.createIdentifier("reject"),
                    undefined,
                    [ts.factory.createIdentifier("error")],
                  ),
                ),
              ]),
              ts.factory.createBlock([
                ts.factory.createExpressionStatement(
                  ts.factory.createCallExpression(
                    ts.factory.createIdentifier("resolve"),
                    undefined,
                    [ts.factory.createIdentifier("response")],
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
  const functionBody = ts.factory.createBlock([
    ts.factory.createIfStatement(
      ts.factory.createPrefixUnaryExpression(
        ts.SyntaxKind.ExclamationToken,
        ts.factory.createIdentifier("metadata"),
      ),
      ts.factory.createBlock([
        ts.factory.createExpressionStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createIdentifier("metadata"),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            ts.factory.createNewExpression(
              ts.factory.createPropertyAccessExpression(
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
    ts.factory.createIfStatement(
      ts.factory.createPrefixUnaryExpression(
        ts.SyntaxKind.ExclamationToken,
        ts.factory.createIdentifier("options"),
      ),
      ts.factory.createBlock([
        ts.factory.createExpressionStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createIdentifier("options"),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            ts.factory.createObjectLiteralExpression([]),
          ),
        ),
      ]),
    ),
    ts.factory.createReturnStatement(
      ts.factory.createNewExpression(
        ts.factory.createIdentifier("Promise"),
        undefined,
        [
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            [createParameter("resolve"), createParameter("reject")],
            undefined,
            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            promiseBody,
          ),
        ],
      ),
    ),
  ]);

  const messageParameter = createParameter("message", requestType);
  const metadataParameter = createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
    true,
  );
  const callOptionsParameter = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
    true,
  );
  const returnType = ts.factory.createTypeReferenceNode("Promise", [
    responseType,
  ]);

  return comment.addDeprecatedJsDoc(
    ts.factory.createPropertyDeclaration(
      undefined,
      undefined,
      methodDescriptor.name,
      undefined,
      ts.factory.createTypeReferenceNode("GrpcPromiseServiceInterface", [
        requestType,
        responseType,
      ]),

      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          messageParameter,
          createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type,
              callOptionsParameter.type,
            ]),
            true,
          ),
          callOptionsParameter,
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        functionBody,
      ),
    ),
    methodDescriptor.options?.deprecated,
  );
}

/**
 * Create typed parameter
 */
function createParameter(
  name: string,
  typename?: ts.TypeNode | ts.QualifiedName,
  optional = false,
) {
  if (typename && !ts.isQualifiedName(typename)) {
    typename = ts.factory.createTypeReferenceNode(
      typename as unknown as ts.EntityName,
    );
  }
  return ts.factory.createParameterDeclaration(
    undefined,
    undefined,
    undefined,
    name,
    optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    typename as ts.TypeReferenceNode,
  );
}

/**
 * Returns grpc-node compatible service interface.
 */
export function createGrpcInterfaceType(
  grpcIdentifier: ts.Identifier,
): ts.Statement[] {
  const messageParameter = createParameter(
    "message",
    ts.factory.createTypeReferenceNode("P"),
  );
  const metadataParameter = createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  const callOptionsParameter = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
  );
  const callOptionsParameterOpt = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
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
    ts.factory.createQualifiedName(grpcIdentifier, "ClientUnaryCall"),
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
 * Returns grpc-node compatible client unary method
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createUnaryRpcMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.EntityName,
) {
  const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
  const messageParameter = createParameter("message", requestType);
  const metadataParameter = createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  const callOptionsParameter = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
  );
  const callbackParameter = createParameter(
    "callback",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "requestCallback"),
      [responseType],
    ),
  );
  const returnType = ts.factory.createTypeReferenceNode(
    ts.factory.createQualifiedName(grpcIdentifier, "ClientUnaryCall"),
  );

  //   addTodo: GrpcInterface<addTodoParams, todoObject> = (message: addTodoParams, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<todoObject>, options?: grpc_1.CallOptions | grpc_1.requestCallback<todoObject>, callback?: grpc_1.requestCallback<todoObject>) : grpc_1.ClientUnaryCall => {
  //     return super.addTodo(message, metadata, options, callback);
  // }

  return comment.addDeprecatedJsDoc(
    ts.factory.createPropertyDeclaration(
      undefined,
      undefined,
      methodDescriptor.name,
      undefined,
      ts.factory.createTypeReferenceNode("GrpcUnaryServiceInterface", [
        requestType,
        responseType,
      ]),
      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          messageParameter,
          createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type,
              callOptionsParameter.type,
              callbackParameter.type,
            ]),
          ),
          createParameter(
            "options",
            ts.factory.createUnionTypeNode([
              callOptionsParameter.type,
              callbackParameter.type,
            ]),
            true,
          ),
          createParameter(
            "callback",
            ts.factory.createTypeReferenceNode(
              ts.factory.createQualifiedName(grpcIdentifier, "requestCallback"),
              [responseType],
            ),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createElementAccessExpression(
                  ts.factory.createSuper(),
                  ts.factory.createStringLiteral(methodDescriptor.name),
                ),
                undefined,
                [
                  ts.factory.createIdentifier("message"),
                  ts.factory.createIdentifier("metadata"),
                  ts.factory.createIdentifier("options"),
                  ts.factory.createIdentifier("callback"),
                ],
              ),
            ),
          ],
          true,
        ),
      ),
    ),
    methodDescriptor.options?.deprecated,
  );
}

/**
 * Returns grpc-node compatible client streaming call method
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createClientStreamingRpcMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.EntityName,
) {
  const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
  const metadataParameter = createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  const callOptionsParameter = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
  );
  const callbackParameter = createParameter(
    "callback",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "requestCallback"),
      [responseType],
    ),
  );
  const returnType = ts.factory.createTypeReferenceNode(
    ts.factory.createQualifiedName(grpcIdentifier, "ClientWritableStream"),
    [requestType],
  );

  //     put(metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<_Object>,
  //         options?: grpc_1.CallOptions | grpc_1.requestCallback<_Object>,
  //         callback?: grpc_1.requestCallback<_Object>): grpc_1.ClientWritableStream<Put> {

  return comment.addDeprecatedJsDoc(
    ts.factory.createPropertyDeclaration(
      undefined,
      undefined,
      methodDescriptor.name,
      undefined,
      ts.factory.createTypeReferenceNode("GrpWritableServiceInterface", [
        requestType,
        responseType,
      ]),

      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type,
              callOptionsParameter.type,
              callbackParameter.type,
            ]),
          ),
          createParameter(
            "options",
            ts.factory.createUnionTypeNode([
              callOptionsParameter.type,
              callbackParameter.type,
            ]),
            true,
          ),
          createParameter(
            "callback",
            ts.factory.createUnionTypeNode([callbackParameter.type]),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createElementAccessExpression(
                  ts.factory.createSuper(),
                  ts.factory.createStringLiteral(methodDescriptor.name),
                ),
                undefined,
                [
                  ts.factory.createIdentifier("metadata"),
                  ts.factory.createIdentifier("options"),
                  ts.factory.createIdentifier("callback"),
                ],
              ),
            ),
          ],
          true,
        ),
      ),
    ),
    methodDescriptor.options?.deprecated,
  );
}

/**
 * Returns grpc-node compatible server streaming call method
 */
function createServerStreamingRpcMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.Identifier,
) {
  const requestType = getRPCInputType(rootDescriptor, methodDescriptor);
  const messageParameter = createParameter("message", requestType);
  const metadataParameter = createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  const callOptionsParameter = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
    true,
  );
  const returnType = ts.factory.createTypeReferenceNode(
    ts.factory.createQualifiedName(grpcIdentifier, "ClientReadableStream"),
    [requestType],
  );

  return comment.addDeprecatedJsDoc(
    ts.factory.createPropertyDeclaration(
      undefined,
      undefined,
      methodDescriptor.name,
      undefined,
      ts.factory.createTypeReferenceNode("GrpcStreamServiceInterface", [
        requestType,
        requestType,
      ]),

      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          messageParameter,
          createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type,
              callOptionsParameter.type,
            ]),
            true,
          ),
          createParameter(
            "options",
            ts.factory.createUnionTypeNode([callOptionsParameter.type]),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createElementAccessExpression(
                  ts.factory.createSuper(),
                  ts.factory.createStringLiteral(methodDescriptor.name),
                ),
                undefined,
                [
                  ts.factory.createIdentifier("message"),
                  ts.factory.createIdentifier("metadata"),
                  ts.factory.createIdentifier("options"),
                ],
              ),
            ),
          ],
          true,
        ),
      ),
    ),
    methodDescriptor.options?.deprecated,
  );
}

/**
 * Returns grpc-node compatible client streaming call method
 */
function createBidiStreamingRpcMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.Identifier,
) {
  const responseType = getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = getRPCInputType(rootDescriptor, methodDescriptor);

  const metadataParameter = createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  const callOptionsParameter = createParameter(
    "options",
    ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
    true,
  );
  const returnType = ts.factory.createTypeReferenceNode(
    ts.factory.createQualifiedName(grpcIdentifier, "ClientDuplexStream"),
    [requestType, responseType],
  );

  return comment.addDeprecatedJsDoc(
    ts.factory.createPropertyDeclaration(
      undefined,
      undefined,
      methodDescriptor.name,
      undefined,
      ts.factory.createTypeReferenceNode("GrpcChunkServiceInterface", [
        requestType,
        responseType,
      ]),

      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type,
              callOptionsParameter.type,
            ]),
            true,
          ),
          createParameter(
            "options",
            ts.factory.createUnionTypeNode([callOptionsParameter.type]),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createElementAccessExpression(
                  ts.factory.createSuper(),
                  ts.factory.createStringLiteral(methodDescriptor.name),
                ),
                undefined,
                [
                  ts.factory.createIdentifier("metadata"),
                  ts.factory.createIdentifier("options"),
                ],
              ),
            ),
          ],
          true,
        ),
      ),
    ),
    methodDescriptor.options?.deprecated,
  );
}

/**
 * Returns grpc-node compatible service client.
 */
export function createServiceClient(
  rootDescriptor: descriptor.FileDescriptorProto,
  serviceDescriptor: descriptor.ServiceDescriptorProto,
  grpcIdentifier: ts.Identifier,
  options: import("./option").Options,
) {
  const members: Array<ts.ClassElement> = [
    ts.factory.createConstructorDeclaration(
      undefined,
      undefined,
      [
        createParameter(
          "address",
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ),
        createParameter(
          "credentials",
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(
              grpcIdentifier,
              "ChannelCredentials",
            ),
          ),
        ),
        createParameter(
          "options",
          ts.factory.createTypeReferenceNode("Partial", [
            ts.factory.createTypeReferenceNode(
              ts.factory.createQualifiedName(grpcIdentifier, "ChannelOptions"),
            ),
          ]),
          true,
        ),
      ],

      ts.factory.createBlock(
        [
          ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
              ts.factory.createSuper(),
              undefined,
              [
                ts.factory.createIdentifier("address"),
                ts.factory.createIdentifier("credentials"),
                ts.factory.createIdentifier("options"),
              ],
            ),
          ),
        ],
        true,
      ),
    ),
  ];

  for (const methodDescriptor of serviceDescriptor.method) {
    if (isUnary(methodDescriptor)) {
      if (!options.unary_rpc_promise) {
        members.push(
          createUnaryRpcMethod(
            rootDescriptor,
            methodDescriptor,
            grpcIdentifier,
          ),
        );
      } else {
        members.push(
          createUnaryRpcPromiseMethod(
            rootDescriptor,
            methodDescriptor,
            grpcIdentifier,
          ),
        );
      }
    } else if (isClientStreaming(methodDescriptor)) {
      members.push(
        createClientStreamingRpcMethod(
          rootDescriptor,
          methodDescriptor,
          grpcIdentifier,
        ),
      );
    } else if (isServerStreaming(methodDescriptor)) {
      members.push(
        createServerStreamingRpcMethod(
          rootDescriptor,
          methodDescriptor,
          grpcIdentifier,
        ),
      );
    } else if (isBidi(methodDescriptor)) {
      members.push(
        createBidiStreamingRpcMethod(
          rootDescriptor,
          methodDescriptor,
          grpcIdentifier,
        ),
      );
    }
  }

  return comment.addDeprecatedJsDoc(
    ts.factory.createClassDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(`${serviceDescriptor.name}Client`),
      undefined,
      [
        ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
          ts.factory.createExpressionWithTypeArguments(
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                grpcIdentifier,
                "makeGenericClientConstructor",
              ),
              undefined,
              [
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createIdentifier(
                    `Unimplemented${serviceDescriptor.name}Service`,
                  ),
                  "definition",
                ),
                ts.factory.createStringLiteral(serviceDescriptor.name),
                ts.factory.createObjectLiteralExpression(),
              ],
            ),
            undefined,
          ),
        ]),
      ],
      members,
    ),
    serviceDescriptor.options?.deprecated,
  );
}

function getRPCOutputType(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReference(rootDescriptor, methodDescriptor.output_type);
}

function getRPCOutputTypeExpr(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReferenceExpr(
    rootDescriptor,
    methodDescriptor.output_type,
  );
}

function getRPCInputType(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReference(rootDescriptor, methodDescriptor.input_type);
}

function getRPCInputTypeExpr(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReferenceExpr(rootDescriptor, methodDescriptor.input_type);
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function getRPCPath(
  rootDescriptor: { package: any },
  serviceDescriptor: { name: any },
  methodDescriptor: { name: any },
) {
  let name = serviceDescriptor.name;
  if (rootDescriptor.package) {
    name = `${rootDescriptor.package}.${name}`;
  }
  return `/${name}/${methodDescriptor.name}`;
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isUnary(methodDescriptor: descriptor.MethodDescriptorProto) {
  return (
    methodDescriptor.client_streaming == false &&
    methodDescriptor.server_streaming == false
  );
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isClientStreaming(methodDescriptor: descriptor.MethodDescriptorProto) {
  return (
    methodDescriptor.client_streaming == true &&
    methodDescriptor.server_streaming == false
  );
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isServerStreaming(methodDescriptor: descriptor.MethodDescriptorProto) {
  return (
    methodDescriptor.client_streaming == false &&
    methodDescriptor.server_streaming == true
  );
}
/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
export function isBidi(
  methodDescriptor: descriptor.MethodDescriptorProto,
): boolean {
  return (
    methodDescriptor.client_streaming == true &&
    methodDescriptor.server_streaming == true
  );
}
