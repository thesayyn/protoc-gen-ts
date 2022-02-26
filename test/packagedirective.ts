/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/packagedirective.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace pkg.mycompany {
    export class Message extends pb_1.Message {
        constructor(data?: any[] | {
            field?: string[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], []);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("field" in data && data.field != undefined) {
                    this.field = data.field;
                }
            }
        }
        get field() {
            return pb_1.Message.getFieldWithDefault(this, 1, []) as string[];
        }
        set field(value: string[]) {
            pb_1.Message.setField(this, 1, value);
        }
        static fromObject(data: {
            field?: string[];
        }) {
            const message = new Message({});
            if (data.field != null) {
                message.field = data.field;
            }
            return message;
        }
        toObject() {
            const data: {
                field?: string[];
            } = {
                field: this.field
            };
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.field.length)
                writer.writeRepeatedString(1, this.field);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Message {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Message();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        pb_1.Message.addToRepeatedField(message, 1, reader.readString());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Message {
            return Message.deserialize(bytes);
        }
    }
}
