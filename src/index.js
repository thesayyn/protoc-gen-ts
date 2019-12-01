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

  function createMessage(messageDescriptor) {
    const members = [];

    // Create constructor
    members.push(createConstructor(messageDescriptor, pbIdentifier));

    function createGetterAndSetter(fieldDescriptor) {
      let type = wrapRepeatedType(
        getType(fieldDescriptor, descriptor.getPackage()),
        fieldDescriptor
      );
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
                createGetterCall(
                  fieldDescriptor,
                  pbIdentifier,
                  getterType,
                  descriptor.getPackage()
                )
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
                    isMessage(fieldDescriptor)
                      ? isRepeated(fieldDescriptor)
                        ? "setRepeatedWrapperField"
                        : "setWrapperField"
                      : "setField"
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
    }

    // Create getter and setters
    messageDescriptor
      .getFieldList()
      .map(fieldDescriptor => createGetterAndSetter(fieldDescriptor));

    // Create toObject method
    members.push(createToObject(messageDescriptor, pbIdentifier));

    // Create serialize  method
    members.push(
      ts.createMethod(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier("serialize"),
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            "w",
            ts.createToken(ts.SyntaxKind.QuestionToken),
            ts.createQualifiedName(pbIdentifier, "BinaryWriter"),
            undefined
          )
        ],
        ts.createUnionTypeNode([
          ts.createIdentifier("Uint8Array"),
          ts.createIdentifier("undefined")
        ]),
        ts.createBlock(
          [
            ts.createVariableStatement(
              undefined,
              ts.createVariableDeclarationList(
                [
                  ts.createVariableDeclaration(
                    "writer",
                    undefined,
                    ts.createBinary(
                      ts.createIdentifier("w"),
                      ts.SyntaxKind.BarBarToken,
                      ts.createNew(
                        ts.createPropertyAccess(pbIdentifier, "BinaryWriter"),
                        undefined,
                        []
                      )
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

              const propParameters = [
                ts.createNumericLiteral(fieldDescriptor.getNumber().toString()),
                propAccessor
              ];

              if (isMessage(fieldDescriptor)) {
                propParameters.push(
                  ts.createArrowFunction(
                    undefined,
                    undefined,
                    [],
                    undefined,
                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    ts.createBlock([])
                  )
                );
              }

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
                    propParameters
                  )
                )
              );
            }),
            ts.createIf(
              ts.createPrefix(
                ts.SyntaxKind.ExclamationToken,
                ts.createIdentifier("w")
              ),
              ts.createReturn(
                ts.createCall(
                  ts.createPropertyAccess(
                    ts.createIdentifier("writer"),
                    "getResultBuffer"
                  ),
                  undefined,
                  []
                )
              )
            )
          ],
          true
        )
      )
    );

    // Create deserialize method
    members.push(
      ts.createMethod(
        undefined,
        [ts.createModifier(ts.SyntaxKind.StaticKeyword)],
        undefined,
        ts.createIdentifier("deserialize"),
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            ts.createIdentifier("bytes"),
            undefined,
            ts.createUnionTypeNode([
              ts.createIdentifier("Uint8Array"),
              ts.createQualifiedName(pbIdentifier, "BinaryReader")
            ])
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
                    ts.createConditional(
                      ts.createBinary(
                        ts.createIdentifier("bytes"),
                        ts.SyntaxKind.InstanceOfKeyword,
                        ts.createIdentifier("Uint8Array")
                      ),
                      ts.createNew(
                        ts.createPropertyAccess(pbIdentifier, "BinaryReader"),
                        undefined,
                        [ts.createIdentifier("bytes")]
                      ),
                      ts.createIdentifier("bytes")
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
                  ts.createIf(
                    ts.createCall(
                      ts.createPropertyAccess(
                        ts.createIdentifier("reader"),
                        "isEndGroup"
                      ),
                      undefined,
                      undefined
                    ),
                    ts.createBreak()
                  ),
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
                        let statements = [];

                        if (
                          isRepeated(fd) &&
                          !isPackageable(fd) &&
                          !isMessage(fd)
                        ) {
                          statements.push(
                            ts.createStatement(
                              ts.createCall(
                                ts.createPropertyAccess(
                                  pbIdentifier,
                                  ts.createPropertyAccess(
                                    ts.createIdentifier("Message"),
                                    "addToRepeatedField"
                                  )
                                ),
                                undefined,
                                [
                                  ts.createIdentifier("message"),
                                  ts.createNumericLiteral(
                                    fd.getNumber().toString()
                                  ),
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
                                ]
                              )
                            )
                          );
                        } else if (isMessage(fd)) {
                          const readCall = ts.createCall(
                            ts.createPropertyAccess(
                              ts.createIdentifier(
                                getTypeName(fd, descriptor.getPackage())
                              ),
                              "deserialize"
                            ),
                            undefined,
                            [ts.createIdentifier("reader")]
                          );

                          statements.push(
                            ts.createStatement(
                              ts.createCall(
                                ts.createPropertyAccess(
                                  ts.createIdentifier("reader"),
                                  "readMessage"
                                ),
                                undefined,
                                [
                                  ts.createPropertyAccess(
                                    ts.createIdentifier("message"),
                                    fd.getName()
                                  ),
                                  ts.createArrowFunction(
                                    undefined,
                                    undefined,
                                    [],
                                    undefined,
                                    ts.createToken(
                                      ts.SyntaxKind.EqualsGreaterThanToken
                                    ),
                                    isRepeated(fd)
                                      ? ts.createCall(
                                          ts.createPropertyAccess(
                                            pbIdentifier,
                                            ts.createPropertyAccess(
                                              ts.createIdentifier("Message"),
                                              "addToRepeatedField"
                                            )
                                          ),
                                          undefined,
                                          [
                                            ts.createIdentifier("message"),
                                            ts.createNumericLiteral(
                                              fd.getNumber().toString()
                                            ),
                                            readCall
                                          ]
                                        )
                                      : ts.createBinary(
                                          ts.createPropertyAccess(
                                            ts.createIdentifier("message"),
                                            fd.getName()
                                          ),
                                          ts.SyntaxKind.EqualsToken,
                                          readCall
                                        )
                                  )
                                ]
                              )
                            )
                          );
                        } else {
                          statements.push(
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
                          );
                        }
                        statements.push(ts.createBreak());
                        return ts.createCaseClause(
                          ts.createNumericLiteral(fd.getNumber().toString()),
                          statements
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
          pbImport = createImport(pbIdentifier, "google-protobuf");
        }
        statements.push(createMessage(messageDescriptor));

        // Process nested messages
        if (
          messageDescriptor.getNestedTypeList &&
          messageDescriptor.getNestedTypeList().length
        ) {
          statements.push(
            createNamespace(
              messageDescriptor.getName(),
              processDescriptors(messageDescriptor, namespace)
            )
          );
        }
      }
    }

    // Process nested messages
    if (descriptor.getNestedTypeList) {
      for (const nestedDescriptor of descriptor.getNestedTypeList()) {
        statements.push(createMessage(nestedDescriptor));
      }
    }

    // Process enums
    for (const enumDescriptor of descriptor.getEnumTypeList()) {
      statements.push(createEnum(enumDescriptor));
    }

    return statements;
  }

  // Create all messages recursively
  const statements = processDescriptors(descriptor, descriptor.getPackage());

  let grpcIdentifier = ts.createUniqueName("grpc");
  let grpcImport;

  // Create all services
  statements.push(
    ...descriptor.getServiceList().map(serviceDescriptor => {
      if (!grpcImport) {
        grpcImport = createImport(grpcIdentifier, "grpc");
      }
      return ts.createVariableStatement(
        [
          ts.createModifier(ts.SyntaxKind.ExportKeyword),
          ts.createModifier(ts.SyntaxKind.ConstKeyword)
        ],
        ts.createVariableDeclaration(
          ts.createIdentifier(serviceDescriptor.getName()),
          undefined,
          ts.createObjectLiteral(
            serviceDescriptor.getMethodList().map(methodDescriptor => {
              return ts.createPropertyAssignment(
                methodDescriptor.getName(),
                ts.createObjectLiteral(
                  [
                    ts.createPropertyAssignment(
                      "path",
                      ts.createStringLiteral(
                        `/${serviceDescriptor.getName()}/${methodDescriptor.getName()}`
                      )
                    ),
                    ts.createPropertyAssignment(
                      "requestStream",
                      methodDescriptor.getClientStreaming()
                        ? ts.createTrue()
                        : ts.createFalse()
                    ),
                    ts.createPropertyAssignment(
                      "responseStream",
                      methodDescriptor.hasServerStreaming()
                        ? ts.createTrue()
                        : ts.createFalse()
                    ),
                    ts.createPropertyAssignment(
                      "requestType",
                      ts.createIdentifier(
                        methodDescriptor.getInputType().slice(1)
                      )
                    ),
                    ts.createPropertyAssignment(
                      "responseType",
                      ts.createIdentifier(
                        methodDescriptor.getOutputType().slice(1)
                      )
                    ),
                    ts.createPropertyAssignment(
                      "requestSerialize",
                      ts.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          ts.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            "message",
                            undefined,
                            ts.createIdentifier(
                              normalizeTypeName(
                                methodDescriptor.getInputType(),
                                descriptor.getPackage()
                              )
                            )
                          )
                        ],
                        undefined,
                        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        ts.createCall(
                          ts.createPropertyAccess(
                            ts.createIdentifier("Buffer"),
                            "from"
                          ),
                          undefined,
                          [
                            ts.createCall(
                              ts.createPropertyAccess(
                                ts.createIdentifier("message"),
                                "serialize"
                              ),
                              undefined,
                              []
                            )
                          ]
                        )
                      )
                    ),
                    ts.createPropertyAssignment(
                      "requestDeserialize",
                      ts.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          ts.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            "bytes",
                            undefined,
                            ts.createIdentifier("Buffer")
                          )
                        ],
                        undefined,
                        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        ts.createCall(
                          ts.createPropertyAccess(
                            ts.createIdentifier(
                              normalizeTypeName(
                                methodDescriptor.getInputType(),
                                descriptor.getPackage()
                              )
                            ),
                            "deserialize"
                          ),
                          undefined,
                          [
                            ts.createNew(
                              ts.createIdentifier("Uint8Array"),
                              undefined,
                              [ts.createIdentifier("bytes")]
                            )
                          ]
                        )
                      )
                    ),
                    ts.createPropertyAssignment(
                      "responseSerialize",
                      ts.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          ts.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            "message",
                            undefined,
                            ts.createIdentifier(
                              normalizeTypeName(
                                methodDescriptor.getOutputType(),
                                descriptor.getPackage()
                              )
                            )
                          )
                        ],
                        undefined,
                        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        ts.createCall(
                          ts.createPropertyAccess(
                            ts.createIdentifier("Buffer"),
                            "from"
                          ),
                          undefined,
                          [
                            ts.createCall(
                              ts.createPropertyAccess(
                                ts.createIdentifier("message"),
                                "serialize"
                              ),
                              undefined,
                              []
                            )
                          ]
                        )
                      )
                    ),
                    ts.createPropertyAssignment(
                      "responseDeserialize",
                      ts.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          ts.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            "bytes",
                            undefined,
                            ts.createIdentifier("Buffer")
                          )
                        ],
                        undefined,
                        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        ts.createCall(
                          ts.createPropertyAccess(
                            ts.createIdentifier(
                              normalizeTypeName(
                                methodDescriptor.getOutputType(),
                                descriptor.getPackage()
                              )
                            ),
                            "deserialize"
                          ),
                          undefined,
                          [
                            ts.createNew(
                              ts.createIdentifier("Uint8Array"),
                              undefined,
                              [ts.createIdentifier("bytes")]
                            )
                          ]
                        )
                      )
                    )
                  ],
                  true
                )
              );
            }),
            true
          )
        )
      );
    })
  );

  // Create all service clients

  statements.push(
    ...descriptor.getServiceList().map(serviceDescriptor => {
      if (!grpcImport) {
        grpcImport = createImport(grpcIdentifier, "grpc");
      }
      return ts.createVariableStatement(
        [
          ts.createModifier(ts.SyntaxKind.ExportKeyword),
          ts.createModifier(ts.SyntaxKind.ConstKeyword)
        ],
        ts.createVariableDeclaration(
          ts.createIdentifier(`${serviceDescriptor.getName()}Client`),
          undefined,
          ts.createCall(
            ts.createPropertyAccess(
              grpcIdentifier,
              "makeGenericClientConstructor"
            ),
            undefined,
            [
              ts.createIdentifier(serviceDescriptor.getName()),
              ts.createStringLiteral(serviceDescriptor.getName()),
              ts.createObjectLiteral()
            ]
          )
        )
      );
    })
  );

  // Wrap within the namespace
  if (descriptor.hasPackage()) {
    sf.statements = [
      pbImport,
      grpcImport,
      createNamespace(descriptor.getPackage(), statements)
    ].filter(Boolean);
  } else {
    sf.statements = [pbImport, grpcImport, ...statements].filter(Boolean);
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

function createImport(identifier, moduleSpecifier) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(undefined, ts.createNamespaceImport(identifier)),
    ts.createLiteral(moduleSpecifier)
  );
}

