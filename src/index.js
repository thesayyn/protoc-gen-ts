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
    ts.factory.createLiteral(moduleSpecifier)
  );
}

function createToObject(rootDescriptor, messageDescriptor, getNamedImport) {
  const properties = [];

  for (const fd of messageDescriptor.getFieldList()) {
    let propertyAccessExpression = ts.factory.createPropertyAccess(
      ts.factory.createThis(),
      fd.getName()
    );

    if (isMessage(fd)) {
      if (isRepeated(fd)) {
        const arrowFunc = ts.factory.createArrowFunction(
          undefined,
          undefined,
          [
            ts.factory.createParameter(
              undefined,
              undefined,
              undefined,
              "item",
              undefined,
              ts.factory.createTypeReferenceNode(
                createTypeIdentifier(
                  fd,
                  rootDescriptor.getPackage(),
                  getNamedImport
                ),
                undefined
              )
            ),
          ],
          undefined,
          ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
          ts.factory.createCall(
            ts.factory.createPropertyAccess(ts.factory.createIdentifier("item"), "toObject"),
            undefined,
            undefined
          )
        );
        propertyAccessExpression = ts.factory.createCall(
          ts.factory.createPropertyAccess(propertyAccessExpression, "map"),
          undefined,
          [arrowFunc]
        );
      } else {
        propertyAccessExpression = ts.factory.createBinary(
          propertyAccessExpression,
          ts.factory.SyntaxKind.AmpersandAmpersandToken,
          ts.factory.createCall(
            ts.factory.createPropertyAccess(propertyAccessExpression, "toObject")
          )
        );
      }
    }
    properties.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier(fd.getName()),
        propertyAccessExpression
      )
    );
  }

  return ts.factory.createMethod(
    undefined,
    undefined,
    undefined,
    ts.factory.createIdentifier("toObject"),
    undefined,
    undefined,
    undefined,
    undefined,
    ts.factory.createBlock(
      [ts.factory.createReturn(ts.factory.createObjectLiteral(properties, true))],
      true
    )
  );
}

function createNamespace(packageName, statements) {
  const identifiers = String(packageName).split(".");

  statements = ts.factory.createModuleBlock(statements);

  for (let i = identifiers.length - 1; i >= 0; i--) {
    statements = ts.factory.createModuleDeclaration(
      undefined,
      [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(identifiers[i]),
      statements,
      ts.factory.NodeFlags.Namespace
    );
  }

  return statements;
}

function createTypeLiteral(rootDescriptor, messageDescriptor, getNamedImport) {
  const members = [];

  for (const fieldDescriptor of messageDescriptor.getFieldList()) {
    // TODO: Check if the field is optional
    members.push(
      ts.factory.createPropertySignature(
        undefined,
        fieldDescriptor.getName(),
        ts.factory.createToken(ts.factory.SyntaxKind.QuestionToken),
        wrapRepeatedType(
          getType(fieldDescriptor, rootDescriptor.getPackage(), getNamedImport),
          fieldDescriptor
        ),
        undefined
      )
    );
  }
  return ts.factory.createTypeLiteralNode(members);
}

function createConstructor(
  rootDescriptor,
  messageDescriptor,
  pbIdentifier,
  getNamedImport
) {
  const statements = [];

  const dataIdentifier = ts.factory.createIdentifier("data");
  const typeNode = ts.factory.createUnionTypeNode([
    ts.factory.createArrayTypeNode(
      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("any"), undefined)
    ) /* any[] */,
    createTypeLiteral(rootDescriptor, messageDescriptor, getNamedImport),
  ]);

  // Create super(); statement
  statements.factory.push(
    ts.factory.createStatement(ts.factory.createCall(ts.factory.createSuper(), undefined, undefined))
  );

  // Create initialize(); statement
  statements.factory.push(
    ts.factory.createStatement(
      ts.factory.createCall(
        ts.factory.createPropertyAccess(
          ts.factory.createPropertyAccess(pbIdentifier, "Message"),
          "initialize"
        ),
        undefined,
        [
          ts.factory.createThis(),
          ts.factory.createBinary(
            ts.factory.createCall(
              ts.factory.createPropertyAccess(ts.factory.createIdentifier("Array"), "isArray"),
              undefined,
              [dataIdentifier]
            ),
            ts.factory.SyntaxKind.AmpersandAmpersandToken,
            dataIdentifier
          ),
          ts.factory.createNumericLiteral("0"),
          ts.factory.createNumericLiteral("-1") /* TODO: Handle extensions */,
          ts.factory.createArrayLiteral(
            messageDescriptor
              .getFieldList()
              .filter(
                (fd) =>
                  fd.getLabel() ==
                  descriptor.FieldDescriptorProto.Label.LABEL_REPEATED
              )
              .map((fd) => ts.factory.createNumericLiteral(fd.getNumber().toString()))
          ),
          ts.factory.createNull() /* TODO: Handle oneofFields */,
        ]
      )
    )
  );

  // Create data variable and if block
  statements.factory.push(
    ts.factory.createIf(
      ts.factory.createBinary(
        ts.factory.createLogicalNot(
          ts.factory.createCall(
            ts.factory.createPropertyAccess(ts.factory.createIdentifier("Array"), "isArray"),
            undefined,
            [dataIdentifier]
          )
        ),
        ts.factory.SyntaxKind.AmpersandAmpersandToken,
        ts.factory.createBinary(
          ts.factory.createTypeOf(dataIdentifier),
          ts.factory.SyntaxKind.EqualsEqualsToken,
          ts.factory.createStringLiteral("object")
        )
      ),
      ts.factory.createBlock(
        messageDescriptor
          .getFieldList()
          .map((fieldDescriptor) =>
            ts.factory.createStatement(
              ts.factory.createBinary(
                ts.factory.createPropertyAccess(
                  ts.factory.createThis(),
                  fieldDescriptor.getName()
                ),
                ts.factory.SyntaxKind.EqualsToken,
                ts.factory.createPropertyAccess(
                  dataIdentifier,
                  fieldDescriptor.getName()
                )
              )
            )
          )
      )
    )
  );

  return ts.factory.createConstructor(
    undefined,
    undefined,
    [
      ts.factory.createParameter(
        undefined,
        undefined,
        undefined,
        dataIdentifier,
        ts.factory.createToken(ts.factory.SyntaxKind.QuestionToken),
        typeNode
      ),
    ],
    ts.factory.createBlock(statements, true)
  );
}

