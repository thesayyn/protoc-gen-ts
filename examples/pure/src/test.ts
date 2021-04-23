import * as pb_1 from "google-protobuf";
export enum Kind {
    UPDATED = 0,
    DELETED = 1
}
export class Change extends pb_1.Message {
    constructor(data?: any[] | {
        kind?: Kind;
        patch?: string;
        tags: string[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [3], []);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("kind" in data) {
                this.kind = data.kind;
            }
            if ("patch" in data) {
                this.patch = data.patch;
            }
            this.tags = data.tags;
        }
    }
    get kind() {
        return pb_1.Message.getField(this, 1) as Kind;
    }
    set kind(value: Kind) {
        pb_1.Message.setField(this, 1, value);
    }
    get patch() {
        return pb_1.Message.getField(this, 2) as string;
    }
    set patch(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get tags() {
        return pb_1.Message.getField(this, 3) as string[];
    }
    set tags(value: string[]) {
        pb_1.Message.setField(this, 3, value);
    }
    toObject() {
        var data: {
            kind?: Kind;
            patch?: string;
            tags: string[];
        } = {
            tags: this.tags
        };
        if (this.kind != null) {
            data.kind = this.kind;
        }
        if (this.patch != null) {
            data.patch = this.patch;
        }
        return data;
    }
    serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
        const writer = w || new pb_1.BinaryWriter();
        if (this.kind !== undefined)
            writer.writeEnum(1, this.kind);
        if (typeof this.patch === "string" && this.patch.length)
            writer.writeString(2, this.patch);
        if (this.tags !== undefined)
            writer.writeRepeatedString(3, this.tags);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Change {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Change();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.kind = reader.readEnum();
                    break;
                case 2:
                    message.patch = reader.readString();
                    break;
                case 3:
                    pb_1.Message.addToRepeatedField(message, 3, reader.readString());
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Change {
        return Change.deserialize(bytes);
    }
}
