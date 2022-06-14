import { OneOfWithoutAnyOtherFields, OneOf } from "./oneof";

describe("oneof", () => {

    it("should take last property  if two properties are present at the same time if given via constructor", () => {
        const oneOf = new OneOfWithoutAnyOtherFields(
            // @ts-expect-error
            { age: "21", date_of_birth: "21.01.1999", nickname: "Heisenberg", realname: "Walter White" }
        )

        expect(oneOf.toObject()).toEqual({
            date_of_birth: "21.01.1999",
            realname: "Walter White"
        });
        expect(oneOf.age_or_dateofbirth).toBe("date_of_birth");
        expect(oneOf.nickname_or_realname).toBe("realname");
    });

    it("should take last seen if two properties are present at the same time", () => {
        const oneOf = new OneOf({nickname: "thesayyn"});
        oneOf.date_of_birth = "18.11.1998";
        oneOf.age = "22";
        expect(oneOf.toObject()).toEqual({
            age: "22",
            nickname: "thesayyn"
        });
        expect(oneOf.age_or_dateofbirth).toBe("age");
    })


})