import * as fs from "fs";
import * as path from "path";
import { maps } from "./proto/map_checked";

describe("maps", () => {
    const bin = fs.readFileSync(path.join(__dirname, "map.bin"));
    it("should be able to deserialize from go", () => {
        const tags = maps.Tags.deserialize(bin);
        expect(tags.toObject()).toEqual({
            key: "this is unique",
            keys: {
                "key1": "value1"
            },
            topics: {
                "key2": {
                    link: "link"
                }
            },
            topics_with_intkeys: {
                1: { link: "link_int" },
                5: { link: "link_int" }
            }
        })
    })
})