const descriptor = require("../compiler/descriptor");
const ts = require("typescript");
const util = require("./util");

/**
 * Returns a method descriptor ast
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createMethodDescriptor(
  rootDescriptor,
  serviceDescriptor,
  methodDescriptor,
  grpcIdentifier,
) {
  const responseType = util.getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);
  const descriptor = ts.factory.createNewExpression(
    ts.factory.createPropertyAccessExpression(
      grpcIdentifier,
      "MethodDescriptor",
    ),
    [requestType, responseType],
    [
      ts.factory.createStringLiteral(
        util.getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor),
      ),
      ts.factory.createPropertyAccessExpression(
        ts.factory.createPropertyAccessExpression(grpcIdentifier, "MethodType"),
        util.isUnary(methodDescriptor) ? "UNARY" : "SERVER_STREAMING",
      ),
      requestType,
      responseType,
      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [util.createParameter("message", requestType)],
        undefined,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("message"),
            "serialize",
          ),
          undefined,
          undefined,
        ),
      ),
      ts.factory.createPropertyAccessExpression(responseType, "deserialize"),
    ],
  );

  return ts.factory.createPropertyDeclaration(
    undefined,
    [
      ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword),
      ts.factory.createModifier(ts.SyntaxKind.StaticKeyword),
    ],
    methodDescriptor.name,
    undefined,
    undefined,
    descriptor,
  );
}

/**
 * Returns grpc-node compatible client unary method
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createUnaryRpcMethod(
  rootDescriptor,
  serviceDescriptor,
  methodDescriptor,
  grpcIdentifier,
) {
  const responseType = util.getRPCOutputType(rootDescriptor, methodDescriptor);
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);
  const metadataParameter = util.createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    methodDescriptor.name,
    undefined,
    undefined,
    [
      util.createParameter("message", requestType),
      util.createParameter(
        "metadata",
        ts.factory.createUnionTypeNode([
          metadataParameter.type,
          ts.factory.createNull(),
        ]),
      ),
      util.createParameter(
        "callback",
        ts.factory.createFunctionTypeNode(
          undefined,
          [
            util.createParameter(
              "error",
              ts.factory.createQualifiedName(grpcIdentifier, "RpcError"),
            ),
            util.createParameter("response", responseType),
          ],
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
        ),
      ),
    ],
    undefined,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                "_client",
              ),
              "rpcCall",
            ),
            undefined,
            [
              ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createThis(),
                  "_address",
                ),
                ts.SyntaxKind.PlusToken,
                ts.factory.createStringLiteral(
                  util.getRPCPath(
                    rootDescriptor,
                    serviceDescriptor,
                    methodDescriptor,
                  ),
                ),
              ),
              ts.factory.createIdentifier("message"),
              ts.factory.createBinaryExpression(
                ts.factory.createIdentifier("metadata"),
                ts.SyntaxKind.BarBarToken,
                ts.factory.createObjectLiteralExpression(),
              ),
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(`${serviceDescriptor.name}Client`),
                methodDescriptor.name,
              ),
              ts.factory.createIdentifier("callback"),
            ],
          ),
        ),
      ],
      true,
    ),
  );
}

/**
 * Returns grpc-node compatible client unary method
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createServerStreamingRpcMethod(
  rootDescriptor,
  serviceDescriptor,
  methodDescriptor,
  grpcIdentifier,
) {
  const requestType = util.getRPCInputType(rootDescriptor, methodDescriptor);
  const metadataParameter = util.createParameter(
    "metadata",
    ts.factory.createQualifiedName(grpcIdentifier, "Metadata"),
  );
  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    methodDescriptor.name,
    undefined,
    undefined,
    [
      util.createParameter("message", requestType),
      util.createParameter(
        "metadata",
        ts.factory.createUnionTypeNode([
          metadataParameter.type,
          ts.factory.createNull(),
        ]),
      ),
    ],
    undefined,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                "_client",
              ),
              "serverStreaming",
            ),
            undefined,
            [
              ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createThis(),
                  "_address",
                ),
                ts.SyntaxKind.PlusToken,
                ts.factory.createStringLiteral(
                  util.getRPCPath(
                    rootDescriptor,
                    serviceDescriptor,
                    methodDescriptor,
                  ),
                ),
              ),
              ts.factory.createIdentifier("message"),
              ts.factory.createBinaryExpression(
                ts.factory.createIdentifier("metadata"),
                ts.SyntaxKind.BarBarToken,
                ts.factory.createObjectLiteralExpression(),
              ),
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(`${serviceDescriptor.name}Client`),
                methodDescriptor.name,
              ),
            ],
          ),
        ),
      ],
      true,
    ),
  );
}

/**
 * Returns grpc-node compatible service client.
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @param {ts.Identifier} grpcIdentifier
 * @returns
 */
