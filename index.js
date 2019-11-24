const plugin = require("google-protobuf/google/protobuf/compiler/plugin_pb");
const descriptorpb = require("google-protobuf/google/protobuf/descriptor_pb");
const fs = require("fs");
const ts = require("typescript");

const pbBuffer = fs.readFileSync(0);
const pbVector = new Uint8Array(pbBuffer.length);
pbVector.set(pbBuffer);

const codeGenRequest = plugin.CodeGeneratorRequest.deserializeBinary(pbVector);
const codeGenResponse = new plugin.CodeGeneratorResponse();

const descriptors = codeGenRequest.getProtoFileList();

for (const descriptor of descriptors) {
  const name = descriptor.getName().replace(".proto", ".ts");
  const codegenFile = new plugin.CodeGeneratorResponse.File();

  const sf = ts.createSourceFile(
    name,
    ``,
    ts.ScriptTarget.ES2020,
    false,
    ts.ScriptKind.TS
  );

  fs.writeFileSync("ast.json", JSON.stringify(sf, undefined, 2));

  let pbIdentifier = ts.createUniqueName("pb");
  let pbImport;

  function createMessage(messageDescriptor, namespace) {
    const members = [];

    // Create message metadata
    const repeatedFieldsIdentifier = ts.createIdentifier("repeatedFields_");

    // Create repeated fields property
    members.push(
      ts.createProperty(
        undefined,
        [
          ts.createModifier(ts.SyntaxKind.ProtectedKeyword),
          ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)
        ],
        repeatedFieldsIdentifier,
        undefined,
        ts.createArrayTypeNode(ts.createIdentifier("number")),
        ts.createArrayLiteral(
          messageDescriptor
            .getFieldList()
            .filter(
              fd =>
                fd.getLabel() ==
                descriptorpb.FieldDescriptorProto.Label.LABEL_REPEATED
            )
            .map(fd => ts.createNumericLiteral(fd.getNumber().toString()))
        )
      )
    );

    members.push(
      ts.createProperty(
        undefined,
        [
          ts.createModifier(ts.SyntaxKind.ProtectedKeyword),
          ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)
        ],
        ts.createIdentifier("displayName"),
        undefined,
        ts.createIdentifier("string"),
        ts.createStringLiteral(
          namespace
            ? `proto.${namespace}.${messageDescriptor.getName()}`
            : `proto.${messageDescriptor.getName()}`
        )
      )
    );

    // Create constructor
    members.push(createConstructor(pbIdentifier, repeatedFieldsIdentifier));

    // Create getter and setters
    messageDescriptor.getFieldList().map(fieldDescriptor => {
      let type = wrapRepeatedType(getType(fieldDescriptor), fieldDescriptor);
      const getterType = wrapOptinalType(type, fieldDescriptor);

      members.push(
        ts.createGetAccessor(
          undefined,
          undefined,
          fieldDescriptor.getName(),
          undefined,
          getterType,
          ts.createBlock(
            [
              ts.createReturn(
                createGetterCall(fieldDescriptor, pbIdentifier, getterType)
              )
            ],
            true
          )
        )
      );

      const paramIdentifier = ts.createIdentifier("value");

      members.push(
        ts.createSetAccessor(
          undefined,
          undefined,
          fieldDescriptor.getName(),
          [
            ts.createParameter(
              undefined,
              undefined,
              undefined,
              paramIdentifier,
              undefined,
              type
            )
          ],
          ts.createBlock(
            [
              ts.createStatement(
                ts.createCall(
                  ts.createPropertyAccess(
                    ts.createPropertyAccess(pbIdentifier, "Message"),
                    "setField"
                  ),
                  undefined,
                  [
                    ts.createThis(),
                    ts.createNumericLiteral(
                      fieldDescriptor.getNumber().toString()
                    ),
                    paramIdentifier
                  ]
                )
              )
            ],
            true
          )
        )
      );
    });

    // Create toObject method
    members.push(createToObject(messageDescriptor, pbIdentifier));

    // Create serializeBinary method
    members.push(
      ts.createMethod(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier("serializeBinary"),
        undefined,
        undefined,
        undefined,
        ts.createTypeReferenceNode("Uint8Array"),
        ts.createBlock(
          [
            ts.createVariableStatement(
              undefined,
              ts.createVariableDeclarationList(
                [
                  ts.createVariableDeclaration(
                    "writer",
                    undefined,
                    ts.createNew(
                      ts.createPropertyAccess(pbIdentifier, "BinaryWriter"),
                      undefined,
                      []
                    )
                  )
                ],
                ts.NodeFlags.Const
              )
            ),
            ...messageDescriptor.getFieldList().map(fieldDescriptor => {
              const propAccessor = ts.createPropertyAccess(
                ts.createThis(),
                fieldDescriptor.getName()
              );

              return ts.createIf(
                propAccessor,
                ts.createStatement(
                  ts.createCall(
                    ts.createPropertyAccess(
                      ts.createIdentifier("writer"),
                      ts.createIdentifier(
                        `write${toBinaryMethodName(
                          fieldDescriptor,
                          descriptor
                        )}`
                      )
                    ),
                    undefined,
                    [
                      ts.createNumericLiteral(
                        fieldDescriptor.getNumber().toString()
                      ),
                      propAccessor
                    ]
                  )
                )
              );
            }),
            ts.createReturn(
              ts.createCall(
                ts.createPropertyAccess(
                  ts.createIdentifier("writer"),
                  "getResultBuffer"
                ),
                undefined,
                []
              )
            ) // return writer.getResultBuffer()
          ],
          true
        )
      )
    );

    // Create deserializeBinary method
    members.push(
      ts.createMethod(
        undefined,
        [ts.createModifier(ts.SyntaxKind.StaticKeyword)],
        undefined,
        ts.createIdentifier("deserializeBinary"),
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            ts.createIdentifier("bytes"),
            undefined,
            ts.createTypeReferenceNode("Uint8Array")
          )
        ],
        ts.createTypeReferenceNode(messageDescriptor.getName()),
        ts.createBlock(
          [
            ts.createVariableStatement(
              undefined,
              ts.createVariableDeclarationList(
                [
                  ts.createVariableDeclaration(
                    "reader",
                    undefined,
                    ts.createNew(
                      ts.createPropertyAccess(pbIdentifier, "BinaryReader"),
                      undefined,
                      [ts.createIdentifier("bytes")]
                    )
                  ),
                  ts.createVariableDeclaration(
                    "message",
                    undefined,
                    ts.createNew(
                      ts.createIdentifier(messageDescriptor.getName()),
                      undefined,
                      []
                    )
                  )
                ],
                ts.NodeFlags.Const
              )
            ),
            ts.createWhile(
              ts.createCall(
                ts.createPropertyAccess(
                  ts.createIdentifier("reader"),
                  "nextField"
                ),
                undefined,
                []
              ),
              ts.createBlock(
                [
                  ts.createSwitch(
                    ts.createCall(
                      ts.createPropertyAccess(
                        ts.createIdentifier("reader"),
                        "getFieldNumber"
                      ),
                      undefined,
                      []
                    ),
                    ts.createCaseBlock([
                      ...messageDescriptor.getFieldList().map(fd => {
                        return ts.createCaseClause(
                          ts.createNumericLiteral(fd.getNumber().toString()),
                          [
                            ts.createStatement(
                              ts.createBinary(
                                ts.createPropertyAccess(
                                  ts.createIdentifier("message"),
                                  fd.getName()
                                ),
                                ts.SyntaxKind.EqualsToken,
                                ts.createCall(
                                  ts.createPropertyAccess(
                                    ts.createIdentifier("reader"),
                                    `read${toBinaryMethodName(
                                      fd,
                                      descriptor,
                                      false
                                    )}`
                                  ),
                                  undefined,
                                  []
                                )
                              )
                            )
                          ]
                        );
                      }),
                      ts.createDefaultClause([
                        ts.createStatement(
                          ts.createCall(
                            ts.createPropertyAccess(
                              ts.createIdentifier("reader"),
                              "skipField"
                            ),
                            undefined,
                            []
                          )
                        )
                      ])
                    ])
                  )
                ],
                true
              )
            ),
            ts.createReturn(ts.createIdentifier("message"))
          ],
          true
        )
      )
    );

    // Create message class
    return ts.createClassDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createIdentifier(messageDescriptor.getName()),
      undefined,
      [
        ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
          ts.createExpressionWithTypeArguments(
            undefined,
            ts.createPropertyAccess(
              pbIdentifier,
              ts.createIdentifier("Message")
            )
          )
        ])
      ],
      members
    );
  }
  function createEnum(enumDescriptor) {
    return ts.createEnumDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createIdentifier(enumDescriptor.getName()),
      enumDescriptor.getValueList().map(valueDescriptor => {
        return ts.createEnumMember(
          valueDescriptor.getName(),
          ts.createNumericLiteral(valueDescriptor.getNumber().toString())
        );
      })
    );
  }

  function processDescriptors(descriptor, namespace) {
    const statements = [];

    // Process messages
    if (descriptor.getMessageTypeList) {
      for (const messageDescriptor of descriptor.getMessageTypeList()) {
        if (!pbImport) {
          pbImport = ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(
              undefined,
              ts.createNamespaceImport(pbIdentifier)
            ),
            ts.createLiteral("google-protobuf")
          );
        }
        statements.push(createMessage(messageDescriptor, namespace));

        // Process nested messages
        if (messageDescriptor.getNestedTypeList) {
          const childNamespace = namespace
            ? `${namespace}.${messageDescriptor.getName()}`
            : messageDescriptor.getName();
          statements.push(
            createNamespace(
              childNamespace,
              processDescriptors(messageDescriptor, childNamespace)
            )
          );
        }
      }
    }

    // Process nested messages
    if (descriptor.getNestedTypeList) {
      for (const nestedDescriptor of descriptor.getNestedTypeList()) {
        statements.push(createMessage(nestedDescriptor, namespace));
      }
    }

    // Process enums
    for (const enumDescriptor of descriptor.getEnumTypeList()) {
      statements.push(createEnum(enumDescriptor));
    }

    return statements;
  }

  const statements = processDescriptors(descriptor, descriptor.getPackage());

  // Wrap within the namespace
  if (descriptor.hasPackage()) {
    sf.statements = [
      pbImport,
      createNamespace(descriptor.getPackage(), statements)
    ];
  } else {
    sf.statements = [pbImport, ...statements];
  }

  codegenFile.setName(name);
  codegenFile.setContent(
    ts
      .createPrinter({
        newLine: ts.NewLineKind.LineFeed,
        omitTrailingSemicolon: true
      })
      .printFile(sf)
  );

  codeGenResponse.addFile(codegenFile);
}

