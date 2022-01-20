import {
    EnumDescriptorProto,
    FileDescriptorProto,
    DescriptorProto,
    FieldDescriptorProto,
    MethodDescriptorProto,
    OneofDescriptorProto,
} from './compiler/descriptor.js';
import * as field from './field.js';
import * as type from './type.js';
import ts, {
    Block,
    CallExpression,
    ClassDeclaration,
    ClassElement,
    ConstructorDeclaration,
    EnumDeclaration,
    Expression,
    factory,
    GetAccessorDeclaration,
    Identifier,
    MethodDeclaration,
    ModuleBlock,
    NodeFlags,
    Statement,
    SyntaxKind,
    TypeNode,
    TypeReferenceNode,
} from 'typescript';
import { ConfigParameters } from './index.js';

/**
 * Returns a enum for the enum descriptor
 */
export function createEnum(enumDescriptor: EnumDescriptorProto): EnumDeclaration
{
    const values = [];

    for (const valueDescriptor of enumDescriptor.value)
    {
        values.push(
            factory.createEnumMember(
                valueDescriptor.name,
                factory.createNumericLiteral(valueDescriptor.number)
            )
        );
    }
    return factory.createEnumDeclaration(
        undefined,
        [ factory.createModifier(SyntaxKind.ExportKeyword) ],
        factory.createIdentifier(enumDescriptor.name),
        values
    );
}

function createFromObject(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
): MethodDeclaration
{
    const dataIdentifier = factory.createIdentifier('data');
    const messageIdentifier = factory.createIdentifier('message');

    const statements = [];
    const properties = [];

    for (const fieldDescriptor of messageDescriptor.field)
    {
        let assignmentExpr: Expression = factory.createPropertyAccessExpression(
            dataIdentifier,
            fieldDescriptor.name
        );

        if (field.isMap(fieldDescriptor))
        {
            const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name)!.field;

            assignmentExpr = factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    factory.createIdentifier("Object"),
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
                let keyExpr: Expression = factory.createIdentifier("key");
                let valueExpr: Expression = factory.createIdentifier("value");

                if (coercer)
                {
                    keyExpr = factory.createCallExpression(
                        factory.createIdentifier(coercer),
                        undefined,
                        [keyExpr]
                    );
                }

                if (field.isMessage(valueDescriptor))
                {
                    valueExpr = factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            type.getTypeReference(rootDescriptor, valueDescriptor.type_name) as Expression,
                            "fromObject"
                        ),
                        undefined,
                        [factory.createIdentifier("value")]
                    );
                }

                assignmentExpr = factory.createCallExpression(
                    factory.createPropertyAccessExpression(assignmentExpr, "map"),
                    undefined,
                    [
                        factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    factory.createArrayBindingPattern([
                                        factory.createBindingElement(
                                            undefined,
                                            undefined,
                                            "key"
                                        ),
                                        factory.createBindingElement(
                                            undefined,
                                            undefined,
                                            "value"
                                        ),
                                    ])
                                ),
                            ],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createArrayLiteralExpression([keyExpr, valueExpr])
                        ),
                    ]
                );
            }
            assignmentExpr = factory.createNewExpression(
                factory.createIdentifier("Map"),
                undefined,
                [assignmentExpr]
            );
        } else if (field.isMessage(fieldDescriptor)) {
            if (field.isRepeated(fieldDescriptor)) {
                const arrowFunc = factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                        factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            "item"
                        ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Expression,
                            "fromObject"
                        ),
                        undefined,
                        [factory.createIdentifier("item")]
                    )
                );
                assignmentExpr = factory.createCallExpression(
                    factory.createPropertyAccessExpression(assignmentExpr, "map"),
                    undefined,
                    [arrowFunc]
                );
            } else {
                assignmentExpr = factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Expression,
                        "fromObject"
                    ),
                    undefined,
                    [
                        factory.createPropertyAccessExpression(
                            dataIdentifier,
                            fieldDescriptor.name
                        ),
                    ]
                );
            }
        }

        if (field.isOptional(rootDescriptor, fieldDescriptor)) {
            const propertyAccessor = factory.createPropertyAccessExpression(
                dataIdentifier,
                fieldDescriptor.name
            );
            let condition = factory.createBinaryExpression(
                propertyAccessor,
                factory.createToken(SyntaxKind.ExclamationEqualsToken),
                factory.createNull()
            );

            if (field.isMap(fieldDescriptor)) {
                condition = factory.createBinaryExpression(
                    factory.createTypeOfExpression(propertyAccessor),
                    factory.createToken(SyntaxKind.EqualsEqualsToken),
                    factory.createStringLiteral("object")
                );
            }

            statements.push(
                factory.createIfStatement(
                    condition,
                    factory.createBlock(
                        [
                            factory.createExpressionStatement(
                                factory.createBinaryExpression(
                                    factory.createPropertyAccessExpression(
                                        messageIdentifier,
                                        fieldDescriptor.name
                                    ),
                                    factory.createToken(SyntaxKind.EqualsToken),
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
                factory.createPropertyAssignment(
                    fieldDescriptor.name,
                    assignmentExpr
                )
            );
        }
    }

    statements.unshift(
        factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
                [
                    factory.createVariableDeclaration(
                        "message",
                        undefined,
                        undefined,
                        factory.createNewExpression(
                            factory.createIdentifier(messageDescriptor.name),
                            undefined,
                            [factory.createObjectLiteralExpression(properties, true)]
                        )
                    ),
                ],
                NodeFlags.Const
            )
        )
    );

    statements.push(factory.createReturnStatement(messageIdentifier));

    return factory.createMethodDeclaration(
        undefined,
        [ factory.createModifier(SyntaxKind.StaticKeyword) ],
        undefined,
        factory.createIdentifier('fromObject'),
        undefined,
        undefined,
        [
            factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                dataIdentifier,
                undefined,
                createPrimitiveMessageSignature(rootDescriptor, messageDescriptor)
            ),
        ],
        undefined,
        factory.createBlock(statements, true)
    );
}

