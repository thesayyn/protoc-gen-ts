const plugin = require("google-protobuf/google/protobuf/compiler/plugin_pb");
const descriptorpb = require("google-protobuf/google/protobuf/descriptor_pb");
const fs = require("fs");
const ts = require("typescript");

function createImport(identifier, moduleSpecifier) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(undefined, ts.createNamespaceImport(identifier)),
    ts.createLiteral(moduleSpecifier)
  );
}

function createToObject(rootDescriptor, messageDescriptor) {
  const properties = [];

  for (const fd of messageDescriptor.getFieldList()) {
    let propertyAccessExpression = ts.createPropertyAccess(
      ts.createThis(),
      fd.getName()
    );

    if (isMessage(fd)) {
      if (isRepeated(fd)) {
        const arrowFunc = ts.createArrowFunction(
          undefined,
          undefined,
          [
            ts.createParameter(
              undefined,
              undefined,
              undefined,
              "item",
              undefined,
              ts.createTypeReferenceNode(
                ts.createIdentifier(
                  getTypeName(fd, rootDescriptor.getPackage())
                ),
                undefined
              )
            ),
          ],
          undefined,
          ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.createCall(
            ts.createPropertyAccess(ts.createIdentifier("item"), "toObject"),
            undefined,
            null
          )
        );
        propertyAccessExpression = ts.createCall(
          ts.createPropertyAccess(propertyAccessExpression, "map"),
          undefined,
          [arrowFunc]
        );
      } else {
        propertyAccessExpression = ts.createBinary(
          propertyAccessExpression,
          ts.SyntaxKind.AmpersandAmpersandToken,
          ts.createCall(
            ts.createPropertyAccess(propertyAccessExpression, "toObject")
          )
        );
      }
    }
    properties.push(
      ts.createPropertyAssignment(
        ts.createIdentifier(fd.getName()),
        propertyAccessExpression
      )
    );
  }

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
      [ts.createReturn(ts.createObjectLiteral(properties, true))],
      true
    )
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

function createTypeLiteral(rootDescriptor, messageDescriptor) {
  const members = [];

  for (const fieldDescriptor of messageDescriptor.getFieldList()) {
    // TODO: Check if the field is optional
    members.push(
      ts.createPropertySignature(
        undefined,
        fieldDescriptor.getName(),
        ts.createToken(ts.SyntaxKind.QuestionToken),
        wrapRepeatedType(
          getType(fieldDescriptor, rootDescriptor.getPackage()),
          fieldDescriptor
        ),
        undefined
      )
    );
  }
  return ts.createTypeLiteralNode(members);
}

function createConstructor(rootDescriptor, messageDescriptor, pbIdentifier) {
  const statements = [];

  const dataIdentifier = ts.createIdentifier("data");
  const typeNode = ts.createUnionTypeNode([
    ts.createArrayTypeNode(
      ts.createTypeReferenceNode(ts.createIdentifier("any"), undefined)
    ) /* any[] */,
    createTypeLiteral(rootDescriptor, messageDescriptor),
  ]);

  // Create super(); statement
  statements.push(
    ts.createStatement(ts.createCall(ts.createSuper(), undefined, undefined))
  );

  // Create initialize(); statement
  statements.push(
    ts.createStatement(
      ts.createCall(
        ts.createPropertyAccess(
          ts.createPropertyAccess(pbIdentifier, "Message"),
          "initialize"
        ),
        undefined,
        [
          ts.createThis(),
          ts.createBinary(
            ts.createCall(
              ts.createPropertyAccess(ts.createIdentifier("Array"), "isArray"),
              undefined,
              [dataIdentifier]
            ),
            ts.SyntaxKind.AmpersandAmpersandToken,
            dataIdentifier
          ),
          ts.createNumericLiteral("0"),
          ts.createNumericLiteral("-1") /* TODO: Handle extensions */,
          ts.createArrayLiteral(
            messageDescriptor
              .getFieldList()
              .filter(
                (fd) =>
                  fd.getLabel() ==
                  descriptorpb.FieldDescriptorProto.Label.LABEL_REPEATED
              )
              .map((fd) => ts.createNumericLiteral(fd.getNumber().toString()))
          ),
          ts.createNull() /* TODO: Handle oneofFields */,
        ]
      )
    )
  );

  // Create data variable and if block
  statements.push(
    ts.createIf(
      ts.createBinary(
        ts.createLogicalNot(
          ts.createCall(
            ts.createPropertyAccess(ts.createIdentifier("Array"), "isArray"),
            undefined,
            [dataIdentifier]
          )
        ),
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.createBinary(
          ts.createTypeOf(dataIdentifier),
          ts.SyntaxKind.EqualsEqualsToken,
          ts.createStringLiteral("object")
        )
      ),
      ts.createBlock(
        messageDescriptor
          .getFieldList()
          .map((fieldDescriptor) =>
            ts.createStatement(
              ts.createBinary(
                ts.createPropertyAccess(
                  ts.createThis(),
                  fieldDescriptor.getName()
                ),
                ts.SyntaxKind.EqualsToken,
                ts.createPropertyAccess(
                  dataIdentifier,
                  fieldDescriptor.getName()
                )
              )
            )
          )
      )
    )
  );

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
        typeNode
      ),
    ],
    ts.createBlock(statements, true)
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
  const typeNames = Object.keys(
    descriptorpb.FieldDescriptorProto.Type
  ).map((n) => n.replace("TYPE_", ""));

  let typeName = typeNames[fieldDescriptor.getType() - 1].toLowerCase();
  typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
  return isPacked(fieldDescriptor, descriptor)
    ? `Packed${typeName}`
    : isRepeated(fieldDescriptor) && isWriter
    ? `Repeated${typeName}`
    : typeName;
}

