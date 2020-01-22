import {Message, SubMessage} from "../protos/messagefields";

describe("SubMessages", () => {


    it("should be serialized",() => {
        const mymsg = new Message({
            sub_message: new SubMessage({
                field_1: "field_1_value",
                field_2: "field_2_value"
            })

        });

        const deserializedMessage = Message.deserialize(mymsg.serialize());

        expect(deserializedMessage.sub_message instanceof SubMessage).toBe(true);
        expect(deserializedMessage.sub_message.field_1).toBe("field_1_value");
        expect(deserializedMessage.sub_message.field_2).toBe("field_2_value");
    })

    it("should be converted to plain object", () => {
        const mymsg = new Message({
            sub_message: new SubMessage({
                field_1: "field_1_value",
                field_2: "field_2_value"
            })

        });

        expect(mymsg.toObject()).toEqual({
            sub_message: {
                field_1: "field_1_value",
                field_2: "field_2_value"
            }
        })
    })


    it("should be converted to undefined", () => {
        const mymsg = new Message();

        expect(mymsg.toObject()).toEqual({sub_message: undefined})
    })

})