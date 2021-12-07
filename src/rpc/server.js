const descriptor = require("../compiler/descriptor");
const ts = require("typescript");
const util = require("./util");

/**
 * Returns grpc-node compatible service description
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 */
function createServiceDefinition(rootDescriptor, serviceDescriptor) {
    return ts.factory.createObjectLiteralExpression(
        serviceDescriptor.method.map((methodDescriptor) => {
            return ts.factory.createPropertyAssignment(
                methodDescriptor.name,
                ts.factory.createObjectLiteralExpression(
                    [
                        ts.factory.createPropertyAssignment(
                            "path",
                            ts.factory.createStringLiteral(
                                util.getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor),
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
                                        ts.factory.createTypeReferenceNode(
                                            util.getRPCInputType(rootDescriptor, methodDescriptor),
                                            undefined,
                                        ),
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
                                        util.getRPCInputType(rootDescriptor, methodDescriptor),
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
                                        ts.factory.createTypeReferenceNode(
                                            util.getRPCOutputType(rootDescriptor, methodDescriptor),
                                            undefined,
                                        ),
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
                                        util.getRPCOutputType(rootDescriptor, methodDescriptor),
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
        }),
        true,
    );
}

/**
 * Returns grpc-node compatible abstract service class
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {ts.Identifier} grpcIdentifier
 */
function createUnimplementedService(
    rootDescriptor,
    serviceDescriptor,
    grpcIdentifier,
) {
    const members = [
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
            [util.createParameter("method", ts.factory.createIdentifier("string"))],
            ts.factory.createTypeReferenceNode(
                ts.factory.createPropertyAccessExpression(
                    grpcIdentifier,
                    "UntypedHandleCall",
                ),
            ),
        ),
    ];

    for (const methodDescriptor of serviceDescriptor.method) {
        const parameters = [];
        let callType;

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
                        ts.factory.createIdentifier(callType),
                    ),
                    [
                        util.getRPCInputType(rootDescriptor, methodDescriptor),
                        util.getRPCOutputType(rootDescriptor, methodDescriptor),
                    ],
                ),
            ),
        );

        if (util.isUnary(methodDescriptor) || util.isClientStreaming(methodDescriptor)) {
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
            ),
        );
    }

    return ts.factory.createClassDeclaration(
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
    );
}

module.exports = { createUnimplementedService }