const descriptor = require("./compiler/descriptor");
const ts = require("typescript");
const type = require("./type");
const field = require("./field");

/**
 * Returns a enum for the enum descriptor
 * @param {descriptor.EnumDescriptorProto} enumDescriptor 
 */
function createEnum(enumDescriptor) {
    const values = [];

    for (const valueDescriptor of enumDescriptor.value) {
        values.push(
            ts.factory.createEnumMember(
                valueDescriptor.name,
                ts.factory.createNumericLiteral(valueDescriptor.number)
            )
        );
    }
    return ts.factory.createEnumDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(enumDescriptor.name),
        values
    );
}


/**
 *
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.DescriptorProto} messageDescriptor
 */
function createFromObject(rootDescriptor, messageDescriptor) {
    const dataIdentifier = ts.factory.createIdentifier("data");
    const messageIdentifier = ts.factory.createIdentifier("message");

    const statements = [];

    const properties = [];

    for (const fieldDescriptor of messageDescriptor.field) {
        let assignmentExpr = ts.factory.createPropertyAccessExpression(
            dataIdentifier,
            fieldDescriptor.name
        );

        if (field.isMap(fieldDescriptor)) {
            const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(
                fieldDescriptor.type_name
            ).field;

            assignmentExpr = ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("Object"),
                    "entries"
                ),
                undefined,
                [assignmentExpr]
            );

            let coercer;

            if (field.isNumber(keyDescriptor)) {
                coercer = "Number";
            } else if (field.isBoolean(keyDescriptor)) {
                coercer = "Boolean";
            }

            if (field.isMessage(valueDescriptor) || !field.isString(keyDescriptor)) {
                let keyExpr = ts.factory.createIdentifier("key");
                let valueExpr = ts.factory.createIdentifier("value");
  

                if (coercer) {
                    keyExpr = ts.factory.createCallExpression(
                        ts.factory.createIdentifier(coercer),
                        undefined,
                        [keyExpr]
                    );
                }

                if (field.isMessage(valueDescriptor)) {
                    valueExpr = ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            type.getTypeReference(rootDescriptor, valueDescriptor.type_name),
                            "fromObject"
                        ),
                        undefined,
                        [ts.factory.createIdentifier("value")]
                    );
                }

                assignmentExpr = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(assignmentExpr, "map"),
                    undefined,
                    [
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                ts.factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.factory.createArrayBindingPattern([
                                        ts.factory.createBindingElement(
                                            undefined,
                                            undefined,
                                            "key"
                                        ),
                                        ts.factory.createBindingElement(
                                            undefined,
                                            undefined,
                                            "value"
                                        ),
                                    ])
                                ),
                            ],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createArrayLiteralExpression([keyExpr, valueExpr])
                        ),
                    ]
                );
            }
            assignmentExpr = ts.factory.createNewExpression(
                ts.factory.createIdentifier("Map"),
                undefined,
                [assignmentExpr]
            );
        } else if (field.isMessage(fieldDescriptor)) {
            if (field.isRepeated(fieldDescriptor)) {
                const arrowFunc = ts.factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                        ts.factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            "item"
                        ),
                    ],
                    undefined,
                    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            type.getTypeReference(rootDescriptor, fieldDescriptor.type_name),
                            "fromObject"
                        ),
                        undefined,
                        [ts.factory.createIdentifier("item")]
                    )
                );
                assignmentExpr = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(assignmentExpr, "map"),
                    undefined,
                    [arrowFunc]
                );
            } else {
                assignmentExpr = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        type.getTypeReference(rootDescriptor, fieldDescriptor.type_name),
                        "fromObject"
                    ),
                    undefined,
                    [
                        ts.factory.createPropertyAccessExpression(
                            dataIdentifier,
                            fieldDescriptor.name
                        ),
                    ]
                );
            }
        } 

        if (field.isOptional(rootDescriptor, fieldDescriptor)) {
            const propertyAccessor = ts.factory.createPropertyAccessExpression(
                dataIdentifier,
                fieldDescriptor.name
            );
            let condition = ts.factory.createBinaryExpression(
                propertyAccessor,
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
                ts.factory.createNull()
            );

            if (field.isMap(fieldDescriptor)) {
                condition = ts.factory.createBinaryExpression(
                    ts.factory.createTypeOfExpression(propertyAccessor),
                    ts.factory.createToken(ts.SyntaxKind.EqualsEqualsToken),
                    ts.factory.createStringLiteral("object")
                );
            }

            statements.push(
                ts.factory.createIfStatement(
                    condition,
                    ts.factory.createBlock(
                        [
                            ts.factory.createExpressionStatement(
                                ts.factory.createBinaryExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        messageIdentifier,
                                        fieldDescriptor.name
                                    ),
                                    ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                                    assignmentExpr
                                )
                            ),
                        ],
                        true
                    )
                )
            );
        } else {
            properties.push(
                ts.factory.createPropertyAssignment(
                    fieldDescriptor.name,
                    assignmentExpr
                )
            );
        }
    }

    statements.unshift(
        ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [
                    ts.factory.createVariableDeclaration(
                        "message",
                        undefined,
                        undefined,
                        ts.factory.createNewExpression(
                            ts.factory.createIdentifier(messageDescriptor.name),
                            undefined,
                            [ts.factory.createObjectLiteralExpression(properties, true)]
                        )
                    ),
                ],
                ts.NodeFlags.Const
            )
        )
    );

    statements.push(ts.factory.createReturnStatement(messageIdentifier));

    return ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
        undefined,
        ts.factory.createIdentifier("fromObject"),
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                dataIdentifier,
                undefined,
                createPrimitiveMessageSignature(rootDescriptor, messageDescriptor)
            ),
        ],
        undefined,
        ts.factory.createBlock(statements, true)
    );
}

