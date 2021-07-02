
const type = require('./type');
const descriptor = require('./compiler/descriptor');
const ts = require('typescript');

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
                                getRPCPath(
                                    rootDescriptor,
                                    serviceDescriptor,
                                    methodDescriptor
                                )
                            )
                        ),
                        ts.factory.createPropertyAssignment(
                            "requestStream",
                            methodDescriptor.client_streaming
                                ? ts.factory.createTrue()
                                : ts.factory.createFalse()
                        ),
                        ts.factory.createPropertyAssignment(
                            "responseStream",
                            methodDescriptor.server_streaming
                                ? ts.factory.createTrue()
                                : ts.factory.createFalse()
                        ),
                        ts.factory.createPropertyAssignment(
                            "requestSerialize",
                            ts.factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    ts.factory.createParameterDeclaration(
                                        undefined,
                                        undefined,
                                        undefined,
                                        "message",
                                        undefined,
                                        ts.factory.createTypeReferenceNode(
                                            getRPCInputType(rootDescriptor, methodDescriptor),
                                            undefined
                                        )
                                    ),
                                ],
                                undefined,
                                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("Buffer"),
                                        "from"
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createCallExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier("message"),
                                                "serialize"
                                            ),
                                            undefined,
                                            undefined
                                        ),
                                    ]
                                )
                            )
                        ),
                        ts.factory.createPropertyAssignment(
                            "requestDeserialize",
                            ts.factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    ts.factory.createParameterDeclaration(
                                        undefined,
                                        undefined,
                                        undefined,
                                        "bytes",
                                        undefined,
                                        ts.factory.createTypeReferenceNode(
                                            ts.factory.createIdentifier("Buffer"),
                                            undefined
                                        )
                                    ),
                                ],
                                undefined,
                                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        getRPCInputType(rootDescriptor, methodDescriptor),
                                        "deserialize"
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createNewExpression(
                                            ts.factory.createIdentifier("Uint8Array"),
                                            undefined,
                                            [ts.factory.createIdentifier("bytes")]
                                        ),
                                    ]
                                )
                            )
                        ),
                        ts.factory.createPropertyAssignment(
                            "responseSerialize",
                            ts.factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    ts.factory.createParameterDeclaration(
                                        undefined,
                                        undefined,
                                        undefined,
                                        "message",
                                        undefined,
                                        ts.factory.createTypeReferenceNode(
                                            getRPCOutputType(rootDescriptor, methodDescriptor),
                                            undefined
                                        )
                                    ),
                                ],
                                undefined,
                                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("Buffer"),
                                        "from"
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createCallExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier("message"),
                                                "serialize"
                                            ),
                                            undefined,
                                            []
                                        ),
                                    ]
                                )
                            )
                        ),
                        ts.factory.createPropertyAssignment(
                            "responseDeserialize",
                            ts.factory.createArrowFunction(
                                undefined,
                                undefined,
                                [
                                    ts.factory.createParameterDeclaration(
                                        undefined,
                                        undefined,
                                        undefined,
                                        "bytes",
                                        undefined,
                                        ts.factory.createTypeReferenceNode(
                                            ts.factory.createIdentifier("Buffer"),
                                            undefined
                                        )
                                    ),
                                ],
                                undefined,
                                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        getRPCOutputType(rootDescriptor, methodDescriptor),
                                        "deserialize"
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createNewExpression(
                                            ts.factory.createIdentifier("Uint8Array"),
                                            undefined,
                                            [ts.factory.createIdentifier("bytes")]
                                        ),
                                    ]
                                )
                            )
                        ),
                    ],
                    true
                )
            );
        }),
        true
    )
}

/**
 * Returns interface definition of the service description
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor 
 * @param {ts.Identifier} grpcIdentifier 
 */
