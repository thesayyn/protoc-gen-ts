import {importdirective as id1} from "../protos/imported";
import {importdirective as id2} from "../protos/importdirective";

describe("Imported Proto", () => {

    it("should be serialized", () => {
        const mymsg = new id2.a.Message({
            importedField: new id1.b.Imported({})
        });

        const deserializedMessage = id2.a.Message.deserialize(mymsg.serialize());

        expect(deserializedMessage.importedField instanceof id1.b.Imported).toBe(true);
    })

})