function createToObject(messageDescriptor) {
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
                ts.createPropertyAccess(ts.createThis(), fd.getName())
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

function createGetterCall(fieldDescriptor, pbIdentifier, type, packageName) {
  let calle = ts.createIdentifier("getFieldWithDefault");

  let args = [
    ts.createThis(),
    ts.createNumericLiteral(fieldDescriptor.getNumber().toString()),
    ts.createIdentifier("undefined")
  ];

  if (isRepeated(fieldDescriptor) && !isMessage(fieldDescriptor)) {
    calle = ts.createIdentifier("getField");
    args.pop();
  }

  if (isMessage(fieldDescriptor)) {
    calle = isRepeated(fieldDescriptor)
      ? ts.createIdentifier("getRepeatedWrapperField")
      : ts.createIdentifier("getWrapperField");
    args.splice(
      1,
      0,
      ts.createIdentifier(getTypeName(fieldDescriptor, packageName))
    );
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

function createConstructor(descriptor, pbIdentifier) {
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
              ts.createArrayLiteral(
                descriptor
                  .getFieldList()
                  .filter(
                    fd =>
                      fd.getLabel() ==
                      descriptorpb.FieldDescriptorProto.Label.LABEL_REPEATED
                  )
                  .map(fd => ts.createNumericLiteral(fd.getNumber().toString()))
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

function getType(fieldDescriptor, packageName) {
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
      return ts.createIdentifier(getTypeName(fieldDescriptor, packageName));
    default:
      throw new Error("Unhandled type " + fieldDescriptor.getType());
  }
}

function getTypeName(fieldDescriptor, packageName) {
  if (packageName == undefined) {
    throw new TypeError();
  }

  return normalizeTypeName(fieldDescriptor.getTypeName(), packageName);
}

function normalizeTypeName(name, packageName) {
  return (packageName ? name.replace(`${packageName}.`, "") : name).replace(
    /^\./,
    ""
  );
}

function isRepeated(fieldDescriptor) {
  return (
    fieldDescriptor.getLabel() ==
    descriptorpb.FieldDescriptorProto.Label.LABEL_REPEATED
  );
}

function isMessage(fieldDescriptor) {
  return (
    fieldDescriptor.getType() ==
    descriptorpb.FieldDescriptorProto.Type.TYPE_MESSAGE
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