function createUnimplementedServer(rootDescriptor, serviceDescriptor, grpcIdentifier) {
    const members = [
        ts.factory.createPropertyDeclaration(
            undefined,
            [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
            "definition",
            undefined,
            undefined,
            createServiceDefinition(rootDescriptor, serviceDescriptor)
        ),
        ts.factory.createIndexSignature(
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "method",
                    undefined,
                    ts.factory.createIdentifier("string")
                )
            ],
            ts.factory.createTypeReferenceNode(
                ts.factory.createPropertyAccessExpression(grpcIdentifier, "UntypedHandleCall")
            )
        )
    ];

    for (const methodDescriptor of serviceDescriptor.method) {
        const parameters = [];
        let callType;

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
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                "call",
                undefined,
                ts.factory.createTypeReferenceNode(
                    ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier(callType)),
                    [
                        getRPCInputType(rootDescriptor, methodDescriptor),
                        getRPCOutputType(rootDescriptor, methodDescriptor)
                    ]
                )
            )
        );

        if (isUnary(methodDescriptor) || isClientStreaming(methodDescriptor)) {
            parameters.push(
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "callback",
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("requestCallback")),
                        [getRPCOutputType(rootDescriptor, methodDescriptor)]
                    )
                )
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
                ts.factory.createTypeReferenceNode("void")
            )
        )
    }

    return ts.factory.createClassDeclaration(
        undefined,
        [
            ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
            ts.factory.createModifier(ts.SyntaxKind.AbstractKeyword)
        ],
        ts.factory.createIdentifier(`Unimplemented${serviceDescriptor.name}Service`),
        undefined,
        undefined,
        members
    )
}


/**
 * Returns grpc-node compatible unary client method
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function createUnaryServiceClientMethod(
    rootDescriptor,
    methodDescriptor,
    grpcIdentifier
) {
    const responseType = ts.factory.createTypeReferenceNode(
        getRPCOutputType(rootDescriptor, methodDescriptor)
    );
    const requestType = ts.factory.createTypeReferenceNode(
        getRPCInputType(rootDescriptor, methodDescriptor)
    );

    const promiseBody = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(ts.factory.createSuper(), methodDescriptor.name),
        undefined,
        [
            ts.factory.createIdentifier("request"),
            ts.factory.createIdentifier("metadata"),
            ts.factory.createIdentifier("options"),
            ts.factory.createArrowFunction(
                undefined,
                undefined,
                [
                    ts.factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        "error",
                        undefined,
                        ts.factory.createQualifiedName(grpcIdentifier, "ServiceError")
                    ),
                    ts.factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        "response",
                        undefined,
                        responseType
                    ),
                ],
                undefined,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                ts.factory.createBlock(
                    [
                        ts.factory.createIfStatement(
                            ts.factory.createIdentifier("error"),
                            ts.factory.createBlock([
                                ts.factory.createExpressionStatement(
                                    ts.factory.createCallExpression(ts.factory.createIdentifier("reject"), undefined, [
                                        ts.factory.createIdentifier("error"),
                                    ])
                                ),
                            ]),
                            ts.factory.createBlock([
                                ts.factory.createExpressionStatement(
                                    ts.factory.createCallExpression(ts.factory.createIdentifier("resolve"), undefined, [
                                        ts.factory.createIdentifier("response"),
                                    ])
                                ),
                            ])
                        ),
                    ],
                    true
                )
            ),
        ]
    );

    return ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        methodDescriptor.name,
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                "request",
                undefined,
                requestType
            ),
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                "metadata",
                ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                ts.factory.createQualifiedName(grpcIdentifier, "Metadata")
            ),
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                "options",
                ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                ts.factory.createQualifiedName(grpcIdentifier, "CallOptions")
            ),
        ],
        ts.factory.createTypeReferenceNode("Promise", [responseType]),
        ts.factory.createBlock(
            [
                ts.factory.createIfStatement(
                    ts.factory.createPrefixUnaryExpression(
                        ts.SyntaxKind.ExclamationToken,
                        ts.factory.createIdentifier("metadata")
                    ),
                    ts.factory.createExpressionStatement(
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier("metadata"),
                            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                            ts.factory.createNewExpression(
                                ts.factory.createPropertyAccessExpression(grpcIdentifier, "Metadata")
                            )
                        )
                    )
                ),
                ts.factory.createIfStatement(
                    ts.factory.createPrefixUnaryExpression(
                        ts.SyntaxKind.ExclamationToken,
                        ts.factory.createIdentifier("options")
                    ),
                    ts.factory.createExpressionStatement(
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier("options"),
                            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                            ts.factory.createObjectLiteralExpression([])
                        )
                    )
                ),
                ts.factory.createReturnStatement(
                    ts.factory.createNewExpression(ts.factory.createIdentifier("Promise"), undefined, [
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                ts.factory.createParameterDeclaration(undefined, undefined, undefined, "resolve"),
                                ts.factory.createParameterDeclaration(undefined, undefined, undefined, "reject"),
                            ],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            promiseBody
                        ),
                    ])
                ),
            ],
            true
        )
    );
}

/**
 * Returns grpc-node compatible service client.
 * @param {descriptor.FieldDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @param {ts.Identifier} grpcIdentifier 
 * @returns 
 */