/**
 * 
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor
 */
function createToObject(rootDescriptor, messageDescriptor) {

    const statements = [];

    const properties = [];

    const dataIdentifier = ts.factory.createIdentifier("data");

    for (const fieldDescriptor of messageDescriptor.field) {
        let valueExpr = ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            fieldDescriptor.name
        );

        if (field.isMap(fieldDescriptor)) {
            const [, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name).field;

            if (field.isMessage(valueDescriptor)) {
                valueExpr = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessChain(
                                ts.factory.createIdentifier("Array"),
                                undefined,
                                "from"
                            ),
                            undefined,
                            [valueExpr]
                        ),
                        "map"
                    ),
                    undefined,
                    [
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                ts.factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.factory.createArrayBindingPattern([
                                        ts.factory.createBindingElement(undefined, undefined, "key"),
                                        ts.factory.createBindingElement(undefined, undefined, "value")
                                    ])
                                )
                            ],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createArrayLiteralExpression([
                                ts.factory.createIdentifier("key"),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("value"),
                                        "toObject"
                                    ),
                                    undefined,
                                    []
                                )
                            ])
                        )
                    ]
                )

            }

            valueExpr = ts.factory.createCallExpression(
                ts.factory.createPropertyAccessChain(
                    ts.factory.createIdentifier("Object"),
                    undefined,
                    "fromEntries"
                ),
                undefined,
                [valueExpr]
            )
        } else if (field.isMessage(fieldDescriptor)) {
            if (field.isRepeated(fieldDescriptor)) {
                const arrowFunc = ts.factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                        ts.factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            "item",
                            undefined,
                            ts.factory.createTypeReferenceNode(
                                type.getTypeReference(
                                    rootDescriptor,
                                    fieldDescriptor.type_name,
                                ),
                                undefined
                            )
                        ),
                    ],
                    undefined,
                    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("item"), "toObject"),
                        undefined,
                        undefined
                    )
                );
                valueExpr = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(valueExpr, "map"),
                    undefined,
                    [arrowFunc]
                );
            } else {
                valueExpr = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(valueExpr, "toObject")
                );
            }
        }





        if (field.isOptional(rootDescriptor, fieldDescriptor)) {
            const propertyAccessor = ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                fieldDescriptor.name
            );
            let condition = ts.factory.createBinaryExpression(
                propertyAccessor,
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
                ts.factory.createNull()
            );

            if (field.isMap(fieldDescriptor)) {
                condition = ts.factory.createBinaryExpression(
                    ts.factory.createPropertyAccessExpression(
                        propertyAccessor,
                        "size"
                    ),
                    ts.factory.createToken(ts.SyntaxKind.GreaterThanToken),
                    ts.factory.createNumericLiteral(0)
                );
            }

            statements.push(
                ts.factory.createIfStatement(
                    condition,
                    ts.factory.createBlock([
                        ts.factory.createExpressionStatement(
                            ts.factory.createBinaryExpression(
                                ts.factory.createPropertyAccessExpression(dataIdentifier, fieldDescriptor.name),
                                ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                                valueExpr
                            )
                        )
                    ], true)
                )
            )
        } else {
            properties.push(
                ts.factory.createPropertyAssignment(
                    fieldDescriptor.name,
                    valueExpr
                )
            );
        }

    }


    statements.unshift(
        ts.factory.createVariableStatement(undefined,
            ts.factory.createVariableDeclarationList([
                ts.factory.createVariableDeclaration(
                    "data",
                    undefined,
                    createPrimitiveMessageSignature(rootDescriptor, messageDescriptor),
                    ts.factory.createObjectLiteralExpression(properties, true)
                )
            ], ts.NodeFlags.Const)
        )
    )



    statements.push(ts.factory.createReturnStatement(dataIdentifier))


    return ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        ts.factory.createIdentifier("toObject"),
        undefined,
        undefined,
        undefined,
        undefined,
        ts.factory.createBlock(statements, true)
    );
}

/**
 * 
 * @param {string} packageName 
 * @param {ts.NodeArray<ts.Statement>} statements 
 * @returns {ts.NodeArray<ts.Statement>}
 */
function createNamespace(packageName, statements) {
    const identifiers = String(packageName).split(".");

    statements = ts.factory.createModuleBlock(statements);

    for (let i = identifiers.length - 1; i >= 0; i--) {
        statements = ts.factory.createModuleDeclaration(
            undefined,
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.factory.createIdentifier(identifiers[i]),
            statements,
            ts.NodeFlags.Namespace
        );
    }

    return statements;
}

/**
 * 
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor
 */