process.stdout.write(Buffer.from(codeGenResponse.serializeBinary()));

function createToObject(messageDescriptor, pbIdentifier) {
  return ts.createMethod(
    undefined,
    undefined,
    undefined,
    ts.createIdentifier("toObject"),
    undefined,
    undefined,
    undefined,
    undefined,
    ts.createBlock(
      [
        ts.createReturn(
          ts.createObjectLiteral(
            messageDescriptor.getFieldList().map(fd => {
              return ts.createPropertyAssignment(
                ts.createIdentifier(fd.getName()),
                createGetterCall(
                  fd,
                  pbIdentifier,
                  wrapOptinalType(wrapRepeatedType(getType(fd), fd), fd)
                )
              );
            }),
            true
          )
        )
      ],
      true
    )
  );
}

function createGetterCall(fieldDescriptor, pbIdentifier, type) {
  let calle = ts.createIdentifier("getFieldWithDefault");

  let args = [
    ts.createThis(),
    ts.createNumericLiteral(fieldDescriptor.getNumber().toString()),
    ts.createIdentifier("undefined")
  ];

  if (
    fieldDescriptor.getLabel() ==
    descriptorpb.FieldDescriptorProto.Label.LABEL_REPEATED
  ) {
    calle = ts.createIdentifier("getField");
    args.pop();
  }

  return ts.createAsExpression(
    ts.createCall(
      ts.createPropertyAccess(
        ts.createPropertyAccess(pbIdentifier, "Message"),
        calle
      ),
      undefined,
      args
    ),
    type
  );
}