function createServiceClient(
    rootDescriptor,
    serviceDescriptor,
    grpcIdentifier
) {
    const members = [
        ts.factory.createConstructorDeclaration(
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "address",
                    undefined,
                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "credentials",
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createQualifiedName(grpcIdentifier, "ChannelCredentials")
                    )
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "options",
                    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(
                        'Partial',
                        [
                            ts.factory.createQualifiedName(grpcIdentifier, "ChannelOptions")
                        ]
                    )
                ),
            ],

            ts.factory.createBlock(
                [
                    ts.factory.createCallExpression(ts.factory.createSuper(), undefined, [
                        ts.factory.createIdentifier("address"),
                        ts.factory.createIdentifier("credentials"),
                        ts.factory.createIdentifier("options"),
                    ]),
                ],
                true
            )
        ),
    ];

    for (const methodDescriptor of serviceDescriptor.method) {
        if (!isUnary(methodDescriptor) || !process.env.EXPERIMENTAL_FEATURES) {
            continue;
        }
        members.push(
            createUnaryServiceClientMethod(
                rootDescriptor,
                methodDescriptor,
                grpcIdentifier
            )
        );
    }

    return ts.factory.createClassDeclaration(
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
                            "makeGenericClientConstructor"
                        ),
                        undefined,
                        [
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier(`Unimplemented${serviceDescriptor.name}Service`),
                                "definition"
                            ),
                            ts.factory.createStringLiteral(serviceDescriptor.name),
                            ts.factory.createObjectLiteralExpression(),
                        ]
                    )
                ),
            ]),
        ],
        members
    );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 */
function getRPCOutputType(rootDescriptor, methodDescriptor) {
    return type.getTypeReference(rootDescriptor, methodDescriptor.output_type);
}

/**
* @param {descriptor.FileDescriptorProto} rootDescriptor 
* @param {descriptor.MethodDescriptorProto} methodDescriptor 
*/
function getRPCInputType(rootDescriptor, methodDescriptor) {
    return type.getTypeReference(rootDescriptor, methodDescriptor.input_type);
}


/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor 
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 */
function getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor) {
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
function isUnary(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == false &&
        methodDescriptor.server_streaming == false
    );
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 * @returns {boolean}
 */
function isClientStreaming(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == true &&
        methodDescriptor.server_streaming == false
    );
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 * @returns {boolean}
 */
function isServerStreaming(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == false &&
        methodDescriptor.server_streaming == true
    );
}
/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 * @returns {boolean}
 */
function isBidi(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == true &&
        methodDescriptor.server_streaming == true
    );
}



module.exports = { createUnimplementedServer, createServiceClient };