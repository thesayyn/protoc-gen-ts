import * as descriptor from "./compiler/descriptor";
import * as field from "./field";
import * as type from "./type";
import * as ts from "typescript";
import * as comment from "./comment";

/**
 * Returns a enum for the enum descriptor
 */
export function createEnum(
  enumDescriptor: descriptor.EnumDescriptorProto,
): ts.EnumDeclaration {
  const values = [];

  for (const valueDescriptor of enumDescriptor.value) {
    values.push(
      comment.addDeprecatedJsDoc(
        ts.factory.createEnumMember(
          valueDescriptor.name,
          ts.factory.createNumericLiteral(valueDescriptor.number),
        ),
        valueDescriptor.options?.deprecated,
      ),
    );
  }
  return comment.addDeprecatedJsDoc(
    ts.factory.createEnumDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(enumDescriptor.name),
      values,
    ),
    enumDescriptor.options?.deprecated,
  );
}

function createFromObject(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
): ts.MethodDeclaration {
  const dataIdentifier = ts.factory.createIdentifier("data");
  const messageIdentifier = ts.factory.createIdentifier("message");

  const statements = [];
  const properties = [];

  for (const fieldDescriptor of messageDescriptor.field) {
    let assignmentExpr: ts.Expression =
      ts.factory.createPropertyAccessExpression(
        dataIdentifier,
        fieldDescriptor.name,
      );

    if (field.isMap(fieldDescriptor)) {
      const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(
        fieldDescriptor.type_name,
      )!.field;

      assignmentExpr = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("Object"),
          "entries",
        ),
        undefined,
        [assignmentExpr],
      );

      let coercer;

      if (field.isNumber(keyDescriptor)) {
        coercer = "Number";
      } else if (field.isBoolean(keyDescriptor)) {
        coercer = "Boolean";
      }

      if (field.isMessage(valueDescriptor) || !field.isString(keyDescriptor)) {
        let keyExpr: ts.Expression = ts.factory.createIdentifier("key");
        let valueExpr: ts.Expression = ts.factory.createIdentifier("value");

        if (coercer) {
          keyExpr = ts.factory.createCallExpression(
            ts.factory.createIdentifier(coercer),
            undefined,
            [keyExpr],
          );
        }

        if (field.isMessage(valueDescriptor)) {
          valueExpr = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              type.getTypeReferenceExpr(
                rootDescriptor,
                valueDescriptor.type_name,
              ),
              "fromObject",
            ),
            undefined,
            [ts.factory.createIdentifier("value")],
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
                      "key",
                    ),
                    ts.factory.createBindingElement(
                      undefined,
                      undefined,
                      "value",
                    ),
                  ]),
                ),
              ],
              undefined,
              ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              ts.factory.createArrayLiteralExpression([keyExpr, valueExpr]),
            ),
          ],
        );
      }
      assignmentExpr = ts.factory.createNewExpression(
        ts.factory.createIdentifier("Map"),
        undefined,
        [assignmentExpr],
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
              "item",
            ),
          ],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              type.getTypeReferenceExpr(
                rootDescriptor,
                fieldDescriptor.type_name,
              ),
              "fromObject",
            ),
            undefined,
            [ts.factory.createIdentifier("item")],
          ),
        );
        assignmentExpr = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(assignmentExpr, "map"),
          undefined,
          [arrowFunc],
        );
      } else {
        assignmentExpr = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            type.getTypeReferenceExpr(
              rootDescriptor,
              fieldDescriptor.type_name,
            ),
            "fromObject",
          ),
          undefined,
          [
            ts.factory.createPropertyAccessExpression(
              dataIdentifier,
              fieldDescriptor.name,
            ),
          ],
        );
      }
    }

    if (field.isOptional(rootDescriptor, fieldDescriptor)) {
      const propertyAccessor = ts.factory.createPropertyAccessExpression(
        dataIdentifier,
        fieldDescriptor.name,
      );
      let condition = ts.factory.createBinaryExpression(
        propertyAccessor,
        ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
        ts.factory.createNull(),
      );

      if (field.isMap(fieldDescriptor)) {
        condition = ts.factory.createBinaryExpression(
          ts.factory.createTypeOfExpression(propertyAccessor),
          ts.factory.createToken(ts.SyntaxKind.EqualsEqualsToken),
          ts.factory.createStringLiteral("object"),
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
                    fieldDescriptor.name,
                  ),
                  ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                  assignmentExpr,
                ),
              ),
            ],
            true,
          ),
        ),
      );
    } else {
      properties.push(
        ts.factory.createPropertyAssignment(
          fieldDescriptor.name,
          assignmentExpr,
        ),
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
              [ts.factory.createObjectLiteralExpression(properties, true)],
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),
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
        createPrimitiveMessageSignature(rootDescriptor, messageDescriptor),
      ),
    ],
    undefined,
    ts.factory.createBlock(statements, true),
  );
}

