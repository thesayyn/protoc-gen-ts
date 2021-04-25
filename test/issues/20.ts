import * as pb_1 from "google-protobuf";
export class Example extends pb_1.Message {
    constructor(data?: any[] | ({} & (({
        foo: Foo;
        bar?: never;
    } | {
        foo?: never;
        bar: Bar;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], [[1, 2]]);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("foo" in data && data.foo != undefined) {
                this.foo = data.foo;
            }
            if ("bar" in data && data.bar != undefined) {
                this.bar = data.bar;
            }
        }
    }
    get foo() {
        return pb_1.Message.getWrapperField(this, Foo, 1) as Foo;
    }
    set foo(value: Foo) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    get bar() {
        return pb_1.Message.getWrapperField(this, Bar, 2) as Bar;
    }
    set bar(value: Bar) {
        pb_1.Message.setWrapperField(this, 2, value);
    }
    toObject() {
        var data: {
            foo?: ReturnType<typeof Foo.prototype.toObject>;
            bar?: ReturnType<typeof Bar.prototype.toObject>;
        } = {};
        if (this.foo != null) {
            data.foo = this.foo.toObject();
        }
        if (this.bar != null) {
            data.bar = this.bar.toObject();
        }
        return data;
    }
    serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
        const writer = w || new pb_1.BinaryWriter();
        if (this.foo !== undefined)
            writer.writeMessage(1, this.foo, () => this.foo.serialize(writer));
        if (this.bar !== undefined)
            writer.writeMessage(2, this.bar, () => this.bar.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Example {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Example();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.foo, () => message.foo = Foo.deserialize(reader));
                    break;
                case 2:
                    reader.readMessage(message.bar, () => message.bar = Bar.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Example {
        return Example.deserialize(bytes);
    }
}
export class Foo extends pb_1.Message {
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    toObject() {
        var data: {} = {};
        return data;
    }
    serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Foo {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Foo();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Foo {
        return Foo.deserialize(bytes);
    }
}
export class Bar extends pb_1.Message {
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    toObject() {
        var data: {} = {};
        return data;
    }
    serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Bar {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Bar();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Bar {
        return Bar.deserialize(bytes);
    }
}