function createMessageSignature(rootDescriptor, messageDescriptor) {

    const oneOfSignatures = [];
    for (const [index] of messageDescriptor.oneof_decl.entries()) {

        const childSignatures = [];

        for (const currentFieldDescriptor of messageDescriptor.field) {
            if (currentFieldDescriptor.oneof_index != index) {
                continue;
            }

            const members = [];

            for (const fieldDescriptor of messageDescriptor.field) {
                if (fieldDescriptor.oneof_index != index) {
                    continue;
                }
                let fieldType = ts.factory.createTypeReferenceNode("never")
                if (fieldDescriptor == currentFieldDescriptor) {
                    fieldType = field.wrapRepeatedType(
                        field.getType(fieldDescriptor, rootDescriptor),
                        fieldDescriptor
                    );
                }
                members.push(ts.factory.createPropertySignature(
                    undefined,
                    fieldDescriptor.name,
                    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    fieldType
                ))
            }

            childSignatures.push(
                ts.factory.createTypeLiteralNode(members)
            )
        }

        oneOfSignatures.push(ts.factory.createUnionTypeNode(childSignatures))
    }

    const fieldSignatures = [];

    for (const fieldDescriptor of messageDescriptor.field) {

        if (typeof fieldDescriptor.oneof_index == "number") {
            continue;
        }

        const fieldType = field.wrapRepeatedType(
            field.getType(fieldDescriptor, rootDescriptor),
            fieldDescriptor
        );

        fieldSignatures.push(
            ts.factory.createPropertySignature(
                undefined,
                fieldDescriptor.name,
                field.isOptional(rootDescriptor, fieldDescriptor) ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                fieldType
            )
        );
    }

    if (oneOfSignatures.length) {
        return ts.factory.createIntersectionTypeNode([
            ts.factory.createTypeLiteralNode(fieldSignatures),
            ts.factory.createUnionTypeNode(oneOfSignatures)
        ])
    }

    return ts.factory.createTypeLiteralNode(fieldSignatures);
}

/**
 * 
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor
 */
function createPrimitiveMessageSignature(rootDescriptor, messageDescriptor) {
    const fieldSignatures = [];

    const wrapMessageType = (fieldType) => {
        return ts.factory.createTypeReferenceNode(
            "ReturnType",
            [
                ts.factory.createTypeOfExpression(
                    ts.factory.createPropertyAccessExpression(ts.factory.createPropertyAccessExpression(fieldType, "prototype"), "toObject")
                )
            ]
        )
    }

    for (const fieldDescriptor of messageDescriptor.field) {
        let fieldType = field.getType(fieldDescriptor, rootDescriptor);

        if (field.isMap(fieldDescriptor)) {
            const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name).field;

            let valueType = field.getType(valueDescriptor, rootDescriptor);

            if (field.isMessage(valueDescriptor)) {
                valueType = wrapMessageType(valueType);
            }

            fieldType = ts.factory.createTypeLiteralNode([
                ts.factory.createIndexSignature(
                    undefined,
                    undefined,
                    [
                        ts.factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            "key",
                            undefined,
                            field.getType(keyDescriptor)
                        )
                    ],
                    valueType
                )
            ])
        } else if (field.isMessage(fieldDescriptor)) {
            fieldType = wrapMessageType(fieldType);
        }

        fieldType = field.wrapRepeatedType(fieldType, fieldDescriptor);

        fieldSignatures.push(
            ts.factory.createPropertySignature(
                undefined,
                fieldDescriptor.name,
                field.isOptional(rootDescriptor, fieldDescriptor) ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                fieldType
            )
        );
    }

    return ts.factory.createTypeLiteralNode(fieldSignatures);
}


/**
 * 
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor 
 * @param {string} pbIdentifier
 */
function createConstructor(
    rootDescriptor,
    messageDescriptor,
    pbIdentifier
) {
    const statements = [];

    const dataIdentifier = ts.factory.createIdentifier("data");
    const typeNode = ts.factory.createUnionTypeNode([
        ts.factory.createArrayTypeNode(
            ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("any"), undefined)
        ) /* any[] */,
        createMessageSignature(rootDescriptor, messageDescriptor),
    ]);


    // Create super(); statement
    statements.push(
        ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createSuper()))
    );

    // Get oneOfFields
    const oneOfFields = messageDescriptor.oneof_decl.map((_, index) => {
        return ts.factory.createArrayLiteralExpression(messageDescriptor.field
            .filter(fd => index == fd.oneof_index)
            .map((fd) => ts.factory.createNumericLiteral(fd.number)))
    });

    // Get repeated fields numbers
    const repeatedFields = messageDescriptor.field
        .filter(
            (fd) => field.isRepeated(fd) && !field.isMap(fd)
        )
        .map((fd) => ts.factory.createNumericLiteral(fd.number))

    // Create initialize(); statement
    statements.push(
        ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                    "initialize"
                ),
                undefined,
                [
                    ts.factory.createThis(),
                    ts.factory.createConditionalExpression(
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("Array"), "isArray"),
                            undefined,
                            [dataIdentifier]
                        ),
                        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                        dataIdentifier,
                        ts.factory.createToken(ts.SyntaxKind.ColonToken),
                        ts.factory.createArrayLiteralExpression()
                    ),
                    ts.factory.createNumericLiteral("0"),
                    ts.factory.createNumericLiteral("-1") /* TODO: Handle extensions */,
                    ts.factory.createArrayLiteralExpression(repeatedFields),
                    ts.factory.createArrayLiteralExpression(oneOfFields),
                ]
            )
        )
    );

    // Create data variable and if block
    statements.push(
        ts.factory.createIfStatement(
            ts.factory.createBinaryExpression(
                ts.factory.createLogicalNot(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("Array"), "isArray"),
                        undefined,
                        [dataIdentifier]
                    )
                ),
                ts.SyntaxKind.AmpersandAmpersandToken,
                ts.factory.createBinaryExpression(
                    ts.factory.createTypeOfExpression(dataIdentifier),
                    ts.SyntaxKind.EqualsEqualsToken,
                    ts.factory.createStringLiteral("object")
                )
            ),
            ts.factory.createBlock(
                messageDescriptor.field
                    .map((fieldDescriptor) => {
                        const assigmentExpression = ts.factory.createExpressionStatement(
                            ts.factory.createBinaryExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createThis(),
                                    fieldDescriptor.name
                                ),
                                ts.SyntaxKind.EqualsToken,
                                ts.factory.createPropertyAccessExpression(
                                    dataIdentifier,
                                    fieldDescriptor.name
                                )
                            )
                        );
                        if (!field.isOptional(rootDescriptor, fieldDescriptor)) {
                            return assigmentExpression;
                        }
                        return ts.factory.createIfStatement(
                            ts.factory.createBinaryExpression(
                                ts.factory.createBinaryExpression(
                                    ts.factory.createStringLiteral(fieldDescriptor.name),
                                    ts.factory.createToken(ts.SyntaxKind.InKeyword),
                                    dataIdentifier
                                ),

                                ts.factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                ts.factory.createBinaryExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        dataIdentifier,
                                        fieldDescriptor.name
                                    ),
                                    ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
                                    ts.factory.createIdentifier("undefined"),
                                ),
                            ),
                            ts.factory.createBlock([assigmentExpression], true)
                        )
                    })
            )
        )
    );

    for (const fieldDescriptor of messageDescriptor.field) {
        if (!field.isMap(fieldDescriptor)) {
            continue;
        }
        let propertyAccessor = ts.factory.createPropertyAccessExpression(ts.factory.createThis(), fieldDescriptor.name);
        statements.push(
            ts.factory.createIfStatement(
                ts.factory.createPrefixUnaryExpression(
                    ts.SyntaxKind.ExclamationToken,
                    propertyAccessor

                ),
                ts.factory.createBinaryExpression(
                    propertyAccessor,
                    ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                    ts.factory.createNewExpression(ts.factory.createIdentifier("Map"), undefined, [])
                )
            )
        )
    }

    return ts.factory.createConstructorDeclaration(
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                dataIdentifier,
                ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                typeNode
            ),
        ],
        ts.factory.createBlock(statements, true)
    );
}


