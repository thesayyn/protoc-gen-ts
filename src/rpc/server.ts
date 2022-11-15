import * as ts from "typescript";
import * as descriptor from "../compiler/descriptor";
import * as util from "./util";
import * as comment from "../comment";

/**
 * Returns grpc-node compatible service description
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
                  util.getRPCPath(
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
                    util.createParameter(
                      "message",
                      util.getRPCInputType(rootDescriptor, methodDescriptor),
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
                    util.createParameter(
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
                      util.getRPCInputTypeExpr(
                        rootDescriptor,
                        methodDescriptor,
                      ),
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
                    util.createParameter(
                      "message",
                      util.getRPCOutputType(rootDescriptor, methodDescriptor),
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
                    util.createParameter(
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
                      util.getRPCOutputTypeExpr(
                        rootDescriptor,
                        methodDescriptor,
                      ),
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
 * Returns grpc-node compatible service interface.
 */
 export function createGrpcInterfaceType(
  grpcIdentifier: ts.Identifier,
): ts.Statement[] {
  const messageParameter = util.createParameter(
    "message",
    ts.factory.createTypeReferenceNode("P"),
  );
  const metadataParameter = util.createParameter(
    "metadata",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
    ),
  );
  const callOptionsParameter = util.createParameter(
    "options",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
    ),
  );
  const callOptionsParameterOpt = util.createParameter(
    "options",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
    ),
    true,
  );
  const callbackParameter = util.createParameter(
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
        util.createParameter(
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
    const parameters: ts.ParameterDeclaration[] = [];
    let callType: string;

    if (util.isUnary(methodDescriptor)) {
      callType = "ServerUnaryCall";
    } else if (util.isClientStreaming(methodDescriptor)) {
      callType = "ServerReadableStream";
    } else if (util.isServerStreaming(methodDescriptor)) {
      callType = "ServerWritableStream";
    } else if (util.isBidi(methodDescriptor)) {
      callType = "ServerDuplexStream";
    }

    parameters.push(
      util.createParameter(
        "call",
        ts.factory.createTypeReferenceNode(
          ts.factory.createQualifiedName(
            grpcIdentifier,
            ts.factory.createIdentifier(callType!),
          ),
          [
            util.getRPCInputType(rootDescriptor, methodDescriptor),
            util.getRPCOutputType(rootDescriptor, methodDescriptor),
          ],
        ),
      ),
    );

    if (
      util.isUnary(methodDescriptor) ||
      util.isClientStreaming(methodDescriptor)
    ) {
      parameters.push(
        util.createParameter(
          "callback",
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(
              grpcIdentifier,
              ts.factory.createIdentifier("sendUnaryData"),
            ),
            [util.getRPCOutputType(rootDescriptor, methodDescriptor)],
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