function createToObject(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.MethodDeclaration {
  const statements = [];
  const properties = [];
  const dataIdentifier = ts.factory.createIdentifier("data");

  for (const fieldDescriptor of messageDescriptor.field) {
    let valueExpr: ts.Expression = ts.factory.createPropertyAccessExpression(
      ts.factory.createThis(),
      fieldDescriptor.name,
    );

    if (field.isMap(fieldDescriptor)) {
      const [, valueDescriptor] = type.getMapDescriptor(
        fieldDescriptor.type_name,
      )!.field;

      if (field.isMessage(valueDescriptor)) {
        valueExpr = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessChain(
                ts.factory.createIdentifier("Array"),
                undefined,
                "from",
              ),
              undefined,
              [valueExpr],
            ),
            "map",
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
                    ts.factory.createBindingElement(
                      undefined,
                      undefined,
                      "key",
                    ),
                    ts.factory.createBindingElement(
                      undefined,
                      undefined,
                      "value",
                    ),
                  ]),
                ),
              ],
              undefined,
              ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              ts.factory.createArrayLiteralExpression([
                ts.factory.createIdentifier("key"),
                ts.factory.createCallExpression(
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("value"),
                    "toObject",
                  ),
                  undefined,
                  [],
                ),
              ]),
            ),
          ],
        );
      }

      valueExpr = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessChain(
          ts.factory.createIdentifier("Object"),
          undefined,
          "fromEntries",
        ),
        undefined,
        [valueExpr],
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
              "item",
              undefined,

              type.getTypeReference(rootDescriptor, fieldDescriptor.type_name),
            ),
          ],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("item"),
              "toObject",
            ),
            undefined,
            undefined,
          ),
        );
        valueExpr = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(valueExpr, "map"),
          undefined,
          [arrowFunc],
        );
      } else {
        valueExpr = ts.factory.createConditionalExpression(
          ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createThis(),
              ts.factory.createIdentifier(fieldDescriptor.name)
            ),
            ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
            ts.factory.createNull()
          ),
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                ts.factory.createIdentifier(fieldDescriptor.name)
              ),
              ts.factory.createIdentifier("toObject")
            ),
            undefined,
            []
          ),
          ts.factory.createToken(ts.SyntaxKind.ColonToken),
          ts.factory.createIdentifier("undefined")
        )
      }
    }

    if (fieldDescriptor.default_value == null && rootDescriptor.syntax != "proto3") {
      properties.push(
        ts.factory.createPropertyAssignment(fieldDescriptor.name,
          ts.factory.createConditionalExpression(
            ts.factory.createBinaryExpression(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createPropertyAccessExpression(
                    pbIdentifier,
                    ts.factory.createIdentifier("Message")
                  ),
                  ts.factory.createIdentifier("getField")
                ),
                undefined,
                [
                  ts.factory.createThis(),
                  ts.factory.createNumericLiteral(fieldDescriptor.number)
                ]
              ),
              ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
              ts.factory.createNull()
            ),
            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
            valueExpr,
            ts.factory.createToken(ts.SyntaxKind.ColonToken),
            ts.factory.createIdentifier("undefined")
          )
        ),
      );
    } else {
      properties.push(
        ts.factory.createPropertyAssignment(fieldDescriptor.name, valueExpr),
      );
    }
  }

  statements.unshift(
    ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            "data",
            undefined,
            createPrimitiveMessageSignature(rootDescriptor, messageDescriptor),
            ts.factory.createObjectLiteralExpression(properties, true),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),
  );

  statements.push(ts.factory.createReturnStatement(dataIdentifier));

  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    ts.factory.createIdentifier("toObject"),
    undefined,
    undefined,
    [],
    undefined,
    ts.factory.createBlock(statements, true),
  );
}

export function createNamespace(
  packageName: string,
  statements: ts.Statement[],
): ts.ModuleDeclaration {
  const identifiers = String(packageName).split(".");

  let decl: ts.ModuleDeclaration | ts.ModuleBlock =
    ts.factory.createModuleBlock(statements);

  for (let i = identifiers.length - 1; i >= 0; i--) {
    decl = ts.factory.createModuleDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(identifiers[i]),
      decl as ts.ModuleBlock,
      ts.NodeFlags.Namespace,
    );
  }

  return decl as ts.ModuleDeclaration;
}

