import { BinaryWriter, Message, FieldValue } from 'google-protobuf';
import exp from 'constants';

export class FileDescriptorSet extends Message {
    file: FileDescriptorProto[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class FileDescriptorProto extends Message {
    name: string;
    package: string;
    dependency: string[];
    public_dependency: FieldValue;
    weak_dependency: FieldValue;
    message_type: DescriptorProto[];
    enum_type: EnumDescriptorProto[];
    service: ServiceDescriptorProto[];
    extension: FieldDescriptorProto[];
    options: FileOptions;
    source_code_info: SourceCodeInfo;
    syntax: FieldValue;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class DescriptorProto extends Message {
    name: string;
    field: FieldDescriptorProto[];
    extension: FieldDescriptorProto[];
    nested_type: DescriptorProto[];
    enum_type: EnumDescriptorProto[];
    extension_range: DescriptorProto.ExtensionRange[];
    oneof_decl: OneofDescriptorProto[];
    options: MessageOptions;
    reserved_range: DescriptorProto.ReservedRange[];
    reserved_name: FieldValue;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace DescriptorProto {
    export class ExtensionRange extends Message {
        start: FieldValue;
        end: FieldValue;
        options: ExtensionRangeOptions;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }

    export class ReservedRange extends Message {
        start: FieldValue;
        end: FieldValue;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }
}

export class ExtensionRangeOptions extends Message {
    uninterpreted_option: UninterpretedOption[];
    field: FieldValue;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class FieldDescriptorProto extends Message {
    name: string;
    number: number;
    label: FieldDescriptorProto.Label;
    type: any;
    type_name: string;
    extendee: string;
    default_value: any;
    oneof_index?: number;
    json_name: string;
    options: FieldOptions;
    proto3_optional: boolean;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace FieldDescriptorProto {
    export enum Type {
        TYPE_DOUBLE = 1,
        TYPE_FLOAT = 2,
        TYPE_INT64 = 3,
        TYPE_UINT64 = 4,
        TYPE_INT32 = 5,
        TYPE_FIXED64 = 6,
        TYPE_FIXED32 = 7,
        TYPE_BOOL = 8,
        TYPE_STRING = 9,
        TYPE_GROUP = 10,
        TYPE_MESSAGE = 11,
        TYPE_BYTES = 12,
        TYPE_UINT32 = 13,
        TYPE_ENUM = 14,
        TYPE_SFIXED32 = 15,
        TYPE_SFIXED64 = 16,
        TYPE_SINT32 = 17,
        TYPE_SINT64 = 18,
    }

    export enum Label {
        LABEL_OPTIONAL = 1,
        LABEL_REQUIRED = 2,
        LABEL_REPEATED = 3,
    }
}

export class OneofDescriptorProto extends Message {
    name: string;
    options: OneofOptions;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class EnumDescriptorProto extends Message {
    name: string;
    value: EnumValueDescriptorProto[];
    options: EnumOptions;
    reserved_range: EnumDescriptorProto.EnumReservedRange[];
    reserved_name: string;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace EnumDescriptorProto {
    export class EnumReservedRange extends Message {
        start: number;
        end: number;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }
}

export class EnumValueDescriptorProto extends Message {
    name: string;
    number: number;
    options: EnumValueOptions;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class ServiceDescriptorProto extends Message {
    name: string;
    method: MethodDescriptorProto[];
    options: ServiceOptions;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class MethodDescriptorProto extends Message {
    name: string;
    input_type: string;
    output_type: string;
    client_streaming: boolean;
    server_streaming: boolean;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class FileOptions extends Message {
    java_package: FieldValue;
    java_outer_classname: FieldValue;
    java_multiple_files: boolean;
    java_generate_equals_and_hash: FieldValue;
    java_string_check_utf8: boolean;
    optimize_for: FileOptions.OptimizeMode;
    go_package: FieldValue;
    cc_generic_services: boolean;
    java_generic_services: boolean;
    py_generic_services: boolean;
    php_generic_services: boolean;
    deprecated: boolean;
    cc_enable_arenas: boolean;
    objc_class_prefix: FieldValue;
    csharp_namespace: FieldValue;
    swift_prefix: FieldValue;
    php_class_prefix: FieldValue;
    php_namespace: FieldValue;
    php_metadata_namespace: FieldValue;
    ruby_package: FieldValue;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace FileOptions {
    export enum OptimizeMode {
        SPEED = 1,
        CODE_SIZE = 2,
        LITE_RUNTIME = 3,
    }
}

export class MessageOptions extends Message {
    message_set_wire_format: boolean;
    no_standard_descriptor_accessor: boolean;
    deprecated: boolean;
    map_entry: boolean;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class FieldOptions extends Message {
    ctype: FieldOptions.CType;
    packed: boolean;
    jstype: FieldOptions.JSType;
    lazy: boolean;
    weak: boolean;
    deprecated: boolean;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace FieldOptions {
    export enum CType {
        STRING = 0,
        CORD = 1,
        STRING_PIECE = 2,
    }

    export enum JSType {
        JS_NORMAL = 0,
        JS_STRING = 1,
        JS_NUMBER = 2,
    }
}

export class OneofOptions extends Message {
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class EnumOptions extends Message {
    allow_alias: FieldValue;
    deprecated: boolean;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class EnumValueOptions extends Message {
    deprecated: boolean;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class ServiceOptions extends Message {
    deprecated: boolean;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export class MethodOptions extends Message {
    deprecated: boolean;
    idempotency_level: MethodOptions.IdempotencyLevel;
    uninterpreted_option: UninterpretedOption[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace MethodOptions {
    export enum IdempotencyLevel {
        IDEMPOTENCY_UNKNOWN = 0,
        NO_SIDE_EFFECTS = 1,
        IDEMPOTENT = 2,
    }
}

export class UninterpretedOption extends Message {
    name: UninterpretedOption.NamePart[];
    identifier_value: FieldValue;
    positive_int_value: FieldValue;
    negative_int_value: FieldValue;
    double_value: FieldValue;
    string_value: FieldValue;
    aggregate_value: FieldValue;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace UninterpretedOption {
    export class NamePart extends Message {
        name_part: FieldValue;
        is_extension: FieldValue;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }
}

export class SourceCodeInfo extends Message {
    location: SourceCodeInfo.Location[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace SourceCodeInfo {
    export class Location extends Message {
        path: string;
        span: FieldValue;
        leading_comments: FieldValue;
        trailing_comments: FieldValue;
        leading_detached_comments: FieldValue;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }
}

export class GeneratedCodeInfo extends Message {
    location: GeneratedCodeInfo.Annotation[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;
}

export namespace GeneratedCodeInfo {
    export class Annotation extends Message {
        path: FieldValue;
        source_file: FieldValue;
        begin: FieldValue;
        end: FieldValue;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }
}