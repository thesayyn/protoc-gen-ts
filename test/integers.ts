/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/integers.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class Integers extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        int32?: number;
        int64?: number;
        sint32?: number;
        sint64?: number;
        sfixed32?: number;
        sfixed64?: number;
        fixed32?: number;
        fixed64?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("int32" in data && data.int32 != undefined) {
                this.int32 = data.int32;
            }
            if ("int64" in data && data.int64 != undefined) {
                this.int64 = data.int64;
            }
            if ("sint32" in data && data.sint32 != undefined) {
                this.sint32 = data.sint32;
            }
            if ("sint64" in data && data.sint64 != undefined) {
                this.sint64 = data.sint64;
            }
            if ("sfixed32" in data && data.sfixed32 != undefined) {
                this.sfixed32 = data.sfixed32;
            }
            if ("sfixed64" in data && data.sfixed64 != undefined) {
                this.sfixed64 = data.sfixed64;
            }
            if ("fixed32" in data && data.fixed32 != undefined) {
                this.fixed32 = data.fixed32;
            }
            if ("fixed64" in data && data.fixed64 != undefined) {
                this.fixed64 = data.fixed64;
            }
        }
    }
    get int32() {
        return pb_1.Message.getField(this, 2) as number;
    }
    set int32(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get int64() {
        return pb_1.Message.getField(this, 3) as number;
    }
    set int64(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get sint32() {
        return pb_1.Message.getField(this, 4) as number;
    }
    set sint32(value: number) {
        pb_1.Message.setField(this, 4, value);
    }
    get sint64() {
        return pb_1.Message.getField(this, 5) as number;
    }
    set sint64(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get sfixed32() {
        return pb_1.Message.getField(this, 6) as number;
    }
    set sfixed32(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    get sfixed64() {
        return pb_1.Message.getField(this, 7) as number;
    }
    set sfixed64(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    get fixed32() {
        return pb_1.Message.getField(this, 8) as number;
    }
    set fixed32(value: number) {
        pb_1.Message.setField(this, 8, value);
    }
    get fixed64() {
        return pb_1.Message.getField(this, 9) as number;
    }
    set fixed64(value: number) {
        pb_1.Message.setField(this, 9, value);
    }
    static fromObject(data: {
        int32?: number;
        int64?: number;
        sint32?: number;
        sint64?: number;
        sfixed32?: number;
        sfixed64?: number;
        fixed32?: number;
        fixed64?: number;
    }) {
        const message = new Integers({});
        if (data.int32 != null) {
            message.int32 = data.int32;
        }
        if (data.int64 != null) {
            message.int64 = data.int64;
        }
        if (data.sint32 != null) {
            message.sint32 = data.sint32;
        }
        if (data.sint64 != null) {
            message.sint64 = data.sint64;
        }
        if (data.sfixed32 != null) {
            message.sfixed32 = data.sfixed32;
        }
        if (data.sfixed64 != null) {
            message.sfixed64 = data.sfixed64;
        }
        if (data.fixed32 != null) {
            message.fixed32 = data.fixed32;
        }
        if (data.fixed64 != null) {
            message.fixed64 = data.fixed64;
        }
        return message;
    }
    toObject() {
        const data: {
            int32?: number;
            int64?: number;
            sint32?: number;
            sint64?: number;
            sfixed32?: number;
            sfixed64?: number;
            fixed32?: number;
            fixed64?: number;
        } = {};
        if (this.int32 != null) {
            data.int32 = this.int32;
        }
        if (this.int64 != null) {
            data.int64 = this.int64;
        }
        if (this.sint32 != null) {
            data.sint32 = this.sint32;
        }
        if (this.sint64 != null) {
            data.sint64 = this.sint64;
        }
        if (this.sfixed32 != null) {
            data.sfixed32 = this.sfixed32;
        }
        if (this.sfixed64 != null) {
            data.sfixed64 = this.sfixed64;
        }
        if (this.fixed32 != null) {
            data.fixed32 = this.fixed32;
        }
        if (this.fixed64 != null) {
            data.fixed64 = this.fixed64;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.int32 !== undefined)
            writer.writeInt32(2, this.int32);
        if (this.int64 !== undefined)
            writer.writeInt64(3, this.int64);
        if (this.sint32 !== undefined)
            writer.writeSint32(4, this.sint32);
        if (this.sint64 !== undefined)
            writer.writeSint64(5, this.sint64);
        if (this.sfixed32 !== undefined)
            writer.writeSfixed32(6, this.sfixed32);
        if (this.sfixed64 !== undefined)
            writer.writeSfixed64(7, this.sfixed64);
        if (this.fixed32 !== undefined)
            writer.writeFixed32(8, this.fixed32);
        if (this.fixed64 !== undefined)
            writer.writeFixed64(9, this.fixed64);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Integers {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Integers();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 2:
                    message.int32 = reader.readInt32();
                    break;
                case 3:
                    message.int64 = reader.readInt64();
                    break;
                case 4:
                    message.sint32 = reader.readSint32();
                    break;
                case 5:
                    message.sint64 = reader.readSint64();
                    break;
                case 6:
                    message.sfixed32 = reader.readSfixed32();
                    break;
                case 7:
                    message.sfixed64 = reader.readSfixed64();
                    break;
                case 8:
                    message.fixed32 = reader.readFixed32();
                    break;
                case 9:
                    message.fixed64 = reader.readFixed64();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Integers {
        return Integers.deserialize(bytes);
    }
}
