const plugin = require("./compiler/plugin");
const descriptor = require("./compiler/descriptor");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function createImport(identifier, moduleSpecifier) {
  return ts.factory.createImportDeclaration(
    undefined,
    undefined,
    ts.factory.createImportClause(undefined, ts.factory.createNamespaceImport(identifier)),
    ts.factory.createStringLiteral(moduleSpecifier)
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
    let propertyAccessExpression = ts.factory.createPropertyAccessExpression(
      ts.factory.createThis(),
      fieldDescriptor.name
    );

    if (isMessage(fieldDescriptor)) {
      if (isRepeated(fieldDescriptor)) {
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
                getTypeReference(
                  rootDescriptor,
                  fieldDescriptor,
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
        propertyAccessExpression = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(propertyAccessExpression, "map"),
          undefined,
          [arrowFunc]
        );
      } else {
        propertyAccessExpression = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(propertyAccessExpression, "toObject")
        );
      }
    }

    if (isOptional(rootDescriptor, fieldDescriptor)) {
      statements.push(
        ts.factory.createIfStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createThis(),
              fieldDescriptor.name
            ),
            ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
            ts.factory.createNull()
          ),
          ts.factory.createBlock([
            ts.factory.createExpressionStatement(
              ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(dataIdentifier, fieldDescriptor.name),
                ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                propertyAccessExpression
              )
            )
          ], true)
        )
      )
    } else {
      properties.push(
        ts.factory.createPropertyAssignment(
          fieldDescriptor.name,
          propertyAccessExpression
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
          createFlatMessageSignature(rootDescriptor, messageDescriptor),
          ts.factory.createObjectLiteralExpression(properties, true)
        )
      ])
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
        let optional = ts.factory.createToken(ts.SyntaxKind.QuestionToken);
        if (fieldDescriptor == currentFieldDescriptor) {
          fieldType = wrapRepeatedType(
            getType(fieldDescriptor, rootDescriptor),
            fieldDescriptor
          );
          optional = undefined
        }
        members.push(ts.factory.createPropertySignature(
          undefined,
          fieldDescriptor.name,
          optional,
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

    const fieldType = wrapRepeatedType(
      getType(fieldDescriptor, rootDescriptor),
      fieldDescriptor
    );

    fieldSignatures.push(
      ts.factory.createPropertySignature(
        undefined,
        fieldDescriptor.name,
        isOptional(rootDescriptor, fieldDescriptor) ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
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
function createFlatMessageSignature(rootDescriptor, messageDescriptor) {

  const fieldSignatures = [];

  for (const fieldDescriptor of messageDescriptor.field) {
    let fieldType = getType(fieldDescriptor, rootDescriptor);

    if (isMessage(fieldDescriptor)) {
      fieldType = ts.factory.createTypeReferenceNode(
        "ReturnType",
        [
          ts.factory.createTypeOfExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createPropertyAccessExpression(fieldType, "prototype"), "toObject")
          )
        ]
      )
    }

    fieldType = wrapRepeatedType(fieldType, fieldDescriptor);

    fieldSignatures.push(
      ts.factory.createPropertySignature(
        undefined,
        fieldDescriptor.name,
        isOptional(rootDescriptor, fieldDescriptor) ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
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
      (fd) => isRepeated(fd)
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
            if (!isOptional(rootDescriptor, fieldDescriptor)) {
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
 * 
 * @param {*} type 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @returns 
 */
function wrapRepeatedType(type, fieldDescriptor) {
  if (isRepeated(fieldDescriptor)) {
    type = ts.factory.createArrayTypeNode(type);
  }

  return type;
}

/**
 * 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @returns 
 */
function getType(fieldDescriptor, rootDescriptor) {
  switch (fieldDescriptor.type) {
    case descriptor.FieldDescriptorProto.Type.TYPE_DOUBLE:
    case descriptor.FieldDescriptorProto.Type.TYPE_FLOAT:
    case descriptor.FieldDescriptorProto.Type.TYPE_INT32:
    case descriptor.FieldDescriptorProto.Type.TYPE_INT64:
    case descriptor.FieldDescriptorProto.Type.TYPE_UINT32:
    case descriptor.FieldDescriptorProto.Type.TYPE_UINT64:
    case descriptor.FieldDescriptorProto.Type.TYPE_SINT32:
    case descriptor.FieldDescriptorProto.Type.TYPE_SINT64:
    case descriptor.FieldDescriptorProto.Type.TYPE_FIXED32:
    case descriptor.FieldDescriptorProto.Type.TYPE_FIXED64:
    case descriptor.FieldDescriptorProto.Type.TYPE_SFIXED32:
    case descriptor.FieldDescriptorProto.Type.TYPE_SFIXED64:
    case descriptor.FieldDescriptorProto.Type.TYPE_SFIXED64:
      return ts.factory.createTypeReferenceNode("number");
    case descriptor.FieldDescriptorProto.Type.TYPE_STRING:
      return ts.factory.createTypeReferenceNode("string");
    case descriptor.FieldDescriptorProto.Type.TYPE_BOOL:
      return ts.factory.createTypeReferenceNode("boolean");
    case descriptor.FieldDescriptorProto.Type.TYPE_BYTES:
      return ts.factory.createTypeReferenceNode("Uint8Array");
    case descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE:
    case descriptor.FieldDescriptorProto.Type.TYPE_ENUM:
      return getTypeReference(rootDescriptor, fieldDescriptor);
    default:
      throw new Error("Unhandled type " + fieldDescriptor.type);
  }
}

function normalizeTypeName(name, packageName) {
  return (packageName ? name.replace(`${packageName}.`, "") : name).replace(
    /^\./,
    ""
  );
}


/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isRepeated(fieldDescriptor) {
  return (
    fieldDescriptor.label ==
    descriptor.FieldDescriptorProto.Label.LABEL_REPEATED
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isMessage(fieldDescriptor) {
  return (
    fieldDescriptor.type ==
    descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isEnum(fieldDescriptor) {
  return (
    fieldDescriptor.type ==
    descriptor.FieldDescriptorProto.Type.TYPE_ENUM
  );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isOptional(rootDescriptor, fieldDescriptor) {
  if (rootDescriptor.syntax == "proto3") {
    return fieldDescriptor.label != descriptor.FieldDescriptorProto.Label.LABEL_REQUIRED || fieldDescriptor.proto3_optional
  }
  return fieldDescriptor.label == descriptor.FieldDescriptorProto.Label.LABEL_OPTIONAL;
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isString(fieldDescriptor) {
  return (
    fieldDescriptor.type ==
    descriptor.FieldDescriptorProto.Type.TYPE_STRING
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isBoolean(fieldDescriptor) {
  return (
    fieldDescriptor.type ==
    descriptor.FieldDescriptorProto.Type.TYPE_BOOL
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isPackageable(fieldDescriptor) {
  const type = fieldDescriptor.type
  return (
    isRepeated(fieldDescriptor) &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_STRING &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_GROUP &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_BYTES
  );
}


/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 */
function isPacked(fieldDescriptor, rootDescriptor) {
  if (!isPackageable(fieldDescriptor)) {
    return false;
  }
  const options = fieldDescriptor.options;
  if (rootDescriptor.syntax == "proto2") {
    return options && options.packed
  }

  return options == null || options.packed;
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 */
function toBinaryMethodName(fieldDescriptor, rootDescriptor, isWriter = true) {
  const typeNames = Object.keys(
    descriptor.FieldDescriptorProto.Type
  )
    .map(key => descriptor.FieldDescriptorProto.Type[key])
    .filter(n => typeof n == "string")
    .map((n) => n.replace("TYPE_", ""));

  let typeName = typeNames[fieldDescriptor.type - 1].toLowerCase();
  //lowercase first char
  typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

  if (isPacked(fieldDescriptor, rootDescriptor)) {
    return `Packed${typeName}`;
  } else {
    if (isRepeated(fieldDescriptor) && isWriter) {
      return `Repeated${typeName}`;
    } else {
      return typeName;
    }
  }
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
  const getterType = wrapRepeatedType(
    getType(fieldDescriptor, rootDescriptor),
    fieldDescriptor
  );
  const block = ts.factory.createBlock(
    [
      ts.factory.createReturnStatement(
        createGetterCall(
          rootDescriptor,
          fieldDescriptor,
          pbIdentifier,
          getterType
        )
      ),
    ],
    true
  );
  return ts.factory.createGetAccessorDeclaration(
    undefined,
    undefined,
    fieldDescriptor.name,
    undefined,
    undefined,
    block
  );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} pbIdentifier 
 * @param {string} type
 */
function createGetterCall(
  rootDescriptor,
  fieldDescriptor,
  pbIdentifier,
  type
) {

  let args = [];

  let getterMethod = "getField";

  if (isMessage(fieldDescriptor)) {
    getterMethod = isRepeated(fieldDescriptor) ? "getRepeatedWrapperField" : "getWrapperField";
    args = [
      ts.factory.createThis(),
      getTypeReference(rootDescriptor, fieldDescriptor),
      ts.factory.createNumericLiteral(fieldDescriptor.number)
    ]
  } else {
    args = [
      ts.factory.createThis(),
      ts.factory.createNumericLiteral(fieldDescriptor.number),
    ];

    if (fieldDescriptor.default_value) {
      let defaultt;

      if (isEnum(fieldDescriptor)) {
        defaultt = ts.factory.createPropertyAccessExpression(
          getTypeReference(rootDescriptor, fieldDescriptor),
          fieldDescriptor.default_value
        )
      } else if (isString(fieldDescriptor)) {
        defaultt = ts.factory.createStringLiteral(fieldDescriptor.default_value)
      } else if (isBoolean(fieldDescriptor)) {
        defaultt = ts.factory.createIdentifier(fieldDescriptor.default_value)
      } else {
        defaultt = ts.factory.createIdentifier(fieldDescriptor.default_value)
      }
      getterMethod = "getFieldWithDefault";
      args.push(defaultt);
    }
  }
  return ts.factory.createAsExpression(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
        ts.factory.createIdentifier(getterMethod)
      ),
      undefined,
      args
    ),
    type
  );
}


/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} pbIdentifier 
 */
function createSetter(
  rootDescriptor,
  fieldDescriptor,
  pbIdentifier
) {
  const type = wrapRepeatedType(
    getType(fieldDescriptor, rootDescriptor),
    fieldDescriptor
  );
  const paramIdentifier = ts.factory.createIdentifier("value");

  const block = ts.factory.createBlock(
    [
      ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(pbIdentifier, "Message"),
            isMessage(fieldDescriptor)
              ? isRepeated(fieldDescriptor)
                ? "setRepeatedWrapperField"
                : "setWrapperField"
              : "setField"
          ),
          undefined,
          [
            ts.factory.createThis(),
            ts.factory.createNumericLiteral(fieldDescriptor.number),
            paramIdentifier,
          ]
        )
      ),
    ],
    true
  )
  return ts.factory.createSetAccessorDeclaration(
    undefined,
    undefined,
    fieldDescriptor.name,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        paramIdentifier,
        undefined,
        type
      ),
    ],
    block
  );
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

    const propParameters = [
      ts.factory.createNumericLiteral(fieldDescriptor.number),
      propAccessor,
    ];

    if (isMessage(fieldDescriptor)) {
      if (isRepeated(fieldDescriptor)) {
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
                  getTypeReference(
                    rootDescriptor,
                    fieldDescriptor
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

    if (isString(fieldDescriptor) && !isRepeated(fieldDescriptor)) {
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
        ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("writer"),
              ts.factory.createIdentifier(
                `write${toBinaryMethodName(
                  fieldDescriptor,
                  rootDescriptor
                )}`
              )
            ),
            undefined,
            propParameters
          )
        )
      )
    )
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
  )

  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    ts.factory.createIdentifier("serialize"),
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
          undefined
        ),
        undefined
      ),
    ],
    ts.factory.createUnionTypeNode([
      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Uint8Array"), undefined),
      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("undefined"), undefined),
    ]),
    ts.factory.createBlock(statements, true)
  );
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
      isRepeated(fieldDescriptor) &&
      !isPackageable(fieldDescriptor) &&
      !isMessage(fieldDescriptor)
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
                  `read${toBinaryMethodName(
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
    } else if (isMessage(fieldDescriptor)) {
      const readCall = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          getTypeReference(
            rootDescriptor,
            fieldDescriptor
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
                isRepeated(fieldDescriptor)
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
                      getTypeReference(rootDescriptor, fieldDescriptor),
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
                `read${toBinaryMethodName(
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
 * @returns 
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
        fieldDescriptor,
        pbIdentifier
      )
    );
  }

  // Create toObject method
  members.push(
    createToObject(rootDescriptor, messageDescriptor)
  );

  // Create serialize  method
  members.push(
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
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 */
function getRPCOutputType(rootDescriptor, methodDescriptor) {
  const name = normalizeTypeName(
    methodDescriptor.output_type,
    rootDescriptor.package
  )

  const path = symbolMap.get('.' + name);

  if (!path || !dependencyMap.has(path)) {
    return ts.factory.createIdentifier(name)
  }
  return ts.factory.createPropertyAccessExpression(dependencyMap.get(path), name);
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 */
function getRPCInputType(rootDescriptor, methodDescriptor) {
  const name = normalizeTypeName(
    methodDescriptor.input_type,
    rootDescriptor.package
  );

  const path = symbolMap.get('.' + name);

  if (!path || !dependencyMap.has(path)) {
    return ts.factory.createIdentifier(name)
  }
  return ts.factory.createPropertyAccessExpression(dependencyMap.get(path), name);
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
 */
function isUnaryRPC(methodDescriptor) {
  return (
    methodDescriptor.client_streaming == false &&
    methodDescriptor.server_streaming == false
  );
}

/**
 * Returns interface definition of the service description
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor 
 * @param {ts.Identifier} grpcIdentifier 
 */
function createServiceInterface(rootDescriptor, serviceDescriptor, grpcIdentifier) {
  const methods = [];

  for (const methodDescriptor of serviceDescriptor.method) {
    methods.push(ts.factory.createPropertySignature(
      undefined,
      methodDescriptor.name,
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("MethodDefinition")),
        [
          getRPCInputType(rootDescriptor, methodDescriptor),
          getRPCOutputType(rootDescriptor, methodDescriptor)
        ]
      )
    ))
  }
  return ts.factory.createInterfaceDeclaration(
    undefined,
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`I${serviceDescriptor.name}Service`),
    undefined,
    [
      ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.factory.createTypeReferenceNode(
          ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("ServiceDefinition")),
          [
            ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("UntypedServiceImplementation"))
          ]
        ),
      ]),
    ],
    methods
  )
}