function createMessageSignature(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
): ts.TypeNode {
  const oneOfSignatures = [];

  for (const [index] of messageDescriptor.oneof_decl.entries()) {
    const childSignatures = [];

    for (const currentFieldDescriptor of messageDescriptor.field) {
      if (currentFieldDescriptor.oneof_index !== index) {
        continue;
      }

      const members = [];

      for (const fieldDescriptor of messageDescriptor.field) {
        if (fieldDescriptor.oneof_index != index) {
          continue;
        }

        let fieldType: ts.TypeNode =
          ts.factory.createTypeReferenceNode("never");

        if (fieldDescriptor == currentFieldDescriptor) {
          fieldType = field.wrapRepeatedType(
            field.getType(fieldDescriptor, rootDescriptor) as ts.TypeNode,
            fieldDescriptor,
          );
        }

        members.push(
          comment.addDeprecatedJsDoc(
            ts.factory.createPropertySignature(
              undefined,
              fieldDescriptor.name,
              ts.factory.createToken(ts.SyntaxKind.QuestionToken),
              fieldType,
            ),
            fieldDescriptor.options?.deprecated &&
              fieldDescriptor == currentFieldDescriptor,
          ),
        );
      }

      childSignatures.push(ts.factory.createTypeLiteralNode(members));
    }

    oneOfSignatures.push(ts.factory.createUnionTypeNode(childSignatures));
  }

  const fieldSignatures = [];

  for (const fieldDescriptor of messageDescriptor.field) {
    if (typeof fieldDescriptor.oneof_index !== "number") {
      fieldSignatures.push(
        comment.addDeprecatedJsDoc(
          ts.factory.createPropertySignature(
            undefined,
            fieldDescriptor.name,
            field.isOptional(rootDescriptor, fieldDescriptor)
              ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
              : undefined,
            field.wrapRepeatedType(
              field.getType(fieldDescriptor, rootDescriptor),
              fieldDescriptor,
            ),
          ),
          fieldDescriptor.options?.deprecated,
        ),
      );
    }
  }

  if (oneOfSignatures.length) {
    return ts.factory.createIntersectionTypeNode([
      ts.factory.createTypeLiteralNode(fieldSignatures),
      ts.factory.createUnionTypeNode(oneOfSignatures),
    ]);
  }

  return ts.factory.createTypeLiteralNode(fieldSignatures);
}

function createPrimitiveMessageSignature(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
) {
  const fieldSignatures = [];

  const wrapMessageType = (
    fieldType: ts.TypeReferenceNode,
  ): ts.TypeReferenceNode => {
    const type = ts.factory.createTypeQueryNode(
      ts.factory.createQualifiedName(
        ts.factory.createQualifiedName(fieldType.typeName, "prototype"),
        "toObject",
      ),
    );
    return ts.factory.createTypeReferenceNode("ReturnType", [type]);
  };

  for (const fieldDescriptor of messageDescriptor.field) {
    let fieldType: ts.TypeNode = field.getType(fieldDescriptor, rootDescriptor);

    if (field.isMap(fieldDescriptor)) {
      const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(
        fieldDescriptor.type_name,
      ).field;

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
              field.getType(keyDescriptor, rootDescriptor),
            ),
          ],
          valueType as ts.TypeNode,
        ),
      ]);
    } else if (field.isMessage(fieldDescriptor)) {
      fieldType = wrapMessageType(fieldType as ts.TypeReferenceNode);
    }

    fieldSignatures.push(
      ts.factory.createPropertySignature(
        undefined,
        fieldDescriptor.name,
        field.isOptional(rootDescriptor, fieldDescriptor)
          ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
          : undefined,
        field.wrapRepeatedType(fieldType as ts.TypeNode, fieldDescriptor),
      ),
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
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.ConstructorDeclaration {
  const dataIdentifier = ts.factory.createIdentifier("data");
  const typeNode = ts.factory.createUnionTypeNode([
    ts.factory.createArrayTypeNode(
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier("any"),
        undefined,
      ),
    ),
    createMessageSignature(rootDescriptor, messageDescriptor),
  ]);

  // Get oneOfFields
  const oneOfFields = messageDescriptor.oneof_decl.map(
    (_: descriptor.OneofDescriptorProto, index: number) => {
      return ts.factory.createArrayLiteralExpression(
        messageDescriptor.field
          .filter((fd) => index == fd.oneof_index)
          .map((fd) => ts.factory.createNumericLiteral(fd.number)),
      );
    },
  );

  // Get repeated fields numbers
  const repeatedFields = messageDescriptor.field
    .filter((fd) => field.isRepeated(fd) && !field.isMap(fd))
    .map((fd) => ts.factory.createNumericLiteral(fd.number));

  const statements: ts.Statement[] = [
    // Create super(); statement
    ts.factory.createExpressionStatement(
      ts.factory.createCallExpression(
        ts.factory.createSuper(),
        undefined,
        undefined,
      ),
    ),

    // Create initialize(); statement
    ts.factory.createExpressionStatement(
      ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
          "initialize",
        ),
        undefined,
        [
          ts.factory.createThis(),
          ts.factory.createConditionalExpression(
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("Array"),
                "isArray",
              ),
              undefined,
              [dataIdentifier],
            ),
            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
            dataIdentifier,
            ts.factory.createToken(ts.SyntaxKind.ColonToken),
            ts.factory.createArrayLiteralExpression(),
          ),
          ts.factory.createNumericLiteral("0"),
          ts.factory.createNumericLiteral("-1") /* TODO: Handle extensions */,
          ts.factory.createArrayLiteralExpression(repeatedFields),
          ts.factory.createArrayLiteralExpression(oneOfFields),
        ],
      ),
    ),

    // Create data variable and if block
    ts.factory.createIfStatement(
      ts.factory.createBinaryExpression(
        ts.factory.createLogicalNot(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("Array"),
              "isArray",
            ),
            undefined,
            [dataIdentifier],
          ),
        ),
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.factory.createBinaryExpression(
          ts.factory.createTypeOfExpression(dataIdentifier),
          ts.SyntaxKind.EqualsEqualsToken,
          ts.factory.createStringLiteral("object"),
        ),
      ),
      ts.factory.createBlock(
        messageDescriptor.field.map((fieldDescriptor) => {
          const assigmentExpression = ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                fieldDescriptor.name,
              ),
              ts.SyntaxKind.EqualsToken,
              ts.factory.createPropertyAccessExpression(
                dataIdentifier,
                fieldDescriptor.name,
              ),
            ),
          );
          if (!field.isOptional(rootDescriptor, fieldDescriptor)) {
            return assigmentExpression;
          }
          return ts.factory.createIfStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createBinaryExpression(
                ts.factory.createStringLiteral(fieldDescriptor.name),
                ts.factory.createToken(ts.SyntaxKind.InKeyword),
                dataIdentifier,
              ),

              ts.factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
              ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                  dataIdentifier,
                  fieldDescriptor.name,
                ),
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
                ts.factory.createIdentifier("undefined"),
              ),
            ),
            ts.factory.createBlock([assigmentExpression], true),
          );
        }),
      ),
    ),

    ...messageDescriptor.field
      .filter((fieldDescriptor) => field.isMap(fieldDescriptor))
      .map((fieldDescriptor) => {
        const propertyAccessor = ts.factory.createPropertyAccessExpression(
          ts.factory.createThis(),
          fieldDescriptor.name,
        );

        return ts.factory.createIfStatement(
          ts.factory.createPrefixUnaryExpression(
            ts.SyntaxKind.ExclamationToken,
            propertyAccessor,
          ),
          ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              propertyAccessor,
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createNewExpression(
                ts.factory.createIdentifier("Map"),
                undefined,
                [],
              ),
            ),
          ),
        );
      }),
  ];

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
        typeNode,
      ),
    ],
    ts.factory.createBlock(statements, true),
  );
}