function createNamespace(packageName, statements) {
  const identifiers = String(packageName).split(".");

  statements = ts.createModuleBlock(statements);

  for (let i = identifiers.length - 1; i >= 0; i--) {
    statements = ts.createModuleDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createIdentifier(identifiers[i]),
      statements,
      ts.NodeFlags.Namespace
    );
  }

  return statements;
}

function createConstructor(pbIdentifier, repeatedFieldsIdentifier) {
  const dataIdentifier = ts.createIdentifier("data");
  return ts.createConstructor(
    undefined,
    undefined,
    [
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        dataIdentifier,
        ts.createToken(ts.SyntaxKind.QuestionToken),
        ts.createArrayTypeNode(ts.createIdentifier("any")) /* any[] */
      )
    ],

    ts.createBlock(
      [
        ts.createStatement(
          ts.createCall(ts.createSuper(), undefined, undefined)
        ),
        ts.createStatement(
          ts.createCall(
            ts.createPropertyAccess(
              ts.createPropertyAccess(pbIdentifier, "Message"),
              "initialize"
            ),
            undefined,
            [
              ts.createThis(),
              dataIdentifier,
              ts.createNumericLiteral("0"),
              ts.createNumericLiteral("-1"),
              ts.createPropertyAccess(
                ts.createThis(),
                repeatedFieldsIdentifier
              ),
              ts.createNull() /* TODO: Handle oneofFields */
            ]
          )
        )
      ],
      true
    )
  );
}

