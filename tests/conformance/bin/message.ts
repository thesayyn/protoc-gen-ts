// @deno-types="https://esm.sh/v78/@types/google-protobuf@latest/index.d.ts"
import * as imp_1 from "npm:google-protobuf";
export class theater_Theater {
    t_string: string;
    t_bool: boolean;
    t_int32: number;
    t_int64: number;

    static deserialize(bytes: Uint8Array) {
        const message = new theater_Theater;
        const br = new imp_1.BinaryReader(bytes);
        while(br.nextField() && !br.isEndGroup()){
            switch(br.getFieldNumber()){
                case 1:
                    message.t_string = br.readString();
                    break;
                case 2:
                    message.t_bool = br.readBool();
                    break;
                case 3:
                    message.t_int32 = br.readInt32();
                    break;
                case 4:
                    message.t_int64 = br.readInt64();
                    break;
                default:
                    br.skipField();
            }
        }
        return message;
    }
    serialize() {
        const bw = new imp_1.BinaryWriter;
        if (this.t_string !== undefined) {
            bw.writeString(1, this.t_string);
        }
        if (this.t_bool !== undefined) {
            bw.writeBool(2, this.t_bool);
        }
        if (this.t_int32 !== undefined) {
            bw.writeInt32(3, this.t_int32);
        }
        if (this.t_int64 !== undefined) {
            bw.writeInt64(4, this.t_int64);
        }

        return bw.getResultBuffer();
    }
}
export class theater_Theater_MessageName {
    static deserialize(bytes: Uint8Array) {
        const message = new theater_Theater_MessageName;
        const br = new imp_1.BinaryReader(bytes);
        while(br.nextField() && !br.isEndGroup()){
            switch(br.getFieldNumber()){
                default:
                    br.skipField();
            }
        }
        return message;
    }
    serialize() {
        const bw = new imp_1.BinaryWriter;
        return bw.getResultBuffer();
    }
}