/**
 * Returns a get accessor for the field
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} pbIdentifier
 */
function createGetter(
    rootDescriptor,
    fieldDescriptor,
    pbIdentifier
) {
    const getterType = field.wrapRepeatedType(field.getType(fieldDescriptor, rootDescriptor), fieldDescriptor);
    let getterExpr = createGetterCall(
        rootDescriptor,
        fieldDescriptor,
        pbIdentifier
    );

    if (field.isMap(fieldDescriptor)) {
        getterExpr = ts.factory.createAsExpression(
            getterExpr,
            ts.factory.createToken(ts.SyntaxKind.AnyKeyword)
        );
    }

    return ts.factory.createGetAccessorDeclaration(
        undefined,
        undefined,
        fieldDescriptor.name,
        undefined,
        undefined,
        ts.factory.createBlock([
            ts.factory.createReturnStatement(
                ts.factory.createAsExpression(getterExpr, getterType)
            )
        ], true)
    );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} pbIdentifier 
 * @param {string} getterType
 */
function createGetterCall(
    rootDescriptor,
    fieldDescriptor,
    pbIdentifier
) {

    let args = [];

    let getterMethod = "getField";

    if (field.isMessage(fieldDescriptor) && !field.isMap(fieldDescriptor)) {
        getterMethod = field.isRepeated(fieldDescriptor) ? "getRepeatedWrapperField" : "getWrapperField";
        args = [
            ts.factory.createThis(),
            type.getTypeReference(rootDescriptor, fieldDescriptor.type_name),
            ts.factory.createNumericLiteral(fieldDescriptor.number)
        ]
    } else {
        args = [
            ts.factory.createThis(),
            ts.factory.createNumericLiteral(fieldDescriptor.number),
        ];

        if (fieldDescriptor.default_value) {
            let defaultt;

            if (field.isEnum(fieldDescriptor)) {
                defaultt = ts.factory.createPropertyAccessExpression(
                    type.getTypeReference(rootDescriptor, fieldDescriptor.type_name),
                    fieldDescriptor.default_value
                )
            } else if (field.isString(fieldDescriptor)) {
                defaultt = ts.factory.createStringLiteral(fieldDescriptor.default_value)
            } else if (field.isBoolean(fieldDescriptor)) {
                defaultt = ts.factory.createIdentifier(fieldDescriptor.default_value)
            } else {
                defaultt = ts.factory.createIdentifier(fieldDescriptor.default_value)
            }
            getterMethod = "getFieldWithDefault";
            args.push(defaultt);
        }
    }
    return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
            ts.factory.createIdentifier(getterMethod)
        ),
        undefined,
        args
    );
}

/**
 * Returns a class for the message descriptor
 * @param {number} index 
 * @param {descriptor.OneofDescriptorProto} oneofDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor 
 * @param {ts.Identifier} pbIdentifier
 */
