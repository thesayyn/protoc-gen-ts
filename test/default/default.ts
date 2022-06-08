/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/default/default.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class MessageWithDefault extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        bool_field?: boolean;
        string_field?: string;
        int32_field?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("bool_field" in data && data.bool_field != undefined) {
                this.bool_field = data.bool_field;
            }
            if ("string_field" in data && data.string_field != undefined) {
                this.string_field = data.string_field;
            }
            if ("int32_field" in data && data.int32_field != undefined) {
                this.int32_field = data.int32_field;
            }
        }
    }
    get bool_field() {
        return pb_1.Message.getFieldWithDefault(this, 1, true) as boolean;
    }
    set bool_field(value: boolean) {
        pb_1.Message.setField(this, 1, value);
    }
    get string_field() {
        return pb_1.Message.getFieldWithDefault(this, 2, "default value") as string;
    }
    set string_field(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get int32_field() {
        return pb_1.Message.getFieldWithDefault(this, 3, 12) as number;
    }
    set int32_field(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    static fromObject(data: {
        bool_field?: boolean;
        string_field?: string;
        int32_field?: number;
    }): MessageWithDefault {
        const message = new MessageWithDefault({});
        if (data.bool_field != null) {
            message.bool_field = data.bool_field;
        }
        if (data.string_field != null) {
            message.string_field = data.string_field;
        }
        if (data.int32_field != null) {
            message.int32_field = data.int32_field;
        }
        return message;
    }
    toObject() {
        const data: {
            bool_field?: boolean;
            string_field?: string;
            int32_field?: number;
        } = {
            bool_field: this.bool_field,
            string_field: this.string_field,
            int32_field: this.int32_field
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (pb_1.Message.getField(this, 1) != null)
            writer.writeBool(1, this.bool_field);
        if (typeof this.string_field === "string" && this.string_field.length)
            writer.writeString(2, this.string_field);
        if (pb_1.Message.getField(this, 3) != null)
            writer.writeInt32(3, this.int32_field);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MessageWithDefault {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MessageWithDefault();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.bool_field = reader.readBool();
                    break;
                case 2:
                    message.string_field = reader.readString();
                    break;
                case 3:
                    message.int32_field = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): MessageWithDefault {
        return MessageWithDefault.deserialize(bytes);
    }
}
