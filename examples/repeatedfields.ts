import * as pb_1 from "google-protobuf";
export class RepeatedMessages extends pb_1.Message {
    protected readonly repeatedFields_: number[] = [1];
    protected readonly displayName: string = "proto.RepeatedMessages";
    constructor(data?: any[]) {
        super();
        pb_1.Message.initialize(this, data, 0, -1, this.repeatedFields_, null);
    }
    get test(): string[] {
        return pb_1.Message.getField(this, 1) as string[];
    }
    set test(value: string[]) {
        pb_1.Message.setField(this, 1, value);
    }
    toObject() {
        return {
            test: (pb_1.Message.getField(this, 1) as string[])
        };
    }
    serializeBinary(): Uint8Array {
        const writer = new pb_1.BinaryWriter();
        if (this.test)
            writer.writeRepeatedString(1, this.test);
        return writer.getResultBuffer();
    }
    static deserializeBinary(bytes: Uint8Array): RepeatedMessages {
        const reader = new pb_1.BinaryReader(bytes), message = new RepeatedMessages();
        while (reader.nextField()) {
            switch (reader.getFieldNumber()) {
                // TODO: support for repeated non string fields.
                case 1: message.test = reader.readString();
                default: reader.skipField();
            }
        }
        return message;
    }
}
export namespace RepeatedMessages { }
