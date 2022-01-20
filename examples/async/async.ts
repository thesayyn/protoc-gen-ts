/**
 * Generated by the protoc-gen-ts. DO NOT EDIT!
 * compiler version: 3.18.1
 * source: async.proto
 * git: https://github.com/thesayyn/protoc-gen-ts
 *  */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@fyn-software/grpc";
export class AsyncRequest extends pb_1.Message {
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}) {
        const message = new AsyncRequest({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AsyncRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new AsyncRequest();
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
    static deserializeBinary(bytes: Uint8Array): AsyncRequest {
        return AsyncRequest.deserialize(bytes);
    }
}
export class AsyncResponse extends pb_1.Message {
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}) {
        const message = new AsyncResponse({});
        return message;
    }
    toObject() {
        const data: {} = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AsyncResponse {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new AsyncResponse();
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
    static deserializeBinary(bytes: Uint8Array): AsyncResponse {
        return AsyncResponse.deserialize(bytes);
    }
}
export abstract class AsyncService {
    static definition = {
        Unary: "/example.v1.Async/Unary",
        ClientStream: "/example.v1.Async/ClientStream",
        ServerStream: "/example.v1.Async/ServerStream",
        BidiStream: "/example.v1.Async/BidiStream"
    };
}
export class AsyncClient extends grpc_1.BaseClient {
    static serviceName = "Async";
    constructor(address: string) {
        super(address);
    }
    @grpc_1.methodDescriptor<AsyncRequest, AsyncResponse>({ path: "/example.v1.Async/Unary", requestStream: false, responseStream: false })
    public async Unary(request: AsyncRequest, metadata?: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<AsyncResponse> {
        return super.makeUnaryRequest<AsyncRequest, AsyncResponse>("/example.v1.Async/Unary", request, metadata, options);
    }
    @grpc_1.methodDescriptor<AsyncRequest, AsyncResponse>({ path: "/example.v1.Async/ClientStream", requestStream: true, responseStream: false })
    public async ClientStream(request: AsyncIterable<AsyncRequest>, metadata?: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<AsyncResponse> {
        return super.makeClientStreamRequest<AsyncRequest, AsyncResponse>("/example.v1.Async/ClientStream", request, metadata, options);
    }
    @grpc_1.methodDescriptor<AsyncRequest, AsyncResponse>({ path: "/example.v1.Async/ServerStream", requestStream: false, responseStream: true })
    public async *ServerStream(request: AsyncRequest, metadata?: grpc_1.Metadata, options?: grpc_1.CallOptions): AsyncGenerator<AsyncResponse, void, undefined> {
        yield* super.makeServerStreamRequest<AsyncRequest, AsyncResponse>("/example.v1.Async/ServerStream", request, metadata, options);
    }
    @grpc_1.methodDescriptor<AsyncRequest, AsyncResponse>({ path: "/example.v1.Async/BidiStream", requestStream: true, responseStream: true })
    public async *BidiStream(request: AsyncIterable<AsyncRequest>, metadata?: grpc_1.Metadata, options?: grpc_1.CallOptions): AsyncGenerator<AsyncResponse, void, undefined> {
        yield* super.makeBidiStreamRequest<AsyncRequest, AsyncResponse>("/example.v1.Async/BidiStream", request, metadata, options);
    }
}