// Returns a get accessor for the field
function createGetter(rootDescriptor, fieldDescriptor, pbIdentifier) {
  let type = wrapRepeatedType(
    getType(fieldDescriptor, rootDescriptor.getPackage()),
    fieldDescriptor
  );
  const getterType = wrapOptinalType(type, fieldDescriptor);
  return ts.createGetAccessor(
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
            rootDescriptor.getPackage()
          )
        ),
      ],
      true
    )
  );
}

// Returns the inner logic of the field accessor.
function createGetterCall(fieldDescriptor, pbIdentifier, type, packageName) {
  let calle = ts.createIdentifier("getFieldWithDefault");

  let args = [
    ts.createThis(),
    ts.createNumericLiteral(fieldDescriptor.getNumber().toString()),
    ts.createIdentifier("undefined"),
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

// Returns a set accessor for the field
function createSetter(rootDescriptor, fieldDescriptor, pbIdentifier) {
  let type = wrapRepeatedType(
    getType(fieldDescriptor, rootDescriptor.getPackage()),
    fieldDescriptor
  );
  const paramIdentifier = ts.createIdentifier("value");
  return ts.createSetAccessor(
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
      ),
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
              ts.createNumericLiteral(fieldDescriptor.getNumber().toString()),
              paramIdentifier,
            ]
          )
        ),
      ],
      true
    )
  );
}

/**
 * Returns the serialize method for the message class
 * TODO: Split this function into chunk functions
 */
function createSerialize(rootDescriptor, fields, pbIdentifier) {
  return ts.createMethod(
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
        ts.createTypeReferenceNode(
          ts.createQualifiedName(pbIdentifier, "BinaryWriter"),
          undefined
        ),
        undefined
      ),
    ],
    ts.createUnionTypeNode([
      ts.createTypeReferenceNode(ts.createIdentifier("Uint8Array"), undefined),
      ts.createTypeReferenceNode(ts.createIdentifier("undefined"), undefined),
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
              ),
            ],
            ts.NodeFlags.Const
          )
        ),
        ...fields.map((fieldDescriptor) => {
          const propAccessor = ts.createPropertyAccess(
            ts.createThis(),
            fieldDescriptor.getName()
          );

          const propParameters = [
            ts.createNumericLiteral(fieldDescriptor.getNumber().toString()),
            propAccessor,
          ];

          if (isMessage(fieldDescriptor)) {
            if (isRepeated(fieldDescriptor)) {
              propParameters.push(
                ts.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    ts.createParameter(
                      undefined,
                      undefined,
                      undefined,
                      "item",
                      undefined,
                      ts.createTypeReferenceNode(
                        ts.createIdentifier(
                          getTypeName(
                            fieldDescriptor,
                            rootDescriptor.getPackage()
                          )
                        ),
                        undefined
                      )
                    ),
                  ],
                  undefined,
                  ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                  ts.createCall(
                    ts.createPropertyAccess(
                      ts.createIdentifier("item"),
                      "serialize"
                    ),
                    undefined,
                    [ts.createIdentifier("writer")]
                  )
                )
              );
            } else {
              propParameters.push(
                ts.createArrowFunction(
                  undefined,
                  undefined,
                  [],
                  undefined,
                  ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                  ts.createCall(
                    ts.createPropertyAccess(
                      ts.createPropertyAccess(
                        ts.createThis(),
                        fieldDescriptor.getName()
                      ),
                      "serialize"
                    ),
                    undefined,
                    [ts.createIdentifier("writer")]
                  )
                )
              );
            }
          }

          // this.prop !== undefined
          let condition = ts.createBinary(
            propAccessor,
            ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
            ts.createIdentifier("undefined")
          );

          return ts.createIf(
            condition,
            ts.createStatement(
              ts.createCall(
                ts.createPropertyAccess(
                  ts.createIdentifier("writer"),
                  ts.createIdentifier(
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
        ),
      ],
      true
    )
  );
}

