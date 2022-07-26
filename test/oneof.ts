/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/oneof.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class OneOfWithoutAnyOtherFields extends pb_1.Message {
    #one_of_decls: number[][] = [[1, 2], [4, 3]];
    constructor(data?: any[] | ({} & (({
        nickname?: string;
        realname?: never;
    } | {
        nickname?: never;
        realname?: string;
    }) | ({
        age?: string;
        date_of_birth?: never;
    } | {
        age?: never;
        date_of_birth?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("nickname" in data && data.nickname != undefined) {
                this.nickname = data.nickname;
            }
            if ("realname" in data && data.realname != undefined) {
                this.realname = data.realname;
            }
            if ("age" in data && data.age != undefined) {
                this.age = data.age;
            }
            if ("date_of_birth" in data && data.date_of_birth != undefined) {
                this.date_of_birth = data.date_of_birth;
            }
        }
    }
    get nickname() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set nickname(value: string) {
        pb_1.Message.setOneofField(this, 1, this.#one_of_decls[0]!, value);
    }
    get has_nickname() {
        return pb_1.Message.getField(this, 1) != null;
    }
    clear_nickname(): void {
        this.nickname = undefined!;
    }
    get realname() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set realname(value: string) {
        pb_1.Message.setOneofField(this, 2, this.#one_of_decls[0]!, value);
    }
    get has_realname() {
        return pb_1.Message.getField(this, 2) != null;
    }
    clear_realname(): void {
        this.realname = undefined!;
    }
    get age() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set age(value: string) {
        pb_1.Message.setOneofField(this, 4, this.#one_of_decls[1]!, value);
    }
    get has_age() {
        return pb_1.Message.getField(this, 4) != null;
    }
    clear_age(): void {
        this.age = undefined!;
    }
    get date_of_birth() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set date_of_birth(value: string) {
        pb_1.Message.setOneofField(this, 3, this.#one_of_decls[1]!, value);
    }
    get has_date_of_birth() {
        return pb_1.Message.getField(this, 3) != null;
    }
    clear_date_of_birth(): void {
        this.date_of_birth = undefined!;
    }
    get nickname_or_realname() {
        const cases: {
            [index: number]: "none" | "nickname" | "realname";
        } = {
            0: "none",
            1: "nickname",
            2: "realname"
        };
        return cases[pb_1.Message.computeOneofCase(this, [1, 2])]!;
    }
    get age_or_dateofbirth() {
        const cases: {
            [index: number]: "none" | "age" | "date_of_birth";
        } = {
            0: "none",
            4: "age",
            3: "date_of_birth"
        };
        return cases[pb_1.Message.computeOneofCase(this, [4, 3])]!;
    }
    static fromObject(data?: OneOfWithoutAnyOtherFields.AsObjectPartial): OneOfWithoutAnyOtherFields {
        if (!data) {
            return new OneOfWithoutAnyOtherFields();
        }
        const message = new OneOfWithoutAnyOtherFields({});
        if (data.nickname != null) {
            message.nickname = data.nickname;
        }
        if (data.realname != null) {
            message.realname = data.realname;
        }
        if (data.age != null) {
            message.age = data.age;
        }
        if (data.date_of_birth != null) {
            message.date_of_birth = data.date_of_birth;
        }
        return message;
    }
    toObject() {
        const data: OneOfWithoutAnyOtherFields.AsObject = {
            nickname: this.nickname,
            realname: this.realname,
            age: this.age,
            date_of_birth: this.date_of_birth
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_nickname)
            writer.writeString(1, this.nickname);
        if (this.has_realname)
            writer.writeString(2, this.realname);
        if (this.has_age)
            writer.writeString(4, this.age);
        if (this.has_date_of_birth)
            writer.writeString(3, this.date_of_birth);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OneOfWithoutAnyOtherFields {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new OneOfWithoutAnyOtherFields();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.nickname = reader.readString();
                    break;
                case 2:
                    message.realname = reader.readString();
                    break;
                case 4:
                    message.age = reader.readString();
                    break;
                case 3:
                    message.date_of_birth = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): OneOfWithoutAnyOtherFields {
        return OneOfWithoutAnyOtherFields.deserialize(bytes);
    }
}
export namespace OneOfWithoutAnyOtherFields {
    export type AsObject = {
        nickname: string;
        realname: string;
        age: string;
        date_of_birth: string;
    };
    export type AsObjectPartial = {
        nickname?: string;
        realname?: string;
        age?: string;
        date_of_birth?: string;
    };
}
export class OneOf extends pb_1.Message {
    #one_of_decls: number[][] = [[3, 4]];
    constructor(data?: any[] | ({
        nickname?: string;
    } & (({
        date_of_birth?: string;
        age?: never;
    } | {
        date_of_birth?: never;
        age?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("nickname" in data && data.nickname != undefined) {
                this.nickname = data.nickname;
            }
            if ("date_of_birth" in data && data.date_of_birth != undefined) {
                this.date_of_birth = data.date_of_birth;
            }
            if ("age" in data && data.age != undefined) {
                this.age = data.age;
            }
        }
    }
    get nickname() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set nickname(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get date_of_birth() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set date_of_birth(value: string) {
        pb_1.Message.setOneofField(this, 3, this.#one_of_decls[0]!, value);
    }
    get has_date_of_birth() {
        return pb_1.Message.getField(this, 3) != null;
    }
    clear_date_of_birth(): void {
        this.date_of_birth = undefined!;
    }
    get age() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set age(value: string) {
        pb_1.Message.setOneofField(this, 4, this.#one_of_decls[0]!, value);
    }
    get has_age() {
        return pb_1.Message.getField(this, 4) != null;
    }
    clear_age(): void {
        this.age = undefined!;
    }
    get age_or_dateofbirth() {
        const cases: {
            [index: number]: "none" | "date_of_birth" | "age";
        } = {
            0: "none",
            3: "date_of_birth",
            4: "age"
        };
        return cases[pb_1.Message.computeOneofCase(this, [3, 4])]!;
    }
    static fromObject(data?: OneOf.AsObjectPartial): OneOf {
        if (!data) {
            return new OneOf();
        }
        const message = new OneOf({});
        if (data.nickname != null) {
            message.nickname = data.nickname;
        }
        if (data.date_of_birth != null) {
            message.date_of_birth = data.date_of_birth;
        }
        if (data.age != null) {
            message.age = data.age;
        }
        return message;
    }
    toObject() {
        const data: OneOf.AsObject = {
            nickname: this.nickname,
            date_of_birth: this.date_of_birth,
            age: this.age
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.nickname.length)
            writer.writeString(1, this.nickname);
        if (this.has_date_of_birth)
            writer.writeString(3, this.date_of_birth);
        if (this.has_age)
            writer.writeString(4, this.age);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OneOf {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new OneOf();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.nickname = reader.readString();
                    break;
                case 3:
                    message.date_of_birth = reader.readString();
                    break;
                case 4:
                    message.age = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): OneOf {
        return OneOf.deserialize(bytes);
    }
}
export namespace OneOf {
    export type AsObject = {
        nickname: string;
        date_of_birth: string;
        age: string;
    };
    export type AsObjectPartial = {
        nickname?: string;
        date_of_birth?: string;
        age?: string;
    };
}