function createToObject(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
): MethodDeclaration
{
    const statements: Statement[] = [];
    const properties = [];
    const dataIdentifier = factory.createIdentifier('data');

    for (const fieldDescriptor of messageDescriptor.field)
    {
        let valueExpr: Expression = factory.createPropertyAccessExpression(
            factory.createThis(),
            fieldDescriptor.name
        );

        if (field.isMap(fieldDescriptor))
        {
            const [, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name)!.field;

            if (field.isMessage(valueDescriptor))
            {
                valueExpr = factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createCallExpression(
                            factory.createPropertyAccessChain(
                                factory.createIdentifier("Array"),
                                undefined,
                                "from"
                            ),
                            undefined,
                            [ valueExpr ]
                        ),
                        "map"
                    ),
                    undefined,
                    [
                        factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    factory.createArrayBindingPattern([
                                        factory.createBindingElement(undefined, undefined, "key"),
                                        factory.createBindingElement(undefined, undefined, "value")
                                    ])
                                )
                            ],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createArrayLiteralExpression([
                                factory.createIdentifier("key"),
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createIdentifier("value"),
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

            valueExpr = factory.createCallExpression(
                factory.createPropertyAccessChain(
                    factory.createIdentifier("Object"),
                    undefined,
                    "fromEntries"
                ),
                undefined,
                [ valueExpr ]
            )
        }
        else if (field.isMessage(fieldDescriptor))
        {
            if (field.isRepeated(fieldDescriptor))
            {
                const arrowFunc = factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                        factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            "item",
                            undefined,
                            factory.createTypeReferenceNode(
                                type.getTypeReference(
                                    rootDescriptor,
                                    fieldDescriptor.type_name,
                                ) as Identifier,
                                undefined
                            )
                        ),
                    ],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(factory.createIdentifier("item"), "toObject"),
                        undefined,
                        undefined
                    )
                );
                valueExpr = factory.createCallExpression(
                    factory.createPropertyAccessExpression(valueExpr, "map"),
                    undefined,
                    [arrowFunc]
                );
            }
            else
            {
                valueExpr = factory.createCallExpression(
                    factory.createPropertyAccessExpression(valueExpr, "toObject"),
                    undefined,
                    undefined,
                );
            }
        }

        if (field.isOptional(rootDescriptor, fieldDescriptor))
        {
            const propertyAccessor = factory.createPropertyAccessExpression(
                factory.createThis(),
                fieldDescriptor.name
            );
            let condition = factory.createBinaryExpression(
                propertyAccessor,
                factory.createToken(SyntaxKind.ExclamationEqualsToken),
                factory.createNull()
            );

            if (field.isMap(fieldDescriptor)) {
                condition = factory.createBinaryExpression(
                    factory.createPropertyAccessExpression(
                        propertyAccessor,
                        "size"
                    ),
                    factory.createToken(SyntaxKind.GreaterThanToken),
                    factory.createNumericLiteral(0)
                );
            }

            statements.push(
                factory.createIfStatement(
                    condition,
                    factory.createBlock([
                        factory.createExpressionStatement(
                            factory.createBinaryExpression(
                                factory.createPropertyAccessExpression(dataIdentifier, fieldDescriptor.name),
                                factory.createToken(SyntaxKind.EqualsToken),
                                valueExpr
                            )
                        )
                    ], true)
                )
            )
        }
        else
        {
            properties.push(
                factory.createPropertyAssignment(
                    fieldDescriptor.name,
                    valueExpr
                )
            );
        }
    }

    statements.unshift(
        factory.createVariableStatement(undefined,
            factory.createVariableDeclarationList([
                factory.createVariableDeclaration(
                    "data",
                    undefined,
                    createPrimitiveMessageSignature(rootDescriptor, messageDescriptor),
                    factory.createObjectLiteralExpression(properties, true)
                )
            ], NodeFlags.Const)
        )
    )

    statements.push(factory.createReturnStatement(dataIdentifier));

    return factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier("toObject"),
        undefined,
        undefined,
        [],
        undefined,
        factory.createBlock(statements, true)
    );
}

export function createNamespace(packageName: string, statements: Statement[]): ModuleBlock
{
    const identifiers = packageName.split('.').reverse();
    let block: ModuleBlock = factory.createModuleBlock(statements) as any;

    for(const identifier of identifiers)
    {
        block = factory.createModuleDeclaration(
            undefined,
            [ factory.createModifier(SyntaxKind.ExportKeyword) ],
            factory.createIdentifier(identifier),
            block,
            NodeFlags.Namespace
        ) as any;
    }

    return block;
}

