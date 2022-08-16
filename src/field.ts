import * as descriptor from "./compiler/descriptor.js";
import * as type from "./type.js";
import * as ts from "typescript";

/**
 * @param {*} type
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function wrapRepeatedType(type: any, fieldDescriptor: descriptor.FieldDescriptorProto) {
  if (isRepeated(fieldDescriptor) && !isMap(fieldDescriptor)) {
    type = ts.factory.createArrayTypeNode(type);
  }

  return type;
}

/**
 * Given the type T constructs T | undefined.
 * Null is not added, cos Message.setWrapperField is not accepting null.
 * @param type
 */
export function wrapNullableType(type: ts.TypeNode) {
  return ts.factory.createUnionTypeNode([
    type,
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
  ]);
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function getMapType(rootDescriptor: descriptor.FileDescriptorProto, fieldDescriptor: descriptor.FieldDescriptorProto) {
  const messageDescriptor = type.getMapDescriptor(fieldDescriptor.type_name);
  const [keyDescriptor, valueDescriptor] = messageDescriptor.field;

  return ts.factory.createTypeReferenceNode("Map", [
    getType(keyDescriptor, rootDescriptor),
    getType(valueDescriptor, rootDescriptor),
  ]);
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param asObject to return message AsObject type reference
 * @param asObjectPartial to return AsObjectPartial type referenct
 * @returns {ts.TypeReferenceNode | ts.Identifier | ts.PropertyAccessExpression}
 */
export function getType(
  fieldDescriptor: descriptor.FieldDescriptorProto,
  rootDescriptor: descriptor.FileDescriptorProto,
  asObject = false,
  asObjectPartial = false,
): ts.TypeReferenceNode {
  if (isMap(fieldDescriptor)) {
    return getMapType(rootDescriptor, fieldDescriptor);
  } else if (hasJsTypeString(fieldDescriptor)) {
    return ts.factory.createTypeReferenceNode("string");
  }
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
      return type.getTypeReference(
        rootDescriptor,
        fieldDescriptor.type_name,
        asObject,
        asObjectPartial,
      );
    case descriptor.FieldDescriptorProto.Type.TYPE_ENUM:
      return type.getTypeReference(rootDescriptor, fieldDescriptor.type_name);
    default:
      throw new Error("Unhandled type " + fieldDescriptor.type);
  }
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function toBinaryMethodName(
  fieldDescriptor: descriptor.FieldDescriptorProto,
  rootDescriptor: descriptor.FileDescriptorProto,
  isWriter = true,
) {
  const typeNames = Object.keys(descriptor.FieldDescriptorProto.Type)
    .map<string>((key) => descriptor.FieldDescriptorProto.Type[+key])
    .filter((n) => typeof n == "string")
    .map((n) => n.replace("TYPE_", ""));

  let typeName = typeNames[fieldDescriptor.type - 1].toLowerCase();
  //lowercase first char
  typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

  const suffix = hasJsTypeString(fieldDescriptor) ? "String" : "";

  if (isPacked(rootDescriptor, fieldDescriptor)) {
    return `Packed${typeName}${suffix}`;
  } else {
    if (isRepeated(fieldDescriptor) && isWriter) {
      return `Repeated${typeName}${suffix}`;
    } else {
      return `${typeName}${suffix}`;
    }
  }
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function hasJsTypeString(
  fieldDescriptor: descriptor.FieldDescriptorProto,
) {
  return (
    fieldDescriptor.options &&
    fieldDescriptor.options.jstype == descriptor.FieldOptions.JSType.JS_STRING
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isMap(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return type.getMapDescriptor(fieldDescriptor.type_name) != undefined;
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isRepeated(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return (
    fieldDescriptor.label ==
    descriptor.FieldDescriptorProto.Label.LABEL_REPEATED
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isMessage(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return (
    fieldDescriptor.type == descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isNumber(fieldDescriptor: descriptor.FieldDescriptorProto) {
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
      return true;
    default:
      return false;
  }
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isEnum(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return fieldDescriptor.type == descriptor.FieldDescriptorProto.Type.TYPE_ENUM;
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isOptional(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
) {
  if (rootDescriptor.syntax == "proto3") {
    return (
      fieldDescriptor.label !=
      descriptor.FieldDescriptorProto.Label.LABEL_REQUIRED ||
      fieldDescriptor.proto3_optional
    );
  }
  return (
    fieldDescriptor.label ==
    descriptor.FieldDescriptorProto.Label.LABEL_OPTIONAL
  );
}

/**
 * Function is used to determine, whether the field
 * must always be provided when passed to a constructor or fromObject method.
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function canBeCreatedWithoutValue(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
) {
  return (
    isOptional(rootDescriptor, fieldDescriptor) ||
    // Both proto2 and proto3 don't track presence for maps and repeated fields.
    // https://github.com/protocolbuffers/protobuf/blob/main/docs/field_presence.md#presence-in-proto2-apis
    isMap(fieldDescriptor) ||
    isRepeated(fieldDescriptor)
  );
}

/**
 * Function is used to determine, whether the field must be nullable
 * in the toObject() method return type.
 * Getters always
 * Need to be in sync with getters.
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function canHaveNullValue(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    isOptional(rootDescriptor, fieldDescriptor) &&
    !(
      isNumber(fieldDescriptor) ||
      isEnum(fieldDescriptor) ||
      isRepeated(fieldDescriptor) ||
      isBytes(fieldDescriptor) ||
      isString(fieldDescriptor) ||
      isBoolean(fieldDescriptor) ||
      isMap(fieldDescriptor)
    )
    // isRequiredWithoutExplicitDefault is needed, cos
    // protoc-gen-ts does not throw an exception when deserializing a message
    // that does not have some required fields
    // (neither does Google's javascript implementation).
    // Thanks to @tomasz-szypenbejl-td for reference.
  ) || isRequiredWithoutExplicitDefault(rootDescriptor, fieldDescriptor);
  // Fields that are not optional and have explicit default return that default.
  // Fields that are optional and are not messages, i.e.:
  // (
  //   isNumber(fieldDescriptor) ||
  //   isEnum(fieldDescriptor) ||
  //   isRepeated(fieldDescriptor) ||
  //   isBytes(fieldDescriptor) ||
  //   isString(fieldDescriptor) ||
  //   isBoolean(fieldDescriptor) ||
  //   isMap(fieldDescriptor)
  // ) === true
  // return their default value (zero, [], new Unit8Array(), '', false, new Map())
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isRequiredWithoutExplicitDefault(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
) {
  return (
    rootDescriptor.syntax != "proto3" &&
    fieldDescriptor.label == descriptor.FieldDescriptorProto.Label.LABEL_REQUIRED &&
    !fieldDescriptor.has_default_value
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isString(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return (
    fieldDescriptor.type == descriptor.FieldDescriptorProto.Type.TYPE_STRING
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isBytes(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return (
    fieldDescriptor.type == descriptor.FieldDescriptorProto.Type.TYPE_BYTES
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isBoolean(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return fieldDescriptor.type == descriptor.FieldDescriptorProto.Type.TYPE_BOOL;
}

/**
 *
 * @param {descriptor.FieldDescriptorProto.Type} type
 * @see https://github.com/protocolbuffers/protobuf/blob/ef8d418fad8366f9854127eb4338b0757eda9aa3/src/google/protobuf/descriptor.h#L2392
 */
export function isTypePackable(type: descriptor.FieldDescriptorProto.Type) {
  return (
    type != descriptor.FieldDescriptorProto.Type.TYPE_STRING &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_GROUP &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE &&
    type != descriptor.FieldDescriptorProto.Type.TYPE_BYTES
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 * @see https://github.com/protocolbuffers/protobuf/blob/ef8d418fad8366f9854127eb4338b0757eda9aa3/src/google/protobuf/descriptor.h#L2283
 */
export function isPackable(fieldDescriptor: descriptor.FieldDescriptorProto) {
  return isRepeated(fieldDescriptor) && isTypePackable(fieldDescriptor.type);
}

export function isPacked(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
) {
  if (!isPackable(fieldDescriptor)) return false;
  const options = fieldDescriptor.options;
  // weirdly the compiler does not send the syntax information
  // it only sends when the syntax is proto3 so we have to look for it.
  // when it is empty, it indicates that the syntax is proto2 for sure
  if (rootDescriptor.syntax == "proto3") {
    return !options || !options.has_packed || options.packed;
  }

  return options != null && options.packed;
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function hasPresenceGetter(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
) {
  return (
    !isRepeated(fieldDescriptor) &&
    !isMap(fieldDescriptor) &&
    !(
      rootDescriptor.syntax == "proto3" &&
      !(
        fieldDescriptor.proto3_optional || isMessage(fieldDescriptor) || fieldDescriptor.has_oneof_index
      )
    )
  );
}
