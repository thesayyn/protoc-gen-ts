import {importdirective as id1} from "./imported";
import {importdirective as id2} from "./importdirective";

describe("Imported Proto", () => {

    it("should be serialized", () => {
        const mymsg = new id2.Message({
            importedField: new id1.Imported({})
        });

        const deserializedMessage = id2.Message.deserialize(mymsg.serialize());

        expect(deserializedMessage.importedField instanceof id1.Imported).toBe(true);
    })

})
