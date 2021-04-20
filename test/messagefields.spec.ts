console.log(require("fs").readdirSync("."));
import { Message, SubMessage } from "./messagefields";

describe("SubMessages", () => {


    it("should be serialized", () => {
        const mymsg = new Message({
            sub_message: new SubMessage({
                field_1: "field_1_value",
                field_2: "field_2_value"
            }),
            array_prop: [new SubMessage()]

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
            }),
            array_prop: [new SubMessage()]

        });

        expect(mymsg.toObject()).toEqual({
            sub_message: {
                field_1: "field_1_value",
                field_2: "field_2_value"
            },
            array_prop: [{}]
        })
    })

    it("should be converted to plain object arrays", () => {
        const mymsg = new Message({
            array_prop: [
                new SubMessage({ field_1: "field_1_value0", field_2: "field_2_value0" }),
                new SubMessage({ field_1: "field_1_value1", field_2: "field_2_value1" }),
            ]
        });

        expect(mymsg.toObject()).toEqual({
            array_prop: [
                { field_1: "field_1_value0", field_2: "field_2_value0" },
                { field_1: "field_1_value1", field_2: "field_2_value1" },
            ]
        })
    })


    it("should be converted to undefined", () => {
        const mymsg = new Message();

        expect(mymsg.toObject()).toEqual({ array_prop: [] })
    })

})