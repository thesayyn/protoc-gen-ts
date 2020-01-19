import {Integers} from '../protos/integers';

describe("integers", () => {


    it("should set & get int32", () => {
        const a = new Integers({
            int32: 5456,
            int64: 25656
        });
        expect(a.int32).toBe(5456)
        expect(a.int64).toBe(25656)
    })
});
