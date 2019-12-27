import * as pb_1 from "./google-protobuf";
export class Inner extends pb_1.Message {
    constructor(data?: any[]) {
        super();
        pb_1.Message.initialize(this, data, 0, -1, [], null);
    }
    get a(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
    }
    set a(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    toObject() {
        return {
            a: this.a
        };
    }
    serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
        const writer = w || new pb_1.BinaryWriter();
        if (this.a)
            writer.writeInt32(1, this.a);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Inner {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Inner();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.a = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
}
export class Outter extends pb_1.Message {
    constructor(data?: any[]) {
        super();
        pb_1.Message.initialize(this, data, 0, -1, [], null);
    }
    get a(): Inner | undefined {
        return pb_1.Message.getWrapperField(this, Inner, 1) as Inner | undefined;
    }
    set a(value: Inner) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    toObject() {
        return {
            a: this.a
        };
    }
    serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
        const writer = w || new pb_1.BinaryWriter();
        if (this.a)
            writer.writeMessage(1, this.a, (item: Inner) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Outter {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Outter();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.a, () => message.a = Inner.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
}