function createMessageSignature(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
): TypeNode
{
    const oneOfSignatures = [];

    for (const [ index ] of messageDescriptor.oneof_decl.entries())
    {
        const childSignatures = [];

        for (const currentFieldDescriptor of messageDescriptor.field)
        {
            if (currentFieldDescriptor.oneof_index !== index)
            {
                continue;
            }

            const members = [];

            for (const fieldDescriptor of messageDescriptor.field)
            {
                if (fieldDescriptor.oneof_index != index)
                {
                    continue;
                }

                let fieldType: TypeNode = factory.createTypeReferenceNode('never');

                if (fieldDescriptor == currentFieldDescriptor) {
                    fieldType = field.wrapRepeatedType(
                        field.getType(fieldDescriptor, rootDescriptor) as TypeNode,
                        fieldDescriptor
                    );
                }

                members.push(factory.createPropertySignature(
                    undefined,
                    fieldDescriptor.name,
                    factory.createToken(SyntaxKind.QuestionToken),
                    fieldType
                ))
            }

            childSignatures.push(
                factory.createTypeLiteralNode(members)
            )
        }

        oneOfSignatures.push(factory.createUnionTypeNode(childSignatures))
    }

    const fieldSignatures = messageDescriptor.field
        .filter(f => typeof f.oneof_index !== 'number')
        .map(f => factory.createPropertySignature(
            undefined,
            f.name,
            field.isOptional(rootDescriptor, f) ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
            field.wrapRepeatedType(field.getType(f, rootDescriptor) as TypeNode, f)
        ));

    if (oneOfSignatures.length)
    {
        return factory.createIntersectionTypeNode([
            factory.createTypeLiteralNode(fieldSignatures),
            factory.createUnionTypeNode(oneOfSignatures)
        ])
    }

    return factory.createTypeLiteralNode(fieldSignatures);
}

function createPrimitiveMessageSignature(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
) {
    const fieldSignatures = [];

    const wrapMessageType = (fieldType: TypeReferenceNode): TypeReferenceNode => {
        return factory.createTypeReferenceNode(
            "ReturnType",
            [
                factory.createTypeOfExpression(
                    factory.createPropertyAccessExpression(
                        factory.createPropertyAccessExpression(
                            fieldType.typeName as Identifier,
                            'prototype',
                        ),
                        'toObject',
                    )
                ) as any,
            ]
        )
    }

    for (const fieldDescriptor of messageDescriptor.field) {
        let fieldType = field.getType(fieldDescriptor, rootDescriptor) as TypeReferenceNode;
        let finalFieldType: TypeNode;

        if (field.isMap(fieldDescriptor)) {
            const [ keyDescriptor, valueDescriptor ] = type.getMapDescriptor(fieldDescriptor.type_name)!.field;

            let valueType = field.getType(valueDescriptor, rootDescriptor) as TypeReferenceNode;

            if (field.isMessage(valueDescriptor))
            {
                valueType = wrapMessageType(valueType);
            }

            finalFieldType = factory.createTypeLiteralNode([
                factory.createIndexSignature(
                    undefined,
                    undefined,
                    [
                        factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            'key',
                            undefined,
                            field.getType(keyDescriptor, rootDescriptor) as TypeNode,
                        )
                    ],
                    valueType as TypeNode
                )
            ])
        }
        else if (field.isMessage(fieldDescriptor))
        {
            fieldType = wrapMessageType(fieldType);
        }

        fieldSignatures.push(
            factory.createPropertySignature(
                undefined,
                fieldDescriptor.name,
                field.isOptional(rootDescriptor, fieldDescriptor) ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
                field.wrapRepeatedType(fieldType, fieldDescriptor)
            )
        );
    }

    return factory.createTypeLiteralNode(fieldSignatures);
}

function createConstructor(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
    pbIdentifier: Identifier,
): ConstructorDeclaration
{
    const dataIdentifier = factory.createIdentifier("data");
    const typeNode = factory.createUnionTypeNode([
        factory.createArrayTypeNode(
            factory.createTypeReferenceNode(factory.createIdentifier("any"), undefined)
        ),
        createMessageSignature(rootDescriptor, messageDescriptor),
    ]);

    // Get oneOfFields
    const oneOfFields = messageDescriptor.oneof_decl.map((_: OneofDescriptorProto, index: number) => {
        return factory.createArrayLiteralExpression(messageDescriptor.field
            .filter(fd => index == fd.oneof_index)
            .map(fd => factory.createNumericLiteral(fd.number)))
    });

    // Get repeated fields numbers
    const repeatedFields = messageDescriptor.field
        .filter(fd => field.isRepeated(fd) && !field.isMap(fd))
        .map(fd => factory.createNumericLiteral(fd.number));

    const statements: Statement[] = [
        // Create super(); statement
        factory.createExpressionStatement(
            factory.createCallExpression(factory.createSuper(), undefined, undefined)
        ),

        // Create initialize(); statement
        factory.createExpressionStatement(
            factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                    "initialize"
                ),
                undefined,
                [
                    factory.createThis(),
                    factory.createConditionalExpression(
                        factory.createCallExpression(
                            factory.createPropertyAccessExpression(factory.createIdentifier("Array"), "isArray"),
                            undefined,
                            [ dataIdentifier ]
                        ),
                        factory.createToken(SyntaxKind.QuestionToken),
                        dataIdentifier,
                        factory.createToken(SyntaxKind.ColonToken),
                        factory.createArrayLiteralExpression()
                    ),
                    factory.createNumericLiteral("0"),
                    factory.createNumericLiteral("-1") /* TODO: Handle extensions */,
                    factory.createArrayLiteralExpression(repeatedFields),
                    factory.createArrayLiteralExpression(oneOfFields),
                ]
            )
        ),

        // Create data variable and if block
        factory.createIfStatement(
            factory.createBinaryExpression(
                factory.createLogicalNot(
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(factory.createIdentifier("Array"), "isArray"),
                        undefined,
                        [dataIdentifier]
                    )
                ),
                SyntaxKind.AmpersandAmpersandToken,
                factory.createBinaryExpression(
                    factory.createTypeOfExpression(dataIdentifier),
                    SyntaxKind.EqualsEqualsToken,
                    factory.createStringLiteral("object")
                )
            ),
            factory.createBlock(
                messageDescriptor.field
                    .map((fieldDescriptor) => {
                        const assigmentExpression = factory.createExpressionStatement(
                            factory.createBinaryExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createThis(),
                                    fieldDescriptor.name
                                ),
                                SyntaxKind.EqualsToken,
                                factory.createPropertyAccessExpression(
                                    dataIdentifier,
                                    fieldDescriptor.name
                                )
                            )
                        );
                        if (!field.isOptional(rootDescriptor, fieldDescriptor)) {
                            return assigmentExpression;
                        }
                        return factory.createIfStatement(
                            factory.createBinaryExpression(
                                factory.createBinaryExpression(
                                    factory.createStringLiteral(fieldDescriptor.name),
                                    factory.createToken(SyntaxKind.InKeyword),
                                    dataIdentifier
                                ),

                                factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                                factory.createBinaryExpression(
                                    factory.createPropertyAccessExpression(
                                        dataIdentifier,
                                        fieldDescriptor.name
                                    ),
                                    factory.createToken(SyntaxKind.ExclamationEqualsToken),
                                    factory.createIdentifier("undefined"),
                                ),
                            ),
                            factory.createBlock([assigmentExpression], true)
                        )
                    })
            )
        ),

        ...messageDescriptor.field
            .filter(fieldDescriptor => field.isMap(fieldDescriptor))
            .map(fieldDescriptor => {
                const propertyAccessor = factory.createPropertyAccessExpression(factory.createThis(), fieldDescriptor.name);

                return factory.createIfStatement(
                    factory.createPrefixUnaryExpression(
                        SyntaxKind.ExclamationToken,
                        propertyAccessor
                    ),
                    factory.createExpressionStatement(
                        factory.createBinaryExpression(
                            propertyAccessor,
                            factory.createToken(SyntaxKind.EqualsToken),
                            factory.createNewExpression(factory.createIdentifier("Map"), undefined, [])
                        )
                    )
                );
            }),
    ];

    return factory.createConstructorDeclaration(
        undefined,
        undefined,
        [
            factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                dataIdentifier,
                factory.createToken(SyntaxKind.QuestionToken),
                typeNode
            ),
        ],
        factory.createBlock(statements, true),
    );
}


