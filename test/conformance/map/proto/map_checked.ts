/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.17.0
 * source: test/conformance/map/proto/map.proto
 * git: https://github.com/thesayyn/protoc-gen-ts
 *  */
import * as pb_1 from "google-protobuf";
export namespace maps {
    export class Topic extends pb_1.Message {
        constructor(data?: any[] | {
            link?: string;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("link" in data && data.link != undefined) {
                    this.link = data.link;
                }
            }
        }
        get link() {
            return pb_1.Message.getField(this, 2) as string;
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
            } = {};
            if (this.link != null) {
                data.link = this.link;
            }
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
        constructor(data?: any[] | {
            key?: string;
            keys?: Map<string, string>;
            topics?: Map<string, Topic>;
            topics_with_intkeys?: Map<number, Topic>;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
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
                if ("topics_with_intkeys" in data && data.topics_with_intkeys != undefined) {
                    this.topics_with_intkeys = data.topics_with_intkeys;
                }
            }
            if (!this.keys)
                this.keys = new Map();
            if (!this.topics)
                this.topics = new Map();
            if (!this.topics_with_intkeys)
                this.topics_with_intkeys = new Map();
        }
        get key() {
            return pb_1.Message.getField(this, 2) as string;
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
        get topics_with_intkeys() {
            return pb_1.Message.getField(this, 4) as any as Map<number, Topic>;
        }
        set topics_with_intkeys(value: Map<number, Topic>) {
            pb_1.Message.setField(this, 4, value as any);
        }
        static fromObject(data: {
            key?: string;
            keys?: {
                [key: string]: string;
            };
            topics?: {
                [key: string]: ReturnType<typeof Topic.prototype.toObject>;
            };
            topics_with_intkeys?: {
                [key: number]: ReturnType<typeof Topic.prototype.toObject>;
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
            if (typeof data.topics_with_intkeys == "object") {
                message.topics_with_intkeys = new Map(Object.entries(data.topics_with_intkeys).map(([key, value]) => [Number(key), Topic.fromObject(value)]));
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
                topics_with_intkeys?: {
                    [key: number]: ReturnType<typeof Topic.prototype.toObject>;
                };
            } = {};
            if (this.key != null) {
                data.key = this.key;
            }
            if (this.keys.size > 0) {
                data.keys = Object.fromEntries(this.keys);
            }
            if (this.topics.size > 0) {
                data.topics = Object.fromEntries(Array.from(this.topics).map(([key, value]) => [key, value.toObject()]));
            }
            if (this.topics_with_intkeys.size > 0) {
                data.topics_with_intkeys = Object.fromEntries(Array.from(this.topics_with_intkeys).map(([key, value]) => [key, value.toObject()]));
            }
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
            for (const [key, value] of this.topics_with_intkeys) {
                writer.writeMessage(4, this.topics_with_intkeys, () => {
                    writer.writeInt64(1, key);
                    writer.writeMessage(2, value, () => value.serialize(writer));
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
                        reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.topics_with_intkeys as any, reader, reader.readInt64, () => {
                            let value;
                            reader.readMessage(message, () => value = Topic.deserialize(reader));
                            return value;
                        }));
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
}
