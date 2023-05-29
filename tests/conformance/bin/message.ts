// @deno-types="https://esm.sh/v78/@types/google-protobuf@latest/index.d.ts"
import * as imp_0 from "npm:google-protobuf";
export class theater_Theater {
    t_string: string;
    t_bool: boolean;
    t_int32: number;
    t_int64: number;
    static deserialize() {
        const br = new imp_0.BinaryReader;
        const message = new theater_Theater();
        while(br.nextField() && !br.isEndGroup()){
            switch(br.getFieldNumber()){
                case 1:
                    message.t_string = br.readString();
                    break;
                case 2:
                    message.t_bool = br.readBool();
                    break;
                case 3:
                    message.t_int32 = br.readEnum();
                    break;
                case 4:
                    message.t_int64 = br.readUint32();
                    break;
                default:
                    br.skipField();
            }
        }
    }
}