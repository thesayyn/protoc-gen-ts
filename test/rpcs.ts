/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/rpcs.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export class None extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}): None {
        const message = new None({});
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
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): None {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new None();
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
    static deserializeBinary(bytes: Uint8Array): None {
        return None.deserialize(bytes);
    }
}
export class _Object extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: string;
        size?: number;
        mimeType?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("size" in data && data.size != undefined) {
                this.size = data.size;
            }
            if ("mimeType" in data && data.mimeType != undefined) {
                this.mimeType = data.mimeType;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get size() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set size(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get mimeType() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set mimeType(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    static fromObject(data: {
        id?: string;
        size?: number;
        mimeType?: string;
    }): _Object {
        const message = new _Object({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.size != null) {
            message.size = data.size;
        }
        if (data.mimeType != null) {
            message.mimeType = data.mimeType;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: string;
            size?: number;
            mimeType?: string;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.size != null) {
            data.size = this.size;
        }
        if (this.mimeType != null) {
            data.mimeType = this.mimeType;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id.length)
            writer.writeString(1, this.id);
        if (this.size != 0)
            writer.writeUint64(3, this.size);
        if (this.mimeType.length)
            writer.writeString(4, this.mimeType);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): _Object {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _Object();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readString();
                    break;
                case 3:
                    message.size = reader.readUint64();
                    break;
                case 4:
                    message.mimeType = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): _Object {
        return _Object.deserialize(bytes);
    }
}
export class Chunk extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        data?: Uint8Array;
        range?: Chunk.Range;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("data" in data && data.data != undefined) {
                this.data = data.data;
            }
            if ("range" in data && data.range != undefined) {
                this.range = data.range;
            }
        }
    }
    get data() {
        return pb_1.Message.getFieldWithDefault(this, 1, new Uint8Array()) as Uint8Array;
    }
    set data(value: Uint8Array) {
        pb_1.Message.setField(this, 1, value);
    }
    get range() {
        return pb_1.Message.getWrapperField(this, Chunk.Range, 2) as Chunk.Range;
    }
    set range(value: Chunk.Range) {
        pb_1.Message.setWrapperField(this, 2, value);
    }
    clear_range() {
        pb_1.Message.setField(this, 2, undefined);
    }
    has_range() {
        return pb_1.Message.getField(this, 2) != null;
    }
    static fromObject(data: {
        data?: Uint8Array;
        range?: ReturnType<typeof Chunk.Range.prototype.toObject>;
    }): Chunk {
        const message = new Chunk({});
        if (data.data != null) {
            message.data = data.data;
        }
        if (data.range != null) {
            message.range = Chunk.Range.fromObject(data.range);
        }
        return message;
    }
    toObject() {
        const data: {
            data?: Uint8Array;
            range?: ReturnType<typeof Chunk.Range.prototype.toObject>;
        } = {};
        if (this.data != null) {
            data.data = this.data;
        }
        if (this.range != null) {
            data.range = this.range.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.data.length)
            writer.writeBytes(1, this.data);
        if (this.has_range())
            writer.writeMessage(2, this.range, () => this.range.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Chunk {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Chunk();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.data = reader.readBytes();
                    break;
                case 2:
                    reader.readMessage(message.range, () => message.range = Chunk.Range.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Chunk {
        return Chunk.deserialize(bytes);
    }
}
export namespace Chunk {
    export class Range extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            start?: number;
            end?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("start" in data && data.start != undefined) {
                    this.start = data.start;
                }
                if ("end" in data && data.end != undefined) {
                    this.end = data.end;
                }
            }
        }
        get start() {
            return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
        }
        set start(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get end() {
            return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
        }
        set end(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        static fromObject(data: {
            start?: number;
            end?: number;
        }): Range {
            const message = new Range({});
            if (data.start != null) {
                message.start = data.start;
            }
            if (data.end != null) {
                message.end = data.end;
            }
            return message;
        }
        toObject() {
            const data: {
                start?: number;
                end?: number;
            } = {};
            if (this.start != null) {
                data.start = this.start;
            }
            if (this.end != null) {
                data.end = this.end;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.start != 0)
                writer.writeInt64(1, this.start);
            if (this.end != 0)
                writer.writeInt64(2, this.end);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Range {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Range();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.start = reader.readInt64();
                        break;
                    case 2:
                        message.end = reader.readInt64();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Range {
            return Range.deserialize(bytes);
        }
    }
    export class Query extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            id?: string;
            range?: Chunk.Range;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("id" in data && data.id != undefined) {
                    this.id = data.id;
                }
                if ("range" in data && data.range != undefined) {
                    this.range = data.range;
                }
            }
        }
        get id() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get range() {
            return pb_1.Message.getWrapperField(this, Chunk.Range, 2) as Chunk.Range;
        }
        set range(value: Chunk.Range) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        clear_range() {
            pb_1.Message.setField(this, 2, undefined);
        }
        has_range() {
            return pb_1.Message.getField(this, 2) != null;
        }
        static fromObject(data: {
            id?: string;
            range?: ReturnType<typeof Chunk.Range.prototype.toObject>;
        }): Query {
            const message = new Query({});
            if (data.id != null) {
                message.id = data.id;
            }
            if (data.range != null) {
                message.range = Chunk.Range.fromObject(data.range);
            }
            return message;
        }
        toObject() {
            const data: {
                id?: string;
                range?: ReturnType<typeof Chunk.Range.prototype.toObject>;
            } = {};
            if (this.id != null) {
                data.id = this.id;
            }
            if (this.range != null) {
                data.range = this.range.toObject();
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id.length)
                writer.writeString(1, this.id);
            if (this.has_range())
                writer.writeMessage(2, this.range, () => this.range.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Query {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Query();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readString();
                        break;
                    case 2:
                        reader.readMessage(message.range, () => message.range = Chunk.Range.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Query {
            return Query.deserialize(bytes);
        }
    }
}
export class Query extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    static fromObject(data: {
        id?: string;
    }): Query {
        const message = new Query({});
        if (data.id != null) {
            message.id = data.id;
        }
        return message;
    }
    toObject() {
        const data: {
            id?: string;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id.length)
            writer.writeString(1, this.id);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Query {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Query();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Query {
        return Query.deserialize(bytes);
    }
}
export namespace Query {
    export class Result extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            objects?: _Object[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("objects" in data && data.objects != undefined) {
                    this.objects = data.objects;
                }
            }
        }
        get objects() {
            return pb_1.Message.getRepeatedWrapperField(this, _Object, 1) as _Object[];
        }
        set objects(value: _Object[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        static fromObject(data: {
            objects?: ReturnType<typeof _Object.prototype.toObject>[];
        }): Result {
            const message = new Result({});
            if (data.objects != null) {
                message.objects = data.objects.map(item => _Object.fromObject(item));
            }
            return message;
        }
        toObject() {
            const data: {
                objects?: ReturnType<typeof _Object.prototype.toObject>[];
            } = {};
            if (this.objects != null) {
                data.objects = this.objects.map((item: _Object) => item.toObject());
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.objects.length)
                writer.writeRepeatedMessage(1, this.objects, (item: _Object) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Result {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Result();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.objects, () => pb_1.Message.addToRepeatedWrapperField(message, 1, _Object.deserialize(reader), _Object));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Result {
            return Result.deserialize(bytes);
        }
    }
}
export class Put extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        id?: string;
        chunk?: Chunk;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("chunk" in data && data.chunk != undefined) {
                this.chunk = data.chunk;
            }
        }
    }
    get id() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get chunk() {
        return pb_1.Message.getWrapperField(this, Chunk, 3) as Chunk;
    }
    set chunk(value: Chunk) {
        pb_1.Message.setWrapperField(this, 3, value);
    }
    clear_chunk() {
        pb_1.Message.setField(this, 3, undefined);
    }
    has_chunk() {
        return pb_1.Message.getField(this, 3) != null;
    }
    static fromObject(data: {
        id?: string;
        chunk?: ReturnType<typeof Chunk.prototype.toObject>;
    }): Put {
        const message = new Put({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.chunk != null) {
            message.chunk = Chunk.fromObject(data.chunk);
        }
        return message;
    }
    toObject() {
        const data: {
            id?: string;
            chunk?: ReturnType<typeof Chunk.prototype.toObject>;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.chunk != null) {
            data.chunk = this.chunk.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.id.length)
            writer.writeString(1, this.id);
        if (this.has_chunk())
            writer.writeMessage(3, this.chunk, () => this.chunk.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Put {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Put();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readString();
                    break;
                case 3:
                    reader.readMessage(message.chunk, () => message.chunk = Chunk.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Put {
        return Put.deserialize(bytes);
    }
}
interface GrpcUnaryServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    (message: P, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
}
interface GrpcStreamServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
    (message: P, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
}
interface GrpWritableServiceInterface<P, R> {
    (metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    (callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
}
interface GrpcChunkServiceInterface<P, R> {
    (metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
    (options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
}
interface GrpcPromiseServiceInterface<P, R> {
    (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<R>;
    (message: P, options?: grpc_1.CallOptions): Promise<R>;
}
export abstract class UnimplementedStorageService {
    static definition = {
        query: {
            path: "/Storage/query",
            requestStream: false,
            responseStream: true,
            requestSerialize: (message: Query) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => Query.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: Query.Result) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => Query.Result.deserialize(new Uint8Array(bytes))
        },
        get: {
            path: "/Storage/get",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: Query) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => Query.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: _Object) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => _Object.deserialize(new Uint8Array(bytes))
        },
        put: {
            path: "/Storage/put",
            requestStream: true,
            responseStream: false,
            requestSerialize: (message: Put) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => Put.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: _Object) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => _Object.deserialize(new Uint8Array(bytes))
        },
        chunk: {
            path: "/Storage/chunk",
            requestStream: true,
            responseStream: true,
            requestSerialize: (message: Chunk.Query) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => Chunk.Query.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: Chunk) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => Chunk.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract query(call: grpc_1.ServerWritableStream<Query, Query.Result>): void;
    abstract get(call: grpc_1.ServerUnaryCall<Query, _Object>, callback: grpc_1.sendUnaryData<_Object>): void;
    abstract put(call: grpc_1.ServerReadableStream<Put, _Object>, callback: grpc_1.sendUnaryData<_Object>): void;
    abstract chunk(call: grpc_1.ServerDuplexStream<Chunk.Query, Chunk>): void;
}
export class StorageClient extends grpc_1.makeGenericClientConstructor(UnimplementedStorageService.definition, "Storage", {}) {
    constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
        super(address, credentials, options);
    }
    query: GrpcStreamServiceInterface<Query, Query> = (message: Query, metadata?: grpc_1.Metadata | grpc_1.CallOptions, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<Query> => {
        return super.query(message, metadata, options);
    };
    get: GrpcUnaryServiceInterface<Query, _Object> = (message: Query, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<_Object>, options?: grpc_1.CallOptions | grpc_1.requestCallback<_Object>, callback?: grpc_1.requestCallback<_Object>): grpc_1.ClientUnaryCall => {
        return super.get(message, metadata, options, callback);
    };
    put: GrpWritableServiceInterface<Put, _Object> = (metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<_Object>, options?: grpc_1.CallOptions | grpc_1.requestCallback<_Object>, callback?: grpc_1.requestCallback<_Object>): grpc_1.ClientWritableStream<Put> => {
        return super.put(metadata, options, callback);
    };
    chunk: GrpcChunkServiceInterface<Chunk.Query, Chunk> = (metadata?: grpc_1.Metadata | grpc_1.CallOptions, options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<Chunk.Query, Chunk> => {
        return super.chunk(metadata, options);
    };
}
