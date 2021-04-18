import {Serialization} from "./serialization";

describe("Serialization", () => {
    it("should not serialize empty string",() => {
        const msg = new Serialization({
            test: ""

        });
        const bytes = msg.serialize();
        expect(bytes.length).toBe(0);
    });
})