/**
 * Returns a get accessor for the field
 */
function createGetter(
    rootDescriptor: FileDescriptorProto,
    fieldDescriptor: FieldDescriptorProto,
    pbIdentifier: Identifier,
): GetAccessorDeclaration
{
    const getterType = field.wrapRepeatedType(field.getType(fieldDescriptor, rootDescriptor) as TypeNode, fieldDescriptor);
    let getterExpr: Expression = createGetterCall(rootDescriptor, fieldDescriptor, pbIdentifier);

    if (field.isMap(fieldDescriptor))
    {
        getterExpr = factory.createAsExpression(
            getterExpr,
            factory.createToken(SyntaxKind.AnyKeyword)
        );
    }

    return factory.createGetAccessorDeclaration(
        undefined,
        undefined,
        fieldDescriptor.name,
        [],
        undefined,
        factory.createBlock([
            factory.createReturnStatement(
                factory.createAsExpression(getterExpr, getterType)
            )
        ], true)
    );
}

function createGetterCall(
    rootDescriptor: FileDescriptorProto,
    fieldDescriptor: FieldDescriptorProto,
    pbIdentifier: Identifier,
): CallExpression
{
    let args: Expression[];
    let getterMethod = 'getField';

    if (field.isMessage(fieldDescriptor) && !field.isMap(fieldDescriptor))
    {
        getterMethod = field.isRepeated(fieldDescriptor)
            ? 'getRepeatedWrapperField'
            : 'getWrapperField';

        args = [
            factory.createThis(),
            type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Expression,
            factory.createNumericLiteral(fieldDescriptor.number)
        ]
    }
    else
    {
        args = [
            factory.createThis(),
            factory.createNumericLiteral(fieldDescriptor.number),
        ];

        if (fieldDescriptor.default_value)
        {
            getterMethod = 'getFieldWithDefault';
            let _default: Expression;

            if (field.isEnum(fieldDescriptor))
            {
                _default = factory.createPropertyAccessExpression(
                    type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Expression,
                    fieldDescriptor.default_value
                )
            }
            else if (field.isString(fieldDescriptor))
            {
                _default = factory.createStringLiteral(fieldDescriptor.default_value)
            }
            else if (field.isBoolean(fieldDescriptor))
            {
                _default = factory.createIdentifier(fieldDescriptor.default_value)
            }
            else
            {
                _default = factory.createIdentifier(fieldDescriptor.default_value)
            }

            args.push(_default);
        }
    }
    return factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createPropertyAccessExpression(pbIdentifier, "Message"),
            factory.createIdentifier(getterMethod)
        ),
        undefined,
        args
    );
}

/**
 * Returns a class for the message descriptor
 */