function createOneOfGetter(index, oneofDescriptor, messageDescriptor, pbIdentifier) {

    const numbers = [];

    const types = [
        ts.factory.createStringLiteral("none")
    ];

    const cases = [
        ts.factory.createPropertyAssignment(
            ts.factory.createNumericLiteral(0),
            ts.factory.createStringLiteral("none"),

        )
    ];

    for (const field of messageDescriptor.field) {
        if (field.oneof_index == index) {
            types.push(ts.factory.createStringLiteral(field.name));
            numbers.push(ts.factory.createNumericLiteral(field.number));
            cases.push(ts.factory.createPropertyAssignment(
                ts.factory.createNumericLiteral(field.number),
                ts.factory.createStringLiteral(field.name))
            );
        }
    }

    const statements = [
        ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList([
                ts.factory.createVariableDeclaration(
                    "cases",
                    undefined,
                    ts.factory.createTypeLiteralNode([
                        ts.factory.createIndexSignature(
                            undefined,
                            undefined,
                            [
                                ts.factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    "index",
                                    undefined,
                                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
                                )
                            ],
                            ts.factory.createUnionTypeNode(types)
                        )
                    ]),
                    ts.factory.createObjectLiteralExpression(cases, true)
                )
            ], ts.NodeFlags.Const)
        ),

        ts.factory.createReturnStatement(
            ts.factory.createElementAccessExpression(
                ts.factory.createIdentifier("cases"),
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                        ts.factory.createIdentifier("computeOneofCase")
                    ),
                    undefined,
                    [
                        ts.factory.createThis(),
                        ts.factory.createArrayLiteralExpression(numbers)
                    ]
                ),
            )
        )
    ]

    return ts.factory.createGetAccessorDeclaration(
        undefined,
        undefined,
        oneofDescriptor.name,
        undefined,
        undefined,
        ts.factory.createBlock(statements, true)
    );
}


/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} pbIdentifier 
 */
function createSetter(
    rootDescriptor,
    messageDescriptor,
    fieldDescriptor,
    pbIdentifier
) {
    const type = field.wrapRepeatedType(
        field.getType(fieldDescriptor, rootDescriptor),
        fieldDescriptor
    );
    const valueParameter = ts.factory.createIdentifier("value");


    let block;

    if (field.isOneOf(fieldDescriptor)) {
        block = createOneOfSetterBlock(messageDescriptor, fieldDescriptor, valueParameter, pbIdentifier)
    } else {
        block = createSetterBlock(fieldDescriptor, valueParameter, pbIdentifier)
    }


    return ts.factory.createSetAccessorDeclaration(
        undefined,
        undefined,
        fieldDescriptor.name,
        [ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            valueParameter,
            undefined,
            type
        )],
        block
    );
}

/**
 * @param {descriptor.DescriptorProto} descriptor 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} valueParameter 
 * @param {ts.Identifier} pbIdentifier 
 */
function createOneOfSetterBlock(descriptor, fieldDescriptor, valueParameter, pbIdentifier) {
    let method = "setOneofField"

    if (field.isMessage(fieldDescriptor)) {
        method = "setOneofWrapperField"
    }

    const numbers = [];


    for (const field of descriptor.field) {
        if (field.oneof_index == fieldDescriptor.oneof_index) {
            numbers.push(ts.factory.createNumericLiteral(field.number));
        }
    }

    return ts.factory.createBlock([
        ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                    method
                ),
                undefined,
                [
                    ts.factory.createThis(),
                    ts.factory.createNumericLiteral(fieldDescriptor.number),
                    ts.factory.createArrayLiteralExpression(numbers),
                    valueParameter,
                ]
            )
        ),
    ], true)
}


/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} valueParameter 
 * @param {ts.Identifier} pbIdentifier 
 */
function createSetterBlock(fieldDescriptor, valueParameter, pbIdentifier) {
    let method = "setField"

    if (field.isMessage(fieldDescriptor) && !field.isMap(fieldDescriptor)) {
        if (field.isRepeated(fieldDescriptor)) {
            method = "setRepeatedWrapperField"
        } else {
            method = "setWrapperField"
        }
    }

    if (field.isMap(fieldDescriptor)) {
        valueParameter = ts.factory.createAsExpression(valueParameter, ts.factory.createToken(ts.SyntaxKind.AnyKeyword));
    }

    return ts.factory.createBlock([
        ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                    method
                ),
                undefined,
                [
                    ts.factory.createThis(),
                    ts.factory.createNumericLiteral(fieldDescriptor.number),
                    valueParameter,
                ]
            )
        ),
    ], true)
}


/**
 * Returns the serialize method for the message class
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.DescriptorProto} messageDescriptor
 * @param {ts.Identifier} pbIdentifier
 */
