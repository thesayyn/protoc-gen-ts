/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/presence/presence_proto2.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./presence_common";
import * as pb_1 from "google-protobuf";
export class PresenceMessageV2 extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        int32: number;
        enum: dependency_1.PresenceCommonEnum;
        string: string;
        message: dependency_1.PresenceCommonMessage;
        oneof: dependency_1.PresenceCommonMessageOneOf;
        opt_int32?: number;
        opt_enum?: dependency_1.PresenceCommonEnum;
        opt_string?: string;
        opt_message?: dependency_1.PresenceCommonMessage;
        opt_oneof?: dependency_1.PresenceCommonMessageOneOf;
        repeated?: number[];
        map?: Map<string, string>;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [11], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            this.int32 = data.int32;
            this.enum = data.enum;
            this.string = data.string;
            this.message = data.message;
            this.oneof = data.oneof;
            if ("opt_int32" in data && data.opt_int32 != undefined) {
                this.opt_int32 = data.opt_int32;
            }
            if ("opt_enum" in data && data.opt_enum != undefined) {
                this.opt_enum = data.opt_enum;
            }
            if ("opt_string" in data && data.opt_string != undefined) {
                this.opt_string = data.opt_string;
            }
            if ("opt_message" in data && data.opt_message != undefined) {
                this.opt_message = data.opt_message;
            }
            if ("opt_oneof" in data && data.opt_oneof != undefined) {
                this.opt_oneof = data.opt_oneof;
            }
            if ("repeated" in data && data.repeated != undefined) {
                this.repeated = data.repeated;
            }
            if ("map" in data && data.map != undefined) {
                this.map = data.map;
            }
        }
        if (!this.map)
            this.map = new Map();
    }
    get int32() {
        return pb_1.Message.getField(this, 1) as number | undefined;
    }
    set int32(value: number | undefined) {
        pb_1.Message.setField(this, 1, value);
    }
    get has_int32() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get enum() {
        return pb_1.Message.getField(this, 2) as dependency_1.PresenceCommonEnum | undefined;
    }
    set enum(value: dependency_1.PresenceCommonEnum | undefined) {
        pb_1.Message.setField(this, 2, value);
    }
    get has_enum() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get string() {
        return pb_1.Message.getField(this, 3) as string | undefined;
    }
    set string(value: string | undefined) {
        pb_1.Message.setField(this, 3, value);
    }
    get has_string() {
        return pb_1.Message.getField(this, 3) != null;
    }
    get message() {
        return pb_1.Message.getWrapperField(this, dependency_1.PresenceCommonMessage, 4) as dependency_1.PresenceCommonMessage | undefined;
    }
    set message(value: dependency_1.PresenceCommonMessage | undefined) {
        pb_1.Message.setWrapperField(this, 4, value);
    }
    get has_message() {
        return pb_1.Message.getField(this, 4) != null;
    }
    get oneof() {
        return pb_1.Message.getWrapperField(this, dependency_1.PresenceCommonMessageOneOf, 5) as dependency_1.PresenceCommonMessageOneOf | undefined;
    }
    set oneof(value: dependency_1.PresenceCommonMessageOneOf | undefined) {
        pb_1.Message.setWrapperField(this, 5, value);
    }
    get has_oneof() {
        return pb_1.Message.getField(this, 5) != null;
    }
    get opt_int32() {
        return pb_1.Message.getFieldWithDefault(this, 6, 0) as number;
    }
    set opt_int32(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    get has_opt_int32() {
        return pb_1.Message.getField(this, 6) != null;
    }
    get opt_enum() {
        return pb_1.Message.getFieldWithDefault(this, 7, dependency_1.PresenceCommonEnum.ZERO) as dependency_1.PresenceCommonEnum;
    }
    set opt_enum(value: dependency_1.PresenceCommonEnum) {
        pb_1.Message.setField(this, 7, value);
    }
    get has_opt_enum() {
        return pb_1.Message.getField(this, 7) != null;
    }
    get opt_string() {
        return pb_1.Message.getFieldWithDefault(this, 8, "") as string;
    }
    set opt_string(value: string) {
        pb_1.Message.setField(this, 8, value);
    }
    get has_opt_string() {
        return pb_1.Message.getField(this, 8) != null;
    }
    get opt_message() {
        return pb_1.Message.getWrapperField(this, dependency_1.PresenceCommonMessage, 9) as dependency_1.PresenceCommonMessage | undefined;
    }
    set opt_message(value: dependency_1.PresenceCommonMessage | undefined) {
        pb_1.Message.setWrapperField(this, 9, value);
    }
    get has_opt_message() {
        return pb_1.Message.getField(this, 9) != null;
    }
    get opt_oneof() {
        return pb_1.Message.getWrapperField(this, dependency_1.PresenceCommonMessageOneOf, 10) as dependency_1.PresenceCommonMessageOneOf | undefined;
    }
    set opt_oneof(value: dependency_1.PresenceCommonMessageOneOf | undefined) {
        pb_1.Message.setWrapperField(this, 10, value);
    }
    get has_opt_oneof() {
        return pb_1.Message.getField(this, 10) != null;
    }
    get repeated() {
        return pb_1.Message.getFieldWithDefault(this, 11, []) as number[];
    }
    set repeated(value: number[]) {
        pb_1.Message.setField(this, 11, value);
    }
    get map() {
        return pb_1.Message.getField(this, 12) as any as Map<string, string>;
    }
    set map(value: Map<string, string>) {
        pb_1.Message.setField(this, 12, value as any);
    }
    static fromObject(data?: PresenceMessageV2.AsObjectPartial): PresenceMessageV2 {
        if (!data) {
            return new PresenceMessageV2();
        }
        const message = new PresenceMessageV2({
            int32: data.int32,
            enum: data.enum,
            string: data.string,
            message: dependency_1.PresenceCommonMessage.fromObject(data.message),
            oneof: dependency_1.PresenceCommonMessageOneOf.fromObject(data.oneof)
        });
        if (data.opt_int32 != null) {
            message.opt_int32 = data.opt_int32;
        }
        if (data.opt_enum != null) {
            message.opt_enum = data.opt_enum;
        }
        if (data.opt_string != null) {
            message.opt_string = data.opt_string;
        }
        if (data.opt_message != null) {
            message.opt_message = dependency_1.PresenceCommonMessage.fromObject(data.opt_message);
        }
        if (data.opt_oneof != null) {
            message.opt_oneof = dependency_1.PresenceCommonMessageOneOf.fromObject(data.opt_oneof);
        }
        if (data.repeated != null) {
            message.repeated = data.repeated;
        }
        if (typeof data.map == "object") {
            message.map = new Map(Object.entries(data.map));
        }
        return message;
    }
    toObject() {
        const data: PresenceMessageV2.AsObject = {
            opt_int32: this.opt_int32,
            opt_enum: this.opt_enum,
            opt_string: this.opt_string,
            repeated: this.repeated,
            map: Object.fromEntries(this.map)
        };
        if (this.int32 != null) {
            data.int32 = this.int32;
        }
        if (this.enum != null) {
            data.enum = this.enum;
        }
        if (this.string != null) {
            data.string = this.string;
        }
        if (this.message != null) {
            data.message = this.message.toObject();
        }
        if (this.oneof != null) {
            data.oneof = this.oneof.toObject();
        }
        if (this.opt_message != null) {
            data.opt_message = this.opt_message.toObject();
        }
        if (this.opt_oneof != null) {
            data.opt_oneof = this.opt_oneof.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_int32)
            writer.writeInt32(1, this.int32);
        if (this.has_enum)
            writer.writeEnum(2, this.enum);
        if (this.has_string && this.string!.length)
            writer.writeString(3, this.string);
        if (this.has_message)
            writer.writeMessage(4, this.message, () => this.message!.serialize(writer));
        if (this.has_oneof)
            writer.writeMessage(5, this.oneof, () => this.oneof!.serialize(writer));
        if (this.has_opt_int32)
            writer.writeInt32(6, this.opt_int32);
        if (this.has_opt_enum)
            writer.writeEnum(7, this.opt_enum);
        if (this.has_opt_string && this.opt_string!.length)
            writer.writeString(8, this.opt_string);
        if (this.has_opt_message)
            writer.writeMessage(9, this.opt_message, () => this.opt_message!.serialize(writer));
        if (this.has_opt_oneof)
            writer.writeMessage(10, this.opt_oneof, () => this.opt_oneof!.serialize(writer));
        if (this.repeated.length)
            writer.writeRepeatedInt32(11, this.repeated);
        for (const [key, value] of this.map) {
            writer.writeMessage(12, this.map, () => {
                writer.writeString(1, key);
                writer.writeString(2, value);
            });
        }
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PresenceMessageV2 {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new PresenceMessageV2();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.int32 = reader.readInt32();
                    break;
                case 2:
                    message.enum = reader.readEnum();
                    break;
                case 3:
                    message.string = reader.readString();
                    break;
                case 4:
                    reader.readMessage(message.message, () => message.message = dependency_1.PresenceCommonMessage.deserialize(reader));
                    break;
                case 5:
                    reader.readMessage(message.oneof, () => message.oneof = dependency_1.PresenceCommonMessageOneOf.deserialize(reader));
                    break;
                case 6:
                    message.opt_int32 = reader.readInt32();
                    break;
                case 7:
                    message.opt_enum = reader.readEnum();
                    break;
                case 8:
                    message.opt_string = reader.readString();
                    break;
                case 9:
                    reader.readMessage(message.opt_message, () => message.opt_message = dependency_1.PresenceCommonMessage.deserialize(reader));
                    break;
                case 10:
                    reader.readMessage(message.opt_oneof, () => message.opt_oneof = dependency_1.PresenceCommonMessageOneOf.deserialize(reader));
                    break;
                case 11:
                    pb_1.Message.addToRepeatedField(message, 11, reader.readInt32());
                    break;
                case 12:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.map as any, reader, reader.readString, reader.readString));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): PresenceMessageV2 {
        return PresenceMessageV2.deserialize(bytes);
    }
}
export namespace PresenceMessageV2 {
    export type AsObject = {
        int32?: number;
        enum?: dependency_1.PresenceCommonEnum;
        string?: string;
        message?: dependency_1.PresenceCommonMessage.AsObject;
        oneof?: dependency_1.PresenceCommonMessageOneOf.AsObject;
        opt_int32: number;
        opt_enum: dependency_1.PresenceCommonEnum;
        opt_string: string;
        opt_message?: dependency_1.PresenceCommonMessage.AsObject;
        opt_oneof?: dependency_1.PresenceCommonMessageOneOf.AsObject;
        repeated: number[];
        map: {
            [key: string]: string;
        };
    };
    export type AsObjectPartial = {
        int32: number;
        enum: dependency_1.PresenceCommonEnum;
        string: string;
        message: dependency_1.PresenceCommonMessage.AsObjectPartial;
        oneof: dependency_1.PresenceCommonMessageOneOf.AsObjectPartial;
        opt_int32?: number;
        opt_enum?: dependency_1.PresenceCommonEnum;
        opt_string?: string;
        opt_message?: dependency_1.PresenceCommonMessage.AsObjectPartial;
        opt_oneof?: dependency_1.PresenceCommonMessageOneOf.AsObjectPartial;
        repeated?: number[];
        map?: {
            [key: string]: string;
        };
    };
}
