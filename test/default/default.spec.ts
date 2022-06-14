import { MessageWithDefault, MessageWithImplicitDefault } from "./default";
import { DefaultMessageV2WithoutDefault, DefaultMessageV2WithDefault } from "./default_proto2";
import { DefaultMessageV3 } from "./default_proto3";
import { DefaultCommonEnum } from "./default_common";

function toObjectWithDefaults(message: Object): Object {
    // unfortunately, it is not as simple as: Object.keys(message).filter(k => typeof message[k] != "function")
    function correctFieldValue(fieldValue: unknown): unknown {
        return fieldValue instanceof Map ? { ...fieldValue } : fieldValue;
    }
    const classPropertyDescriptors = Object.getOwnPropertyDescriptors(message.constructor.prototype);
    const getters = Object.keys(classPropertyDescriptors)
        .filter((k) => classPropertyDescriptors[k].get != null && classPropertyDescriptors[k].set != null);
    return Object.fromEntries(getters.map((g) => [g, correctFieldValue(message[g])]));
}

describe("defaults", () => {

    it("should return defaults", () => {
        const message = new MessageWithDefault();

        expect(message.bool_field).toBe(true);
        expect(message.int32_field).toBe(12);
        expect(message.string_field).toBe("default value");
    });

    it("should not return defaults in the output of toObject()", () => {
        const message = new MessageWithDefault();

        expect(message.toObject()).toEqual({});
    });

    it("should return implicit defaults for optional fields (v2)", () => {
        const message = new MessageWithImplicitDefault();

        expect(message.bool_field).toBe(false);
        expect(message.int32_field).toBe(0);
        expect(message.string_field).toBe("");
    });

    it("should not return implicit defaults in the output of toObject() (v2)", () => {
        const message = new MessageWithImplicitDefault();

        expect(message.toObject()).toEqual({});
    });

    it("should not return defaults for required fields without [default=] (v2)", () => {
        expect(toObjectWithDefaults(new DefaultMessageV2WithoutDefault)).toEqual({
            message: undefined,
            enum: undefined,

            bool: undefined,
            string: undefined,

            int32: undefined,
            fixed32: undefined,
            sfixed32: undefined,
            uint32: undefined,
            sint32: undefined,
            int64: undefined,
            fixed64: undefined,
            sfixed64: undefined,
            uint64: undefined,
            sint64: undefined,
            float: undefined,
            double: undefined,

            int_but_string: undefined,

            map_string_string: {},
            map_string_message: {},

            array_int32: [],
            array_message: [],

            one_of_int32: 0, // scalar oneof fields have implicit defaults
            one_of_message: undefined,

            bytes: undefined
        })
    });

    it("should return explicitly specified defaults (v2)", () => {
        expect(toObjectWithDefaults(new DefaultMessageV2WithDefault)).toEqual({
            message: undefined,
            enum: DefaultCommonEnum.TWO,

            bool: true,
            string: "default string",

            int32: 5,
            fixed32: 6,
            sfixed32: 7,
            uint32: 8,
            sint32: 9,
            int64: 10,
            fixed64: 11,
            sfixed64: 12,
            uint64: 13,
            sint64: 14,
            float: 15.0,
            double: 16.0,

            int_but_string: "17",

            one_of_int32: 18,
            one_of_message: undefined
        })
    });

    it("should not serialize fields that have not been set (v2)", () => {
        const defaults = new DefaultMessageV2WithoutDefault();
        const serializedDefaults = defaults.serialize();
        const transferredDefaults = DefaultMessageV2WithoutDefault.deserialize(serializedDefaults);

        expect(serializedDefaults.length).toBe(0);

        expect(transferredDefaults.message).toBe(undefined);
        expect(transferredDefaults.enum).toBe(undefined);

        expect(transferredDefaults.bool).toBe(undefined);
        expect(transferredDefaults.string).toBe(undefined);

        expect(transferredDefaults.int32).toBe(undefined);
        expect(transferredDefaults.fixed32).toBe(undefined);
        expect(transferredDefaults.sfixed32).toBe(undefined);
        expect(transferredDefaults.uint32).toBe(undefined);
        expect(transferredDefaults.sint32).toBe(undefined);
        expect(transferredDefaults.int64).toBe(undefined);
        expect(transferredDefaults.fixed64).toBe(undefined);
        expect(transferredDefaults.sfixed64).toBe(undefined);
        expect(transferredDefaults.uint64).toBe(undefined);
        expect(transferredDefaults.sint64).toBe(undefined);
        expect(transferredDefaults.float).toBe(undefined);
        expect(transferredDefaults.double).toBe(undefined);

        expect(transferredDefaults.int_but_string).toBe(undefined);

        expect(transferredDefaults.map_string_string.values.length).toBe(0);
        expect(transferredDefaults.map_string_message.values.length).toBe(0);

        expect(transferredDefaults.array_int32).toEqual([]);
        expect(transferredDefaults.array_message).toEqual([]);

        expect(transferredDefaults.one_of_int32).toBe(0); // scalar oneof fields have implicit defaults
        expect(transferredDefaults.one_of_message).toBe(undefined);

        expect(transferredDefaults.bytes).toEqual(undefined);
    });

    it("should not serialize fields that have not been set, even when they have explicit default values (v2)", () => {
        const defaults = new DefaultMessageV2WithDefault();
        const serializedDefaults = defaults.serialize();
        const transferredDefaults = DefaultMessageV2WithDefault.deserialize(serializedDefaults);

        expect(serializedDefaults.length).toBe(0);

        // below values are just defaults of DefaultMessageV2WithDefault message, not something that arrived over the wire
        expect(transferredDefaults.message).toBe(undefined);
        expect(transferredDefaults.enum).toBe(DefaultCommonEnum.TWO);

        expect(transferredDefaults.bool).toBe(true);
        expect(transferredDefaults.string).toBe("default string");

        expect(transferredDefaults.int32).toBe(5);
        expect(transferredDefaults.fixed32).toBe(6);
        expect(transferredDefaults.sfixed32).toBe(7);
        expect(transferredDefaults.uint32).toBe(8);
        expect(transferredDefaults.sint32).toBe(9);
        expect(transferredDefaults.int64).toBe(10);
        expect(transferredDefaults.fixed64).toBe(11);
        expect(transferredDefaults.sfixed64).toBe(12);
        expect(transferredDefaults.uint64).toBe(13);
        expect(transferredDefaults.sint64).toBe(14);
        expect(transferredDefaults.float).toBe(15);
        expect(transferredDefaults.double).toBe(16);

        expect(transferredDefaults.int_but_string).toBe("17");

        expect(transferredDefaults.one_of_int32).toBe(18);
        expect(transferredDefaults.one_of_message).toBe(undefined);
    });

    it("should return defaults (v3)", () => {
        expect(toObjectWithDefaults(new DefaultMessageV3())).toEqual({
            message: undefined,
            enum: DefaultCommonEnum.ZERO,

            bool: false,
            string: "",

            int32: 0,
            fixed32: 0,
            sfixed32: 0,
            uint32: 0,
            sint32: 0,
            int64: 0,
            fixed64: 0,
            sfixed64: 0,
            uint64: 0,
            sint64: 0,
            float: 0,
            double: 0,

            int_but_string: "",

            map_string_string: {},
            map_string_message: {},

            array_int32: [],
            array_message: [],

            one_of_int32: 0,
            one_of_message: undefined,

            bytes: new Uint8Array()
        })
    });

    it("should be serialized defaults (v3)", () => {
        const defaults = new DefaultMessageV3();
        const transferredDefaults = DefaultMessageV3.deserialize(defaults.serialize());

        expect(transferredDefaults.message).toBe(undefined);
        expect(transferredDefaults.enum).toBe(DefaultCommonEnum.ZERO);

        expect(transferredDefaults.bool).toBe(false);
        expect(transferredDefaults.string).toBe("");

        expect(transferredDefaults.int32).toBe(0);
        expect(transferredDefaults.fixed32).toBe(0);
        expect(transferredDefaults.sfixed32).toBe(0);
        expect(transferredDefaults.uint32).toBe(0);
        expect(transferredDefaults.sint32).toBe(0);
        expect(transferredDefaults.int64).toBe(0);
        expect(transferredDefaults.fixed64).toBe(0);
        expect(transferredDefaults.sfixed64).toBe(0);
        expect(transferredDefaults.uint64).toBe(0);
        expect(transferredDefaults.sint64).toBe(0);
        expect(transferredDefaults.float).toBe(0);
        expect(transferredDefaults.double).toBe(0);

        expect(transferredDefaults.int_but_string).toBe("");

        expect(transferredDefaults.map_string_string.values.length).toBe(0);
        expect(transferredDefaults.map_string_message.values.length).toBe(0);

        expect(transferredDefaults.array_int32).toEqual([]);
        expect(transferredDefaults.array_message).toEqual([]);

        expect(transferredDefaults.one_of_int32).toBe(0);
        expect(transferredDefaults.one_of_message).toBe(undefined);

        expect(transferredDefaults.bytes).toEqual(new Uint8Array());
    });
})
