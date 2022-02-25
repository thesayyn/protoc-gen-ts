/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/no_namespace/nested.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export enum Type {
    HTTP = 0,
    DATABASE = 1,
    SCHEDULE = 3,
    FIREHOSE = 4,
    SYSTEM = 5,
    BUCKET = 6
}
export class SchedulingContext extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        env?: SchedulingContextEnv[];
        timeout?: number;
        batch?: SchedulingContextBatch;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("env" in data && data.env != undefined) {
                this.env = data.env;
            }
            if ("timeout" in data && data.timeout != undefined) {
                this.timeout = data.timeout;
            }
            if ("batch" in data && data.batch != undefined) {
                this.batch = data.batch;
            }
        }
    }
    get env() {
        return pb_1.Message.getRepeatedWrapperField(this, SchedulingContextEnv, 2) as SchedulingContextEnv[];
    }
    set env(value: SchedulingContextEnv[]) {
        pb_1.Message.setRepeatedWrapperField(this, 2, value);
    }
    get timeout() {
        return pb_1.Message.getField(this, 3) as number;
    }
    set timeout(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get batch() {
        return pb_1.Message.getWrapperField(this, SchedulingContextBatch, 4) as SchedulingContextBatch;
    }
    set batch(value: SchedulingContextBatch) {
        pb_1.Message.setWrapperField(this, 4, value);
    }
    static fromObject(data: {
        env?: ReturnType<typeof SchedulingContextEnv.prototype.toObject>[];
        timeout?: number;
        batch?: ReturnType<typeof SchedulingContextBatch.prototype.toObject>;
    }) {
        const message = new SchedulingContext({});
        if (data.env != null) {
            message.env = data.env.map(item => SchedulingContextEnv.fromObject(item));
        }
        if (data.timeout != null) {
            message.timeout = data.timeout;
        }
        if (data.batch != null) {
            message.batch = SchedulingContextBatch.fromObject(data.batch);
        }
        return message;
    }
    toObject() {
        const data: {
            env?: ReturnType<typeof SchedulingContextEnv.prototype.toObject>[];
            timeout?: number;
            batch?: ReturnType<typeof SchedulingContextBatch.prototype.toObject>;
        } = {};
        if (this.env != null) {
            data.env = this.env.map((item: SchedulingContextEnv) => item.toObject());
        }
        if (this.timeout != null) {
            data.timeout = this.timeout;
        }
        if (this.batch != null) {
            data.batch = this.batch.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.env !== undefined)
            writer.writeRepeatedMessage(2, this.env, (item: SchedulingContextEnv) => item.serialize(writer));
        if (this.timeout !== undefined)
            writer.writeInt32(3, this.timeout);
        if (this.batch !== undefined)
            writer.writeMessage(4, this.batch, () => this.batch.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SchedulingContext {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SchedulingContext();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 2:
                    reader.readMessage(message.env, () => pb_1.Message.addToRepeatedWrapperField(message, 2, SchedulingContextEnv.deserialize(reader), SchedulingContextEnv));
                    break;
                case 3:
                    message.timeout = reader.readInt32();
                    break;
                case 4:
                    reader.readMessage(message.batch, () => message.batch = SchedulingContextBatch.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SchedulingContext {
        return SchedulingContext.deserialize(bytes);
    }
}
export class SchedulingContextEnv extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        key?: string;
        value?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("key" in data && data.key != undefined) {
                this.key = data.key;
            }
            if ("value" in data && data.value != undefined) {
                this.value = data.value;
            }
        }
    }
    get key() {
        return pb_1.Message.getField(this, 1) as string;
    }
    set key(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get value() {
        return pb_1.Message.getField(this, 2) as string;
    }
    set value(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        key?: string;
        value?: string;
    }) {
        const message = new SchedulingContextEnv({});
        if (data.key != null) {
            message.key = data.key;
        }
        if (data.value != null) {
            message.value = data.value;
        }
        return message;
    }
    toObject() {
        const data: {
            key?: string;
            value?: string;
        } = {};
        if (this.key != null) {
            data.key = this.key;
        }
        if (this.value != null) {
            data.value = this.value;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.key === "string" && this.key.length)
            writer.writeString(1, this.key);
        if (typeof this.value === "string" && this.value.length)
            writer.writeString(2, this.value);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SchedulingContextEnv {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SchedulingContextEnv();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.key = reader.readString();
                    break;
                case 2:
                    message.value = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SchedulingContextEnv {
        return SchedulingContextEnv.deserialize(bytes);
    }
}
export class SchedulingContextBatch extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        limit?: number;
        deadline?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("limit" in data && data.limit != undefined) {
                this.limit = data.limit;
            }
            if ("deadline" in data && data.deadline != undefined) {
                this.deadline = data.deadline;
            }
        }
    }
    get limit() {
        return pb_1.Message.getField(this, 1) as number;
    }
    set limit(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get deadline() {
        return pb_1.Message.getField(this, 2) as number;
    }
    set deadline(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        limit?: number;
        deadline?: number;
    }) {
        const message = new SchedulingContextBatch({});
        if (data.limit != null) {
            message.limit = data.limit;
        }
        if (data.deadline != null) {
            message.deadline = data.deadline;
        }
        return message;
    }
    toObject() {
        const data: {
            limit?: number;
            deadline?: number;
        } = {};
        if (this.limit != null) {
            data.limit = this.limit;
        }
        if (this.deadline != null) {
            data.deadline = this.deadline;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.limit !== undefined)
            writer.writeUint64(1, this.limit);
        if (this.deadline !== undefined)
            writer.writeUint64(2, this.deadline);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SchedulingContextBatch {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SchedulingContextBatch();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.limit = reader.readUint64();
                    break;
                case 2:
                    message.deadline = reader.readUint64();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SchedulingContextBatch {
        return SchedulingContextBatch.deserialize(bytes);
    }
}
export class Target extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        id?: string;
        cwd?: string;
        handler?: string;
        context?: SchedulingContext;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("cwd" in data && data.cwd != undefined) {
                this.cwd = data.cwd;
            }
            if ("handler" in data && data.handler != undefined) {
                this.handler = data.handler;
            }
            if ("context" in data && data.context != undefined) {
                this.context = data.context;
            }
        }
    }
    get id() {
        return pb_1.Message.getField(this, 1) as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get cwd() {
        return pb_1.Message.getField(this, 2) as string;
    }
    set cwd(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get handler() {
        return pb_1.Message.getField(this, 3) as string;
    }
    set handler(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get context() {
        return pb_1.Message.getWrapperField(this, SchedulingContext, 4) as SchedulingContext;
    }
    set context(value: SchedulingContext) {
        pb_1.Message.setWrapperField(this, 4, value);
    }
    static fromObject(data: {
        id?: string;
        cwd?: string;
        handler?: string;
        context?: ReturnType<typeof SchedulingContext.prototype.toObject>;
    }) {
        const message = new Target({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.cwd != null) {
            message.cwd = data.cwd;
        }
        if (data.handler != null) {
            message.handler = data.handler;
        }
        if (data.context != null) {
            message.context = SchedulingContext.fromObject(data.context);
        }
        return message;
    }
    toObject() {
        const data: {
            id?: string;
            cwd?: string;
            handler?: string;
            context?: ReturnType<typeof SchedulingContext.prototype.toObject>;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.cwd != null) {
            data.cwd = this.cwd;
        }
        if (this.handler != null) {
            data.handler = this.handler;
        }
        if (this.context != null) {
            data.context = this.context.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.id === "string" && this.id.length)
            writer.writeString(1, this.id);
        if (typeof this.cwd === "string" && this.cwd.length)
            writer.writeString(2, this.cwd);
        if (typeof this.handler === "string" && this.handler.length)
            writer.writeString(3, this.handler);
        if (this.context !== undefined)
            writer.writeMessage(4, this.context, () => this.context.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Target {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Target();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readString();
                    break;
                case 2:
                    message.cwd = reader.readString();
                    break;
                case 3:
                    message.handler = reader.readString();
                    break;
                case 4:
                    reader.readMessage(message.context, () => message.context = SchedulingContext.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Target {
        return Target.deserialize(bytes);
    }
}
export class Event extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {
        id?: string;
        type?: Type;
        target?: Target;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("id" in data && data.id != undefined) {
                this.id = data.id;
            }
            if ("type" in data && data.type != undefined) {
                this.type = data.type;
            }
            if ("target" in data && data.target != undefined) {
                this.target = data.target;
            }
        }
    }
    get id() {
        return pb_1.Message.getField(this, 1) as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get type() {
        return pb_1.Message.getField(this, 2) as Type;
    }
    set type(value: Type) {
        pb_1.Message.setField(this, 2, value);
    }
    get target() {
        return pb_1.Message.getWrapperField(this, Target, 3) as Target;
    }
    set target(value: Target) {
        pb_1.Message.setWrapperField(this, 3, value);
    }
    static fromObject(data: {
        id?: string;
        type?: Type;
        target?: ReturnType<typeof Target.prototype.toObject>;
    }) {
        const message = new Event({});
        if (data.id != null) {
            message.id = data.id;
        }
        if (data.type != null) {
            message.type = data.type;
        }
        if (data.target != null) {
            message.target = Target.fromObject(data.target);
        }
        return message;
    }
    toObject() {
        const data: {
            id?: string;
            type?: Type;
            target?: ReturnType<typeof Target.prototype.toObject>;
        } = {};
        if (this.id != null) {
            data.id = this.id;
        }
        if (this.type != null) {
            data.type = this.type;
        }
        if (this.target != null) {
            data.target = this.target.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (typeof this.id === "string" && this.id.length)
            writer.writeString(1, this.id);
        if (this.type !== undefined)
            writer.writeEnum(2, this.type);
        if (this.target !== undefined)
            writer.writeMessage(3, this.target, () => this.target.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Event {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Event();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.id = reader.readString();
                    break;
                case 2:
                    message.type = reader.readEnum();
                    break;
                case 3:
                    reader.readMessage(message.target, () => message.target = Target.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Event {
        return Event.deserialize(bytes);
    }
}
export class Pop extends pb_1.Message {
    #one_of_decls = [];
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
        return pb_1.Message.getField(this, 1) as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    static fromObject(data: {
        id?: string;
    }) {
        const message = new Pop({});
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
        if (typeof this.id === "string" && this.id.length)
            writer.writeString(1, this.id);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Pop {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Pop();
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
    static deserializeBinary(bytes: Uint8Array): Pop {
        return Pop.deserialize(bytes);
    }
}
export class Complete extends pb_1.Message {
    #one_of_decls = [];
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
        return pb_1.Message.getField(this, 1) as string;
    }
    set id(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    static fromObject(data: {
        id?: string;
    }) {
        const message = new Complete({});
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
        if (typeof this.id === "string" && this.id.length)
            writer.writeString(1, this.id);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Complete {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Complete();
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
    static deserializeBinary(bytes: Uint8Array): Complete {
        return Complete.deserialize(bytes);
    }
}
export class CompleteResult extends pb_1.Message {
    #one_of_decls = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: {}) {
        const message = new CompleteResult({});
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
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CompleteResult {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new CompleteResult();
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
    static deserializeBinary(bytes: Uint8Array): CompleteResult {
        return CompleteResult.deserialize(bytes);
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
export abstract class UnimplementedQueueService {
    static definition = {
        pop: {
            path: "/event.Queue/pop",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: Pop) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => Pop.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: Event) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => Event.deserialize(new Uint8Array(bytes))
        },
        complete: {
            path: "/event.Queue/complete",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: Complete) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => Complete.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: CompleteResult) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => CompleteResult.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract pop(call: grpc_1.ServerUnaryCall<Pop, Event>, callback: grpc_1.sendUnaryData<Event>): void;
    abstract complete(call: grpc_1.ServerUnaryCall<Complete, CompleteResult>, callback: grpc_1.sendUnaryData<CompleteResult>): void;
}
export class QueueClient extends grpc_1.makeGenericClientConstructor(UnimplementedQueueService.definition, "Queue", {}) {
    constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
        super(address, credentials, options);
    }
    pop: GrpcUnaryServiceInterface<Pop, Event> = (message: Pop, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<Event>, options?: grpc_1.CallOptions | grpc_1.requestCallback<Event>, callback?: grpc_1.requestCallback<Event>): grpc_1.ClientUnaryCall => {
        return super.pop(message, metadata, options, callback);
    };
    complete: GrpcUnaryServiceInterface<Complete, CompleteResult> = (message: Complete, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<CompleteResult>, options?: grpc_1.CallOptions | grpc_1.requestCallback<CompleteResult>, callback?: grpc_1.requestCallback<CompleteResult>): grpc_1.ClientUnaryCall => {
        return super.complete(message, metadata, options, callback);
    };
}
