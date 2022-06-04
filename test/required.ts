/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/required.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class NoOptionalValues extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        test: string;
        test2: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            this.test = data.test;
            this.test2 = data.test2;
        }
    }
    get test() {
        return pb_1.Message.getField(this, 1) as string;
    }
    set test(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get test2() {
        return pb_1.Message.getField(this, 2) as string;
    }
    set test2(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        test: string;
        test2: string;
    }) {
        const message = new NoOptionalValues({
            test: data.test,
            test2: data.test2
        });
        return message;
    }
    toObject() {
        const data: {
            test: string;
            test2: string;
        } = {
            test: this.test,
            test2: this.test2
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.test === "string" && this.test.length)
            writer.writeString(1, this.test);
        if (typeof this.test2 === "string" && this.test2.length)
            writer.writeString(2, this.test2);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): NoOptionalValues {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new NoOptionalValues();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.test = reader.readString();
                    break;
                case 2:
                    message.test2 = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): NoOptionalValues {
        return NoOptionalValues.deserialize(bytes);
    }
}
