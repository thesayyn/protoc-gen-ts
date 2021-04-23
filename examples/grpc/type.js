import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export class Request extends pb_1.Message {
    constructor(data) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("a" in data) {
                this.a = data.a;
            }
            if ("b" in data) {
                this.b = data.b;
            }
        }
    }
    get a() {
        return pb_1.Message.getField(this, 1);
    }
    set a(value) {
        pb_1.Message.setField(this, 1, value);
    }
    get b() {
        return pb_1.Message.getField(this, 2);
    }
    set b(value) {
        pb_1.Message.setField(this, 2, value);
    }
    toObject() {
        var data = {};
        if (this.a != null) {
            data.a = this.a;
        }
        if (this.b != null) {
            data.b = this.b;
        }
        return data;
    }
    serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.a !== undefined)
            writer.writeInt32(1, this.a);
        if (this.b !== undefined)
            writer.writeInt32(2, this.b);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes) {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Request();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.a = reader.readInt32();
                    break;
                case 2:
                    message.b = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary() {
        return this.serialize();
    }
    static deserializeBinary(bytes) {
        return Request.deserialize(bytes);
    }
}
export class Response extends pb_1.Message {
    constructor(data) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("result" in data) {
                this.result = data.result;
            }
        }
    }
    get result() {
        return pb_1.Message.getField(this, 1);
    }
    set result(value) {
        pb_1.Message.setField(this, 1, value);
    }
    toObject() {
        var data = {};
        if (this.result != null) {
            data.result = this.result;
        }
        return data;
    }
    serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.result !== undefined)
            writer.writeInt32(1, this.result);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes) {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Response();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.result = reader.readInt32();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary() {
        return this.serialize();
    }
    static deserializeBinary(bytes) {
        return Response.deserialize(bytes);
    }
}
export const Example = {
    add: {
        path: "/Example/add",
        requestStream: false,
        responseStream: false,
        requestSerialize: (message) => Buffer.from(message.serialize()),
        requestDeserialize: (bytes) => Request.deserialize(new Uint8Array(bytes)),
        responseSerialize: (message) => Buffer.from(message.serialize()),
        responseDeserialize: (bytes) => Response.deserialize(new Uint8Array(bytes))
    }
};
export class ExampleClient extends grpc_1.makeGenericClientConstructor(Example, "Example", {}) {
    constructor(address, credentials, options) {
        super(address, credentials, options);
    }
}
