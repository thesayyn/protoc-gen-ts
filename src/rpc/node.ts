import * as ts from "typescript";
import * as descriptor from "../compiler/descriptor";
import * as comment from "../comment";
import * as util from "./util";
import * as option from "../option";

/**
 * Returns grpc-node compatible client unary promise method
 */
function createUnaryRpcPromiseMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.Identifier,
) {
  const responseType = util.getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);

  // super.put(message, metadata, options, (error: grpc_1.ServiceError, response: Result) => {
  //   if (error) {
  //     reject(error);
  //   } else {
  //      resolve(response);
  //   }
  // }
  const promiseBody = ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createSuper(),
      methodDescriptor.name,
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
          util.createParameter(
            "error",
            ts.factory.createTypeReferenceNode(
              ts.factory.createQualifiedName(grpcIdentifier, "ServiceError"),
            ),
          ),
          util.createParameter("response", responseType),
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
            [util.createParameter("resolve"), util.createParameter("reject")],
            undefined,
            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            promiseBody,
          ),
        ],
      ),
    ),
  ]);

  const messageParameter = util.createParameter("message", requestType);
  const metadataParameter = util.createParameter(
    "metadata",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
    ),
    true,
  );
  const callOptionsParameter = util.createParameter(
    "options",
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(grpcIdentifier, "CallOptions"),
    ),
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
          util.createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type!,
              callOptionsParameter.type!,
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
 * Returns grpc-node compatible client unary method
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createUnaryRpcMethod(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
  grpcIdentifier: ts.EntityName,
) {
  const responseType = util.getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);
  const messageParameter = util.createParameter("message", requestType);
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
  const callbackParameter = util.createParameter(
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
          util.createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type!,
              callOptionsParameter.type!,
              callbackParameter.type!,
            ]),
          ),
          util.createParameter(
            "options",
            ts.factory.createUnionTypeNode([
              callOptionsParameter.type!,
              callbackParameter.type!,
            ]),
            true,
          ),
          util.createParameter(
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
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createSuper(),
                  methodDescriptor.name,
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
  const responseType = util.getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);
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
  const callbackParameter = util.createParameter(
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
          util.createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type!,
              callOptionsParameter.type!,
              callbackParameter.type!,
            ]),
          ),
          util.createParameter(
            "options",
            ts.factory.createUnionTypeNode([
              callOptionsParameter.type!,
              callbackParameter.type!,
            ]),
            true,
          ),
          util.createParameter(
            "callback",
            ts.factory.createUnionTypeNode([callbackParameter.type!]),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createSuper(),
                  methodDescriptor.name,
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
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);
  const messageParameter = util.createParameter("message", requestType);
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
          util.createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type!,
              callOptionsParameter.type!,
            ]),
            true,
          ),
          util.createParameter(
            "options",
            ts.factory.createUnionTypeNode([callOptionsParameter.type!]),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createSuper(),
                  methodDescriptor.name,
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
  const responseType = util.getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);

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
          util.createParameter(
            "metadata",
            ts.factory.createUnionTypeNode([
              metadataParameter.type!,
              callOptionsParameter.type!,
            ]),
            true,
          ),
          util.createParameter(
            "options",
            ts.factory.createUnionTypeNode([callOptionsParameter.type!]),
            true,
          ),
        ],
        returnType,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createSuper(),
                  methodDescriptor.name,
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
  options: option.Options,
) {
  const members: Array<ts.ClassElement> = [
    ts.factory.createConstructorDeclaration(
      undefined,
      undefined,
      [
        util.createParameter(
          "address",
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ),
        util.createParameter(
          "credentials",
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(
              grpcIdentifier,
              "ChannelCredentials",
            ),
          ),
        ),
        util.createParameter(
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
    if (util.isUnary(methodDescriptor)) {
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
    } else if (util.isClientStreaming(methodDescriptor)) {
      members.push(
        createClientStreamingRpcMethod(
          rootDescriptor,
          methodDescriptor,
          grpcIdentifier,
        ),
      );
    } else if (util.isServerStreaming(methodDescriptor)) {
      members.push(
        createServerStreamingRpcMethod(
          rootDescriptor,
          methodDescriptor,
          grpcIdentifier,
        ),
      );
    } else if (util.isBidi(methodDescriptor)) {
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
