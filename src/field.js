const descriptor = require("./compiler/descriptor");
const type = require("./type");
const ts = require("typescript");

/**
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
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @returns {ts.TypeReferenceNode | }
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
            return type.getTypeReference(rootDescriptor, fieldDescriptor.type_name);
        default:
            throw new Error("Unhandled type " + fieldDescriptor.type);
    }
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
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
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isOneOf(fieldDescriptor) {
    return typeof fieldDescriptor.oneof_index == "number";
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


module.exports = { getType, wrapRepeatedType, toBinaryMethodName, isPackageable, isPacked, isOneOf, isBoolean, isString, isEnum, isMessage, isOptional, isRepeated }