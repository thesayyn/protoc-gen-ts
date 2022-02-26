/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.1
 * source: test/_/importdirective.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./imported";
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export namespace importdirective {
    export class Message extends pb_1.Message {
        constructor(data?: any[] | {
            importedField?: dependency_1.importdirective.Imported;
            submessageField?: dependency_1.importdirective.Imported.SubMessage;
            enumField?: dependency_1.importdirective.Imported.SubMessage.MyEnum;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("importedField" in data && data.importedField != undefined) {
                    this.importedField = data.importedField;
                }
                if ("submessageField" in data && data.submessageField != undefined) {
                    this.submessageField = data.submessageField;
                }
                if ("enumField" in data && data.enumField != undefined) {
                    this.enumField = data.enumField;
                }
            }
        }
        get importedField() {
            return pb_1.Message.getWrapperField(this, dependency_1.importdirective.Imported, 1) as dependency_1.importdirective.Imported;
        }
        set importedField(value: dependency_1.importdirective.Imported) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get submessageField() {
            return pb_1.Message.getWrapperField(this, dependency_1.importdirective.Imported.SubMessage, 2) as dependency_1.importdirective.Imported.SubMessage;
        }
        set submessageField(value: dependency_1.importdirective.Imported.SubMessage) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        get enumField() {
            return pb_1.Message.getFieldWithDefault(this, 3, dependency_1.importdirective.Imported.SubMessage.MyEnum.VALUE) as dependency_1.importdirective.Imported.SubMessage.MyEnum;
        }
        set enumField(value: dependency_1.importdirective.Imported.SubMessage.MyEnum) {
            pb_1.Message.setField(this, 3, value);
        }
        static fromObject(data: {
            importedField?: ReturnType<typeof dependency_1.importdirective.Imported.prototype.toObject>;
            submessageField?: ReturnType<typeof dependency_1.importdirective.Imported.SubMessage.prototype.toObject>;
            enumField?: dependency_1.importdirective.Imported.SubMessage.MyEnum;
        }) {
            const message = new Message({});
            if (data.importedField != null) {
                message.importedField = dependency_1.importdirective.Imported.fromObject(data.importedField);
            }
            if (data.submessageField != null) {
                message.submessageField = dependency_1.importdirective.Imported.SubMessage.fromObject(data.submessageField);
            }
            if (data.enumField != null) {
                message.enumField = data.enumField;
            }
            return message;
        }
        toObject() {
            const data: {
                importedField?: ReturnType<typeof dependency_1.importdirective.Imported.prototype.toObject>;
                submessageField?: ReturnType<typeof dependency_1.importdirective.Imported.SubMessage.prototype.toObject>;
                enumField?: dependency_1.importdirective.Imported.SubMessage.MyEnum;
            } = {
                importedField: this.importedField != null ? this.importedField.toObject() : undefined,
                submessageField: this.submessageField != null ? this.submessageField.toObject() : undefined,
                enumField: this.enumField
            };
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (pb_1.Message.getField(this, 1) != null)
                writer.writeMessage(1, this.importedField, () => this.importedField.serialize(writer));
            if (pb_1.Message.getField(this, 2) != null)
                writer.writeMessage(2, this.submessageField, () => this.submessageField.serialize(writer));
            if (pb_1.Message.getField(this, 3) != null)
                writer.writeEnum(3, this.enumField);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Message {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Message();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.importedField, () => message.importedField = dependency_1.importdirective.Imported.deserialize(reader));
                        break;
                    case 2:
                        reader.readMessage(message.submessageField, () => message.submessageField = dependency_1.importdirective.Imported.SubMessage.deserialize(reader));
                        break;
                    case 3:
                        message.enumField = reader.readEnum();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): Message {
            return Message.deserialize(bytes);
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
    export abstract class UnimplementedImportedServiceService {
        static definition = {
            ImportedServiceTest: {
                path: "/importdirective.ImportedService/ImportedServiceTest",
                requestStream: false,
                responseStream: false,
                requestSerialize: (message: dependency_1.importdirective.Imported) => Buffer.from(message.serialize()),
                requestDeserialize: (bytes: Buffer) => dependency_1.importdirective.Imported.deserialize(new Uint8Array(bytes)),
                responseSerialize: (message: dependency_1.importdirective.Imported.SubMessage) => Buffer.from(message.serialize()),
                responseDeserialize: (bytes: Buffer) => dependency_1.importdirective.Imported.SubMessage.deserialize(new Uint8Array(bytes))
            }
        };
        [method: string]: grpc_1.UntypedHandleCall;
        abstract ImportedServiceTest(call: grpc_1.ServerUnaryCall<dependency_1.importdirective.Imported, dependency_1.importdirective.Imported.SubMessage>, callback: grpc_1.sendUnaryData<dependency_1.importdirective.Imported.SubMessage>): void;
    }
    export class ImportedServiceClient extends grpc_1.makeGenericClientConstructor(UnimplementedImportedServiceService.definition, "ImportedService", {}) {
        constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
            super(address, credentials, options);
        }
        ImportedServiceTest: GrpcUnaryServiceInterface<dependency_1.importdirective.Imported, dependency_1.importdirective.Imported.SubMessage> = (message: dependency_1.importdirective.Imported, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<dependency_1.importdirective.Imported.SubMessage>, options?: grpc_1.CallOptions | grpc_1.requestCallback<dependency_1.importdirective.Imported.SubMessage>, callback?: grpc_1.requestCallback<dependency_1.importdirective.Imported.SubMessage>): grpc_1.ClientUnaryCall => {
            return super.ImportedServiceTest(message, metadata, options, callback);
        };
    }
}