/**
 * Returns interface definition of the service description
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor 
 * @param {ts.Identifier} grpcIdentifier 
 */
function createServerInterface(rootDescriptor, serviceDescriptor, grpcIdentifier) {
  const methods = [];

  for (const methodDescriptor of serviceDescriptor.method) {
    methods.push(
      ts.factory.createPropertySignature(
        undefined,
        methodDescriptor.name,
        undefined,
        ts.factory.createTypeReferenceNode(
          ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("handleUnaryCall")),
          [
            getRPCInputType(rootDescriptor, methodDescriptor),
            getRPCOutputType(rootDescriptor, methodDescriptor)
          ]
        )
      )
    )
  }

  return ts.factory.createInterfaceDeclaration(
    undefined,
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`I${serviceDescriptor.name}Server`),
    undefined,
    [
      ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("UntypedServiceImplementation")),
      ]),
    ],
    methods
  )
}

/**
 * Returns grpc-node compatible service description
 * @param {descriptor.FieldDescriptorProto} rootDescriptor 
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor 
 */
function createService(rootDescriptor, serviceDescriptor) {
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(serviceDescriptor.name),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(
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
        ),
      ],
      ts.NodeFlags.Const
    )
  );
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

  const metadataType = ts.factory.createQualifiedName(grpcIdentifier, "Metadata");

  const errorType = ts.factory.createQualifiedName(grpcIdentifier, "ServiceError");

  const returnType = ts.factory.createTypeReferenceNode("Promise", [responseType]);

  const rpcName = methodDescriptor.name;

  const promiseBody = ts.factory.createCallExpression(
    ts.factory.createElementAccessExpression(ts.factory.createSuper(), ts.factory.createStringLiteral(rpcName)),
    undefined,
    [
      ts.factory.createIdentifier("request"),
      ts.factory.createIdentifier("metadata"),
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
            errorType
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
    rpcName,
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
        metadataType
      ),
    ],
    returnType,
    ts.factory.createBlock(
      [
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
    if (!isUnaryRPC(methodDescriptor) || !process.env.EXPERIMENTAL_FEATURES) {
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
              ts.factory.createIdentifier(serviceDescriptor.name),
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

function replaceExtension(filename, extension = ".ts") {
  return filename.replace(/\.[^/.]+$/, extension)
}

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



/**
 * dependency import
 * Beware that this object is mutated heavily.
 */

const symbolMap = new Map();
const dependencyMap = new Map();

function resetDependencyMap() {
  dependencyMap.clear();
}

let calls = [];

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function getTypeReference(rootDescriptor, fieldDescriptor) {

  calls.push(fieldDescriptor.type_name);
  const path = symbolMap.get(fieldDescriptor.type_name);

  const name = normalizeTypeName(
    fieldDescriptor.type_name,
    rootDescriptor.package
  );

  if (!path || !dependencyMap.has(path)) {
    return ts.factory.createIdentifier(name)
  }

  return ts.factory.createPropertyAccessExpression(dependencyMap.get(path), name);
}


/**
 * @param {descriptor.FileDescriptorProto | descriptor.DescriptorProto} descriptor
 * @param {string} path
 * @param {string} prefix
 */
function scan(descriptor, path, prefix) {
  const replaceDoubleDots = (name) => name.replace(/\.\./g, ".");
  for (const enumDescriptor of descriptor.enum_type) {
    symbolMap.set(replaceDoubleDots(`${prefix}.${enumDescriptor.name}`), path);
  }

  if (descriptor.message_type) {
    for (const messageDescriptor of descriptor.message_type) {
      const name = replaceDoubleDots(`${prefix}.${messageDescriptor.name}`);
      symbolMap.set(name, path);
      scan(messageDescriptor, path, name)
    }
  }
  if (descriptor.nested_type) {
    for (const nestedDescriptor of descriptor.nested_type) {
      const name = replaceDoubleDots(`${prefix}.${nestedDescriptor.name}`);
      symbolMap.set(name, path);
      scan(nestedDescriptor, path, name);
    }
  }
}
/** end dependency import */



const request = plugin.CodeGeneratorRequest.deserialize(new Uint8Array(fs.readFileSync(0)));
const response = new plugin.CodeGeneratorResponse({
  supported_features: plugin.CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL
});

for (const descriptor of request.proto_file) {
  scan(descriptor, descriptor.name, `.${descriptor.package || ""}`);
}

for (const descriptor of request.proto_file) {

  const name = replaceExtension(descriptor.name);
  const pbIdentifier = ts.factory.createUniqueName("pb");
  const grpcIdentifier = ts.factory.createUniqueName("grpc");

  const importStatements = [];

  // Create all named imports from dependencies
  for (const dependency of descriptor.dependency) {
    const identifier = ts.factory.createUniqueName("dep");
    const moduleSpecifier = replaceExtension(dependency, "");
    dependencyMap.set(dependency, identifier);
    const importedFrom = `./${path.relative(path.dirname(descriptor.name), moduleSpecifier)}`;
    importStatements.push(createImport(identifier, importedFrom));

  }


  // Create all messages recursively
  // For imported types, assign a unique identifier to each typeName
  let statements = [];

  // Process enums
  for (const enumDescriptor of descriptor.enum_type) {
    statements.push(createEnum(enumDescriptor));
  }


  // Process root messages
  for (const messageDescriptor of descriptor.message_type) {
    statements.push(
      ...processDescriptorRecursively(descriptor, messageDescriptor, pbIdentifier)
    )
  }

  if (statements.length) {
    importStatements.push(createImport(pbIdentifier, "google-protobuf"));
  }

  // Create all services and clients
  for (const serviceDescriptor of descriptor.service) {
    statements.push(createServiceInterface(descriptor, serviceDescriptor, grpcIdentifier));
    statements.push(createServerInterface(descriptor, serviceDescriptor, grpcIdentifier));
    statements.push(createService(descriptor, serviceDescriptor));
    statements.push(createServiceClient(descriptor, serviceDescriptor, grpcIdentifier));
  }

  // Import grpc only if there is service statements
  if (descriptor.service.length) {
    importStatements.push(createImport(grpcIdentifier, process.env.GRPC_PACKAGE_NAME || "@grpc/grpc-js"));
  }

  // Wrap statements within the namespace
  if (descriptor.package) {

    statements = [
      ...importStatements,
      createNamespace(descriptor.package, statements),
    ]
  } else {
    statements = [...importStatements, ...statements];
  }

  const sourcefile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
  sourcefile.identifiers = new Set();

  const content = ts
    .createPrinter({
      newLine: ts.NewLineKind.LineFeed,
      omitTrailingSemicolon: true,
    })
    .printFile(sourcefile);

  response.file.push(new plugin.CodeGeneratorResponse.File({
    name,
    content
    //content: JSON.stringify({t: Array.from(symbolMap.entries()), calls}, null, 2)
  }));

  resetDependencyMap();

}

process.stdout.write(response.serialize());


