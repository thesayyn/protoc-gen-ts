import {MessageWithDefault} from "./default";

describe("defaults", () => {

    it("should return defaults", () => {
        expect(new MessageWithDefault().toObject()).toEqual({
            bool_field: true,
            int32_field: 12,
            string_field: "default value"
        })
    })
})