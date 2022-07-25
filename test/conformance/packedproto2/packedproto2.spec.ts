import * as fs from "fs";
import * as path from "path";
import { WebMessageInfo } from "./packed_proto2";

describe("packed proto 2", () => {
    const bin = fs.readFileSync(path.join(__dirname, "packedproto2.bin"));
    it("should not pack scanLengths", () => {
        const info = WebMessageInfo.deserialize(bin);
        expect(info.message!.imageMessage!.scanLengths).toEqual([5453]);
        expect(info.message!.imageMessage!.url).toBe("https://mmg-fna.whatsapp.net/d/f/Ao80b2eZH8ojxMdwrIs2z2LCjMrIHaMSiNkdfJXe1Pjs.enc");
        expect(info.message!.imageMessage!.height).toBe(1280);
        expect(info.message!.imageMessage!.width).toBe(720);
    })
})