function createSerialize(rootDescriptor, messageDescriptor, pbIdentifier) {
    const statements = [
        ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [
                    ts.factory.createVariableDeclaration(
                        "writer",
                        undefined,
                        undefined,
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier("w"),
                            ts.SyntaxKind.BarBarToken,
                            ts.factory.createNewExpression(
                                ts.factory.createPropertyAccessExpression(pbIdentifier, "BinaryWriter"),
                                undefined,
                                []
                            )
                        )
                    ),
                ],
                ts.NodeFlags.Const
            )
        )
    ];

    for (const fieldDescriptor of messageDescriptor.field) {
        const propAccessor = ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            fieldDescriptor.name
        );

        if (field.isMap(fieldDescriptor)) {
            const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name).field;

            const valueExprArgs = [
                ts.factory.createNumericLiteral(2),
                ts.factory.createIdentifier("value"),
            ];


            if (field.isMessage(valueDescriptor)) {
                valueExprArgs.push(
                    ts.factory.createArrowFunction(
                        undefined,
                        undefined,
                        [],
                        undefined,
                        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("value"),
                                "serialize"
                            ),
                            undefined,
                            [ts.factory.createIdentifier("writer")]
                        )
                    )
                )
            }
            const writeCall = ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("writer"), "writeMessage"),
                undefined,
                [
                    ts.factory.createNumericLiteral(fieldDescriptor.number),
                    propAccessor,
                    ts.factory.createArrowFunction(
                        undefined,
                        undefined,
                        [],
                        undefined,
                        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        ts.factory.createBlock([
                            ts.factory.createExpressionStatement(
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("writer"),
                                        ts.factory.createIdentifier(
                                            `write${field.toBinaryMethodName(
                                                keyDescriptor,
                                                rootDescriptor
                                            )}`
                                        )
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createNumericLiteral(1),
                                        ts.factory.createIdentifier("key")
                                    ]
                                )
                            ),
                            ts.factory.createExpressionStatement(
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("writer"),
                                        ts.factory.createIdentifier(
                                            `write${field.toBinaryMethodName(
                                                valueDescriptor,
                                                rootDescriptor
                                            )}`
                                        )
                                    ),
                                    undefined,
                                    valueExprArgs
                                )
                            )
                        ], true)
                    )
                ]
            );

            statements.push(
                ts.factory.createForOfStatement(
                    undefined,
                    ts.factory.createVariableDeclarationList([
                        ts.factory.createVariableDeclaration(
                            ts.factory.createArrayBindingPattern([
                                ts.factory.createBindingElement(undefined, undefined, "key"),
                                ts.factory.createBindingElement(undefined, undefined, "value")
                            ])
                        ),
                    ], ts.NodeFlags.Const),
                    propAccessor,
                    ts.factory.createBlock([writeCall])
                )
            )
        } else {
            const propParameters = [
                ts.factory.createNumericLiteral(fieldDescriptor.number),
                propAccessor,
            ];
            if (field.isMessage(fieldDescriptor)) {
                if (field.isRepeated(fieldDescriptor)) {
                    propParameters.push(
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                ts.factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    "item",
                                    undefined,
                                    ts.factory.createTypeReferenceNode(
                                        type.getTypeReference(
                                            rootDescriptor,
                                            fieldDescriptor.type_name
                                        )
                                    )
                                ),
                            ],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("item"),
                                    "serialize"
                                ),
                                undefined,
                                [ts.factory.createIdentifier("writer")]
                            )
                        )
                    );
                } else {
                    propParameters.push(
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createThis(),
                                        fieldDescriptor.name
                                    ),
                                    "serialize"
                                ),
                                undefined,
                                [ts.factory.createIdentifier("writer")]
                            )
                        )
                    );
                }
            }

            // this.prop !== undefined
            let condition = ts.factory.createBinaryExpression(
                propAccessor,
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                ts.factory.createIdentifier("undefined")
            );


            let statement = ts.factory.createExpressionStatement(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("writer"),
                        ts.factory.createIdentifier(
                            `write${field.toBinaryMethodName(
                                fieldDescriptor,
                                rootDescriptor
                            )}`
                        )
                    ),
                    undefined,
                    propParameters
                )
            );

            if (field.isString(fieldDescriptor) && !field.isRepeated(fieldDescriptor)) {
                // typeof this.prop !== "string" && this.prop.length
                condition = ts.factory.createBinaryExpression(
                    ts.factory.createBinaryExpression(
                        ts.factory.createTypeOfExpression(propAccessor),
                        ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                        ts.factory.createStringLiteral("string")
                    ),
                    ts.factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                    ts.factory.createPropertyAccessExpression(propAccessor, "length")
                );
            }


            statements.push(
                ts.factory.createIfStatement(
                    condition,
                    statement
                )
            );
        }
    }

    statements.push(
        ts.factory.createIfStatement(
            ts.factory.createPrefixUnaryExpression(
                ts.SyntaxKind.ExclamationToken,
                ts.factory.createIdentifier("w")
            ),
            ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("writer"),
                        "getResultBuffer"
                    ),
                    undefined,
                    []
                )
            )
        )
    );


    return [
        ts.factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            "serialize",
            undefined,
            undefined,
            undefined,
            ts.factory.createTypeReferenceNode("Uint8Array"),
        ),
        ts.factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            "serialize",
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "w",
                    undefined,
                    ts.factory.createQualifiedName(pbIdentifier, "BinaryWriter"),
                    undefined
                ),
            ],
            ts.factory.createTypeReferenceNode("void"),
        ),
        ts.factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            "serialize",
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "w",
                    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createQualifiedName(pbIdentifier, "BinaryWriter"),
                    undefined
                ),
            ],
            ts.factory.createUnionTypeNode([
                ts.factory.createTypeReferenceNode("Uint8Array"),
                ts.factory.createTypeReferenceNode("void"),
            ]),
            ts.factory.createBlock(statements, true)
        )
    ];
}

/**
 * Returns the deserialize method for the message class
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.DescriptorProto} messageDescriptor
 * @param {ts.Identifier} pbIdentifier
 */
