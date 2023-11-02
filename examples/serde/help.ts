import * as imp_0 from "npm:google-protobuf";
export enum Topic {
    BUILD = 0,
    PACK = 1,
    INIT = 2
}
export class Help {
    #unknown_fields = [];
    topic?: Topic = undefined;
    message?: string = undefined;
    short?: string = undefined;
    generated_via?: string = undefined;
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
    static deserialize(bytes: Uint8Array) {
        const message = new Help;
        message.mergeFrom(bytes);
        return message;
    }
    serialize() {
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
        if (this.topic !== undefined && this.topic !== 0) json.topic = Topic[this.topic];
        if (this.message !== undefined && this.message !== "") json.message = this.message;
        if (this.short !== undefined && this.short !== "") json.short = this.short;
        if (this.generated_via !== undefined && this.generated_via !== "") json.generatedVia = this.generated_via;
        return json;
    }
}
