import { Repeated } from "./repeated";


describe("repeated", () => {
    it("it should serialize and deserialize", () => {
        const msg = new Repeated({ indx: [1, 2] });

        const transferredMessage = Repeated.deserialize(msg.serialize());

        expect(transferredMessage.toObject()).toEqual({ indx: [1, 2] });
    })
});