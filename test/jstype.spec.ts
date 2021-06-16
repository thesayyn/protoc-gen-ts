import {JSType} from "./jstype";

describe("jstype", () => {

    it("should accept string instead of number", () => {
        const typ = new JSType({
            int_but_string: "1",
            int_and_normal: 3,
            int_and_number: 5
        });
        const transferredTyp = JSType.deserialize(typ.serialize());

        expect(transferredTyp.toObject()).toEqual({
            int_and_normal: 3,
            int_and_number: 5,
            int_but_string: "1"
        })
    })
})