function createOneOfGetter(
    index: number,
    oneofDescriptor: OneofDescriptorProto,
    messageDescriptor: DescriptorProto,
    pbIdentifier: Identifier
): GetAccessorDeclaration
{
    const numbers = [];
    const types: TypeNode[] = [
        factory.createTypeReferenceNode('none'),
    ];
    const cases = [
        factory.createPropertyAssignment(
            factory.createNumericLiteral(0),
            factory.createStringLiteral('none'),

        )
    ];

    for (const field of messageDescriptor.field)
    {
        if (field.oneof_index !== index)
        {
            continue;
        }

        numbers.push(factory.createNumericLiteral(field.number));
        types.push(factory.createTypeReferenceNode(field.name));
        cases.push(factory.createPropertyAssignment(
            factory.createNumericLiteral(field.number),
            factory.createStringLiteral(field.name))
        );
    }

    const statements: Statement[] = [
        factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList([
                factory.createVariableDeclaration(
                    "cases",
                    undefined,
                    factory.createTypeLiteralNode([
                        factory.createIndexSignature(
                            undefined,
                            undefined,
                            [
                                factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    "index",
                                    undefined,
                                    factory.createKeywordTypeNode(SyntaxKind.NumberKeyword)
                                )
                            ],
                            factory.createUnionTypeNode(types)
                        )
                    ]),
                    factory.createObjectLiteralExpression(cases, true)
                )
            ], NodeFlags.Const)
        ),

        factory.createReturnStatement(
            factory.createElementAccessExpression(
                factory.createIdentifier("cases"),
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                        factory.createIdentifier("computeOneofCase")
                    ),
                    undefined,
                    [
                        factory.createThis(),
                        factory.createArrayLiteralExpression(numbers)
                    ]
                ),
            )
        )
    ]

    return factory.createGetAccessorDeclaration(
        undefined,
        undefined,
        oneofDescriptor.name,
        [],
        undefined,
        factory.createBlock(statements, true)
    );
}

function createSetter(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
    fieldDescriptor: FieldDescriptorProto,
    pbIdentifier: Identifier,
) {
    const type = field.wrapRepeatedType(
        field.getType(fieldDescriptor, rootDescriptor) as TypeNode,
        fieldDescriptor
    );
    const valueParameter = factory.createIdentifier("value");


    let block;

    if (field.isOneOf(fieldDescriptor)) {
        block = createOneOfSetterBlock(messageDescriptor, fieldDescriptor, valueParameter, pbIdentifier)
    } else {
        block = createSetterBlock(fieldDescriptor, valueParameter, pbIdentifier)
    }


    return factory.createSetAccessorDeclaration(
        undefined,
        undefined,
        fieldDescriptor.name,
        [factory.createParameterDeclaration(
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

function createOneOfSetterBlock(
    messageDescriptor: DescriptorProto,
    fieldDescriptor: FieldDescriptorProto,
    valueParameter: Identifier,
    pbIdentifier: Identifier,
):  Block
{
    const method = field.isMessage(fieldDescriptor)
        ? 'setOneofWrapperField'
        : 'setOneofField';
    const numbers = messageDescriptor.field
        .filter(field => field.oneof_index == fieldDescriptor.oneof_index)
        .map(field => factory.createNumericLiteral(field.number));

    return factory.createBlock([
        factory.createExpressionStatement(
            factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                    method
                ),
                undefined,
                [
                    factory.createThis(),
                    factory.createNumericLiteral(fieldDescriptor.number),
                    factory.createArrayLiteralExpression(numbers),
                    valueParameter,
                ]
            )
        ),
    ], true)
}

function createSetterBlock(
    fieldDescriptor: FieldDescriptorProto,
    valueParameter: Identifier,
    pbIdentifier: Identifier,
) {
    const method = field.isMessage(fieldDescriptor) && !field.isMap(fieldDescriptor)
        ? field.isRepeated(fieldDescriptor)
            ? 'setRepeatedWrapperField'
            : 'setWrapperField'
        : 'setField';

    const parameter: Expression = field.isMap(fieldDescriptor)
        ? factory.createAsExpression(valueParameter, factory.createToken(SyntaxKind.AnyKeyword))
        : valueParameter;

    return factory.createBlock([
        factory.createExpressionStatement(
            factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                    method
                ),
                undefined,
                [
                    factory.createThis(),
                    factory.createNumericLiteral(fieldDescriptor.number),
                    parameter,
                ]
            )
        ),
    ], true)
}

/**
 * Returns the serialize method for the message class
 */