function createServiceClient(
  rootDescriptor,
  serviceDescriptor,
  grpcIdentifier,
  params,
) {
  const members = [
    ts.factory.createPropertyDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
      "_address",
      undefined,
      ts.factory.createTypeReferenceNode("string"),
    ),
    ts.factory.createPropertyDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
      "_client",
      undefined,
      ts.factory.createQualifiedName(grpcIdentifier, "GrpcWebClientBase"),
    ),
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
          ts.factory.createTypeReferenceNode("Object"),
          true,
        ),
        util.createParameter(
          "options",
          ts.factory.createQualifiedName(
            grpcIdentifier,
            "GrpcWebClientBaseOptions",
          ),
          true,
        ),
      ],

      ts.factory.createBlock(
        [
          ts.factory.createIfStatement(
            ts.factory.createPrefixUnaryExpression(
              ts.SyntaxKind.ExclamationToken,
              ts.factory.createIdentifier("options"),
            ),
            ts.factory.createBinaryExpression(
              ts.factory.createIdentifier("options"),
              ts.SyntaxKind.EqualsToken,
              ts.factory.createObjectLiteralExpression(),
            ),
          ),
          ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("options"),
              "format",
            ),
            ts.SyntaxKind.EqualsToken,
            ts.factory.createBinaryExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("options"),
                "format",
              ),
              ts.SyntaxKind.BarBarToken,
              ts.factory.createStringLiteral("text"),
            ),
          ),
          ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                "_address",
              ),
              ts.SyntaxKind.EqualsToken,
              ts.factory.createIdentifier("address"),
            ),
          ),
          ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                "_client",
              ),
              ts.SyntaxKind.EqualsToken,
              ts.factory.createNewExpression(
                ts.factory.createPropertyAccessExpression(
                  grpcIdentifier,
                  "GrpcWebClientBase",
                ),
                undefined,
                [ts.factory.createIdentifier("options")],
              ),
            ),
          ),
        ],
        true,
      ),
    ),
  ];

  for (const methodDescriptor of serviceDescriptor.method) {
    members.push(
      createMethodDescriptor(
        rootDescriptor,
        serviceDescriptor,
        methodDescriptor,
        grpcIdentifier,
      ),
    );
    if (util.isUnary(methodDescriptor)) {
      if (!params.unary_rpc_promise) {
        members.push(
          createUnaryRpcMethod(
            rootDescriptor,
            serviceDescriptor,
            methodDescriptor,
            grpcIdentifier,
          ),
        );
      } else {
        // members.push(
        //     ...createUnaryRpcPromiseMethod(
        //         rootDescriptor,
        //         methodDescriptor,
        //         grpcIdentifier,
        //     ),
        // );
      }
    } else if (util.isServerStreaming(methodDescriptor)) {
      members.push(
        createServerStreamingRpcMethod(
          rootDescriptor,
          serviceDescriptor,
          methodDescriptor,
          grpcIdentifier,
        ),
      );
    } else if (util.isClientStreaming(methodDescriptor)) {
      // Not supported
    } else if (util.isBidi(methodDescriptor)) {
      // Not supported
    }
  }

  return ts.factory.createClassDeclaration(
    undefined,
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${serviceDescriptor.name}Client`),
    undefined,
    [
      // ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
      //     ts.factory.createExpressionWithTypeArguments(
      //         ts.factory.createCallExpression(
      //             ts.factory.createPropertyAccessExpression(
      //                 grpcIdentifier,
      //                 "makeGenericClientConstructor",
      //             ),
      //             undefined,
      //             [
      //                 ts.factory.createPropertyAccessExpression(
      //                     ts.factory.createIdentifier(
      //                         `Unimplemented${serviceDescriptor.name}Service`,
      //                     ),
      //                     "definition",
      //                 ),
      //                 ts.factory.createStringLiteral(serviceDescriptor.name),
      //                 ts.factory.createObjectLiteralExpression(),
      //             ],
      //         ),
      //     ),
      // ]),
    ],
    members,
  );
}

module.exports = { createServiceClient };
