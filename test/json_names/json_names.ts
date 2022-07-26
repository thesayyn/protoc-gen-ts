/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/json_names/json_names.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export enum ColorSpace {
    RED_GREEN_BLUE = 0,
    CYAN_YELLOW_MAGENTA_BLACK = 1
}
export class JsonNamesMessage extends pb_1.Message {
    #one_of_decls: number[][] = [[6, 7], [5]];
    constructor(data?: any[] | ({
        someStrings?: string[];
        anInteger?: number;
        aNestedMessage?: JsonNamesMessage.NestedMessage;
        colorSpace?: ColorSpace;
    } & (({
        aSingleString?: string;
        aSingleNumber?: never;
    } | {
        aSingleString?: never;
        aSingleNumber?: number;
    }) | ({
        anOptionalString?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("someStrings" in data && data.someStrings != undefined) {
                this.someStrings = data.someStrings;
            }
            if ("anInteger" in data && data.anInteger != undefined) {
                this.anInteger = data.anInteger;
            }
            if ("aNestedMessage" in data && data.aNestedMessage != undefined) {
                this.aNestedMessage = data.aNestedMessage;
            }
            if ("colorSpace" in data && data.colorSpace != undefined) {
                this.colorSpace = data.colorSpace;
            }
            if ("anOptionalString" in data && data.anOptionalString != undefined) {
                this.anOptionalString = data.anOptionalString;
            }
            if ("aSingleString" in data && data.aSingleString != undefined) {
                this.aSingleString = data.aSingleString;
            }
            if ("aSingleNumber" in data && data.aSingleNumber != undefined) {
                this.aSingleNumber = data.aSingleNumber;
            }
        }
    }
    get someStrings() {
        return pb_1.Message.getFieldWithDefault(this, 1, []) as string[];
    }
    set someStrings(value: string[]) {
        pb_1.Message.setField(this, 1, value);
    }
    get anInteger() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set anInteger(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get aNestedMessage() {
        return pb_1.Message.getWrapperField(this, JsonNamesMessage.NestedMessage, 3) as JsonNamesMessage.NestedMessage | undefined;
    }
    set aNestedMessage(value: JsonNamesMessage.NestedMessage | undefined) {
        pb_1.Message.setWrapperField(this, 3, value);
    }
    get hasANestedMessage() {
        return pb_1.Message.getField(this, 3) != null;
    }
    get colorSpace() {
        return pb_1.Message.getFieldWithDefault(this, 4, ColorSpace.RED_GREEN_BLUE) as ColorSpace;
    }
    set colorSpace(value: ColorSpace) {
        pb_1.Message.setField(this, 4, value);
    }
    get anOptionalString() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set anOptionalString(value: string) {
        pb_1.Message.setOneofField(this, 5, this.#one_of_decls[1]!, value);
    }
    get hasAnOptionalString() {
        return pb_1.Message.getField(this, 5) != null;
    }
    get aSingleString() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set aSingleString(value: string) {
        pb_1.Message.setOneofField(this, 6, this.#one_of_decls[0]!, value);
    }
    get hasASingleString() {
        return pb_1.Message.getField(this, 6) != null;
    }
    get aSingleNumber() {
        return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
    }
    set aSingleNumber(value: number) {
        pb_1.Message.setOneofField(this, 7, this.#one_of_decls[0]!, value);
    }
    get hasASingleNumber() {
        return pb_1.Message.getField(this, 7) != null;
    }
    get mut_ex_field() {
        const cases: {
            [index: number]: "none" | "aSingleString" | "aSingleNumber";
        } = {
            0: "none",
            6: "aSingleString",
            7: "aSingleNumber"
        };
        return cases[pb_1.Message.computeOneofCase(this, [6, 7])]!;
    }
    get _an_optional_string() {
        const cases: {
            [index: number]: "none" | "anOptionalString";
        } = {
            0: "none",
            5: "anOptionalString"
        };
        return cases[pb_1.Message.computeOneofCase(this, [5])]!;
    }
    static fromObject(data?: JsonNamesMessage.AsObjectPartial): JsonNamesMessage {
        if (!data) {
            return new JsonNamesMessage();
        }
        const message = new JsonNamesMessage({});
        if (data.someStrings != null) {
            message.someStrings = data.someStrings;
        }
        if (data.anInteger != null) {
            message.anInteger = data.anInteger;
        }
        if (data.aNestedMessage != null) {
            message.aNestedMessage = JsonNamesMessage.NestedMessage.fromObject(data.aNestedMessage);
        }
        if (data.colorSpace != null) {
            message.colorSpace = data.colorSpace;
        }
        if (data.anOptionalString != null) {
            message.anOptionalString = data.anOptionalString;
        }
        if (data.aSingleString != null) {
            message.aSingleString = data.aSingleString;
        }
        if (data.aSingleNumber != null) {
            message.aSingleNumber = data.aSingleNumber;
        }
        return message;
    }
    toObject() {
        const data: JsonNamesMessage.AsObject = {
            someStrings: this.someStrings,
            anInteger: this.anInteger,
            colorSpace: this.colorSpace,
            anOptionalString: this.anOptionalString,
            aSingleString: this.aSingleString,
            aSingleNumber: this.aSingleNumber
        };
        if (this.aNestedMessage != null) {
            data.aNestedMessage = this.aNestedMessage.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.someStrings.length)
            writer.writeRepeatedString(1, this.someStrings);
        if (this.anInteger != 0)
            writer.writeInt32(2, this.anInteger);
        if (this.hasANestedMessage)
            writer.writeMessage(3, this.aNestedMessage, () => this.aNestedMessage!.serialize(writer));
        if (this.colorSpace != ColorSpace.RED_GREEN_BLUE)
            writer.writeEnum(4, this.colorSpace);
        if (this.hasAnOptionalString)
            writer.writeString(5, this.anOptionalString);
        if (this.hasASingleString)
            writer.writeString(6, this.aSingleString);
        if (this.hasASingleNumber)
            writer.writeInt32(7, this.aSingleNumber);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): JsonNamesMessage {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new JsonNamesMessage();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    pb_1.Message.addToRepeatedField(message, 1, reader.readString());
                    break;
                case 2:
                    message.anInteger = reader.readInt32();
                    break;
                case 3:
                    reader.readMessage(message.aNestedMessage, () => message.aNestedMessage = JsonNamesMessage.NestedMessage.deserialize(reader));
                    break;
                case 4:
                    message.colorSpace = reader.readEnum();
                    break;
                case 5:
                    message.anOptionalString = reader.readString();
                    break;
                case 6:
                    message.aSingleString = reader.readString();
                    break;
                case 7:
                    message.aSingleNumber = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): JsonNamesMessage {
        return JsonNamesMessage.deserialize(bytes);
    }
}
export namespace JsonNamesMessage {
    export type AsObject = {
        someStrings: string[];
        anInteger: number;
        aNestedMessage?: JsonNamesMessage.NestedMessage.AsObject;
        colorSpace: ColorSpace;
        anOptionalString: string;
        aSingleString: string;
        aSingleNumber: number;
    };
    export type AsObjectPartial = {
        someStrings?: string[];
        anInteger?: number;
        aNestedMessage?: JsonNamesMessage.NestedMessage.AsObjectPartial;
        colorSpace?: ColorSpace;
        anOptionalString?: string;
        aSingleString?: string;
        aSingleNumber?: number;
    };
    export class NestedMessage extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            aNestedInteger?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("aNestedInteger" in data && data.aNestedInteger != undefined) {
                    this.aNestedInteger = data.aNestedInteger;
                }
            }
        }
        get aNestedInteger() {
            return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
        }
        set aNestedInteger(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        static fromObject(data?: NestedMessage.AsObjectPartial): NestedMessage {
            if (!data) {
                return new NestedMessage();
            }
            const message = new NestedMessage({});
            if (data.aNestedInteger != null) {
                message.aNestedInteger = data.aNestedInteger;
            }
            return message;
        }
        toObject() {
            const data: NestedMessage.AsObject = {
                aNestedInteger: this.aNestedInteger
            };
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.aNestedInteger != 0)
                writer.writeUint32(1, this.aNestedInteger);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): NestedMessage {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new NestedMessage();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.aNestedInteger = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): NestedMessage {
            return NestedMessage.deserialize(bytes);
        }
    }
    export namespace NestedMessage {
        export type AsObject = {
            aNestedInteger: number;
        };
        export type AsObjectPartial = {
            aNestedInteger?: number;
        };
    }
}