/**
 * Returns the deserialize method for the message class
 * TODO: Split this function into chunk functions
 */
function createDeserialize(rootDescriptor, messageDescriptor, pbIdentifier) {
  return ts.createMethod(
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
          ts.createTypeReferenceNode(
            ts.createIdentifier("Uint8Array"),
            undefined
          ),
          ts.createTypeReferenceNode(
            ts.createQualifiedName(pbIdentifier, "BinaryReader"),
            undefined
          ),
        ])
      ),
    ],
    ts.createTypeReferenceNode(messageDescriptor.getName(), undefined),
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
              ),
            ],
            ts.NodeFlags.Const
          )
        ),
        ts.createWhile(
          ts.createCall(
            ts.createPropertyAccess(ts.createIdentifier("reader"), "nextField"),
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
                  ...messageDescriptor.getFieldList().map((fd) => {
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
                              ts.createPropertyAccess(pbIdentifier, "Message"),
                              "addToRepeatedField"
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
                    } else if (isMessage(fd)) {
                      const readCall = ts.createCall(
                        ts.createPropertyAccess(
                          ts.createIdentifier(
                            getTypeName(fd, rootDescriptor.getPackage())
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
                                        ts.createPropertyAccess(
                                          pbIdentifier,
                                          "Message"
                                        ),
                                        "addToRepeatedWrapperField"
                                      ),
                                      undefined,
                                      [
                                        ts.createIdentifier("message"),
                                        ts.createNumericLiteral(
                                          fd.getNumber().toString()
                                        ),
                                        readCall,
                                        ts.createIdentifier(
                                          getTypeName(
                                            fd,
                                            rootDescriptor.getPackage()
                                          )
                                        ),
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
                              ),
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
                                  rootDescriptor,
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
                    ),
                  ]),
                ])
              ),
            ],
            true
          )
        ),
        ts.createReturn(ts.createIdentifier("message")),
      ],
      true
    )
  );
}

// Returns a class for the message descriptor
function createMessage(rootDescriptor, messageDescriptor, pbIdentifier) {
  const members = [];

  // Create constructor
  members.push(
    createConstructor(rootDescriptor, messageDescriptor, pbIdentifier)
  );

  // Create getter and setters
  for (const fieldDescriptor of messageDescriptor.getFieldList()) {
    members.push(createGetter(rootDescriptor, fieldDescriptor, pbIdentifier));
    members.push(createSetter(rootDescriptor, fieldDescriptor, pbIdentifier));
  }

  // Create toObject method
  members.push(createToObject(rootDescriptor, messageDescriptor));

  // Create serialize  method
  members.push(
    createSerialize(
      rootDescriptor,
      messageDescriptor.getFieldList(),
      pbIdentifier
    )
  );

  // Create deserialize method
  members.push(
    createDeserialize(rootDescriptor, messageDescriptor, pbIdentifier)
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
          ts.createPropertyAccess(pbIdentifier, ts.createIdentifier("Message"))
        ),
      ]),
    ],
    members
  );
}

// Returns a enum for the enum descriptor
function createEnum(enumDescriptor) {
  return ts.createEnumDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createIdentifier(enumDescriptor.getName()),
    enumDescriptor.getValueList().map((valueDescriptor) => {
      return ts.createEnumMember(
        valueDescriptor.getName(),
        ts.createNumericLiteral(valueDescriptor.getNumber().toString())
      );
    })
  );
}

function getRPCOutputType(rootDescriptor, methodDescriptor) {
  return normalizeTypeName(
    methodDescriptor.getOutputType(),
    rootDescriptor.getPackage()
  );
}

function getRPCInputType(rootDescriptor, methodDescriptor) {
  return normalizeTypeName(
    methodDescriptor.getInputType(),
    rootDescriptor.getPackage()
  );
}

function getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor) {
  let name = serviceDescriptor.getName();
  if (rootDescriptor.hasPackage()) {
    name = `${rootDescriptor.getPackage()}.${name}`;
  }
  return `/${name}/${methodDescriptor.getName()}`;
}

function isUnaryRPC(methodDescriptor) {
  return (
    methodDescriptor.getServerStreaming() == false &&
    methodDescriptor.getClientStreaming() == false
  );
}

// Returns grpc-node compatible service description
function createService(rootDescriptor, serviceDescriptor) {
  return ts.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    [
      ts.createVariableDeclaration(
        ts.createIdentifier(serviceDescriptor.getName()),
        undefined,
        ts.createObjectLiteral(
          serviceDescriptor.getMethodList().map((methodDescriptor) => {
            return ts.createPropertyAssignment(
              methodDescriptor.getName(),
              ts.createObjectLiteral(
                [
                  ts.createPropertyAssignment(
                    "path",
                    ts.createStringLiteral(
                      getRPCPath(
                        rootDescriptor,
                        serviceDescriptor,
                        methodDescriptor
                      )
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
                    methodDescriptor.getServerStreaming()
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
                          ts.createTypeReferenceNode(
                            ts.createIdentifier(
                              getRPCInputType(rootDescriptor, methodDescriptor)
                            ),
                            undefined
                          )
                        ),
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
                            undefined
                          ),
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
                          ts.createTypeReferenceNode(
                            ts.createIdentifier("Buffer"),
                            undefined
                          )
                        ),
                      ],
                      undefined,
                      ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                      ts.createCall(
                        ts.createPropertyAccess(
                          ts.createIdentifier(
                            getRPCInputType(rootDescriptor, methodDescriptor)
                          ),
                          "deserialize"
                        ),
                        undefined,
                        [
                          ts.createNew(
                            ts.createIdentifier("Uint8Array"),
                            undefined,
                            [ts.createIdentifier("bytes")]
                          ),
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
                          ts.createTypeReferenceNode(
                            ts.createIdentifier(
                              getRPCOutputType(rootDescriptor, methodDescriptor)
                            ),
                            undefined
                          )
                        ),
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
                          ),
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
                          ts.createTypeReferenceNode(
                            ts.createIdentifier("Buffer"),
                            undefined
                          )
                        ),
                      ],
                      undefined,
                      ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                      ts.createCall(
                        ts.createPropertyAccess(
                          ts.createIdentifier(
                            getRPCOutputType(rootDescriptor, methodDescriptor)
                          ),
                          "deserialize"
                        ),
                        undefined,
                        [
                          ts.createNew(
                            ts.createIdentifier("Uint8Array"),
                            undefined,
                            [ts.createIdentifier("bytes")]
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
    ]
  );
}

// Returns grpc-node compatible unary client method
function createUnaryServiceClientMethod(
  rootDescriptor,
  methodDescriptor,
  grpcIdentifier
) {
  const responseType = ts.createTypeReferenceNode(
    getRPCOutputType(rootDescriptor, methodDescriptor)
  );
  const requestType = ts.createTypeReferenceNode(
    getRPCInputType(rootDescriptor, methodDescriptor)
  );

  const metadataType = ts.createQualifiedName(grpcIdentifier, "Metadata");

  const errorType = ts.createQualifiedName(grpcIdentifier, "ServiceError");

  const returnType = ts.createTypeReferenceNode("Promise", [responseType]);

  const rpcName = methodDescriptor.getName();

  const promiseBody = ts.createCall(
    ts.createElementAccess(ts.createSuper(), ts.createStringLiteral(rpcName)),
    undefined,
    [
      ts.createIdentifier("request"),
      ts.createIdentifier("metadata"),
      ts.createArrowFunction(
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            "error",
            undefined,
            errorType
          ),
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            "response",
            undefined,
            responseType
          ),
        ],
        undefined,
        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.createBlock(
          [
            ts.createIf(
              ts.createIdentifier("error"),
              ts.createBlock([
                ts.createStatement(
                  ts.createCall(ts.createIdentifier("reject"), undefined, [
                    ts.createIdentifier("error"),
                  ])
                ),
              ]),
              ts.createBlock([
                ts.createStatement(
                  ts.createCall(ts.createIdentifier("resolve"), undefined, [
                    ts.createIdentifier("response"),
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

  return ts.createMethod(
    undefined,
    undefined,
    undefined,
    rpcName,
    undefined,
    undefined,
    [
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        "request",
        undefined,
        requestType
      ),
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        "metadata",
        ts.createToken(ts.SyntaxKind.QuestionToken),
        metadataType
      ),
    ],
    returnType,
    ts.createBlock(
      [
        ts.createReturn(
          ts.createNew(ts.createIdentifier("Promise"), undefined, [
            ts.createArrowFunction(
              undefined,
              undefined,
              [
                ts.createParameter(undefined, undefined, undefined, "resolve"),
                ts.createParameter(undefined, undefined, undefined, "reject"),
              ],
              undefined,
              ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
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
    ts.createConstructor(
      undefined,
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          "address",
          undefined,
          ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ),
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          "credentials",
          undefined,
          ts.createTypeReferenceNode(
            ts.createQualifiedName(grpcIdentifier, "ChannelCredentials")
          )
        ),
      ],

      ts.createBlock(
        [
          ts.createCall(ts.createSuper(), undefined, [
            ts.createIdentifier("address"),
            ts.createIdentifier("credentials"),
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

  return ts.createClassDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createIdentifier(`${serviceDescriptor.getName()}Client`),
    undefined,
    [
      ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.createExpressionWithTypeArguments(
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
              ts.createObjectLiteral(),
            ]
          )
        ),
      ]),
    ],
    members
  );
}

function processProtoDescriptor(rootDescriptor, descriptor, pbIdentifier) {
  const statements = [];

  // Process messages
  if (descriptor.getMessageTypeList) {
    for (const messageDescriptor of descriptor.getMessageTypeList()) {
      statements.push(
        createMessage(rootDescriptor, messageDescriptor, pbIdentifier)
      );

      // Process nested messages
      const enumStatements = [];
      for (const enumDescriptor of messageDescriptor.getEnumTypeList()) {
        enumStatements.push(createEnum(enumDescriptor));
      }

      if (enumStatements.length) {
        statements.push(
          createNamespace(messageDescriptor.getName(), enumStatements)
        );
      }

      // Process nested messages
      if (
        messageDescriptor.getNestedTypeList &&
        messageDescriptor.getNestedTypeList().length
      ) {
        const namespacedStatements = processProtoDescriptor(
          rootDescriptor,
          messageDescriptor,
          pbIdentifier
        );
        statements.push(
          createNamespace(messageDescriptor.getName(), namespacedStatements)
        );
      }
    }
  }

  // Process nested messages
  if (descriptor.getNestedTypeList) {
    for (const nestedDescriptor of descriptor.getNestedTypeList()) {
      statements.push(
        createMessage(rootDescriptor, nestedDescriptor, pbIdentifier)
      );
    }
  }

  // Process enums
  for (const enumDescriptor of descriptor.getEnumTypeList()) {
    statements.push(createEnum(enumDescriptor));
  }

  return statements;
}

function main() {
  const pbBuffer = fs.readFileSync(0);
  const pbVector = new Uint8Array(pbBuffer.length);
  pbVector.set(pbBuffer);

  const codeGenRequest = plugin.CodeGeneratorRequest.deserializeBinary(
    pbVector
  );
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

    const pbIdentifier = ts.createUniqueName("pb");
    const grpcIdentifier = ts.createUniqueName("grpc");

    const importStatements = [];

    // Create all messages recursively
    const statements = processProtoDescriptor(
      descriptor,
      descriptor,
      pbIdentifier
    );

    if (statements.length) {
      importStatements.push(createImport(pbIdentifier, "google-protobuf"));
    }

    // Create all services and clients
    for (const serviceDescriptor of descriptor.getServiceList()) {
      statements.push(createService(descriptor, serviceDescriptor));
      statements.push(
        createServiceClient(descriptor, serviceDescriptor, grpcIdentifier)
      );
    }

    if (descriptor.getServiceList().length) {
      importStatements.push(createImport(grpcIdentifier, "grpc"));
    }

    // Wrap statements within the namespace
    if (descriptor.hasPackage()) {
      sf.statements = ts.createNodeArray([
        ...importStatements,
        createNamespace(descriptor.getPackage(), statements),
      ]);
    } else {
      sf.statements = ts.createNodeArray([...importStatements, ...statements]);
    }

    codegenFile.setName(name);
    codegenFile.setContent(
      ts
        .createPrinter({
          newLine: ts.NewLineKind.LineFeed,
          omitTrailingSemicolon: true,
        })
        .printFile(sf)
    );

    codeGenResponse.addFile(codegenFile);
  }

  process.stdout.write(Buffer.from(codeGenResponse.serializeBinary()));
}

main();
