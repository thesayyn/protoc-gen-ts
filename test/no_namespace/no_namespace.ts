/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/no_namespace/no_namespace.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./nested";
import * as dependency_2 from "./double_nested";
import * as pb_1 from "google-protobuf";
export class NoNamespace extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        label?: dependency_1.Target;
        other_fields?: dependency_2.MessageFields;
        batch_fields?: dependency_1.SchedulingContextBatch;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("label" in data && data.label != undefined) {
                this.label = data.label;
            }
            if ("other_fields" in data && data.other_fields != undefined) {
                this.other_fields = data.other_fields;
            }
            if ("batch_fields" in data && data.batch_fields != undefined) {
                this.batch_fields = data.batch_fields;
            }
        }
    }
    get label() {
        return pb_1.Message.getWrapperField(this, dependency_1.Target, 1) as dependency_1.Target;
    }
    set label(value: dependency_1.Target) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    get other_fields() {
        return pb_1.Message.getWrapperField(this, dependency_2.MessageFields, 2) as dependency_2.MessageFields;
    }
    set other_fields(value: dependency_2.MessageFields) {
        pb_1.Message.setWrapperField(this, 2, value);
    }
    get batch_fields() {
        return pb_1.Message.getWrapperField(this, dependency_1.SchedulingContextBatch, 3) as dependency_1.SchedulingContextBatch;
    }
    set batch_fields(value: dependency_1.SchedulingContextBatch) {
        pb_1.Message.setWrapperField(this, 3, value);
    }
    static fromObject(data: {
        label?: ReturnType<typeof dependency_1.Target.prototype.toObject>;
        other_fields?: ReturnType<typeof dependency_2.MessageFields.prototype.toObject>;
        batch_fields?: ReturnType<typeof dependency_1.SchedulingContextBatch.prototype.toObject>;
    }) {
        const message = new NoNamespace({});
        if (data.label != null) {
            message.label = dependency_1.Target.fromObject(data.label);
        }
        if (data.other_fields != null) {
            message.other_fields = dependency_2.MessageFields.fromObject(data.other_fields);
        }
        if (data.batch_fields != null) {
            message.batch_fields = dependency_1.SchedulingContextBatch.fromObject(data.batch_fields);
        }
        return message;
    }
    toObject() {
        const data: {
            label?: ReturnType<typeof dependency_1.Target.prototype.toObject>;
            other_fields?: ReturnType<typeof dependency_2.MessageFields.prototype.toObject>;
            batch_fields?: ReturnType<typeof dependency_1.SchedulingContextBatch.prototype.toObject>;
        } = {};
        if (this.label != null) {
            data.label = this.label.toObject();
        }
        if (this.other_fields != null) {
            data.other_fields = this.other_fields.toObject();
        }
        if (this.batch_fields != null) {
            data.batch_fields = this.batch_fields.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.label !== undefined)
            writer.writeMessage(1, this.label, () => this.label.serialize(writer));
        if (this.other_fields !== undefined)
            writer.writeMessage(2, this.other_fields, () => this.other_fields.serialize(writer));
        if (this.batch_fields !== undefined)
            writer.writeMessage(3, this.batch_fields, () => this.batch_fields.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): NoNamespace {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new NoNamespace();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.label, () => message.label = dependency_1.Target.deserialize(reader));
                    break;
                case 2:
                    reader.readMessage(message.other_fields, () => message.other_fields = dependency_2.MessageFields.deserialize(reader));
                    break;
                case 3:
                    reader.readMessage(message.batch_fields, () => message.batch_fields = dependency_1.SchedulingContextBatch.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): NoNamespace {
        return NoNamespace.deserialize(bytes);
    }
}
