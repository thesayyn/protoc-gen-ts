import * as descriptor from './compiler/descriptor.js';
import * as type from './type.js';
import ts from 'typescript';
import { match } from 'ts-pattern';

export function wrapRepeatedType(type: ts.TypeNode, fieldDescriptor: descriptor.FieldDescriptorProto): ts.TypeNode
{
    return isRepeated(fieldDescriptor) && !isMap(fieldDescriptor)
        ? ts.factory.createArrayTypeNode(type)
        : type;
}

function getMapType(rootDescriptor: descriptor.FileDescriptorProto, fieldDescriptor: descriptor.FieldDescriptorProto): ts.TypeReferenceNode
{
    const messageDescriptor = type.getMapDescriptor(fieldDescriptor.type_name)!;
    const [keyDescriptor, valueDescriptor] = messageDescriptor.field;

    return ts.factory.createTypeReferenceNode(
        'Map',
        [
            getType(keyDescriptor, rootDescriptor) as ts.TypeNode,
            getType(valueDescriptor, rootDescriptor) as ts.TypeNode,
        ]
    );

}

export function getType(fieldDescriptor: descriptor.FieldDescriptorProto, rootDescriptor: descriptor.FileDescriptorProto): ts.TypeReferenceNode|ts.Identifier|ts.PropertyAccessExpression
{
    if (isMap(fieldDescriptor))
    {
        return getMapType(rootDescriptor, fieldDescriptor);
    }
    else if (hasJsTypeString(fieldDescriptor))
    {
        return ts.factory.createTypeReferenceNode('string');
    }

    switch (fieldDescriptor.type)
    {
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
        {
            return ts.factory.createTypeReferenceNode('number');
        }

        case descriptor.FieldDescriptorProto.Type.TYPE_STRING:
        {
            return ts.factory.createTypeReferenceNode('string');
        }

        case descriptor.FieldDescriptorProto.Type.TYPE_BOOL:
        {
            return ts.factory.createTypeReferenceNode('boolean');
        }

        case descriptor.FieldDescriptorProto.Type.TYPE_BYTES:
        {
            return ts.factory.createTypeReferenceNode('Uint8Array');
        }

        case descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE:
        case descriptor.FieldDescriptorProto.Type.TYPE_ENUM:
        {
            return ts.factory.createTypeReferenceNode(
                type.getTypeReference(rootDescriptor, fieldDescriptor.type_name) as ts.Identifier
            );
        }

        default:
        {
            throw new Error("Unhandled type " + fieldDescriptor.type);
        }
    }
}

export function toBinaryMethodName(
    fieldDescriptor: descriptor.FieldDescriptorProto,
    rootDescriptor: descriptor.FileDescriptorProto,
    isWriter: boolean = true,
): string
{
    const typeName = Array.from(Object.keys(descriptor.FieldDescriptorProto.Type)).filter(k => k.startsWith('TYPE_'))[fieldDescriptor.type - 1]
        .replace(/TYPE_(.)(.+)/, (_: string, l: string, w: string) => `${l}${w.toLowerCase()}`);

    const suffix = hasJsTypeString(fieldDescriptor)
        ? 'String'
        : '';

    const prefix = match<boolean, string>(true)
        .with(isPacked(rootDescriptor, fieldDescriptor), () => 'Packed')
        .with(isRepeated(fieldDescriptor) && isWriter, () => 'Repeated')
        .with(true, () => '')
        .exhaustive();

    return `${prefix}${typeName}${suffix}`;
}

function hasJsTypeString(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return fieldDescriptor.options && fieldDescriptor.options.jstype === descriptor.FieldOptions.JSType.JS_STRING;
}

export function isOneOf(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return typeof fieldDescriptor.oneof_index === 'number';
}

export function isMap(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return type.getMapDescriptor(fieldDescriptor.type_name) != undefined;
}

export function isRepeated(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return fieldDescriptor.label === descriptor.FieldDescriptorProto.Label.LABEL_REPEATED;
}

export function isMessage(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE;
}

export function isNumber(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    switch (fieldDescriptor.type)
    {
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
        {
            return true;
        }

        default:
        {
            return false;
        }
    }
}

export function isEnum(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_ENUM;
}

export function isOptional(rootDescriptor: descriptor.FileDescriptorProto, fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return rootDescriptor.syntax == 'proto3'
        ? fieldDescriptor.label !== descriptor.FieldDescriptorProto.Label.LABEL_REQUIRED || fieldDescriptor.proto3_optional
        : fieldDescriptor.label === descriptor.FieldDescriptorProto.Label.LABEL_OPTIONAL;
}

export function isString(fieldDescriptor: descriptor.FieldDescriptorProto) : boolean
{
    return fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_STRING;
}

export function isBoolean(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return fieldDescriptor.type === descriptor.FieldDescriptorProto.Type.TYPE_BOOL;
}

/**
 * @see https://github.com/protocolbuffers/protobuf/blob/ef8d418fad8366f9854127eb4338b0757eda9aa3/src/google/protobuf/descriptor.h#L2392
 */
export function isTypePackable(type: descriptor.FieldDescriptorProto.Type): boolean
{
    return type !== descriptor.FieldDescriptorProto.Type.TYPE_STRING
        && type !== descriptor.FieldDescriptorProto.Type.TYPE_GROUP
        && type !== descriptor.FieldDescriptorProto.Type.TYPE_MESSAGE
        && type !== descriptor.FieldDescriptorProto.Type.TYPE_BYTES
}

/**
 * @see https://github.com/protocolbuffers/protobuf/blob/ef8d418fad8366f9854127eb4338b0757eda9aa3/src/google/protobuf/descriptor.h#L2283
 */
export function isPackable(fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    return isRepeated(fieldDescriptor)
        && isTypePackable(fieldDescriptor.type)
}

export function isPacked(rootDescriptor: descriptor.FileDescriptorProto, fieldDescriptor: descriptor.FieldDescriptorProto): boolean
{
    if (!isPackable(fieldDescriptor))
    {
        return false;
    }

    const options = fieldDescriptor.options;
    // weirdly the compiler does not send the syntax information
    // it only sends when the syntax is proto3, so we have to look for it.
    // when it is empty, it indicates that the syntax is proto2 for sure
    // NOTE - This could be simplified, but don't do that, this is more readable
    return rootDescriptor.syntax === 'proto3'
        ? options?.packed ?? true
        : options?.packed ?? false
}