function wrapRepeatedType(type, fieldDescriptor) {
  if (isRepeated(fieldDescriptor)) {
    type = ts.factory.createArrayTypeNode(type);
  }

  return type;
}

function getType(fieldDescriptor, packageName, getNamedImport) {
  switch (fieldDescriptor.getType()) {
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
      return ts.factory.createIdentifier("number");
    case descriptor.FieldDescriptorProto.Type.TYPE_STRING:
      return ts.factory.createIdentifier("string");
    case descriptor.FieldDescriptorProto.Type.TYPE_BOOL:
      return ts.factory.createIdentifier("boolean");
    case descriptor.FieldDescriptorProto.Type.TYPE_BYTES:
      return ts.factory.createIdentifier("Uint8Array");
    case descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE:
    case descriptor.FieldDescriptorProto.Type.TYPE_ENUM:
      return createTypeIdentifier(fieldDescriptor, packageName, getNamedImport);
    default:
      throw new Error("Unhandled type " + fieldDescriptor.getType());
  }
}

function createTypeIdentifier(fieldDescriptor, packageName, getNamedImport) {
  if (packageName == undefined) {
    throw new TypeError();
  }

  const namedImport = getNamedImport(fieldDescriptor);
  const normalized = normalizeTypeName(
    fieldDescriptor.getTypeName(),
    packageName
  );

  return namedImport
    ? ts.factory.createPropertyAccess(namedImport, normalized.replace(/^[^.]+./, ""))
    : ts.factory.createIdentifier(normalized);
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

function isString(fieldDescriptor) {
  return (
    fieldDescriptor.type ==
    descriptor.FieldDescriptorProto.Type.TYPE_STRING
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
  ).map((n) => n.replace("TYPE_", ""));

  let typeName = typeNames[fieldDescriptor.getType() - 1].toLowerCase();
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
  pbIdentifier,
  getNamedImport
) {
  const getterType = wrapRepeatedType(
    getType(fieldDescriptor, rootDescriptor.package, getNamedImport),
    fieldDescriptor
  );
  const block = ts.factory.createBlock(
    [
      ts.factory.createReturn(
        createGetterCall(
          fieldDescriptor,
          pbIdentifier,
          getterType,
          rootDescriptor.package,
          getNamedImport
        )
      ),
    ],
    true
  );
  return ts.factory.createGetAccessor(
    undefined,
    undefined,
    fieldDescriptor.name,
    undefined,
    getterType,
    block
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {ts.Identifier} pbIdentifier 
 * @param {string} type 
 * @param {string} packageName 
 * @param {*} getNamedImport 
 */
function createGetterCall(
  fieldDescriptor,
  pbIdentifier,
  type,
  packageName,
  getNamedImport
) {
  let calle = ts.factory.createIdentifier("getFieldWithDefault");

  let args = [
    ts.factory.createThis(),
    ts.factory.createNumericLiteral(fieldDescriptor.number),
    ts.factory.createIdentifier("undefined"),
  ];

  if (isRepeated(fieldDescriptor) && !isMessage(fieldDescriptor)) {
    calle = ts.factory.createIdentifier("getField");
    args.pop();
  }

  if (isMessage(fieldDescriptor)) {
    if (isRepeated(fieldDescriptor)) {
      calle = ts.factory.createIdentifier("getRepeatedWrapperField");
    } else {
      calle = ts.factory.createIdentifier("getWrapperField");
    }
    args.splice(
      1,
      0,
      createTypeIdentifier(fieldDescriptor, packageName, getNamedImport)
    );
    args.pop();
  }

  return ts.factory.createAsExpression(
    ts.factory.createCall(
      ts.factory.createPropertyAccess(
        ts.factory.createPropertyAccess(pbIdentifier, "Message"),
        calle
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
 * @param {*} getNamedImport 
 */
function createSetter(
  rootDescriptor,
  fieldDescriptor,
  pbIdentifier,
  getNamedImport
) {
  const type = wrapRepeatedType(
    getType(fieldDescriptor, rootDescriptor.getPackage(), getNamedImport),
    fieldDescriptor
  );
  const paramIdentifier = ts.factory.createIdentifier("value");

  const block = ts.factory.createBlock(
    [
      ts.factory.createStatement(
        ts.factory.createCall(
          ts.factory.createPropertyAccess(
            ts.factory.createPropertyAccess(pbIdentifier, "Message"),
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
  return ts.factory.createSetAccessor(
    undefined,
    undefined,
    fieldDescriptor.getName(),
    [
      ts.factory.createParameter(
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
function createSerialize(rootDescriptor, messageDescriptor, pbIdentifier, getNamedImport) {
  const statements = [
    ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            "writer",
            undefined,
            ts.factory.createBinary(
              ts.factory.createIdentifier("w"),
              ts.factory.SyntaxKind.BarBarToken,
              ts.factory.createNew(
                ts.factory.createPropertyAccess(pbIdentifier, "BinaryWriter"),
                undefined,
                []
              )
            )
          ),
        ],
        ts.factory.NodeFlags.Const
      )
    )
  ];

  for (const fieldDescriptor of messageDescriptor.field) {
    const propAccessor = ts.factory.createPropertyAccess(
      ts.factory.createThis(),
      fieldDescriptor.getName()
    );

    const propParameters = [
      ts.factory.createNumericLiteral(fieldDescriptor.getNumber().toString()),
      propAccessor,
    ];

    if (isMessage(fieldDescriptor)) {
      if (isRepeated(fieldDescriptor)) {
        propParameters.push(
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            [
              ts.factory.createParameter(
                undefined,
                undefined,
                undefined,
                "item",
                undefined,
                ts.factory.createTypeReferenceNode(
                  createTypeIdentifier(
                    fieldDescriptor,
                    rootDescriptor.getPackage(),
                    getNamedImport
                  ),
                  undefined
                )
              ),
            ],
            undefined,
            ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
            ts.factory.createCall(
              ts.factory.createPropertyAccess(
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
            ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
            ts.factory.createCall(
              ts.factory.createPropertyAccess(
                ts.factory.createPropertyAccess(
                  ts.factory.createThis(),
                  fieldDescriptor.getName()
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
    let condition = ts.factory.createBinary(
      propAccessor,
      ts.factory.createToken(ts.factory.SyntaxKind.ExclamationEqualsEqualsToken),
      ts.factory.createIdentifier("undefined")
    );

    if (isString(fieldDescriptor) && !isRepeated(fieldDescriptor)) {
      // typeof this.prop !== "string" && this.prop.length
      condition = ts.factory.createBinary(
        ts.factory.createBinary(
          ts.factory.createTypeOf(propAccessor),
          ts.factory.createToken(ts.factory.SyntaxKind.EqualsEqualsEqualsToken),
          ts.factory.createStringLiteral("string")
        ),
        ts.factory.createToken(ts.factory.SyntaxKind.AmpersandAmpersandToken),
        ts.factory.createPropertyAccess(propAccessor, "length")
      );
    }

    statements.push(
      ts.factory.createIf(
        condition,
        ts.factory.createStatement(
          ts.factory.createCall(
            ts.factory.createPropertyAccess(
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
    ts.factory.createIf(
      ts.factory.createPrefix(
        ts.factory.SyntaxKind.ExclamationToken,
        ts.factory.createIdentifier("w")
      ),
      ts.factory.createReturn(
        ts.factory.createCall(
          ts.factory.createPropertyAccess(
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
      ts.factory.createParameter(
        undefined,
        undefined,
        undefined,
        "w",
        ts.factory.createToken(ts.factory.SyntaxKind.QuestionToken),
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
 * Returns the serializeBinary method for the Message class
 */
function createSerializeBinary() {
  return ts.factory.createMethod(
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
      ts.factory.createThrow(
        ts.factory.createNew(ts.factory.createIdentifier("Error"), undefined, [
          ts.factory.createLiteral("Method not implemented."),
        ])
      ),
    ])
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
  pbIdentifier,
  getNamedImport
) {
  const statements = [
    ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            "reader",
            undefined,
            ts.factory.createConditional(
              ts.factory.createBinary(
                ts.factory.createIdentifier("bytes"),
                ts.factory.SyntaxKind.InstanceOfKeyword,
                ts.factory.createIdentifier("Uint8Array")
              ),
              ts.factory.createNew(
                ts.factory.createPropertyAccess(pbIdentifier, "BinaryReader"),
                undefined,
                [ts.factory.createIdentifier("bytes")]
              ),
              ts.factory.createIdentifier("bytes")
            )
          ),
          ts.factory.createVariableDeclaration(
            "message",
            undefined,
            ts.factory.createNew(
              ts.factory.createIdentifier(messageDescriptor.name),
              undefined,
              []
            )
          ),
        ],
        ts.factory.NodeFlags.Const
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
        ts.factory.createStatement(
          ts.factory.createCall(
            ts.factory.createPropertyAccess(
              ts.factory.createPropertyAccess(pbIdentifier, "Message"),
              "addToRepeatedField"
            ),
            undefined,
            [
              ts.factory.createIdentifier("message"),
              ts.factory.createNumericLiteral(
                fieldDescriptor.getNumber().toString()
              ),
              ts.factory.createCall(
                ts.factory.createPropertyAccess(
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
      const readCall = ts.factory.createCall(
        ts.factory.createPropertyAccess(
          createTypeIdentifier(
            fieldDescriptor,
            rootDescriptor.getPackage(),
            getNamedImport
          ),
          "deserialize"
        ),
        undefined,
        [ts.factory.createIdentifier("reader")]
      );

      statements.push(
        ts.factory.createStatement(
          ts.factory.createCall(
            ts.factory.createPropertyAccess(
              ts.factory.createIdentifier("reader"),
              "readMessage"
            ),
            undefined,
            [
              ts.factory.createPropertyAccess(
                ts.factory.createIdentifier("message"),
                fieldDescriptor.name
              ),
              ts.factory.createArrowFunction(
                undefined,
                undefined,
                [],
                undefined,
                ts.factory.createToken(
                  ts.factory.SyntaxKind.EqualsGreaterThanToken
                ),
                isRepeated(fieldDescriptor)
                  ? ts.factory.createCallExpression(
                    ts.factory.createPropertyAccess(
                      ts.factory.createPropertyAccess(
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
                      createTypeIdentifier(fieldDescriptor, rootDescriptor.package, getNamedImport),
                    ]
                  )
                  : ts.factory.createBinary(
                    ts.factory.createPropertyAccess(
                      ts.factory.createIdentifier("message"),
                      fieldDescriptor.name
                    ),
                    ts.factory.SyntaxKind.EqualsToken,
                    readCall
                  )
              ),
            ]
          )
        )
      );
    } else {
      statements.push(
        ts.factory.createStatement(
          ts.factory.createBinary(
            ts.factory.createPropertyAccess(
              ts.factory.createIdentifier("message"),
              fieldDescriptor.name
            ),
            ts.factory.SyntaxKind.EqualsToken,
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccess(
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
    statements.push(ts.factory.createBreak());

    cases.push(ts.factory.createCaseClause(
      ts.factory.createNumericLiteral(fieldDescriptor.number),
      statements
    ))

  }

  // Default clause
  cases.push(
    ts.factory.createDefaultClause([
      ts.factory.createStatement(
        ts.factory.createCall(
          ts.factory.createPropertyAccess(
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
    ts.factory.createWhile(
      ts.factory.createCall(
        ts.factory.createPropertyAccess(ts.factory.createIdentifier("reader"), "nextField"),
        undefined,
        []
      ),
      ts.factory.createBlock(
        [
          ts.factory.createIf(
            ts.factory.createCall(
              ts.factory.createPropertyAccess(
                ts.factory.createIdentifier("reader"),
                "isEndGroup"
              ),
              undefined,
              undefined
            ),
            ts.factory.createBreak()
          ),
          ts.factory.createSwitch(
            ts.factory.createCall(
              ts.factory.createPropertyAccess(
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
    ts.factory.createReturn(ts.factory.createIdentifier("message"))
  );


  return ts.factory.createMethodDeclaration(
    undefined,
    [ts.factory.createModifier(ts.factory.SyntaxKind.StaticKeyword)],
    undefined,
    ts.factory.createIdentifier("deserialize"),
    undefined,
    undefined,
    [
      ts.factory.createParameter(
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

// Returns a class for the message descriptor
function createMessage(
  rootDescriptor,
  messageDescriptor,
  pbIdentifier,
  getNamedImport
) {
  const members = [];

  // Create constructor
  members.push(
    createConstructor(
      rootDescriptor,
      messageDescriptor,
      pbIdentifier,
      getNamedImport
    )
  );

  // Create getter and setters
  for (const fieldDescriptor of messageDescriptor.getFieldList()) {
    members.push(
      createGetter(
        rootDescriptor,
        fieldDescriptor,
        pbIdentifier,
        getNamedImport
      )
    );
    members.push(
      createSetter(
        rootDescriptor,
        fieldDescriptor,
        pbIdentifier,
        getNamedImport
      )
    );
  }

  // Create toObject method
  members.push(
    createToObject(rootDescriptor, messageDescriptor, getNamedImport)
  );

  // Create serialize  method
  members.push(
    createSerialize(
      rootDescriptor,
      messageDescriptor,
      pbIdentifier,
      getNamedImport
    )
  );

  // Create deserialize method
  members.push(
    createDeserialize(
      rootDescriptor,
      messageDescriptor,
      pbIdentifier,
      getNamedImport
    )
  );

  // Create serializeBinary method
  // TODO: reconsider if this is necessary
  members.push(createSerializeBinary());

  // Create message class
  return ts.factory.createClassDeclaration(
    undefined,
    [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(messageDescriptor.getName()),
    undefined,
    [
      ts.factory.createHeritageClause(ts.factory.SyntaxKind.ExtendsKeyword, [
        ts.factory.createExpressionWithTypeArguments(
          undefined,
          ts.factory.createPropertyAccess(pbIdentifier, ts.factory.createIdentifier("Message"))
        ),
      ]),
    ],
    members
  );


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
        ts.factory.createNumericLiteral(valueDescriptor.getNumber().toString())
      )
    );
  }
  return ts.factory.createEnumDeclaration(
    undefined,
    [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(enumDescriptor.name),
    values
  );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 */
function getRPCOutputType(rootDescriptor, methodDescriptor) {
  return normalizeTypeName(
    methodDescriptor.output_type,
    rootDescriptor.package
  );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor 
 * @param {descriptor.MethodDescriptorProto} methodDescriptor 
 */
function getRPCInputType(rootDescriptor, methodDescriptor) {
  return normalizeTypeName(
    methodDescriptor.input_type,
    rootDescriptor.package
  );
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
          ts.factory.createIdentifier(getRPCInputType(rootDescriptor, methodDescriptor)),
          ts.factory.createIdentifier(getRPCOutputType(rootDescriptor, methodDescriptor))
        ]
      )
    ))
  }
  return ts.factory.createInterfaceDeclaration(
    undefined,
    [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`I${serviceDescriptor.name}Service`),
    undefined,
    [
      ts.factory.createHeritageClause(ts.factory.SyntaxKind.ExtendsKeyword, [
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
            ts.factory.createIdentifier(getRPCInputType(rootDescriptor, methodDescriptor)),
            ts.factory.createIdentifier(getRPCOutputType(rootDescriptor, methodDescriptor))
          ]
        )
      )
    )
  }

  return ts.factory.createInterfaceDeclaration(
    undefined,
    [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`I${serviceDescriptor.getName()}Server`),
    undefined,
    [
      ts.factory.createHeritageClause(ts.factory.SyntaxKind.ExtendsKeyword, [
        ts.factory.createQualifiedName(grpcIdentifier, ts.factory.createIdentifier("UntypedServiceImplementation")),
      ]),
    ],
    methods
  )
}

// Returns grpc-node compatible service description
function createService(rootDescriptor, serviceDescriptor) {
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(serviceDescriptor.getName()),
          ts.factory.createIdentifier(`I${serviceDescriptor.getName()}Service`),
          ts.factory.createObjectLiteral(
            serviceDescriptor.getMethodList().map((methodDescriptor) => {
              return ts.factory.createPropertyAssignment(
                methodDescriptor.getName(),
                ts.factory.createObjectLiteral(
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
                      methodDescriptor.getClientStreaming()
                        ? ts.factory.createTrue()
                        : ts.factory.createFalse()
                    ),
                    ts.factory.createPropertyAssignment(
                      "responseStream",
                      methodDescriptor.getServerStreaming()
                        ? ts.factory.createTrue()
                        : ts.factory.createFalse()
                    ),
                    ts.factory.createPropertyAssignment(
                      "requestSerialize",
                      ts.factory.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          ts.factory.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            "message",
                            undefined,
                            ts.factory.createTypeReferenceNode(
                              ts.factory.createIdentifier(
                                getRPCInputType(rootDescriptor, methodDescriptor)
                              ),
                              undefined
                            )
                          ),
                        ],
                        undefined,
                        ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
                        ts.factory.createCall(
                          ts.factory.createPropertyAccess(
                            ts.factory.createIdentifier("Buffer"),
                            "from"
                          ),
                          undefined,
                          [
                            ts.factory.createCall(
                              ts.factory.createPropertyAccess(
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
                          ts.factory.createParameter(
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
                        ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
                        ts.factory.createCall(
                          ts.factory.createPropertyAccess(
                            ts.factory.createIdentifier(
                              getRPCInputType(rootDescriptor, methodDescriptor)
                            ),
                            "deserialize"
                          ),
                          undefined,
                          [
                            ts.factory.createNew(
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
                          ts.factory.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            "message",
                            undefined,
                            ts.factory.createTypeReferenceNode(
                              ts.factory.createIdentifier(
                                getRPCOutputType(rootDescriptor, methodDescriptor)
                              ),
                              undefined
                            )
                          ),
                        ],
                        undefined,
                        ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
                        ts.factory.createCall(
                          ts.factory.createPropertyAccess(
                            ts.factory.createIdentifier("Buffer"),
                            "from"
                          ),
                          undefined,
                          [
                            ts.factory.createCall(
                              ts.factory.createPropertyAccess(
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
                          ts.factory.createParameter(
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
                        ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
                        ts.factory.createCall(
                          ts.factory.createPropertyAccess(
                            ts.factory.createIdentifier(
                              getRPCOutputType(rootDescriptor, methodDescriptor)
                            ),
                            "deserialize"
                          ),
                          undefined,
                          [
                            ts.factory.createNew(
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
      ts.factory.NodeFlags.Const
    )
  );
}

/**
 * Returns grpc-node compatible unary client method
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

  const rpcName = methodDescriptor.getName();

  const promiseBody = ts.factory.createCall(
    ts.factory.createElementAccess(ts.factory.createSuper(), ts.factory.createStringLiteral(rpcName)),
    undefined,
    [
      ts.factory.createIdentifier("request"),
      ts.factory.createIdentifier("metadata"),
      ts.factory.createArrowFunction(
        undefined,
        undefined,
        [
          ts.factory.createParameter(
            undefined,
            undefined,
            undefined,
            "error",
            undefined,
            errorType
          ),
          ts.factory.createParameter(
            undefined,
            undefined,
            undefined,
            "response",
            undefined,
            responseType
          ),
        ],
        undefined,
        ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createIf(
              ts.factory.createIdentifier("error"),
              ts.factory.createBlock([
                ts.factory.createStatement(
                  ts.factory.createCall(ts.factory.createIdentifier("reject"), undefined, [
                    ts.factory.createIdentifier("error"),
                  ])
                ),
              ]),
              ts.factory.createBlock([
                ts.factory.createStatement(
                  ts.factory.createCall(ts.factory.createIdentifier("resolve"), undefined, [
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

  return ts.factory.createMethod(
    undefined,
    undefined,
    undefined,
    rpcName,
    undefined,
    undefined,
    [
      ts.factory.createParameter(
        undefined,
        undefined,
        undefined,
        "request",
        undefined,
        requestType
      ),
      ts.factory.createParameter(
        undefined,
        undefined,
        undefined,
        "metadata",
        ts.factory.createToken(ts.factory.SyntaxKind.QuestionToken),
        metadataType
      ),
    ],
    returnType,
    ts.factory.createBlock(
      [
        ts.factory.createReturn(
          ts.factory.createNew(ts.factory.createIdentifier("Promise"), undefined, [
            ts.factory.createArrowFunction(
              undefined,
              undefined,
              [
                ts.factory.createParameter(undefined, undefined, undefined, "resolve"),
                ts.factory.createParameter(undefined, undefined, undefined, "reject"),
              ],
              undefined,
              ts.factory.createToken(ts.factory.SyntaxKind.EqualsGreaterThanToken),
              promiseBody
            ),
          ])
        ),
      ],
      true
    )
  );
}

// Returns grpc-node compatible service client.
function createServiceClient(
  rootDescriptor,
  serviceDescriptor,
  grpcIdentifier
) {
  const members = [
    ts.factory.createConstructor(
      undefined,
      undefined,
      [
        ts.factory.createParameter(
          undefined,
          undefined,
          undefined,
          "address",
          undefined,
          ts.factory.createKeywordTypeNode(ts.factory.SyntaxKind.StringKeyword)
        ),
        ts.factory.createParameter(
          undefined,
          undefined,
          undefined,
          "credentials",
          undefined,
          ts.factory.createTypeReferenceNode(
            ts.factory.createQualifiedName(grpcIdentifier, "ChannelCredentials")
          )
        ),
        ts.factory.createParameter(
          undefined,
          undefined,
          undefined,
          "options",
          ts.factory.createToken(ts.factory.SyntaxKind.QuestionToken),
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
          ts.factory.createCall(ts.factory.createSuper(), undefined, [
            ts.factory.createIdentifier("address"),
            ts.factory.createIdentifier("credentials"),
            ts.factory.createIdentifier("options"),
          ]),
        ],
        true
      )
    ),
  ];

  for (const methodDescriptor of serviceDescriptor.getMethodList()) {
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
    [ts.factory.createModifier(ts.factory.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${serviceDescriptor.getName()}Client`),
    undefined,
    [
      ts.factory.createHeritageClause(ts.factory.SyntaxKind.ExtendsKeyword, [
        ts.factory.createExpressionWithTypeArguments(
          undefined,
          ts.factory.createCall(
            ts.factory.createPropertyAccess(
              grpcIdentifier,
              "makeGenericClientConstructor"
            ),
            undefined,
            [
              ts.factory.createIdentifier(serviceDescriptor.getName()),
              ts.factory.createStringLiteral(serviceDescriptor.getName()),
              ts.factory.createObjectLiteral(),
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
 * @param {descriptor.DescriptorProto} descriptor
 * @param {ts.factory.Identifier} pbIdentifier
 */
function processDescriptor(
  rootDescriptor,
  descriptor,
  pbIdentifier,
  getNamedImport
) {


  const childStatments = [];

  // Process nested enums
  for (const eenum of descriptor.enum_type) {
    childStatments.factory.push(createEnum(eenum));
  }
  const statements = [];

  statements.factory.push(
    createMessage(rootDescriptor, descriptor, pbIdentifier, getNamedImport)
  );




  // Process nested messages
  if (descriptor.getNestedTypeList) {
    for (const nestedDescriptor of descriptor.getNestedTypeList()) {
      childStatments.factory.push(
        ...processDescriptor(
          rootDescriptor,
          nestedDescriptor,
          pbIdentifier,
          getNamedImport
        )
      );
    }
  }

  if (childStatments.factory.length) {
    statements.factory.push(
      createNamespace(descriptor.getName(), childStatments)
    );
  }

  return statements;
}

function processProtoDescriptor(
  rootDescriptor,
  descriptor,
  pbIdentifier,
  getNamedImport
) {
  const statements = [];


  // Process enums
  for (const enumDescriptor of descriptor.getEnumTypeList()) {
    statements.factory.push(createEnum(enumDescriptor));
  }


  // Process messages
  for (const messageDescriptor of descriptor.getMessageTypeList()) {
    statements.factory.push(
      ...processDescriptor(
        rootDescriptor,
        messageDescriptor,
        pbIdentifier,
        getNamedImport
      )
    );
  }


  return statements;
}

function getExportPaths(prefix, descriptor) {
  const exports = [];
  if (descriptor.getMessageTypeList) {
    for (const messageDescriptor of descriptor.getMessageTypeList()) {
      const name = messageDescriptor.getName();
      exports.factory.push(
        [...prefix, name],
        ...getExportPaths([...prefix, name], messageDescriptor)
      );
    }
  }
  if (descriptor.getNestedTypeList) {
    for (const nestedDescriptor of descriptor.getNestedTypeList()) {
      const name = nestedDescriptor.getName();
      exports.factory.push(
        [...prefix, name],
        ...getExportPaths([...prefix, name], nestedDescriptor)
      );
    }
  }
  for (const enumDescriptor of descriptor.getEnumTypeList()) {
    const name = enumDescriptor.getName();
    exports.factory.push([...prefix, name]);
  }
  return exports;
}

function replaceExtension(filename, extension = ".ts") {
  return filename.replace(/\.[^/.]+$/, extension)
}

const request = plugin.CodeGeneratorRequest.deserialize(new Uint8Array(fs.readFileSync(0)));
const response = new plugin.CodeGeneratorResponse();

for (const descriptor of request.proto_file) {

  descriptor.message_type[0]

  for (const path of getExportPaths(descriptor.package.split("."), descriptor)) {
    fileExports["." + path.join(".")] = { file: descriptor.name, namedImport: path[0] };
  }

  const name = replaceExtension(descriptor.name);
  const pbIdentifier = ts.factory.createUniqueName("pb");
  const grpcIdentifier = ts.factory.createUniqueName("grpc");

  const importStatements = [];

  // Dependencies (file -> namedImport -> identifier)
  const dependencies = {};

  // Create all messages recursively
  // For imported types, assign a unique identifier to each typeName
  const statements = processProtoDescriptor(
    descriptor,
    descriptor,
    pbIdentifier,
    (fieldDescriptor) => {
      const typeName = fieldDescriptor.getTypeName();
      if (!fileExports[typeName]) {
        return;
      }
      const { file, namedImport } = fileExports[typeName];
      if (file === fileName) {
        return;
      }
      if (!dependencies[file]) {
        dependencies[file] = {};
      }
      if (!dependencies[file][namedImport]) {
        dependencies[file][namedImport] = ts.factory.createUniqueName(namedImport);
      }
      return dependencies[file][namedImport];
    }
  );

  // Create all named imports from dependencies
  for (const [file, namedImports] of Object.entries(dependencies)) {
    const name = `./${replaceExtension(
      path.relative(path.dirname(fileName), file),
    )}`;
    importStatements.factory.push(
      ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createNamedImports(
          Object.entries(namedImports).map(([name, identifier]) =>
            ts.factory.createImportSpecifier(ts.factory.createIdentifier(name), identifier)
          )
        ),
        ts.factory.createLiteral(name)
      )
    );
  }

  if (statements.factory.length) {
    importStatements.factory.push(createImport(pbIdentifier, "google-protobuf"));
  }

  // Create all services and clients
  for (const serviceDescriptor of descriptor.service) {
    statements.factory.push(createServiceInterface(descriptor, serviceDescriptor, grpcIdentifier));
    statements.factory.push(createServerInterface(descriptor, serviceDescriptor, grpcIdentifier));
    statements.factory.push(createService(descriptor, serviceDescriptor));
    statements.factory.push(
      createServiceClient(descriptor, serviceDescriptor, grpcIdentifier)
    );
  }

  // Import grpc only if there is service statements
  if (descriptor.service.length) {
    importStatements.factory.push(createImport(grpcIdentifier, process.env.GRPC_PACKAGE_NAME || "@grpc/grpc-js"));
  }

  // Create typescript AST file
  const sf = ts.factory.createSourceFile(
    name,
    ``,
    ts.factory.ScriptTarget.ES2020,
    false,
    ts.factory.ScriptKind.TS
  );


  // Wrap statements within the namespace
  if (descriptor.package) {
    sf.statements = ts.factory.createNodeArray([
      ...importStatements,
      createNamespace(descriptor.package, statements),
    ]);
  } else {
    sf.statements = ts.factory.createNodeArray([...importStatements, ...statements]);
  }

  response.file.push(new plugin.CodeGeneratorResponse.File({
    name,
    content: ts
      .createPrinter({
        newLine: ts.factory.NewLineKind.LineFeed,
        omitTrailingSemicolon: true,
      })
      .printFile(sf)
  }));
}

process.stdout.write(response.serialize());