/**
 * Returns a get accessor for the field
 */
function createGetter(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.GetAccessorDeclaration {
  const getterType = field.wrapRepeatedType(
    field.getType(fieldDescriptor, rootDescriptor) as ts.TypeNode,
    fieldDescriptor,
  );
  let getterExpr: ts.Expression = createGetterCall(
    rootDescriptor,
    fieldDescriptor,
    pbIdentifier,
  );

  if (field.isMap(fieldDescriptor)) {
    getterExpr = ts.factory.createAsExpression(
      getterExpr,
      ts.factory.createToken(ts.SyntaxKind.AnyKeyword),
    );
  }

  return comment.addDeprecatedJsDoc(
    ts.factory.createGetAccessorDeclaration(
      undefined,
      undefined,
      fieldDescriptor.name,
      [],
      undefined,
      ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createAsExpression(getterExpr, getterType),
          ),
        ],
        true,
      ),
    ),
    fieldDescriptor.options?.deprecated,
  );
}

function createGetterCall(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.CallExpression {
  let args: ts.Expression[];
  let getterMethod = "getField";

  if (field.isMessage(fieldDescriptor) && !field.isMap(fieldDescriptor)) {
    getterMethod = field.isRepeated(fieldDescriptor)
      ? "getRepeatedWrapperField"
      : "getWrapperField";

    args = [
      ts.factory.createThis(),
      type.getTypeReferenceExpr(rootDescriptor, fieldDescriptor.type_name),
      ts.factory.createNumericLiteral(fieldDescriptor.number),
    ];
  } else if (field.isMap(fieldDescriptor)) {
    getterMethod = "getField";

    args = [
      ts.factory.createThis(),
      ts.factory.createNumericLiteral(fieldDescriptor.number),
    ]
  } else {
    args = [
      ts.factory.createThis(),
      ts.factory.createNumericLiteral(fieldDescriptor.number),
    ];

    let default_value = fieldDescriptor.default_value;

    getterMethod = "getFieldWithDefault";
    let _default: ts.Expression;

    if (field.isEnum(fieldDescriptor)) {
      _default = ts.factory.createPropertyAccessExpression(
        type.getTypeReferenceExpr(rootDescriptor, fieldDescriptor.type_name),
        default_value != null ? default_value : type.getLeadingEnumMember(fieldDescriptor.type_name),
      );
    } else if (field.isRepeated(fieldDescriptor)) {
      _default = default_value != null
        ? ts.factory.createIdentifier(default_value)
        : ts.factory.createArrayLiteralExpression(
          [],
          false
        )
    } else if (fieldDescriptor.type == descriptor.FieldDescriptorProto.Type.TYPE_BYTES) {
      _default = default_value != null
        ? ts.factory.createIdentifier(default_value)
        : ts.factory.createNewExpression(
          ts.factory.createIdentifier("Uint8Array"),
          undefined,
          []
        )
    } else if (field.isString(fieldDescriptor) || field.hasJsTypeString(fieldDescriptor)) {
      _default = default_value != null
        ? ts.factory.createStringLiteral(default_value)
        : ts.factory.createStringLiteral("")
    } else if (field.isBoolean(fieldDescriptor)) {
      _default = default_value != null
        ? ts.factory.createIdentifier(default_value)
        : ts.factory.createFalse()
    } else {
      _default = default_value != null
        ? ts.factory.createIdentifier(default_value)
        : ts.factory.createNumericLiteral(0)
    }

    args.push(_default);
  }
  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
      ts.factory.createIdentifier(getterMethod),
    ),
    undefined,
    args,
  );
}

