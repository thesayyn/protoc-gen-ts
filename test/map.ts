/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/map.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./imported";
import * as pb_1 from "google-protobuf";
export class Topic extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        link?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("link" in data && data.link != undefined) {
                this.link = data.link;
            }
        }
    }
    get link() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set link(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        link?: string;
    }) {
        const message = new Topic({});
        if (data.link != null) {
            message.link = data.link;
        }
        return message;
    }
    toObject() {
        const data: {
            link?: string;
        } = {
            link: this.link
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.link === "string" && this.link.length)
            writer.writeString(2, this.link);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Topic {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Topic();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 2:
                    message.link = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Topic {
        return Topic.deserialize(bytes);
    }
}
export class Tags extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        key?: string;
        keys?: Map<string, string>;
        topics?: Map<string, Topic>;
        imported?: Map<number, dependency_1.importdirective.Imported.SubMessage>;
        imported2?: Map<number, dependency_1.importdirective.Imported.SubMessage.MyEnum>;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("key" in data && data.key != undefined) {
                this.key = data.key;
            }
            if ("keys" in data && data.keys != undefined) {
                this.keys = data.keys;
            }
            if ("topics" in data && data.topics != undefined) {
                this.topics = data.topics;
            }
            if ("imported" in data && data.imported != undefined) {
                this.imported = data.imported;
            }
            if ("imported2" in data && data.imported2 != undefined) {
                this.imported2 = data.imported2;
            }
        }
        if (!this.keys)
            this.keys = new Map();
        if (!this.topics)
            this.topics = new Map();
        if (!this.imported)
            this.imported = new Map();
        if (!this.imported2)
            this.imported2 = new Map();
    }
    get key() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set key(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get keys() {
        return pb_1.Message.getField(this, 1) as any as Map<string, string>;
    }
    set keys(value: Map<string, string>) {
        pb_1.Message.setField(this, 1, value as any);
    }
    get topics() {
        return pb_1.Message.getField(this, 3) as any as Map<string, Topic>;
    }
    set topics(value: Map<string, Topic>) {
        pb_1.Message.setField(this, 3, value as any);
    }
    get imported() {
        return pb_1.Message.getField(this, 4) as any as Map<number, dependency_1.importdirective.Imported.SubMessage>;
    }
    set imported(value: Map<number, dependency_1.importdirective.Imported.SubMessage>) {
        pb_1.Message.setField(this, 4, value as any);
    }
    get imported2() {
        return pb_1.Message.getField(this, 5) as any as Map<number, dependency_1.importdirective.Imported.SubMessage.MyEnum>;
    }
    set imported2(value: Map<number, dependency_1.importdirective.Imported.SubMessage.MyEnum>) {
        pb_1.Message.setField(this, 5, value as any);
    }
    static fromObject(data: {
        key?: string;
        keys?: {
            [key: string]: string;
        };
        topics?: {
            [key: string]: ReturnType<typeof Topic.prototype.toObject>;
        };
        imported?: {
            [key: number]: ReturnType<typeof dependency_1.importdirective.Imported.SubMessage.prototype.toObject>;
        };
        imported2?: {
            [key: number]: dependency_1.importdirective.Imported.SubMessage.MyEnum;
        };
    }) {
        const message = new Tags({});
        if (data.key != null) {
            message.key = data.key;
        }
        if (typeof data.keys == "object") {
            message.keys = new Map(Object.entries(data.keys));
        }
        if (typeof data.topics == "object") {
            message.topics = new Map(Object.entries(data.topics).map(([key, value]) => [key, Topic.fromObject(value)]));
        }
        if (typeof data.imported == "object") {
            message.imported = new Map(Object.entries(data.imported).map(([key, value]) => [Number(key), dependency_1.importdirective.Imported.SubMessage.fromObject(value)]));
        }
        if (typeof data.imported2 == "object") {
            message.imported2 = new Map(Object.entries(data.imported2).map(([key, value]) => [Number(key), value]));
        }
        return message;
    }
    toObject() {
        const data: {
            key?: string;
            keys?: {
                [key: string]: string;
            };
            topics?: {
                [key: string]: ReturnType<typeof Topic.prototype.toObject>;
            };
            imported?: {
                [key: number]: ReturnType<typeof dependency_1.importdirective.Imported.SubMessage.prototype.toObject>;
            };
            imported2?: {
                [key: number]: dependency_1.importdirective.Imported.SubMessage.MyEnum;
            };
        } = {
            key: this.key,
            keys: Object.fromEntries(this.keys),
            topics: Object.fromEntries(Array.from(this.topics).map(([key, value]) => [key, value.toObject()])),
            imported: Object.fromEntries(Array.from(this.imported).map(([key, value]) => [key, value.toObject()])),
            imported2: Object.fromEntries(this.imported2)
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.key === "string" && this.key.length)
            writer.writeString(2, this.key);
        for (const [key, value] of this.keys) {
            writer.writeMessage(1, this.keys, () => {
                writer.writeString(1, key);
                writer.writeString(2, value);
            });
        }
        for (const [key, value] of this.topics) {
            writer.writeMessage(3, this.topics, () => {
                writer.writeString(1, key);
                writer.writeMessage(2, value, () => value.serialize(writer));
            });
        }
        for (const [key, value] of this.imported) {
            writer.writeMessage(4, this.imported, () => {
                writer.writeInt32(1, key);
                writer.writeMessage(2, value, () => value.serialize(writer));
            });
        }
        for (const [key, value] of this.imported2) {
            writer.writeMessage(5, this.imported2, () => {
                writer.writeInt64(1, key);
                writer.writeEnum(2, value);
            });
        }
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Tags {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Tags();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 2:
                    message.key = reader.readString();
                    break;
                case 1:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.keys as any, reader, reader.readString, reader.readString));
                    break;
                case 3:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.topics as any, reader, reader.readString, () => {
                        let value;
                        reader.readMessage(message, () => value = Topic.deserialize(reader));
                        return value;
                    }));
                    break;
                case 4:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.imported as any, reader, reader.readInt32, () => {
                        let value;
                        reader.readMessage(message, () => value = dependency_1.importdirective.Imported.SubMessage.deserialize(reader));
                        return value;
                    }));
                    break;
                case 5:
                    reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.imported2 as any, reader, reader.readInt64, reader.readEnum));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Tags {
        return Tags.deserialize(bytes);
    }
}
