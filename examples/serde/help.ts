import * as imp_0 from "npm:google-protobuf";
export enum Topic {
    BUILD = 0,
    PACK = 1,
    INIT = 2
}
export class Help {
    static type = "Help";
    #unknown_fields = [];
    topic?: Topic = 0;
    message?: string = "";
    short?: string = "";
    generated_via?: string = "";
    mergeFrom(bytes: Uint8Array) {
        const br = new imp_0.BinaryReader(bytes);
        while(br.nextField() && !br.isEndGroup()){
            switch(br.getFieldNumber()){
                case 1:
                    this.topic = br.readInt32();
                    break;
                case 2:
                    this.message = br.readString();
                    break;
                case 3:
                    this.short = br.readString();
                    break;
                case 4:
                    this.generated_via = br.readString();
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes: Uint8Array) {
        const message = new Help;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.topic !== undefined && this.topic !== 0) {
            bw.writeInt32(1, this.topic);
        }
        if (this.message !== undefined && this.message !== "") {
            bw.writeString(2, this.message);
        }
        if (this.short !== undefined && this.short !== "") {
            bw.writeString(3, this.short);
        }
        if (this.generated_via !== undefined && this.generated_via !== "") {
            bw.writeString(4, this.generated_via);
        }
        for (const uf of this.#unknown_fields){
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.topic !== undefined && this.topic !== 0) json.topic = Topic[this.topic] ?? this.topic;
        if (this.message !== undefined && this.message !== "") json.message = this.message;
        if (this.short !== undefined && this.short !== "") json.short = this.short;
        if (this.generated_via !== undefined && this.generated_via !== "") json.generatedVia = this.generated_via;
        return json;
    }
    static fromJson(json: unknown) {
        const message = new Help;
        const oneof = new Set;
        const topic = json.hasOwnProperty("topic") ? json.topic : json.topic;
        if (topic !== null && topic !== undefined && topic !== 0) {
            if (!(typeof topic === "number" || typeof topic === "string" && topic in Topic)) throw new Error("illegal value for topic");
            message.topic = typeof topic === "number" ? topic : Topic[topic];
        }
        const message = json.hasOwnProperty("message") ? json.message : json.message;
        if (message !== null && message !== undefined && message !== "") {
            if (!(typeof message === "string")) throw new Error("illegal value for message");
            message.message = message;
        }
        const short = json.hasOwnProperty("short") ? json.short : json.short;
        if (short !== null && short !== undefined && short !== "") {
            if (!(typeof short === "string")) throw new Error("illegal value for short");
            message.short = short;
        }
        const generated_via = json.hasOwnProperty("generatedVia") ? json.generatedVia : json.generated_via;
        if (generated_via !== null && generated_via !== undefined && generated_via !== "") {
            if (!(typeof generated_via === "string")) throw new Error("illegal value for generatedVia");
            message.generated_via = generated_via;
        }
        return message;
    }
}
