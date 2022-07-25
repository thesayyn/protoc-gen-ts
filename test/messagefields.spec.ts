import { MessageFields, SubMessage } from "./messagefields";

describe("SubMessages", () => {
    it("should be serialized", () => {
        const mymsg = new MessageFields({
            sub_message: new SubMessage({
                field_1: "field_1_value",
                field_2: "field_2_value"
            }),
            array_prop: [new SubMessage()]

        });

        const deserializedMessage = MessageFields.deserialize(mymsg.serialize());

        expect(deserializedMessage.sub_message instanceof SubMessage).toBe(true);
        expect(deserializedMessage.sub_message!.field_1).toBe("field_1_value");
        expect(deserializedMessage.sub_message!.field_2).toBe("field_2_value");
    })

    it("should be converted to plain object", () => {
        const mymsg = new MessageFields({
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
            array_prop: [
                {
                    field_1: "",
                    field_2: "",
                },
            ]
        })
    })

    it("should be converted to plain object arrays", () => {
        const mymsg = new MessageFields({
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
        const mymsg = new MessageFields();

        expect(mymsg.toObject()).toEqual({ array_prop: [] })
    })

    it("fromObject should handle construction deeply", () => {
        const message = MessageFields.fromObject({
            array_prop: [
                {
                    field_1: "test",
                    field_2: "test"
                },
                {
                    field_2: "test"
                }
            ],
            sub_message: {}
        });

        expect(message.toObject()).toEqual({
            array_prop: [
                {
                    field_1: "test",
                    field_2: "test"
                },
                {
                    field_1: "",
                    field_2: "test"
                }
            ],
            sub_message: {
                field_1: "",
                field_2: "",
            }
        });
    })

    it("fromObject should handle construction deeply", () => {
        const message = MessageFields.fromObject({
            array_prop: [
                {
                    field_1: "test",
                    field_2: "test"
                },
                {
                    field_2: "test"
                }
            ],
            sub_message: {}
        });

        expect(message.array_prop[0] instanceof SubMessage).toBeTrue();
        expect(message.array_prop[0].field_1).toBe("test");
        expect(message.array_prop[0].field_2).toBe("test");
        
        expect(message.array_prop[1] instanceof SubMessage).toBeTrue();
        expect(message.array_prop[1].field_1).not.toBeTruthy();
        expect(message.array_prop[1].field_2).toBe("test");

        expect(message.sub_message instanceof SubMessage).toBeTrue();
        expect(message.sub_message!.field_2).not.toBeTruthy();
        expect(message.sub_message!.field_1).not.toBeTruthy();
    })

})
