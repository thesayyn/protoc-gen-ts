/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/messagefields.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class MessageFields extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        sub_message?: SubMessage;
        array_prop?: SubMessage[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("sub_message" in data && data.sub_message != undefined) {
                this.sub_message = data.sub_message;
            }
            if ("array_prop" in data && data.array_prop != undefined) {
                this.array_prop = data.array_prop;
            }
        }
    }
    get sub_message() {
        return pb_1.Message.getWrapperField(this, SubMessage, 1) as SubMessage;
    }
    set sub_message(value: SubMessage) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    clear_sub_message() {
        this.sub_message = undefined;
    }
    has_sub_message() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get array_prop() {
        return pb_1.Message.getRepeatedWrapperField(this, SubMessage, 2) as SubMessage[];
    }
    set array_prop(value: SubMessage[]) {
        pb_1.Message.setRepeatedWrapperField(this, 2, value);
    }
    static fromObject(data: {
        sub_message?: ReturnType<typeof SubMessage.prototype.toObject>;
        array_prop?: ReturnType<typeof SubMessage.prototype.toObject>[];
    }) {
        const message = new MessageFields({});
        if (data.sub_message != null) {
            message.sub_message = SubMessage.fromObject(data.sub_message);
        }
        if (data.array_prop != null) {
            message.array_prop = data.array_prop.map(item => SubMessage.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            sub_message?: ReturnType<typeof SubMessage.prototype.toObject>;
            array_prop?: ReturnType<typeof SubMessage.prototype.toObject>[];
        } = {
            sub_message: this.sub_message != null ? this.sub_message.toObject() : undefined,
            array_prop: this.array_prop.map((item: SubMessage) => item.toObject())
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (pb_1.Message.getField(this, 1) != null)
            writer.writeMessage(1, this.sub_message, () => this.sub_message.serialize(writer));
        if (this.array_prop.length)
            writer.writeRepeatedMessage(2, this.array_prop, (item: SubMessage) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MessageFields {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MessageFields();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.sub_message, () => message.sub_message = SubMessage.deserialize(reader));
                    break;
                case 2:
                    reader.readMessage(message.array_prop, () => pb_1.Message.addToRepeatedWrapperField(message, 2, SubMessage.deserialize(reader), SubMessage));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): MessageFields {
        return MessageFields.deserialize(bytes);
    }
}
export class SubMessage extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        field_1?: string;
        field_2?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("field_1" in data && data.field_1 != undefined) {
                this.field_1 = data.field_1;
            }
            if ("field_2" in data && data.field_2 != undefined) {
                this.field_2 = data.field_2;
            }
        }
    }
    get field_1() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set field_1(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get field_2() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set field_2(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        field_1?: string;
        field_2?: string;
    }) {
        const message = new SubMessage({});
        if (data.field_1 != null) {
            message.field_1 = data.field_1;
        }
        if (data.field_2 != null) {
            message.field_2 = data.field_2;
        }
        return message;
    }
    toObject() {
        const data: {
            field_1?: string;
            field_2?: string;
        } = {
            field_1: this.field_1,
            field_2: this.field_2
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.field_1 === "string" && this.field_1.length)
            writer.writeString(1, this.field_1);
        if (typeof this.field_2 === "string" && this.field_2.length)
            writer.writeString(2, this.field_2);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SubMessage {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SubMessage();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.field_1 = reader.readString();
                    break;
                case 2:
                    message.field_2 = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SubMessage {
        return SubMessage.deserialize(bytes);
    }
}
