/* eslint-disable @typescript-eslint/no-use-before-define */
import ts from "typescript";
import * as types from "./types";
import { google_protobuf as descriptor } from "./compiler/descriptor";

/**
 * @param {*} type
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function wrapRepeatedType(
  type: ts.TypeNode,
  fieldDescriptor: descriptor.FieldDescriptorProto,
): ts.TypeNode | ts.ArrayTypeNode {
  if (isRepeated(fieldDescriptor) && !isMap(fieldDescriptor)) {
    return ts.factory.createArrayTypeNode(type);
  }

  return type;
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
function getMapType(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
): ts.TypeNode {
  const messageDescriptor = types.getMapDescriptor(fieldDescriptor.type_name);
  if (messageDescriptor === undefined) {
    throw new Error("Missing messageDescriptor in getMapType");
  }
  const [keyDescriptor, valueDescriptor] = messageDescriptor.field;

  return ts.factory.createTypeReferenceNode("Map", [
    getType(keyDescriptor, rootDescriptor),
    getType(valueDescriptor, rootDescriptor),
  ]);
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @returns {ts.TypeReferenceNode | ts.Identifier | ts.PropertyAccessExpression}
 */
export function getType(
  fieldDescriptor: descriptor.FieldDescriptorProto,
  rootDescriptor: descriptor.FileDescriptorProto,
): ts.TypeNode | ts.TypeReferenceNode {
  if (isMap(fieldDescriptor)) {
    return getMapType(rootDescriptor, fieldDescriptor);
  }
  if (hasJsTypeString(fieldDescriptor)) {
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
      return ts.factory.createTypeReferenceNode("number");
    case descriptor.FieldDescriptorProto.Type.TYPE_STRING:
      return ts.factory.createTypeReferenceNode("string");
    case descriptor.FieldDescriptorProto.Type.TYPE_BOOL:
      return ts.factory.createTypeReferenceNode("boolean");
    case descriptor.FieldDescriptorProto.Type.TYPE_BYTES:
      return ts.factory.createTypeReferenceNode("Uint8Array");
    case descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE:
    case descriptor.FieldDescriptorProto.Type.TYPE_ENUM:
      return types.getTypeReference(rootDescriptor, fieldDescriptor.type_name);
    default:
      throw new Error(`Unhandled type ${fieldDescriptor.type}`);
  }
}

export function toBinaryMethodName(
  fieldDescriptor: descriptor.FieldDescriptorProto,
  rootDescriptor: descriptor.FileDescriptorProto,
  isWriter = true,
): string {
  const typeNames = Object.keys(descriptor.FieldDescriptorProto.Type)
    .map(
      (key: string | number) =>
        descriptor.FieldDescriptorProto.Type[key as any],
    )
    .filter((n) => typeof n === "string")
    .map((n) => n.replace("TYPE_", ""));

  let typeName = typeNames[fieldDescriptor.type - 1].toLowerCase();
  // lowercase first char
  typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

  const suffix = hasJsTypeString(fieldDescriptor) ? "String" : "";

  if (isPacked(rootDescriptor, fieldDescriptor)) {
    return `Packed${typeName}${suffix}`;
  }
  if (isRepeated(fieldDescriptor) && isWriter) {
    return `Repeated${typeName}${suffix}`;
  }
  return `${typeName}${suffix}`;
}

function hasJsTypeString(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    fieldDescriptor.options &&
    fieldDescriptor.options.jstype === descriptor.FieldOptions.JSType.JS_STRING
  );
}

export function isOneOf(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return typeof fieldDescriptor.oneof_index === "number";
}

export function isMap(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return types.getMapDescriptor(fieldDescriptor.type_name) !== undefined;
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isRepeated(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    fieldDescriptor.label ===
    descriptor.FieldDescriptorProto.Label.LABEL_REPEATED
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isMessage(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 * @returns {boolean}
 */
export function isNumber(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
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
      return true;
    default:
      return false;
  }
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isEnum(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_ENUM
  );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isOptional(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  if (rootDescriptor.syntax === "proto3") {
    return (
      fieldDescriptor.label !==
        descriptor.FieldDescriptorProto.Label.LABEL_REQUIRED ||
      fieldDescriptor.proto3_optional
    );
  }
  return (
    fieldDescriptor.label ===
    descriptor.FieldDescriptorProto.Label.LABEL_OPTIONAL
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isString(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_STRING
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isBoolean(
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  return (
    fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_BOOL
  );
}

/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
function isPackable(fieldDescriptor: descriptor.FieldDescriptorProto): boolean {
  const { type } = fieldDescriptor;

  return (
    isRepeated(fieldDescriptor) &&
    type !== descriptor.FieldDescriptorProto.Type.TYPE_STRING &&
    type !== descriptor.FieldDescriptorProto.Type.TYPE_GROUP &&
    type !== descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE &&
    type !== descriptor.FieldDescriptorProto.Type.TYPE_BYTES
  );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor
 */
export function isPacked(
  rootDescriptor: descriptor.FileDescriptorProto,
  fieldDescriptor: descriptor.FieldDescriptorProto,
): boolean {
  if (!isPackable(fieldDescriptor)) {
    return false;
  }
  const { options } = fieldDescriptor;
  // weirdly the compiler does not send the syntax information
  // it only sends when the syntax is proto3 so we have to look for it.
  // when it is empty, it indicates that the syntax is proto2 for sure
  if (rootDescriptor.syntax === "proto3") {
    return !options || options.packed == null || options.packed;
  }

  return options != null && options.packed;
}
