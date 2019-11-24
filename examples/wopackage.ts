import * as pb_1 from "google-protobuf";
export class SearchRequest extends pb_1.Message {
    protected readonly repeatedFields_: number[] = [9];
    protected readonly displayName: string = "proto.SearchRequest";
    constructor(data?: any[]) {
        super();
        pb_1.Message.initialize(this, data, 0, -1, this.repeatedFields_, null);
    }
    get query(): string | undefined {
        return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
    }
    set query(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get page_number(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
    }
    set page_number(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get result_per_page(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
    }
    set result_per_page(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get sint32(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
    }
    set sint32(value: number) {
        pb_1.Message.setField(this, 4, value);
    }
    get sint64(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
    }
    set sint64(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get sfixed32(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
    }
    set sfixed32(value: number) {
        pb_1.Message.setField(this, 6, value);
    }
    get sfixed64(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
    }
    set sfixed64(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    get fixed32(): number | undefined {
        return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
    }
    set fixed32(value: number) {
        pb_1.Message.setField(this, 8, value);
    }
    get corpus(): SearchRequest.Corpus[] {
        return pb_1.Message.getField(this, 9) as SearchRequest.Corpus[];
    }
    set corpus(value: SearchRequest.Corpus[]) {
        pb_1.Message.setField(this, 9, value);
    }
    toObject() {
        return {
            query: (pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined),
            page_number: (pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined),
            result_per_page: (pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined),
            sint32: (pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined),
            sint64: (pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined),
            sfixed32: (pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined),
            sfixed64: (pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined),
            fixed32: (pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined),
            corpus: (pb_1.Message.getField(this, 9) as SearchRequest.Corpus[])
        };
    }
    serializeBinary(): Uint8Array {
        const writer = new pb_1.BinaryWriter();
        if (this.query)
            writer.writeString(1, this.query);
        if (this.page_number)
            writer.writeInt32(2, this.page_number);
        if (this.result_per_page)
            writer.writeInt64(3, this.result_per_page);
        if (this.sint32)
            writer.writeSint32(4, this.sint32);
        if (this.sint64)
            writer.writeSint64(5, this.sint64);
        if (this.sfixed32)
            writer.writeSfixed32(6, this.sfixed32);
        if (this.sfixed64)
            writer.writeSfixed64(7, this.sfixed64);
        if (this.fixed32)
            writer.writeFixed32(8, this.fixed32);
        if (this.corpus)
            writer.writePackedEnum(9, this.corpus);
        return writer.getResultBuffer();
    }
    static deserializeBinary(bytes: Uint8Array): SearchRequest {
        const reader = new pb_1.BinaryReader(bytes), message = new SearchRequest();
        while (reader.nextField()) {
            switch (reader.getFieldNumber()) {
                case 1: message.query = reader.readString();
                case 2: message.page_number = reader.readInt32();
                case 3: message.result_per_page = reader.readInt64();
                case 4: message.sint32 = reader.readSint32();
                case 5: message.sint64 = reader.readSint64();
                case 6: message.sfixed32 = reader.readSfixed32();
                case 7: message.sfixed64 = reader.readSfixed64();
                case 8: message.fixed32 = reader.readFixed32();
                case 9: message.corpus = reader.readPackedEnum();
                default: reader.skipField();
            }
        }
        return message;
    }
}
export namespace SearchRequest {
    export class Response extends pb_1.Message {
        protected readonly repeatedFields_: number[] = [9];
        protected readonly displayName: string = "proto.SearchRequest.Response";
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, this.repeatedFields_, null);
        }
        get corpus(): SearchRequest.Corpus[] {
            return pb_1.Message.getField(this, 9) as SearchRequest.Corpus[];
        }
        set corpus(value: SearchRequest.Corpus[]) {
            pb_1.Message.setField(this, 9, value);
        }
        toObject() {
            return {
                corpus: (pb_1.Message.getField(this, 9) as SearchRequest.Corpus[])
            };
        }
        serializeBinary(): Uint8Array {
            const writer = new pb_1.BinaryWriter();
            if (this.corpus)
                writer.writePackedEnum(9, this.corpus);
            return writer.getResultBuffer();
        }
        static deserializeBinary(bytes: Uint8Array): Response {
            const reader = new pb_1.BinaryReader(bytes), message = new Response();
            while (reader.nextField()) {
                switch (reader.getFieldNumber()) {
                    case 9: message.corpus = reader.readPackedEnum();
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export enum Corpus {
        UNIVERSAL = 0,
        WEB = 1,
        IMAGES = 2,
        LOCAL = 3,
        NEWS = 4,
        PRODUCTS = 5,
        VIDEO = 6
    }
}