function createSerialize(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
    pbIdentifier: Identifier,
): ClassElement[]
{
    const statements: Statement[] = [
        factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
                [
                    factory.createVariableDeclaration(
                        "writer",
                        undefined,
                        undefined,
                        factory.createBinaryExpression(
                            factory.createIdentifier("w"),
                            SyntaxKind.BarBarToken,
                            factory.createNewExpression(
                                factory.createPropertyAccessExpression(pbIdentifier, "BinaryWriter"),
                                undefined,
                                []
                            )
                        )
                    ),
                ],
                NodeFlags.Const
            )
        )
    ];

    for (const fieldDescriptor of messageDescriptor.field) {
        const propAccessor = factory.createPropertyAccessExpression(
            factory.createThis(),
            fieldDescriptor.name
        );

        if (field.isMap(fieldDescriptor))
        {
            const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(fieldDescriptor.type_name)!.field;

            const valueExprArgs: Expression[] = [
                factory.createNumericLiteral(2),
                factory.createIdentifier("value"),
            ];

            if (field.isMessage(valueDescriptor))
            {
                valueExprArgs.push(
                    factory.createArrowFunction(
                        undefined,
                        undefined,
                        [],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier("value"),
                                "serialize"
                            ),
                            undefined,
                            [factory.createIdentifier("writer")]
                        )
                    )
                )
            }

            const writeCall = factory.createExpressionStatement(factory.createCallExpression(
                factory.createPropertyAccessExpression(factory.createIdentifier("writer"), "writeMessage"),
                undefined,
                [
                    factory.createNumericLiteral(fieldDescriptor.number),
                    propAccessor,
                    factory.createArrowFunction(
                        undefined,
                        undefined,
                        [],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createBlock([
                            factory.createExpressionStatement(
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createIdentifier("writer"),
                                        factory.createIdentifier(
                                            `write${field.toBinaryMethodName(
                                                keyDescriptor,
                                                rootDescriptor
                                            )}`
                                        )
                                    ),
                                    undefined,
                                    [
                                        factory.createNumericLiteral(1),
                                        factory.createIdentifier("key")
                                    ]
                                )
                            ),
                            factory.createExpressionStatement(
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createIdentifier("writer"),
                                        factory.createIdentifier(
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
            ));

            statements.push(
                factory.createForOfStatement(
                    undefined,
                    factory.createVariableDeclarationList([
                        factory.createVariableDeclaration(
                            factory.createArrayBindingPattern([
                                factory.createBindingElement(undefined, undefined, "key"),
                                factory.createBindingElement(undefined, undefined, "value")
                            ])
                        ),
                    ], NodeFlags.Const),
                    propAccessor,
                    factory.createBlock([ writeCall ])
                )
            )
        }
        else
        {
            const propParameters: Expression[] = [
                factory.createNumericLiteral(fieldDescriptor.number),
                propAccessor,
            ];

            if (field.isMessage(fieldDescriptor))
            {
                if (field.isRepeated(fieldDescriptor))
                {
                    propParameters.push(
                        factory.createArrowFunction(
                            undefined,
                            undefined,
                            [
                                factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    "item",
                                    undefined,
                                    factory.createTypeReferenceNode(
                                        type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Identifier
                                    )
                                ),
                            ],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createIdentifier("item"),
                                    "serialize"
                                ),
                                undefined,
                                [factory.createIdentifier("writer")]
                            )
                        )
                    );
                }
                else
                {
                    propParameters.push(
                        factory.createArrowFunction(
                            undefined,
                            undefined,
                            [],
                            undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createThis(),
                                        fieldDescriptor.name
                                    ),
                                    "serialize"
                                ),
                                undefined,
                                [factory.createIdentifier("writer")]
                            )
                        )
                    );
                }
            }

            // this.prop !== undefined
            let condition = factory.createBinaryExpression(
                propAccessor,
                factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken),
                factory.createIdentifier("undefined")
            );

            const statement = factory.createExpressionStatement(
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createIdentifier("writer"),
                        factory.createIdentifier(
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
                condition = factory.createBinaryExpression(
                    factory.createBinaryExpression(
                        factory.createTypeOfExpression(propAccessor),
                        factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                        factory.createStringLiteral("string")
                    ),
                    factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                    factory.createPropertyAccessExpression(propAccessor, "length")
                );
            }


            statements.push(
                factory.createIfStatement(
                    condition,
                    statement
                )
            );
        }
    }

    statements.push(
        factory.createIfStatement(
            factory.createPrefixUnaryExpression(
                SyntaxKind.ExclamationToken,
                factory.createIdentifier("w")
            ),
            factory.createReturnStatement(
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createIdentifier("writer"),
                        "getResultBuffer"
                    ),
                    undefined,
                    []
                )
            )
        )
    );


    return [
        factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            "serialize",
            undefined,
            undefined,
            [],
            factory.createTypeReferenceNode("Uint8Array"),
            undefined,
        ),
        factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            "serialize",
            undefined,
            undefined,
            [
                factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "w",
                    undefined,
                    factory.createTypeReferenceNode(
                        factory.createQualifiedName(pbIdentifier, "BinaryWriter")
                    ),
                    undefined
                ),
            ],
            factory.createTypeReferenceNode("void"),
            undefined,
        ),
        factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            "serialize",
            undefined,
            undefined,
            [
                factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    "w",
                    factory.createToken(SyntaxKind.QuestionToken),
                    factory.createTypeReferenceNode(
                        factory.createQualifiedName(pbIdentifier, "BinaryWriter")
                    ),
                    undefined
                ),
            ],
            factory.createUnionTypeNode([
                factory.createTypeReferenceNode("Uint8Array"),
                factory.createTypeReferenceNode("void"),
            ]),
            factory.createBlock(statements, true)
        )
    ];
}

/**
 * Returns the deserialize method for the message class
 */