function createDeserialize(
    rootDescriptor,
    messageDescriptor,
    pbIdentifier
) {
    const statements = [
        ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [
                    ts.factory.createVariableDeclaration(
                        "reader",
                        undefined, undefined,
                        ts.factory.createConditionalExpression(
                            ts.factory.createBinaryExpression(
                                ts.factory.createIdentifier("bytes"),
                                ts.SyntaxKind.InstanceOfKeyword,
                                ts.factory.createPropertyAccessExpression(pbIdentifier, "BinaryReader")
                            ),
                            ts.factory.createToken(ts.SyntaxKind.QuestionToken),

                            ts.factory.createIdentifier("bytes"),
                            ts.factory.createToken(ts.SyntaxKind.ColonToken),
                            ts.factory.createNewExpression(
                                ts.factory.createPropertyAccessExpression(pbIdentifier, "BinaryReader"),
                                undefined,
                                [ts.factory.createIdentifier("bytes")]
                            ),
                        )
                    ),
                    ts.factory.createVariableDeclaration(
                        "message",
                        undefined,
                        undefined,
                        ts.factory.createNewExpression(
                            ts.factory.createIdentifier(messageDescriptor.name),
                            undefined,
                            []
                        )
                    ),
                ],
                ts.NodeFlags.Const
            )
        )
    ];

    const cases = [];

    for (const fieldDescriptor of messageDescriptor.field) {

        let statements = [];

        if (
            field.isRepeated(fieldDescriptor) &&
            !field.isMessage(fieldDescriptor)
        ) {
            statements.push(
                ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                            "addToRepeatedField"
                        ),
                        undefined,
                        [
                            ts.factory.createIdentifier("message"),
                            ts.factory.createNumericLiteral(
                                fieldDescriptor.number
                            ),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("reader"),
                                    `read${field.toBinaryMethodName(
                                        fieldDescriptor,
                                        rootDescriptor,
                                        false
                                    )}`
                                ),
                                undefined,
                                []
                            ),
                        ]
                    )
                )
            );
        } else if (field.isMap(fieldDescriptor)) {
            const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name).field;


            const keyCall = ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("reader"),
                ts.factory.createIdentifier(
                    `read${field.toBinaryMethodName(
                        keyDescriptor,
                        rootDescriptor
                    )}`
                )
            )

            let valueCall;

            if (field.isMessage(valueDescriptor)) {
                valueCall = ts.factory.createArrowFunction(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    ts.factory.createBlock([
                        ts.factory.createVariableStatement(
                            undefined,
                            ts.factory.createVariableDeclarationList([
                                ts.factory.createVariableDeclaration("value")
                            ], ts.NodeFlags.Let)
                        ),
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("reader"),
                                "readMessage"
                            ),
                            undefined,
                            [
                                ts.factory.createIdentifier("message"),
                                ts.factory.createArrowFunction(
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                    ts.factory.createBinaryExpression(
                                        ts.factory.createIdentifier("value"),
                                        ts.SyntaxKind.EqualsToken,
                                        ts.factory.createCallExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                type.getTypeReference(rootDescriptor, valueDescriptor.type_name),
                                                "deserialize"
                                            ),
                                            undefined,
                                            [ts.factory.createIdentifier("reader")]
                                        )
                                    )


                                )
                            ]
                        ),
                        ts.factory.createReturnStatement(ts.factory.createIdentifier("value"))
                    ], true)
                )

            } else {
                valueCall = ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("reader"),
                    ts.factory.createIdentifier(
                        `read${field.toBinaryMethodName(
                            valueDescriptor,
                            rootDescriptor
                        )}`
                    )
                );
            }
            statements.push(
                ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("reader"),
                            "readMessage"
                        ),
                        undefined,
                        [
                            ts.factory.createIdentifier("message"),
                            ts.factory.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                ts.factory.createToken(
                                    ts.SyntaxKind.EqualsGreaterThanToken
                                ),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            pbIdentifier,
                                            "Map"
                                        ),
                                        "deserializeBinary"
                                    ),

                                    undefined,
                                    [
                                        ts.factory.createAsExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier("message"),
                                                fieldDescriptor.name
                                            ),
                                            ts.factory.createToken(ts.SyntaxKind.AnyKeyword)
                                        ),
                                        ts.factory.createIdentifier("reader"),
                                        keyCall,
                                        valueCall
                                    ]
                                )
                            ),
                        ]
                    )
                )
            );
        } else if (field.isMessage(fieldDescriptor)) {
            const readCall = ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    type.getTypeReference(
                        rootDescriptor,
                        fieldDescriptor.type_name
                    ),
                    "deserialize"
                ),
                undefined,
                [ts.factory.createIdentifier("reader")]
            );

            statements.push(
                ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("reader"),
                            "readMessage"
                        ),
                        undefined,
                        [
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("message"),
                                fieldDescriptor.name
                            ),
                            ts.factory.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                ts.factory.createToken(
                                    ts.SyntaxKind.EqualsGreaterThanToken
                                ),
                                field.isRepeated(fieldDescriptor)
                                    ? ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                pbIdentifier,
                                                "Message"
                                            ),
                                            "addToRepeatedWrapperField"
                                        ),
                                        undefined,
                                        [
                                            ts.factory.createIdentifier("message"),
                                            ts.factory.createNumericLiteral(fieldDescriptor.number),
                                            readCall,
                                            type.getTypeReference(rootDescriptor, fieldDescriptor.type_name),
                                        ]
                                    )
                                    : ts.factory.createBinaryExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createIdentifier("message"),
                                            fieldDescriptor.name
                                        ),
                                        ts.SyntaxKind.EqualsToken,
                                        readCall
                                    )
                            ),
                        ]
                    )
                )
            );
        } else {
            statements.push(
                ts.factory.createExpressionStatement(
                    ts.factory.createBinaryExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("message"),
                            fieldDescriptor.name
                        ),
                        ts.SyntaxKind.EqualsToken,
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("reader"),
                                `read${field.toBinaryMethodName(
                                    fieldDescriptor,
                                    rootDescriptor,
                                    false
                                )}`
                            )
                        )
                    )
                )
            );
        }
        statements.push(ts.factory.createBreakStatement());

        cases.push(ts.factory.createCaseClause(
            ts.factory.createNumericLiteral(fieldDescriptor.number),
            statements
        ))

    }

    // Default clause
    cases.push(
        ts.factory.createDefaultClause([
            ts.factory.createExpressionStatement(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("reader"),
                        "skipField"
                    ),
                    undefined,
                    []
                )
            ),
        ])
    );


    statements.push(
        ts.factory.createWhileStatement(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("reader"), "nextField"),
                undefined,
                []
            ),
            ts.factory.createBlock(
                [
                    ts.factory.createIfStatement(
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("reader"),
                                "isEndGroup"
                            ),
                            undefined,
                            undefined
                        ),
                        ts.factory.createBreakStatement()
                    ),
                    ts.factory.createSwitchStatement(
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("reader"),
                                "getFieldNumber"
                            ),
                            undefined,
                            []
                        ),
                        ts.factory.createCaseBlock(cases)
                    ),
                ],
                true
            )
        )
    );

    statements.push(
        ts.factory.createReturnStatement(ts.factory.createIdentifier("message"))
    );


    return ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
        undefined,
        ts.factory.createIdentifier("deserialize"),
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                ts.factory.createIdentifier("bytes"),
                undefined,
                ts.factory.createUnionTypeNode([
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("Uint8Array"),
                        undefined
                    ),
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createQualifiedName(pbIdentifier, "BinaryReader"),
                        undefined
                    ),
                ])
            ),
        ],
        ts.factory.createTypeReferenceNode(messageDescriptor.name, undefined),
        ts.factory.createBlock(statements, true)
    );
}

