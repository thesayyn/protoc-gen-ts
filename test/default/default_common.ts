/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/default/default_common.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export enum DefaultCommonEnum {
    ZERO = 0,
    ONE = 1,
    TWO = 2
}
export class DefaultCommonMessage extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        message?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
        }
    }
    get message() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set message(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    static fromObject(data: {
        message?: string;
    }) {
        const message = new DefaultCommonMessage({});
        if (data.message != null) {
            message.message = data.message;
        }
        return message;
    }
    toObject() {
        const data: {
            message?: string;
        } = {
            message: this.message
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.message === "string" && this.message.length)
            writer.writeString(1, this.message);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DefaultCommonMessage {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new DefaultCommonMessage();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.message = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): DefaultCommonMessage {
        return DefaultCommonMessage.deserialize(bytes);
    }
}
export class DefaultCommonMessageOneOf extends pb_1.Message {
    #one_of_decls = [[1, 2]];
    constructor(data?: any[] | ({} & (({
        int32?: number;
        message?: never;
    } | {
        int32?: never;
        message?: DefaultCommonMessage;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("int32" in data && data.int32 != undefined) {
                this.int32 = data.int32;
            }
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
        }
    }
    get int32() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set int32(value: number) {
        pb_1.Message.setOneofField(this, 1, this.#one_of_decls[0], value);
    }
    clear_int32() {
        pb_1.Message.setField(this, 1, undefined);
    }
    has_int32() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get message() {
        return pb_1.Message.getWrapperField(this, DefaultCommonMessage, 2) as DefaultCommonMessage;
    }
    set message(value: DefaultCommonMessage) {
        pb_1.Message.setOneofWrapperField(this, 2, this.#one_of_decls[0], value);
    }
    clear_message() {
        this.message = undefined;
    }
    has_message() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get oneof() {
        const cases: {
            [index: number]: "none" | "int32" | "message";
        } = {
            0: "none",
            1: "int32",
            2: "message"
        };
        return cases[pb_1.Message.computeOneofCase(this, [1, 2])];
    }
    static fromObject(data: {
        int32?: number;
        message?: ReturnType<typeof DefaultCommonMessage.prototype.toObject>;
    }) {
        const message = new DefaultCommonMessageOneOf({});
        if (data.int32 != null) {
            message.int32 = data.int32;
        }
        if (data.message != null) {
            message.message = DefaultCommonMessage.fromObject(data.message);
        }
        return message;
    }
    toObject() {
        const data: {
            int32?: number;
            message?: ReturnType<typeof DefaultCommonMessage.prototype.toObject>;
        } = {
            int32: this.int32,
            message: this.message != null ? this.message.toObject() : undefined
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (pb_1.Message.getField(this, 1) != null)
            writer.writeInt32(1, this.int32);
        if (pb_1.Message.getField(this, 2) != null)
            writer.writeMessage(2, this.message, () => this.message.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DefaultCommonMessageOneOf {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new DefaultCommonMessageOneOf();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.int32 = reader.readInt32();
                    break;
                case 2:
                    reader.readMessage(message.message, () => message.message = DefaultCommonMessage.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): DefaultCommonMessageOneOf {
        return DefaultCommonMessageOneOf.deserialize(bytes);
    }
}
