"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGeneratorResponse = exports.CodeGeneratorRequest = exports.Version = void 0;
const dep_1 = require("./descriptor");
const pb_1 = require("google-protobuf");
class Version extends pb_1.Message {
    constructor(data) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
        if (!Array.isArray(data) && typeof data == "object") {
            this.major = data.major;
            this.minor = data.minor;
            this.patch = data.patch;
            this.suffix = data.suffix;
        }
    }
    get major() {
        return pb_1.Message.getField(this, 1);
    }
    set major(value) {
        pb_1.Message.setField(this, 1, value);
    }
    get minor() {
        return pb_1.Message.getField(this, 2);
    }
    set minor(value) {
        pb_1.Message.setField(this, 2, value);
    }
    get patch() {
        return pb_1.Message.getField(this, 3);
    }
    set patch(value) {
        pb_1.Message.setField(this, 3, value);
    }
    get suffix() {
        return pb_1.Message.getField(this, 4);
    }
    set suffix(value) {
        pb_1.Message.setField(this, 4, value);
    }
    toObject() {
        return {
            major: this.major,
            minor: this.minor,
            patch: this.patch,
            suffix: this.suffix
        };
    }
    serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.major !== undefined)
            writer.writeInt32(1, this.major);
        if (this.minor !== undefined)
            writer.writeInt32(2, this.minor);
        if (this.patch !== undefined)
            writer.writeInt32(3, this.patch);
        if (typeof this.suffix === "string" && this.suffix.length)
            writer.writeString(4, this.suffix);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes) {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Version();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.major = reader.readInt32();
                    break;
                case 2:
                    message.minor = reader.readInt32();
                    break;
                case 3:
                    message.patch = reader.readInt32();
                    break;
                case 4:
                    message.suffix = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary() {
        return this.serialize();
    }
    static deserializeBinary(bytes) {
        return Version.deserialize(bytes);
    }
}
exports.Version = Version;
class CodeGeneratorRequest extends pb_1.Message {
    constructor(data) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [1, 15], null);
        if (!Array.isArray(data) && typeof data == "object") {
            this.file_to_generate = data.file_to_generate;
            this.parameter = data.parameter;
            this.proto_file = data.proto_file;
            this.compiler_version = data.compiler_version;
        }
    }
    get file_to_generate() {
        return pb_1.Message.getField(this, 1);
    }
    set file_to_generate(value) {
        pb_1.Message.setField(this, 1, value);
    }
    get parameter() {
        return pb_1.Message.getField(this, 2);
    }
    set parameter(value) {
        pb_1.Message.setField(this, 2, value);
    }
    get proto_file() {
        return pb_1.Message.getRepeatedWrapperField(this, dep_1.FileDescriptorProto, 15);
    }
    set proto_file(value) {
        pb_1.Message.setRepeatedWrapperField(this, 15, value);
    }
    get compiler_version() {
        return pb_1.Message.getWrapperField(this, Version, 3);
    }
    set compiler_version(value) {
        pb_1.Message.setWrapperField(this, 3, value);
    }
    toObject() {
        return {
            file_to_generate: this.file_to_generate,
            parameter: this.parameter,
            proto_file: this.proto_file.map((item) => item.toObject()),
            compiler_version: this.compiler_version && this.compiler_version.toObject()
        };
    }
    serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.file_to_generate !== undefined)
            writer.writeRepeatedString(1, this.file_to_generate);
        if (typeof this.parameter === "string" && this.parameter.length)
            writer.writeString(2, this.parameter);
        if (this.proto_file !== undefined)
            writer.writeRepeatedMessage(15, this.proto_file, (item) => item.serialize(writer));
        if (this.compiler_version !== undefined)
            writer.writeMessage(3, this.compiler_version, () => this.compiler_version.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes) {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CodeGeneratorRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    pb_1.Message.addToRepeatedField(message, 1, reader.readString());
                    break;
                case 2:
                    message.parameter = reader.readString();
                    break;
                case 15:
                    reader.readMessage(message.proto_file, () => pb_1.Message.addToRepeatedWrapperField(message, 15, dep_1.FileDescriptorProto.deserialize(reader), dep_1.FileDescriptorProto));
                    break;
                case 3:
                    reader.readMessage(message.compiler_version, () => message.compiler_version = Version.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary() {
        return this.serialize();
    }
    static deserializeBinary(bytes) {
        return CodeGeneratorRequest.deserialize(bytes);
    }
}
exports.CodeGeneratorRequest = CodeGeneratorRequest;
class CodeGeneratorResponse extends pb_1.Message {
    constructor(data) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [15], null);
        if (!Array.isArray(data) && typeof data == "object") {
            this.error = data.error;
            this.supported_features = data.supported_features;
            this.file = data.file;
        }
    }
    get error() {
        return pb_1.Message.getField(this, 1);
    }
    set error(value) {
        pb_1.Message.setField(this, 1, value);
    }
    get supported_features() {
        return pb_1.Message.getField(this, 2);
    }
    set supported_features(value) {
        pb_1.Message.setField(this, 2, value);
    }
    get file() {
        return pb_1.Message.getRepeatedWrapperField(this, CodeGeneratorResponse.File, 15);
    }
    set file(value) {
        pb_1.Message.setRepeatedWrapperField(this, 15, value);
    }
    toObject() {
        return {
            error: this.error,
            supported_features: this.supported_features,
            file: this.file.map((item) => item.toObject())
        };
    }
    serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.error === "string" && this.error.length)
            writer.writeString(1, this.error);
        if (this.supported_features !== undefined)
            writer.writeUint64(2, this.supported_features);
        if (this.file !== undefined)
            writer.writeRepeatedMessage(15, this.file, (item) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes) {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CodeGeneratorResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.error = reader.readString();
                    break;
                case 2:
                    message.supported_features = reader.readUint64();
                    break;
                case 15:
                    reader.readMessage(message.file, () => pb_1.Message.addToRepeatedWrapperField(message, 15, CodeGeneratorResponse.File.deserialize(reader), CodeGeneratorResponse.File));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary() {
        return this.serialize();
    }
    static deserializeBinary(bytes) {
        return CodeGeneratorResponse.deserialize(bytes);
    }
}
exports.CodeGeneratorResponse = CodeGeneratorResponse;
(function (CodeGeneratorResponse) {
    let Feature;
    (function (Feature) {
        Feature[Feature["FEATURE_NONE"] = 0] = "FEATURE_NONE";
        Feature[Feature["FEATURE_PROTO3_OPTIONAL"] = 1] = "FEATURE_PROTO3_OPTIONAL";
    })(Feature = CodeGeneratorResponse.Feature || (CodeGeneratorResponse.Feature = {}));
    class File extends pb_1.Message {
        constructor(data) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.name = data.name;
                this.insertion_point = data.insertion_point;
                this.content = data.content;
                this.generated_code_info = data.generated_code_info;
            }
        }
        get name() {
            return pb_1.Message.getField(this, 1);
        }
        set name(value) {
            pb_1.Message.setField(this, 1, value);
        }
        get insertion_point() {
            return pb_1.Message.getField(this, 2);
        }
        set insertion_point(value) {
            pb_1.Message.setField(this, 2, value);
        }
        get content() {
            return pb_1.Message.getField(this, 15);
        }
        set content(value) {
            pb_1.Message.setField(this, 15, value);
        }
        get generated_code_info() {
            return pb_1.Message.getWrapperField(this, dep_1.GeneratedCodeInfo, 16);
        }
        set generated_code_info(value) {
            pb_1.Message.setWrapperField(this, 16, value);
        }
        toObject() {
            return {
                name: this.name,
                insertion_point: this.insertion_point,
                content: this.content,
                generated_code_info: this.generated_code_info && this.generated_code_info.toObject()
            };
        }
        serialize(w) {
            const writer = w || new pb_1.BinaryWriter();
            if (typeof this.name === "string" && this.name.length)
                writer.writeString(1, this.name);
            if (typeof this.insertion_point === "string" && this.insertion_point.length)
                writer.writeString(2, this.insertion_point);
            if (typeof this.content === "string" && this.content.length)
                writer.writeString(15, this.content);
            if (this.generated_code_info !== undefined)
                writer.writeMessage(16, this.generated_code_info, () => this.generated_code_info.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes) {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new File();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.name = reader.readString();
                        break;
                    case 2:
                        message.insertion_point = reader.readString();
                        break;
                    case 15:
                        message.content = reader.readString();
                        break;
                    case 16:
                        reader.readMessage(message.generated_code_info, () => message.generated_code_info = dep_1.GeneratedCodeInfo.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary() {
            return this.serialize();
        }
        static deserializeBinary(bytes) {
            return File.deserialize(bytes);
        }
    }
    CodeGeneratorResponse.File = File;
})(CodeGeneratorResponse = exports.CodeGeneratorResponse || (exports.CodeGeneratorResponse = {}));