function wrapRepeatedType(type, fieldDescriptor) {
  type = getType(fieldDescriptor);

  if (isRepeated(fieldDescriptor)) {
    type = ts.createArrayTypeNode(type);
  }

  return type;
}

function wrapOptinalType(type, fieldDescriptor) {
  if (
    fieldDescriptor.getLabel() ==
    descriptorpb.FieldDescriptorProto.Label.LABEL_OPTIONAL
  ) {
    type = ts.createUnionTypeNode([type, ts.createIdentifier("undefined")]);
  }
  return type;
}

function getType(fieldDescriptor) {
  switch (fieldDescriptor.getType()) {
    case descriptorpb.FieldDescriptorProto.Type.TYPE_DOUBLE:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_FLOAT:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_INT32:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_INT64:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_UINT32:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_UINT64:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_SINT32:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_SINT64:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_FIXED32:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_FIXED64:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_SFIXED32:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_SFIXED64:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_SFIXED64:
      return ts.createIdentifier("number");
    case descriptorpb.FieldDescriptorProto.Type.TYPE_STRING:
      return ts.createIdentifier("string");
    case descriptorpb.FieldDescriptorProto.Type.TYPE_BOOL:
      return ts.createIdentifier("boolean");
    case descriptorpb.FieldDescriptorProto.Type.TYPE_BYTES:
      return ts.createIdentifier("Uint8Array");
    case descriptorpb.FieldDescriptorProto.Type.TYPE_MESSAGE:
    case descriptorpb.FieldDescriptorProto.Type.TYPE_ENUM:
      return ts.createIdentifier(
        fieldDescriptor
          .getTypeName()
          .slice(1, fieldDescriptor.getTypeName().length)
      );
    default:
      throw new Error("Unhandled type " + fieldDescriptor.getType());
  }
}

function isRepeated(fieldDescriptor) {
  return (
    fieldDescriptor.getLabel() ==
    descriptorpb.FieldDescriptorProto.Label.LABEL_REPEATED
  );
}

function isPackageable(fieldDescriptor) {
  const type = fieldDescriptor.getType();
  return (
    isRepeated(fieldDescriptor) &&
    type != descriptorpb.FieldDescriptorProto.Type.TYPE_STRING &&
    type != descriptorpb.FieldDescriptorProto.Type.TYPE_GROUP &&
    type != descriptorpb.FieldDescriptorProto.Type.TYPE_MESSAGE &&
    type != descriptorpb.FieldDescriptorProto.Type.TYPE_BYTES
  );
}

function isPacked(fieldDescriptor, descriptor) {
  if (!isPackageable(fieldDescriptor)) {
    return false;
  }
  const options = fieldDescriptor.getOptions();
  if (descriptor.getSyntax() == "proto2") {
    return options && options.getPacked();
  }

  return options == null || !options.hasPacked() || options.getPacked();
}

function toBinaryMethodName(fieldDescriptor, descriptor, isWriter = true) {
  const typeNames = Object.keys(descriptorpb.FieldDescriptorProto.Type).map(n =>
    n.replace("TYPE_", "")
  );

  let typeName = typeNames[fieldDescriptor.getType() - 1].toLowerCase();
  typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
  return isPacked(fieldDescriptor, descriptor)
    ? `Packed${typeName}`
    : isRepeated(fieldDescriptor) && isWriter
    ? `Repeated${typeName}`
    : typeName;
}