function createDeserialize(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
    pbIdentifier: Identifier,
): ClassElement
{
    const statements: Statement[] = [
        factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
                [
                    factory.createVariableDeclaration(
                        "reader",
                        undefined, undefined,
                        factory.createConditionalExpression(
                            factory.createBinaryExpression(
                                factory.createIdentifier("bytes"),
                                SyntaxKind.InstanceOfKeyword,
                                factory.createPropertyAccessExpression(pbIdentifier, "BinaryReader")
                            ),
                            factory.createToken(SyntaxKind.QuestionToken),

                            factory.createIdentifier("bytes"),
                            factory.createToken(SyntaxKind.ColonToken),
                            factory.createNewExpression(
                                factory.createPropertyAccessExpression(pbIdentifier, "BinaryReader"),
                                undefined,
                                [factory.createIdentifier("bytes")]
                            ),
                        )
                    ),
                    factory.createVariableDeclaration(
                        "message",
                        undefined,
                        undefined,
                        factory.createNewExpression(
                            factory.createIdentifier(messageDescriptor.name),
                            undefined,
                            []
                        )
                    ),
                ],
                NodeFlags.Const
            )
        )
    ];

    const cases = [];

    for (const fieldDescriptor of messageDescriptor.field)
    {
        const statements = [];

        if (
            field.isRepeated(fieldDescriptor) &&
            !field.isMessage(fieldDescriptor) &&
            !field.isPacked(rootDescriptor, fieldDescriptor)
        )
        {
            statements.push(
                factory.createExpressionStatement(
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createPropertyAccessExpression(pbIdentifier, "Message"),
                            "addToRepeatedField"
                        ),
                        undefined,
                        [
                            factory.createIdentifier("message"),
                            factory.createNumericLiteral(
                                fieldDescriptor.number
                            ),
                            factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                    factory.createIdentifier("reader"),
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
        }
        else if (field.isMap(fieldDescriptor))
        {
            const [ keyDescriptor, valueDescriptor ] = type.getMapDescriptor(fieldDescriptor.type_name)!.field;

            const keyCall = factory.createPropertyAccessExpression(
                factory.createIdentifier("reader"),
                factory.createIdentifier(
                    `read${field.toBinaryMethodName(
                        keyDescriptor,
                        rootDescriptor
                    )}`
                )
            )

            let valueCall;

            if (field.isMessage(valueDescriptor))
            {
                valueCall = factory.createArrowFunction(
                    undefined,
                    undefined,
                    [],
                    undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    factory.createBlock([
                        factory.createVariableStatement(
                            undefined,
                            factory.createVariableDeclarationList([
                                factory.createVariableDeclaration("value")
                            ], NodeFlags.Let)
                        ),
                        factory.createExpressionStatement(factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier("reader"),
                                "readMessage"
                            ),
                            undefined,
                            [
                                factory.createIdentifier("message"),
                                factory.createArrowFunction(
                                    undefined,
                                    undefined,
                                    [],
                                    undefined,
                                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                    factory.createBinaryExpression(
                                        factory.createIdentifier("value"),
                                        SyntaxKind.EqualsToken,
                                        factory.createCallExpression(
                                            factory.createPropertyAccessExpression(
                                                type.getTypeReference(rootDescriptor, valueDescriptor.type_name) as Expression,
                                                "deserialize"
                                            ),
                                            undefined,
                                            [factory.createIdentifier("reader")]
                                        )
                                    )


                                )
                            ]
                        )),
                        factory.createReturnStatement(factory.createIdentifier("value"))
                    ], true)
                )

            }
            else
            {
                valueCall = factory.createPropertyAccessExpression(
                    factory.createIdentifier("reader"),
                    factory.createIdentifier(
                        `read${field.toBinaryMethodName(
                            valueDescriptor,
                            rootDescriptor
                        )}`
                    )
                );
            }

            statements.push(
                factory.createExpressionStatement(
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createIdentifier("reader"),
                            "readMessage"
                        ),
                        undefined,
                        [
                            factory.createIdentifier("message"),
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                factory.createToken(
                                    SyntaxKind.EqualsGreaterThanToken
                                ),
                                factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                        factory.createPropertyAccessExpression(
                                            pbIdentifier,
                                            "Map"
                                        ),
                                        "deserializeBinary"
                                    ),

                                    undefined,
                                    [
                                        factory.createAsExpression(
                                            factory.createPropertyAccessExpression(
                                                factory.createIdentifier("message"),
                                                fieldDescriptor.name
                                            ),
                                            factory.createToken(SyntaxKind.AnyKeyword)
                                        ),
                                        factory.createIdentifier("reader"),
                                        keyCall,
                                        valueCall
                                    ]
                                )
                            ),
                        ]
                    )
                )
            );
        }
        else if (field.isMessage(fieldDescriptor))
        {
            const readCall = factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Expression,
                    "deserialize"
                ),
                undefined,
                [factory.createIdentifier("reader")]
            );

            statements.push(
                factory.createExpressionStatement(
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createIdentifier("reader"),
                            "readMessage"
                        ),
                        undefined,
                        [
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier("message"),
                                fieldDescriptor.name
                            ),
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                factory.createToken(
                                    SyntaxKind.EqualsGreaterThanToken
                                ),
                                field.isRepeated(fieldDescriptor)
                                    ? factory.createCallExpression(
                                        factory.createPropertyAccessExpression(
                                            factory.createPropertyAccessExpression(
                                                pbIdentifier,
                                                "Message"
                                            ),
                                            "addToRepeatedWrapperField"
                                        ),
                                        undefined,
                                        [
                                            factory.createIdentifier("message"),
                                            factory.createNumericLiteral(fieldDescriptor.number),
                                            readCall,
                                            type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as Expression,
                                        ]
                                    )
                                    : factory.createBinaryExpression(
                                        factory.createPropertyAccessExpression(
                                            factory.createIdentifier("message"),
                                            fieldDescriptor.name
                                        ),
                                        SyntaxKind.EqualsToken,
                                        readCall
                                    )
                            ),
                        ]
                    )
                )
            );
        }
        else
        {
            statements.push(
                factory.createExpressionStatement(
                    factory.createBinaryExpression(
                        factory.createPropertyAccessExpression(
                            factory.createIdentifier("message"),
                            fieldDescriptor.name
                        ),
                        SyntaxKind.EqualsToken,
                        factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier("reader"),
                                `read${field.toBinaryMethodName(
                                    fieldDescriptor,
                                    rootDescriptor,
                                    false
                                )}`
                            ),
                            undefined,
                            undefined,
                        )
                    )
                )
            );
        }
        statements.push(factory.createBreakStatement());

        cases.push(factory.createCaseClause(
            factory.createNumericLiteral(fieldDescriptor.number),
            statements
        ))
    }

    // Default clause
    cases.push(
        factory.createDefaultClause([
            factory.createExpressionStatement(
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createIdentifier("reader"),
                        "skipField"
                    ),
                    undefined,
                    []
                )
            ),
        ])
    );

    statements.push(
        factory.createWhileStatement(
            factory.createCallExpression(
                factory.createPropertyAccessExpression(factory.createIdentifier("reader"), "nextField"),
                undefined,
                []
            ),
            factory.createBlock(
                [
                    factory.createIfStatement(
                        factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier("reader"),
                                "isEndGroup"
                            ),
                            undefined,
                            undefined
                        ),
                        factory.createBreakStatement()
                    ),
                    factory.createSwitchStatement(
                        factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                                factory.createIdentifier("reader"),
                                "getFieldNumber"
                            ),
                            undefined,
                            []
                        ),
                        factory.createCaseBlock(cases)
                    ),
                ],
                true
            )
        )
    );

    statements.push(
        factory.createReturnStatement(factory.createIdentifier("message"))
    );

    return factory.createMethodDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.StaticKeyword)],
        undefined,
        factory.createIdentifier("deserialize"),
        undefined,
        undefined,
        [
            factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("bytes"),
                undefined,
                factory.createUnionTypeNode([
                    factory.createTypeReferenceNode(
                        factory.createIdentifier("Uint8Array"),
                        undefined
                    ),
                    factory.createTypeReferenceNode(
                        factory.createQualifiedName(pbIdentifier, "BinaryReader"),
                        undefined
                    ),
                ])
            ),
        ],
        factory.createTypeReferenceNode(messageDescriptor.name, undefined),
        factory.createBlock(statements, true)
    );
}