/**
 * Returns a class for the message descriptor
 */
function createOneOfGetter(
  index: number,
  oneofDescriptor: descriptor.OneofDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.GetAccessorDeclaration {
  const numbers = [];
  const types: ts.TypeNode[] = [
    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral("none")),
  ];
  const cases = [
    ts.factory.createPropertyAssignment(
      ts.factory.createNumericLiteral(0),
      ts.factory.createStringLiteral("none"),
    ),
  ];

  for (const field of messageDescriptor.field) {
    if (field.oneof_index !== index) {
      continue;
    }

    numbers.push(ts.factory.createNumericLiteral(field.number));
    types.push(
      ts.factory.createLiteralTypeNode(
        ts.factory.createStringLiteral(field.name),
      ),
    );
    cases.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createNumericLiteral(field.number),
        ts.factory.createStringLiteral(field.name),
      ),
    );
  }

  const statements: ts.Statement[] = [
    ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
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
                    ts.factory.createKeywordTypeNode(
                      ts.SyntaxKind.NumberKeyword,
                    ),
                  ),
                ],
                ts.factory.createUnionTypeNode(types),
              ),
            ]),
            ts.factory.createObjectLiteralExpression(cases, true),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),

    ts.factory.createReturnStatement(
      ts.factory.createElementAccessExpression(
        ts.factory.createIdentifier("cases"),
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
            ts.factory.createIdentifier("computeOneofCase"),
          ),
          undefined,
          [
            ts.factory.createThis(),
            ts.factory.createArrayLiteralExpression(numbers),
          ],
        ),
      ),
    ),
  ];

  return ts.factory.createGetAccessorDeclaration(
    undefined,
    undefined,
    oneofDescriptor.name,
    [],
    undefined,
    ts.factory.createBlock(statements, true),
  );
}

function createSetter(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
  pbIdentifier: ts.Identifier,
) {
  const type = field.wrapRepeatedType(
    field.getType(fieldDescriptor, rootDescriptor),
    fieldDescriptor,
  );
  const valueParameter = ts.factory.createIdentifier("value");

  let block;

  if (field.isOneOf(fieldDescriptor)) {
    block = createOneOfSetterBlock(
      messageDescriptor,
      fieldDescriptor,
      valueParameter,
      pbIdentifier,
    );
  } else {
    block = createSetterBlock(fieldDescriptor, valueParameter, pbIdentifier);
  }

  return comment.addDeprecatedJsDoc(
    ts.factory.createSetAccessorDeclaration(
      undefined,
      undefined,
      fieldDescriptor.name,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          valueParameter,
          undefined,
          type,
        ),
      ],
      block,
    ),
    fieldDescriptor.options?.deprecated,
  );
}

function createOneOfSetterBlock(
  messageDescriptor: descriptor.DescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
  valueParameter: ts.Identifier,
  pbIdentifier: ts.Identifier,
): ts.Block {
  const method = field.isMessage(fieldDescriptor)
    ? "setOneofWrapperField"
    : "setOneofField";
  const numbers = messageDescriptor.field
    .filter((field) => field.oneof_index == fieldDescriptor.oneof_index)
    .map((field) => ts.factory.createNumericLiteral(field.number));

  return ts.factory.createBlock(
    [
      ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
            method,
          ),
          undefined,
          [
            ts.factory.createThis(),
            ts.factory.createNumericLiteral(fieldDescriptor.number),
            ts.factory.createArrayLiteralExpression(numbers),
            valueParameter,
          ],
        ),
      ),
    ],
    true,
  );
}

function createSetterBlock(
  fieldDescriptor: descriptor.FieldDescriptorProto,
  valueParameter: ts.Identifier,
  pbIdentifier: ts.Identifier,
) {
  const method =
    field.isMessage(fieldDescriptor) && !field.isMap(fieldDescriptor)
      ? field.isRepeated(fieldDescriptor)
        ? "setRepeatedWrapperField"
        : "setWrapperField"
      : "setField";

  const parameter: ts.Expression = field.isMap(fieldDescriptor)
    ? ts.factory.createAsExpression(
        valueParameter,
        ts.factory.createToken(ts.SyntaxKind.AnyKeyword),
      )
    : valueParameter;

  return ts.factory.createBlock(
    [
      ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
            method,
          ),
          undefined,
          [
            ts.factory.createThis(),
            ts.factory.createNumericLiteral(fieldDescriptor.number),
            parameter,
          ],
        ),
      ),
    ],
    true,
  );
}

/**
 * Returns the serialize method for the message class
 */
