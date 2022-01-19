import { BinaryWriter, Message } from 'google-protobuf';
import { FileDescriptorProto, GeneratedCodeInfo } from './descriptor.js';

export class Version extends Message {
    constructor(data: any);

    major: number;
    minor: number;
    patch: number;
    suffix: string;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;

    static deserialize(bytes: Uint8Array): Version;
    static deserializeBinary(bytes: Uint8Array): Version;
}

export class CodeGeneratorRequest extends Message {
    constructor(data: any);

    file_to_generate: string;
    parameter: string;
    proto_file: FileDescriptorProto[];
    compiler_version: Version;
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;

    static deserialize(bytes: Uint8Array): CodeGeneratorRequest;
    static deserializeBinary(bytes: Uint8Array): CodeGeneratorRequest;
}

export class CodeGeneratorResponse extends Message {
    constructor(data: any);

    error: string;
    supported_features: string;
    file: CodeGeneratorResponse.File[];
    toObject(): object;
    serialize(w?: BinaryWriter): Uint8Array;
    serializeBinary(): Uint8Array;

    static deserialize(bytes: Uint8Array): CodeGeneratorResponse;
    static deserializeBinary(bytes: Uint8Array): CodeGeneratorResponse;
}

export namespace CodeGeneratorResponse {
    export enum Feature {
        FEATURE_NONE = 0,
        FEATURE_PROTO3_OPTIONAL = 1,
    }

    export class File extends Message {
        constructor(data: any);

        name: string;
        insertion_point: any;
        content: string;
        generated_code_info: GeneratedCodeInfo;
        toObject(): object;
        serialize(w?: BinaryWriter): Uint8Array;
        serializeBinary(): Uint8Array;
    }
}