/**
 * Returns the deserializeBinary method for the message class
 */
function createDeserializeBinary(messageDescriptor: DescriptorProto): ClassElement
{
    return factory.createMethodDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.StaticKeyword)],
        undefined,
        factory.createIdentifier("deserializeBinary"),
        undefined,
        undefined,
        [
            factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("bytes"),
                undefined,
                factory.createTypeReferenceNode(
                    factory.createIdentifier("Uint8Array")
                )
            ),
        ],
        factory.createTypeReferenceNode(messageDescriptor.name),
        factory.createBlock([
            factory.createReturnStatement(
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createIdentifier(messageDescriptor.name), "deserialize"
                    ),
                    undefined,
                    [
                        factory.createIdentifier("bytes")
                    ]
                )
            )
        ], true)
    );
}


/**
 * Returns the serializeBinary method for the Message class
 */
function createSerializeBinary(): ClassElement
{
    return factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier("serializeBinary"),
        undefined,
        undefined,
        [],
        factory.createUnionTypeNode([
            factory.createTypeReferenceNode(factory.createIdentifier("Uint8Array"), []),
        ]),
        factory.createBlock([
            factory.createReturnStatement(
                factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        factory.createThis(),
                        "serialize"
                    ),
                    undefined,
                    undefined,
                )
            ),
        ], true)
    );
}


/**
 * Returns a class for the message descriptor
 */
function createMessage(
    rootDescriptor: FileDescriptorProto,
    messageDescriptor: DescriptorProto,
    pbIdentifier: Identifier,
): ClassDeclaration
{
    // Create message class
    return factory.createClassDeclaration(
        undefined,
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        messageDescriptor.name,
        undefined,
        [
            factory.createHeritageClause(SyntaxKind.ExtendsKeyword, [
                factory.createExpressionWithTypeArguments(
                    factory.createPropertyAccessExpression(pbIdentifier, factory.createIdentifier("Message")),
                    [],
                ),
            ]),
        ],
        [
            // Create constructor
            createConstructor(
                rootDescriptor,
                messageDescriptor,
                pbIdentifier
            ),

            // Create getter and setters
            ...messageDescriptor.field.flatMap(fieldDescriptor => [
                createGetter(
                    rootDescriptor,
                    fieldDescriptor,
                    pbIdentifier
                ),
                createSetter(
                    rootDescriptor,
                    messageDescriptor,
                    fieldDescriptor,
                    pbIdentifier
                ),
            ]),

            // Create one of getters
            ...Array.from(messageDescriptor.oneof_decl.entries()).map(
                ([ index, oneofDescriptor ]) => createOneOfGetter(index, oneofDescriptor, messageDescriptor, pbIdentifier)
            ),

            // Create fromObject method
            createFromObject(rootDescriptor, messageDescriptor),

            // Create toObject method
            createToObject(rootDescriptor, messageDescriptor),

            // Create serialize  method
            ...createSerialize(
                rootDescriptor,
                messageDescriptor,
                pbIdentifier
            ),

            // Create deserialize method
            createDeserialize(
                rootDescriptor,
                messageDescriptor,
                pbIdentifier
            ),

            // Create serializeBinary method
            createSerializeBinary(),

            // Create deserializeBinary method
            createDeserializeBinary(messageDescriptor),
        ]
    );
}

export function processDescriptorRecursively(
    rootDescriptor: FileDescriptorProto,
    descriptor: DescriptorProto,
    pbIdentifier: Identifier,
    config: ConfigParameters,
): Statement[]
{
    const statements: Statement[] = [
        createMessage(rootDescriptor, descriptor, pbIdentifier)
    ];

    const namespacedStatements: Statement[] = [
        // Add enums
        ...descriptor.enum_type.map(e => createEnum(e)),

        // Add Messages
        ...descriptor.nested_type.flatMap(m => processDescriptorRecursively(rootDescriptor, m, pbIdentifier, config))
    ];

    if (namespacedStatements.length)
    {
        statements.push(createNamespace(descriptor.name, namespacedStatements));
    }

    return statements;
}