function createSerialize(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.ClassElement[] {
  const statements: ts.Statement[] = [
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
                ts.factory.createPropertyAccessExpression(
                  pbIdentifier,
                  "BinaryWriter",
                ),
                undefined,
                [],
              ),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),
  ];

  for (const fieldDescriptor of messageDescriptor.field) {
    const propAccessor = ts.factory.createPropertyAccessExpression(
      ts.factory.createThis(),
      fieldDescriptor.name,
    );

    if (field.isMap(fieldDescriptor)) {
      const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(
        fieldDescriptor.type_name,
      )!.field;

      const valueExprArgs: ts.Expression[] = [
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
                "serialize",
              ),
              undefined,
              [ts.factory.createIdentifier("writer")],
            ),
          ),
        );
      }

      const writeCall = ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("writer"),
            "writeMessage",
          ),
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
              ts.factory.createBlock(
                [
                  ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("writer"),
                        ts.factory.createIdentifier(
                          `write${field.toBinaryMethodName(
                            keyDescriptor,
                            rootDescriptor,
                          )}`,
                        ),
                      ),
                      undefined,
                      [
                        ts.factory.createNumericLiteral(1),
                        ts.factory.createIdentifier("key"),
                      ],
                    ),
                  ),
                  ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("writer"),
                        ts.factory.createIdentifier(
                          `write${field.toBinaryMethodName(
                            valueDescriptor,
                            rootDescriptor,
                          )}`,
                        ),
                      ),
                      undefined,
                      valueExprArgs,
                    ),
                  ),
                ],
                true,
              ),
            ),
          ],
        ),
      );

      statements.push(
        ts.factory.createForOfStatement(
          undefined,
          ts.factory.createVariableDeclarationList(
            [
              ts.factory.createVariableDeclaration(
                ts.factory.createArrayBindingPattern([
                  ts.factory.createBindingElement(undefined, undefined, "key"),
                  ts.factory.createBindingElement(
                    undefined,
                    undefined,
                    "value",
                  ),
                ]),
              ),
            ],
            ts.NodeFlags.Const,
          ),
          propAccessor,
          ts.factory.createBlock([writeCall]),
        ),
      );
    } else {
      const propParameters: ts.Expression[] = [
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
                  type.getTypeReference(
                    rootDescriptor,
                    fieldDescriptor.type_name,
                  ),
                ),
              ],
              undefined,
              ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createIdentifier("item"),
                  "serialize",
                ),
                undefined,
                [ts.factory.createIdentifier("writer")],
              ),
            ),
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
                    fieldDescriptor.name,
                  ),
                  "serialize",
                ),
                undefined,
                [ts.factory.createIdentifier("writer")],
              ),
            ),
          );
        }
      }

      // this.prop !== undefined
      let condition = ts.factory.createBinaryExpression(
        propAccessor,
        ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
        ts.factory.createIdentifier("undefined"),
      );

      const statement = ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("writer"),
            ts.factory.createIdentifier(
              `write${field.toBinaryMethodName(
                fieldDescriptor,
                rootDescriptor,
              )}`,
            ),
          ),
          undefined,
          propParameters,
        ),
      );

      if (
        field.isString(fieldDescriptor) &&
        !field.isRepeated(fieldDescriptor)
      ) {
        // typeof this.prop !== "string" && this.prop.length
        condition = ts.factory.createBinaryExpression(
          ts.factory.createBinaryExpression(
            ts.factory.createTypeOfExpression(propAccessor),
            ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            ts.factory.createStringLiteral("string"),
          ),
          ts.factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
          ts.factory.createPropertyAccessExpression(propAccessor, "length"),
        );
      }

      statements.push(ts.factory.createIfStatement(condition, statement));
    }
  }

  statements.push(
    ts.factory.createIfStatement(
      ts.factory.createPrefixUnaryExpression(
        ts.SyntaxKind.ExclamationToken,
        ts.factory.createIdentifier("w"),
      ),
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("writer"),
            "getResultBuffer",
          ),
          undefined,
          [],
        ),
      ),
    ),
  );

  return [
    ts.factory.createMethodDeclaration(
      undefined,
      undefined,
      undefined,
      "serialize",
      undefined,
      undefined,
      [],
      ts.factory.createTypeReferenceNode("Uint8Array"),
      undefined,
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
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(pbIdentifier, "BinaryWriter"),
          ),
          undefined,
        ),
      ],
      ts.factory.createTypeReferenceNode("void"),
      undefined,
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
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(pbIdentifier, "BinaryWriter"),
          ),
          undefined,
        ),
      ],
      ts.factory.createUnionTypeNode([
        ts.factory.createTypeReferenceNode("Uint8Array"),
        ts.factory.createTypeReferenceNode("void"),
      ]),
      ts.factory.createBlock(statements, true),
    ),
  ];
}

/**
 * Returns the deserialize method for the message class
 */
