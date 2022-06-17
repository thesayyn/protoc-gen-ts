/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/optional/optional_proto2.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class NotOptional extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        should_be_required: string[];
        should_be_optional?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            this.should_be_required = data.should_be_required;
            if ("should_be_optional" in data && data.should_be_optional != undefined) {
                this.should_be_optional = data.should_be_optional;
            }
        }
    }
    get should_be_required() {
        return pb_1.Message.getFieldWithDefault(this, 1, []) as string[];
    }
    set should_be_required(value: string[]) {
        pb_1.Message.setField(this, 1, value);
    }
    get should_be_optional() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set should_be_optional(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    clear_should_be_optional() {
        pb_1.Message.setField(this, 2, undefined);
    }
    has_should_be_optional() {
        return pb_1.Message.getField(this, 2) != null;
    }
    static fromObject(data: {
        should_be_required: string[];
        should_be_optional?: string;
    }): NotOptional {
        const message = new NotOptional({
            should_be_required: data.should_be_required
        });
        if (data.should_be_optional != null) {
            message.should_be_optional = data.should_be_optional;
        }
        return message;
    }
    toObject() {
        const data: {
            should_be_required: string[];
            should_be_optional?: string;
        } = {
            should_be_required: this.should_be_required
        };
        if (this.should_be_optional != null) {
            data.should_be_optional = this.should_be_optional;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.should_be_required.length)
            writer.writeRepeatedString(1, this.should_be_required);
        if (this.has_should_be_optional() && this.should_be_optional.length)
            writer.writeString(2, this.should_be_optional);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): NotOptional {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new NotOptional();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    pb_1.Message.addToRepeatedField(message, 1, reader.readString());
                    break;
                case 2:
                    message.should_be_optional = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): NotOptional {
        return NotOptional.deserialize(bytes);
    }
}
