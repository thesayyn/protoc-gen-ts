/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/default/default_proto3.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./default_common";
import * as pb_1 from "google-protobuf";
export class DefaultMessageV3 extends pb_1.Message {
    #one_of_decls = [[22, 23]];
    constructor(data?: any[] | ({
        message?: dependency_1.DefaultCommonMessage;
        enum?: dependency_1.DefaultCommonEnum;
        bool?: boolean;
        string?: string;
        int32?: number;
        fixed32?: number;
        sfixed32?: number;
        uint32?: number;
        sint32?: number;
        int64?: number;
        fixed64?: number;
        sfixed64?: number;
        uint64?: number;
        sint64?: number;
        float?: number;
        double?: number;
        int_but_string?: string;
        map_string_string?: Map<string, string>;
        map_string_message?: Map<string, dependency_1.DefaultCommonMessage>;
        array_int32?: number[];
        array_message?: dependency_1.DefaultCommonMessage[];
        bytes?: Uint8Array;
    } & (({
        one_of_int32?: number;
        one_of_message?: never;
    } | {
        one_of_int32?: never;
        one_of_message?: dependency_1.DefaultCommonMessage;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [20, 21], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
            if ("enum" in data && data.enum != undefined) {
                this.enum = data.enum;
            }
            if ("bool" in data && data.bool != undefined) {
                this.bool = data.bool;
            }
            if ("string" in data && data.string != undefined) {
                this.string = data.string;
            }
            if ("int32" in data && data.int32 != undefined) {
                this.int32 = data.int32;
            }
            if ("fixed32" in data && data.fixed32 != undefined) {
                this.fixed32 = data.fixed32;
            }
            if ("sfixed32" in data && data.sfixed32 != undefined) {
                this.sfixed32 = data.sfixed32;
            }
            if ("uint32" in data && data.uint32 != undefined) {
                this.uint32 = data.uint32;
            }
            if ("sint32" in data && data.sint32 != undefined) {
                this.sint32 = data.sint32;
            }
            if ("int64" in data && data.int64 != undefined) {
                this.int64 = data.int64;
            }
            if ("fixed64" in data && data.fixed64 != undefined) {
                this.fixed64 = data.fixed64;
            }
            if ("sfixed64" in data && data.sfixed64 != undefined) {
                this.sfixed64 = data.sfixed64;
            }
            if ("uint64" in data && data.uint64 != undefined) {
                this.uint64 = data.uint64;
            }
            if ("sint64" in data && data.sint64 != undefined) {
                this.sint64 = data.sint64;
            }
            if ("float" in data && data.float != undefined) {
                this.float = data.float;
            }
            if ("double" in data && data.double != undefined) {
                this.double = data.double;
            }
            if ("int_but_string" in data && data.int_but_string != undefined) {
                this.int_but_string = data.int_but_string;
            }
            if ("map_string_string" in data && data.map_string_string != undefined) {
                this.map_string_string = data.map_string_string;
            }
            if ("map_string_message" in data && data.map_string_message != undefined) {
                this.map_string_message = data.map_string_message;
            }
            if ("array_int32" in data && data.array_int32 != undefined) {
                this.array_int32 = data.array_int32;
            }
            if ("array_message" in data && data.array_message != undefined) {
                this.array_message = data.array_message;
            }
            if ("one_of_int32" in data && data.one_of_int32 != undefined) {
                this.one_of_int32 = data.one_of_int32;
            }
            if ("one_of_message" in data && data.one_of_message != undefined) {
                this.one_of_message = data.one_of_message;
            }
            if ("bytes" in data && data.bytes != undefined) {
                this.bytes = data.bytes;
            }
        }
        if (!this.map_string_string)
            this.map_string_string = new Map();
        if (!this.map_string_message)
            this.map_string_message = new Map();
    }
    get message() {
        return pb_1.Message.getWrapperField(this, dependency_1.DefaultCommonMessage, 1) as dependency_1.DefaultCommonMessage;
    }
    set message(value: dependency_1.DefaultCommonMessage) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    clear_message() {
        this.message = undefined;
    }
    has_message() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get enum() {
        return pb_1.Message.getFieldWithDefault(this, 2, dependency_1.DefaultCommonEnum.ZERO) as dependency_1.DefaultCommonEnum;
    }
    set enum(value: dependency_1.DefaultCommonEnum) {
        pb_1.Message.setField(this, 2, value);
    }
    get bool() {
        return pb_1.Message.getFieldWithDefault(this, 3, false) as boolean;
    }
    set bool(value: boolean) {
        pb_1.Message.setField(this, 3, value);
    }
    get string() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set string(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get int32() {
        return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
    }
    set int32(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get fixed32() {
        return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
    }
    set fixed32(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    get sfixed32() {
        return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
    }
    set sfixed32(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    get uint32() {
        return pb_1.Message.getFieldWithDefault(this, 8, 0) as number;
    }
    set uint32(value: number) {
        pb_1.Message.setField(this, 8, value);
    }
    get sint32() {
        return pb_1.Message.getFieldWithDefault(this, 9, 0) as number;
    }
    set sint32(value: number) {
        pb_1.Message.setField(this, 9, value);
    }
    get int64() {
        return pb_1.Message.getFieldWithDefault(this, 10, 0) as number;
    }
    set int64(value: number) {
        pb_1.Message.setField(this, 10, value);
    }
    get fixed64() {
        return pb_1.Message.getFieldWithDefault(this, 11, 0) as number;
    }
    set fixed64(value: number) {
        pb_1.Message.setField(this, 11, value);
    }
    get sfixed64() {
        return pb_1.Message.getFieldWithDefault(this, 12, 0) as number;
    }
    set sfixed64(value: number) {
        pb_1.Message.setField(this, 12, value);
    }
    get uint64() {
        return pb_1.Message.getFieldWithDefault(this, 13, 0) as number;
    }
    set uint64(value: number) {
        pb_1.Message.setField(this, 13, value);
    }
    get sint64() {
        return pb_1.Message.getFieldWithDefault(this, 14, 0) as number;
    }
    set sint64(value: number) {
        pb_1.Message.setField(this, 14, value);
    }
    get float() {
        return pb_1.Message.getFieldWithDefault(this, 15, 0) as number;
    }
    set float(value: number) {
        pb_1.Message.setField(this, 15, value);
    }
    get double() {
        return pb_1.Message.getFieldWithDefault(this, 16, 0) as number;
    }
    set double(value: number) {
        pb_1.Message.setField(this, 16, value);
    }
    get int_but_string() {
        return pb_1.Message.getFieldWithDefault(this, 17, "") as string;
    }
    set int_but_string(value: string) {
        pb_1.Message.setField(this, 17, value);
    }
    get map_string_string() {
        return pb_1.Message.getField(this, 18) as any as Map<string, string>;
    }
    set map_string_string(value: Map<string, string>) {
        pb_1.Message.setField(this, 18, value as any);
    }
    get map_string_message() {
        return pb_1.Message.getField(this, 19) as any as Map<string, dependency_1.DefaultCommonMessage>;
    }
    set map_string_message(value: Map<string, dependency_1.DefaultCommonMessage>) {
        pb_1.Message.setField(this, 19, value as any);
    }
    get array_int32() {
        return pb_1.Message.getFieldWithDefault(this, 20, []) as number[];
    }
    set array_int32(value: number[]) {
        pb_1.Message.setField(this, 20, value);
    }
    get array_message() {
        return pb_1.Message.getRepeatedWrapperField(this, dependency_1.DefaultCommonMessage, 21) as dependency_1.DefaultCommonMessage[];
    }
    set array_message(value: dependency_1.DefaultCommonMessage[]) {
        pb_1.Message.setRepeatedWrapperField(this, 21, value);
    }
    get one_of_int32() {
        return pb_1.Message.getFieldWithDefault(this, 22, 0) as number;
    }
    set one_of_int32(value: number) {
        pb_1.Message.setOneofField(this, 22, this.#one_of_decls[0], value);
    }
    clear_one_of_int32() {
        pb_1.Message.setField(this, 22, undefined);
    }
    has_one_of_int32() {
        return pb_1.Message.getField(this, 22) != null;
    }
    get one_of_message() {
        return pb_1.Message.getWrapperField(this, dependency_1.DefaultCommonMessage, 23) as dependency_1.DefaultCommonMessage;
    }
    set one_of_message(value: dependency_1.DefaultCommonMessage) {
        pb_1.Message.setOneofWrapperField(this, 23, this.#one_of_decls[0], value);
    }
    clear_one_of_message() {
        this.one_of_message = undefined;
    }
    has_one_of_message() {
        return pb_1.Message.getField(this, 23) != null;
    }
    get bytes() {
        return pb_1.Message.getFieldWithDefault(this, 24, new Uint8Array()) as Uint8Array;
    }
    set bytes(value: Uint8Array) {
        pb_1.Message.setField(this, 24, value);
    }
    get one_of() {
        const cases: {
            [index: number]: "none" | "one_of_int32" | "one_of_message";
        } = {
            0: "none",
            22: "one_of_int32",
            23: "one_of_message"
        };
        return cases[pb_1.Message.computeOneofCase(this, [22, 23])];
    }
    static fromObject(data: {
        message?: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>;
        enum?: dependency_1.DefaultCommonEnum;
        bool?: boolean;
        string?: string;
        int32?: number;
        fixed32?: number;
        sfixed32?: number;
        uint32?: number;
        sint32?: number;
        int64?: number;
        fixed64?: number;
        sfixed64?: number;
        uint64?: number;
        sint64?: number;
        float?: number;
        double?: number;
        int_but_string?: string;
        map_string_string?: {
            [key: string]: string;
        };
        map_string_message?: {
            [key: string]: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>;
        };
        array_int32?: number[];
        array_message?: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>[];
        one_of_int32?: number;
        one_of_message?: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>;
        bytes?: Uint8Array;
    }) {
        const message = new DefaultMessageV3({});
        if (data.message != null) {
            message.message = dependency_1.DefaultCommonMessage.fromObject(data.message);
        }
        if (data.enum != null) {
            message.enum = data.enum;
        }
        if (data.bool != null) {
            message.bool = data.bool;
        }
        if (data.string != null) {
            message.string = data.string;
        }
        if (data.int32 != null) {
            message.int32 = data.int32;
        }
        if (data.fixed32 != null) {
            message.fixed32 = data.fixed32;
        }
        if (data.sfixed32 != null) {
            message.sfixed32 = data.sfixed32;
        }
        if (data.uint32 != null) {
            message.uint32 = data.uint32;
        }
        if (data.sint32 != null) {
            message.sint32 = data.sint32;
        }
        if (data.int64 != null) {
            message.int64 = data.int64;
        }
        if (data.fixed64 != null) {
            message.fixed64 = data.fixed64;
        }
        if (data.sfixed64 != null) {
            message.sfixed64 = data.sfixed64;
        }
        if (data.uint64 != null) {
            message.uint64 = data.uint64;
        }
        if (data.sint64 != null) {
            message.sint64 = data.sint64;
        }
        if (data.float != null) {
            message.float = data.float;
        }
        if (data.double != null) {
            message.double = data.double;
        }
        if (data.int_but_string != null) {
            message.int_but_string = data.int_but_string;
        }
        if (typeof data.map_string_string == "object") {
            message.map_string_string = new Map(Object.entries(data.map_string_string));
        }
        if (typeof data.map_string_message == "object") {
            message.map_string_message = new Map(Object.entries(data.map_string_message).map(([key, value]) => [key, dependency_1.DefaultCommonMessage.fromObject(value)]));
        }
        if (data.array_int32 != null) {
            message.array_int32 = data.array_int32;
        }
        if (data.array_message != null) {
            message.array_message = data.array_message.map(item => dependency_1.DefaultCommonMessage.fromObject(item));
        }
        if (data.one_of_int32 != null) {
            message.one_of_int32 = data.one_of_int32;
        }
        if (data.one_of_message != null) {
            message.one_of_message = dependency_1.DefaultCommonMessage.fromObject(data.one_of_message);
        }
        if (data.bytes != null) {
            message.bytes = data.bytes;
        }
        return message;
    }
    toObject() {
        const data: {
            message?: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>;
            enum?: dependency_1.DefaultCommonEnum;
            bool?: boolean;
            string?: string;
            int32?: number;
            fixed32?: number;
            sfixed32?: number;
            uint32?: number;
            sint32?: number;
            int64?: number;
            fixed64?: number;
            sfixed64?: number;
            uint64?: number;
            sint64?: number;
            float?: number;
            double?: number;
            int_but_string?: string;
            map_string_string?: {
                [key: string]: string;
            };
            map_string_message?: {
                [key: string]: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>;
            };
            array_int32?: number[];
            array_message?: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>[];
            one_of_int32?: number;
            one_of_message?: ReturnType<typeof dependency_1.DefaultCommonMessage.prototype.toObject>;
            bytes?: Uint8Array;
        } = {
            message: this.message != null ? this.message.toObject() : undefined,
            enum: this.enum,
            bool: this.bool,
            string: this.string,
            int32: this.int32,
            fixed32: this.fixed32,
            sfixed32: this.sfixed32,
            uint32: this.uint32,
            sint32: this.sint32,
            int64: this.int64,
            fixed64: this.fixed64,
            sfixed64: this.sfixed64,
            uint64: this.uint64,
            sint64: this.sint64,
            float: this.float,
            double: this.double,
            int_but_string: this.int_but_string,
            map_string_string: Object.fromEntries(this.map_string_string),
            map_string_message: Object.fromEntries(Array.from(this.map_string_message).map(([key, value]) => [key, value.toObject()])),
            array_int32: this.array_int32,
            array_message: this.array_message.map((item: dependency_1.DefaultCommonMessage) => item.toObject()),
            one_of_int32: this.one_of_int32,
            one_of_message: this.one_of_message != null ? this.one_of_message.toObject() : undefined,
            bytes: this.bytes
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (pb_1.Message.getField(this, 1) != null)
            writer.writeMessage(1, this.message, () => this.message.serialize(writer));
        if (pb_1.Message.getField(this, 2) != null)
            writer.writeEnum(2, this.enum);
        if (pb_1.Message.getField(this, 3) != null)
            writer.writeBool(3, this.bool);
        if (typeof this.string === "string" && this.string.length)
            writer.writeString(4, this.string);
        if (pb_1.Message.getField(this, 5) != null)
            writer.writeInt32(5, this.int32);
        if (pb_1.Message.getField(this, 6) != null)
            writer.writeFixed32(6, this.fixed32);
        if (pb_1.Message.getField(this, 7) != null)
            writer.writeSfixed32(7, this.sfixed32);
        if (pb_1.Message.getField(this, 8) != null)
            writer.writeUint32(8, this.uint32);
        if (pb_1.Message.getField(this, 9) != null)
            writer.writeSint32(9, this.sint32);
        if (pb_1.Message.getField(this, 10) != null)
            writer.writeInt64(10, this.int64);
        if (pb_1.Message.getField(this, 11) != null)
            writer.writeFixed64(11, this.fixed64);
        if (pb_1.Message.getField(this, 12) != null)
            writer.writeSfixed64(12, this.sfixed64);
        if (pb_1.Message.getField(this, 13) != null)
            writer.writeUint64(13, this.uint64);
        if (pb_1.Message.getField(this, 14) != null)
            writer.writeSint64(14, this.sint64);
        if (pb_1.Message.getField(this, 15) != null)
            writer.writeFloat(15, this.float);
        if (pb_1.Message.getField(this, 16) != null)
            writer.writeDouble(16, this.double);
        if (pb_1.Message.getField(this, 17) != null)
            writer.writeInt64String(17, this.int_but_string);
        for (const [key, value] of this.map_string_string) {
            writer.writeMessage(18, this.map_string_string, () => {
                writer.writeString(1, key);
                writer.writeString(2, value);
            });
        }
        for (const [key, value] of this.map_string_message) {
            writer.writeMessage(19, this.map_string_message, () => {
                writer.writeString(1, key);
                writer.writeMessage(2, value, () => value.serialize(writer));
            });
        }
        if (this.array_int32.length)
            writer.writePackedInt32(20, this.array_int32);
        if (this.array_message.length)
            writer.writeRepeatedMessage(21, this.array_message, (item: dependency_1.DefaultCommonMessage) => item.serialize(writer));
        if (pb_1.Message.getField(this, 22) != null)
            writer.writeInt32(22, this.one_of_int32);
        if (pb_1.Message.getField(this, 23) != null)
            writer.writeMessage(23, this.one_of_message, () => this.one_of_message.serialize(writer));
        if (pb_1.Message.getField(this, 24) != null)
            writer.writeBytes(24, this.bytes);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DefaultMessageV3 {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new DefaultMessageV3();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.message, () => message.message = dependency_1.DefaultCommonMessage.deserialize(reader));
                    break;
                case 2:
                    message.enum = reader.readEnum();
                    break;
                case 3:
                    message.bool = reader.readBool();
                    break;
                case 4:
                    message.string = reader.readString();
                    break;
                case 5:
                    message.int32 = reader.readInt32();
                    break;
                case 6:
                    message.fixed32 = reader.readFixed32();
                    break;
                case 7:
                    message.sfixed32 = reader.readSfixed32();
                    break;
                case 8:
                    message.uint32 = reader.readUint32();
                    break;
                case 9:
                    message.sint32 = reader.readSint32();
                    break;
                case 10:
                    message.int64 = reader.readInt64();
                    break;
                case 11:
                    message.fixed64 = reader.readFixed64();
                    break;
                case 12:
                    message.sfixed64 = reader.readSfixed64();
                    break;
                case 13:
                    message.uint64 = reader.readUint64();
                    break;
                case 14:
                    message.sint64 = reader.readSint64();
                    break;
                case 15:
                    message.float = reader.readFloat();
                    break;
                case 16:
                    message.double = reader.readDouble();
                    break;
                case 17:
                    message.int_but_string = reader.readInt64String();
                    break;
                case 18:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.map_string_string as any, reader, reader.readString, reader.readString));
                    break;
                case 19:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.map_string_message as any, reader, reader.readString, () => {
                        let value;
                        reader.readMessage(message, () => value = dependency_1.DefaultCommonMessage.deserialize(reader));
                        return value;
                    }));
                    break;
                case 20:
                    message.array_int32 = reader.readPackedInt32();
                    break;
                case 21:
                    reader.readMessage(message.array_message, () => pb_1.Message.addToRepeatedWrapperField(message, 21, dependency_1.DefaultCommonMessage.deserialize(reader), dependency_1.DefaultCommonMessage));
                    break;
                case 22:
                    message.one_of_int32 = reader.readInt32();
                    break;
                case 23:
                    reader.readMessage(message.one_of_message, () => message.one_of_message = dependency_1.DefaultCommonMessage.deserialize(reader));
                    break;
                case 24:
                    message.bytes = reader.readBytes();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): DefaultMessageV3 {
        return DefaultMessageV3.deserialize(bytes);
    }
}