/**
 * Returns the deserializeBinary method for the message class
 * @param {descriptor.DescriptorProto} messageDescriptor
 */
function createDeserializeBinary(messageDescriptor) {
    return ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
        undefined,
        ts.factory.createIdentifier("deserializeBinary"),
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                ts.factory.createIdentifier("bytes"),
                undefined,
                ts.factory.createTypeReferenceNode(
                    ts.factory.createIdentifier("Uint8Array")
                )
            ),
        ],
        ts.factory.createTypeReferenceNode(messageDescriptor.name),
        ts.factory.createBlock([
            ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier(messageDescriptor.name), "deserialize"
                    ),
                    undefined,
                    [
                        ts.factory.createIdentifier("bytes")
                    ]
                )
            )
        ], true)
    );
}


/**
 * Returns the serializeBinary method for the Message class
 */
function createSerializeBinary() {
    return ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        ts.factory.createIdentifier("serializeBinary"),
        undefined,
        undefined,
        [],
        ts.factory.createUnionTypeNode([
            ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Uint8Array"), []),
        ]),
        ts.factory.createBlock([
            ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createThis(),
                        "serialize"
                    )
                )
            ),
        ], true)
    );
}


/**
 * Returns a class for the message descriptor
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.DescriptorProto} messageDescriptor 
 * @param {ts.Identifier} pbIdentifier
 */
function createMessage(
    rootDescriptor,
    messageDescriptor,
    pbIdentifier
) {
    const members = [];

    // Create constructor
    members.push(
        createConstructor(
            rootDescriptor,
            messageDescriptor,
            pbIdentifier
        )
    );



    // Create getter and setters
    for (const fieldDescriptor of messageDescriptor.field) {
        members.push(
            createGetter(
                rootDescriptor,
                fieldDescriptor,
                pbIdentifier
            )
        );
        members.push(
            createSetter(
                rootDescriptor,
                messageDescriptor,
                fieldDescriptor,
                pbIdentifier
            )
        );
    }

    // Create one of getters
    for (const [index, oneofDescriptor] of messageDescriptor.oneof_decl.entries()) {
        members.push(
            createOneOfGetter(index, oneofDescriptor, messageDescriptor, pbIdentifier)
        );
    }

    // Create fromObject method
    members.push(createFromObject(rootDescriptor, messageDescriptor));

    // Create toObject method
    members.push(
        createToObject(rootDescriptor, messageDescriptor)
    );

    // Create serialize  method
    members.push(
        ...
        createSerialize(
            rootDescriptor,
            messageDescriptor,
            pbIdentifier
        )
    );

    // Create deserialize method
    members.push(
        createDeserialize(
            rootDescriptor,
            messageDescriptor,
            pbIdentifier
        )
    );

    // Create serializeBinary method
    members.push(createSerializeBinary());

    // Create deserializeBinary method
    members.push(createDeserializeBinary(messageDescriptor));

    // Create message class
    return ts.factory.createClassDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        messageDescriptor.name,
        undefined,
        [
            ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                ts.factory.createExpressionWithTypeArguments(
                    ts.factory.createPropertyAccessExpression(pbIdentifier, ts.factory.createIdentifier("Message"))
                ),
            ]),
        ],
        members
    );


}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.DescriptorProto} descriptor
 * @param {ts.Identifier} pbIdentifier
 */
function processDescriptorRecursively(
    rootDescriptor,
    descriptor,
    pbIdentifier
) {

    const statements = [
        createMessage(rootDescriptor, descriptor, pbIdentifier)
    ];

    const namespacedStatements = [];

    for (const eenum of descriptor.enum_type) {
        namespacedStatements.push(createEnum(eenum));
    }

    for (const message of descriptor.nested_type) {
        namespacedStatements.push(...processDescriptorRecursively(rootDescriptor, message, pbIdentifier));
    }

    if (namespacedStatements.length) {
        statements.push(createNamespace(descriptor.name, namespacedStatements));
    }

    return statements;
}

module.exports = { processDescriptorRecursively, createEnum, createNamespace }