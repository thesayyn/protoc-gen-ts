import {pkg} from './packagedirective';

describe("Packaged Proto", () => {

    it("should has the correct namespace", () => {
        expect(Object.keys(pkg)).toEqual(["mycompany"]);
        expect(Object.keys(pkg.mycompany)).toEqual(["Message"]);
    });

    it("should be accessible trough namespace", () => {

        const msg = new pkg.mycompany.Message({
            field: ["test", "test1"]
        });

        const transferredMsg = pkg.mycompany.Message.deserialize(msg.serialize());

        expect(transferredMsg.toObject()).toEqual(msg.toObject())
    });

})