function createDeserialize(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.ClassElement {
  const statements: ts.Statement[] = [
    ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            "reader",
            undefined,
            undefined,
            ts.factory.createConditionalExpression(
              ts.factory.createBinaryExpression(
                ts.factory.createIdentifier("bytes"),
                ts.SyntaxKind.InstanceOfKeyword,
                ts.factory.createPropertyAccessExpression(
                  pbIdentifier,
                  "BinaryReader",
                ),
              ),
              ts.factory.createToken(ts.SyntaxKind.QuestionToken),

              ts.factory.createIdentifier("bytes"),
              ts.factory.createToken(ts.SyntaxKind.ColonToken),
              ts.factory.createNewExpression(
                ts.factory.createPropertyAccessExpression(
                  pbIdentifier,
                  "BinaryReader",
                ),
                undefined,
                [ts.factory.createIdentifier("bytes")],
              ),
            ),
          ),
          ts.factory.createVariableDeclaration(
            "message",
            undefined,
            undefined,
            ts.factory.createNewExpression(
              ts.factory.createIdentifier(messageDescriptor.name),
              undefined,
              [],
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),
  ];

  const cases = [];

  for (const fieldDescriptor of messageDescriptor.field) {
    const statements = [];

    if (
      field.isRepeated(fieldDescriptor) &&
      !field.isMessage(fieldDescriptor) &&
      !field.isPacked(rootDescriptor, fieldDescriptor)
    ) {
      statements.push(
        ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createPropertyAccessExpression(
                pbIdentifier,
                "Message",
              ),
              "addToRepeatedField",
            ),
            undefined,
            [
              ts.factory.createIdentifier("message"),
              ts.factory.createNumericLiteral(fieldDescriptor.number),
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createIdentifier("reader"),
                  `read${field.toBinaryMethodName(
                    fieldDescriptor,
                    rootDescriptor,
                    false,
                  )}`,
                ),
                undefined,
                [],
              ),
            ],
          ),
        ),
      );
    } else if (field.isMap(fieldDescriptor)) {
      const [keyDescriptor, valueDescriptor] = type.getMapDescriptor(
        fieldDescriptor.type_name,
      )!.field;

      const keyCall = ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("reader"),
        ts.factory.createIdentifier(
          `read${field.toBinaryMethodName(keyDescriptor, rootDescriptor)}`,
        ),
      );

      let valueCall;

      if (field.isMessage(valueDescriptor)) {
        valueCall = ts.factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.factory.createBlock(
            [
              ts.factory.createVariableStatement(
                undefined,
                ts.factory.createVariableDeclarationList(
                  [ts.factory.createVariableDeclaration("value")],
                  ts.NodeFlags.Let,
                ),
              ),
              ts.factory.createExpressionStatement(
                ts.factory.createCallExpression(
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("reader"),
                    "readMessage",
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
                        ts.SyntaxKind.EqualsGreaterThanToken,
                      ),
                      ts.factory.createBinaryExpression(
                        ts.factory.createIdentifier("value"),
                        ts.SyntaxKind.EqualsToken,
                        ts.factory.createCallExpression(
                          ts.factory.createPropertyAccessExpression(
                            type.getTypeReferenceExpr(
                              rootDescriptor,
                              valueDescriptor.type_name,
                            ),
                            "deserialize",
                          ),
                          undefined,
                          [ts.factory.createIdentifier("reader")],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              ts.factory.createReturnStatement(
                ts.factory.createIdentifier("value"),
              ),
            ],
            true,
          ),
        );
      } else {
        valueCall = ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("reader"),
          ts.factory.createIdentifier(
            `read${field.toBinaryMethodName(valueDescriptor, rootDescriptor)}`,
          ),
        );
      }

      statements.push(
        ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("reader"),
              "readMessage",
            ),
            undefined,
            [
              ts.factory.createIdentifier("message"),
              ts.factory.createArrowFunction(
                undefined,
                undefined,
                [],
                undefined,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                ts.factory.createCallExpression(
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(
                      pbIdentifier,
                      "Map",
                    ),
                    "deserializeBinary",
                  ),

                  undefined,
                  [
                    ts.factory.createAsExpression(
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("message"),
                        fieldDescriptor.name,
                      ),
                      ts.factory.createToken(ts.SyntaxKind.AnyKeyword),
                    ),
                    ts.factory.createIdentifier("reader"),
                    keyCall,
                    valueCall,
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    } else if (field.isMessage(fieldDescriptor)) {
      const readCall = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          type.getTypeReferenceExpr(rootDescriptor, fieldDescriptor.type_name),
          "deserialize",
        ),
        undefined,
        [ts.factory.createIdentifier("reader")],
      );

      statements.push(
        ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("reader"),
              "readMessage",
            ),
            undefined,
            [
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("message"),
                fieldDescriptor.name,
              ),
              ts.factory.createArrowFunction(
                undefined,
                undefined,
                [],
                undefined,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                field.isRepeated(fieldDescriptor)
                  ? ts.factory.createCallExpression(
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                          pbIdentifier,
                          "Message",
                        ),
                        "addToRepeatedWrapperField",
                      ),
                      undefined,
                      [
                        ts.factory.createIdentifier("message"),
                        ts.factory.createNumericLiteral(fieldDescriptor.number),
                        readCall,
                        type.getTypeReferenceExpr(
                          rootDescriptor,
                          fieldDescriptor.type_name,
                        ),
                      ],
                    )
                  : ts.factory.createBinaryExpression(
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("message"),
                        fieldDescriptor.name,
                      ),
                      ts.SyntaxKind.EqualsToken,
                      readCall,
                    ),
              ),
            ],
          ),
        ),
      );
    } else {
      statements.push(
        ts.factory.createExpressionStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("message"),
              fieldDescriptor.name,
            ),
            ts.SyntaxKind.EqualsToken,
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("reader"),
                `read${field.toBinaryMethodName(
                  fieldDescriptor,
                  rootDescriptor,
                  false,
                )}`,
              ),
              undefined,
              undefined,
            ),
          ),
        ),
      );
    }
    statements.push(ts.factory.createBreakStatement());

    cases.push(
      ts.factory.createCaseClause(
        ts.factory.createNumericLiteral(fieldDescriptor.number),
        statements,
      ),
    );
  }

  // Default clause
  cases.push(
    ts.factory.createDefaultClause([
      ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("reader"),
            "skipField",
          ),
          undefined,
          [],
        ),
      ),
    ]),
  );

  statements.push(
    ts.factory.createWhileStatement(
      ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("reader"),
          "nextField",
        ),
        undefined,
        [],
      ),
      ts.factory.createBlock(
        [
          ts.factory.createIfStatement(
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("reader"),
                "isEndGroup",
              ),
              undefined,
              undefined,
            ),
            ts.factory.createBreakStatement(),
          ),
          ts.factory.createSwitchStatement(
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("reader"),
                "getFieldNumber",
              ),
              undefined,
              [],
            ),
            ts.factory.createCaseBlock(cases),
          ),
        ],
        true,
      ),
    ),
  );

  statements.push(
    ts.factory.createReturnStatement(ts.factory.createIdentifier("message")),
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
            undefined,
          ),
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(pbIdentifier, "BinaryReader"),
            undefined,
          ),
        ]),
      ),
    ],
    ts.factory.createTypeReferenceNode(messageDescriptor.name, undefined),
    ts.factory.createBlock(statements, true),
  );
}

