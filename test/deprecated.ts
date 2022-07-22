/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/deprecated.proto
 * git: https://github.com/thesayyn/protoc-gen-ts
 * @deprecated */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends Uint8Array ? T[P] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
export enum EnumName {
    FIRST = 0,
    /** @deprecated*/
    THIRD = 3
}
/** @deprecated*/
export enum EnumName2 {
    SECOND = 0
}
export class MessageName extends pb_1.Message {
    #one_of_decls: number[][] = [[2, 3]];
    constructor(data?: any[] | ({
        /** @deprecated*/
        deprecated_field?: string;
    } & (({
        me?: string;
        me_deprecated?: never;
    } | {
        me?: never;
        /** @deprecated*/
        me_deprecated?: string;
    })))) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("deprecated_field" in data && data.deprecated_field != undefined) {
                this.deprecated_field = data.deprecated_field;
            }
            if ("me" in data && data.me != undefined) {
                this.me = data.me;
            }
            if ("me_deprecated" in data && data.me_deprecated != undefined) {
                this.me_deprecated = data.me_deprecated;
            }
        }
    }
    /** @deprecated*/
    get deprecated_field() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    /** @deprecated*/
    set deprecated_field(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get me() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set me(value: string) {
        pb_1.Message.setOneofField(this, 2, this.#one_of_decls[0], value);
    }
    get has_me() {
        return pb_1.Message.getField(this, 2) != null;
    }
    /** @deprecated*/
    get me_deprecated() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    /** @deprecated*/
    set me_deprecated(value: string) {
        pb_1.Message.setOneofField(this, 3, this.#one_of_decls[0], value);
    }
    /** @deprecated*/
    get has_me_deprecated() {
        return pb_1.Message.getField(this, 3) != null;
    }
    get test() {
        const cases: {
            [index: number]: "none" | "me" | "me_deprecated";
        } = {
            0: "none",
            2: "me",
            3: "me_deprecated"
        };
        return cases[pb_1.Message.computeOneofCase(this, [2, 3])];
    }
    static fromObject(data: RecursivePartial<MessageName.AsObject>): MessageName {
        const message = new MessageName({});
        if (data.deprecated_field != null) {
            message.deprecated_field = data.deprecated_field;
        }
        if (data.me != null) {
            message.me = data.me;
        }
        if (data.me_deprecated != null) {
            message.me_deprecated = data.me_deprecated;
        }
        return message;
    }
    toObject() {
        const data: MessageName.AsObject = {
            deprecated_field: this.deprecated_field,
            me: this.me,
            me_deprecated: this.me_deprecated
        };
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.deprecated_field.length)
            writer.writeString(1, this.deprecated_field);
        if (this.has_me)
            writer.writeString(2, this.me);
        if (this.has_me_deprecated)
            writer.writeString(3, this.me_deprecated);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MessageName {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MessageName();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.deprecated_field = reader.readString();
                    break;
                case 2:
                    message.me = reader.readString();
                    break;
                case 3:
                    message.me_deprecated = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): MessageName {
        return MessageName.deserialize(bytes);
    }
}
export namespace MessageName {
    export type AsObject = {
        deprecated_field: string;
        me: string;
        me_deprecated: string;
    };
}
/** @deprecated*/
export class MessageName2 extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {}) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") { }
    }
    static fromObject(data: RecursivePartial<MessageName2.AsObject>): MessageName2 {
        const message = new MessageName2({});
        return message;
    }
    toObject() {
        const data: MessageName2.AsObject = {};
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MessageName2 {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new MessageName2();
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
    static deserializeBinary(bytes: Uint8Array): MessageName2 {
        return MessageName2.deserialize(bytes);
    }
}
export namespace MessageName2 {
    export type AsObject = {};
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
export abstract class UnimplementedServiceNameService {
    static definition = {
        MethodName: {
            path: "/ServiceName/MethodName",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: MessageName) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => MessageName.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: MessageName2) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => MessageName2.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract MethodName(call: grpc_1.ServerUnaryCall<MessageName, MessageName2>, callback: grpc_1.sendUnaryData<MessageName2>): void;
}
export class ServiceNameClient extends grpc_1.makeGenericClientConstructor(UnimplementedServiceNameService.definition, "ServiceName", {}) {
    constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
        super(address, credentials, options);
    }
    /** @deprecated*/
    MethodName: GrpcUnaryServiceInterface<MessageName, MessageName2> = (message: MessageName, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<MessageName2>, options?: grpc_1.CallOptions | grpc_1.requestCallback<MessageName2>, callback?: grpc_1.requestCallback<MessageName2>): grpc_1.ClientUnaryCall => {
        return super.MethodName(message, metadata, options, callback);
    };
}
/** @deprecated*/
export abstract class UnimplementedServiceName2Service {
    static definition = {
        MethodName: {
            path: "/ServiceName2/MethodName",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: MessageName) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => MessageName.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: MessageName2) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => MessageName2.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract MethodName(call: grpc_1.ServerUnaryCall<MessageName, MessageName2>, callback: grpc_1.sendUnaryData<MessageName2>): void;
}
/** @deprecated*/
export class ServiceName2Client extends grpc_1.makeGenericClientConstructor(UnimplementedServiceName2Service.definition, "ServiceName2", {}) {
    constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
        super(address, credentials, options);
    }
    MethodName: GrpcUnaryServiceInterface<MessageName, MessageName2> = (message: MessageName, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<MessageName2>, options?: grpc_1.CallOptions | grpc_1.requestCallback<MessageName2>, callback?: grpc_1.requestCallback<MessageName2>): grpc_1.ClientUnaryCall => {
        return super.MethodName(message, metadata, options, callback);
    };
}
