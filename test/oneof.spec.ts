import {OneOfWithoutAnyOtherFields} from "./oneof"; 

describe("oneof", () => {


    it("should set oneof field", () => {
        const oneOf = new OneOfWithoutAnyOtherFields({
            age: "21"
        })


        expect(oneOf.toObject()).toEqual({age: "21"})
    })

})