/**
 * Returns the deserializeBinary method for the message class
 */
function createDeserializeBinary(
  messageDescriptor: descriptor.DescriptorProto,
): ts.ClassElement {
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
          ts.factory.createIdentifier("Uint8Array"),
        ),
      ),
    ],
    ts.factory.createTypeReferenceNode(messageDescriptor.name),
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier(messageDescriptor.name),
              "deserialize",
            ),
            undefined,
            [ts.factory.createIdentifier("bytes")],
          ),
        ),
      ],
      true,
    ),
  );
}

/**
 * Returns the serializeBinary method for the Message class
 */
function createSerializeBinary(): ts.ClassElement {
  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    ts.factory.createIdentifier("serializeBinary"),
    undefined,
    undefined,
    [],
    ts.factory.createUnionTypeNode([
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier("Uint8Array"),
        [],
      ),
    ]),
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createThis(),
              "serialize",
            ),
            undefined,
            undefined,
          ),
        ),
      ],
      true,
    ),
  );
}

/**
 * Returns a class for the message descriptor
 */
function createMessage(
  rootDescriptor: descriptor.FileDescriptorProto,
  messageDescriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.ClassDeclaration {
  // Create message class
  return comment.addDeprecatedJsDoc(
    ts.factory.createClassDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      messageDescriptor.name,
      undefined,
      [
        ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
          ts.factory.createExpressionWithTypeArguments(
            ts.factory.createPropertyAccessExpression(
              pbIdentifier,
              ts.factory.createIdentifier("Message"),
            ),
            [],
          ),
        ]),
      ],
      [
        // Create constructor
        createConstructor(rootDescriptor, messageDescriptor, pbIdentifier),

        // Create getter and setters
        ...messageDescriptor.field.flatMap((fieldDescriptor) => [
          createGetter(rootDescriptor, fieldDescriptor, pbIdentifier),
          createSetter(
            rootDescriptor,
            messageDescriptor,
            fieldDescriptor,
            pbIdentifier,
          ),
        ]),

        // Create one of getters
        ...Array.from(messageDescriptor.oneof_decl.entries()).map(
          ([index, oneofDescriptor]) =>
            createOneOfGetter(
              index,
              oneofDescriptor,
              messageDescriptor,
              pbIdentifier,
            ),
        ),

        // Create fromObject method
        createFromObject(rootDescriptor, messageDescriptor),

        // Create toObject method
        createToObject(rootDescriptor, messageDescriptor, pbIdentifier),

        // Create serialize  method
        ...createSerialize(rootDescriptor, messageDescriptor, pbIdentifier),

        // Create deserialize method
        createDeserialize(rootDescriptor, messageDescriptor, pbIdentifier),

        // Create serializeBinary method
        createSerializeBinary(),

        // Create deserializeBinary method
        createDeserializeBinary(messageDescriptor),
      ],
    ),
    messageDescriptor.options?.deprecated,
  );
}

export function processDescriptorRecursively(
  rootDescriptor: descriptor.FileDescriptorProto,
  descriptor: descriptor.DescriptorProto,
  pbIdentifier: ts.Identifier,
): ts.Statement[] {
  const statements: ts.Statement[] = [
    createMessage(rootDescriptor, descriptor, pbIdentifier),
  ];

  const namespacedStatements: ts.Statement[] = [];

  for (const _enum of descriptor.enum_type) {
    namespacedStatements.push(createEnum(_enum));
  }

  for (const message of descriptor.nested_type) {
    namespacedStatements.push(
      ...processDescriptorRecursively(rootDescriptor, message, pbIdentifier),
    );
  }

  if (namespacedStatements.length) {
    statements.push(createNamespace(descriptor.name, namespacedStatements));
  }

  return statements;
}
