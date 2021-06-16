const descriptor = require("./compiler/descriptor");
const type = require("./type");
const ts = require("typescript");

/**
 * @param {*} type 
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function wrapRepeatedType(type, fieldDescriptor) {
    if (isRepeated(fieldDescriptor) && !isMap(fieldDescriptor)) {
        type = ts.factory.createArrayTypeNode(type);
    }

    return type;
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function getMapType(rootDescriptor, fieldDescriptor) {
    const messageDescriptor = type.getMapDescriptor(fieldDescriptor.type_name);
    const [keyDescriptor, valueDescriptor] = messageDescriptor.field;

    return ts.factory.createTypeReferenceNode(
        "Map",
        [
            getType(keyDescriptor, rootDescriptor),
            getType(valueDescriptor, rootDescriptor)
        ]
    );

}


/**
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @returns {ts.TypeReferenceNode | ts.Identifier | ts.PropertyAccessExpression}
 */
function getType(fieldDescriptor, rootDescriptor) {
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
function hasJsTypeString(fieldDescriptor) {
    return fieldDescriptor.options && fieldDescriptor.options.jstype == descriptor.FieldOptions.JSType.JS_STRING;
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
function isMap(fieldDescriptor) {
    return type.getMapDescriptor(fieldDescriptor.type_name) != undefined;
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
function isPackable(fieldDescriptor) {
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
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.FieldDescriptorProto} fieldDescriptor 
 */
function isPacked(rootDescriptor, fieldDescriptor) {
    if (!isPackable(fieldDescriptor)) {
        return false;
    }
    const options = fieldDescriptor.options;
    // weirdly the compiler does not send the syntax information
    // it only sends when the syntax is proto3 so we have to look for it. 
    // when it is empty, it indicates that the syntax is proto2 for sure
    if (rootDescriptor.syntax == "proto3") {
        return !options || options.packed == null || options.packed;
    } 
        
    return options != null && options.packed
}


module.exports = { getType, wrapRepeatedType, toBinaryMethodName, isMap, isPacked, isOneOf, isBoolean, isString, isEnum, isMessage, isOptional, isRepeated }