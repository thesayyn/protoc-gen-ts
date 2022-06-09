import { MessageWithDefault } from "./default";
import { DefaultMessageV2WithoutDefault, DefaultMessageV2WithDefault } from "./default_proto2";
import { DefaultMessageV3 } from "./default_proto3";
import { DefaultCommonEnum, DefaultCommonMessage, DefaultCommonMessageOneOf } from "./default_common";

describe("defaults", () => {

    it("should return defaults", () => {
        expect(new MessageWithDefault().toObject()).toEqual({
            bool_field: true,
            int32_field: 12,
            string_field: "default value"
        })
    });

    it("should return defaults (v2)", () => {
        expect(new DefaultMessageV2WithoutDefault().toObject()).toEqual({
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

            one_of_int32: undefined,
            one_of_message: undefined,

            bytes: undefined
        })
    });

    it("should return proto defaults (v2)", () => {
        expect(new DefaultMessageV2WithDefault().toObject()).toEqual({
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

    it("should be serialized defaults (v2)", () => {
        const defaults = new DefaultMessageV2WithoutDefault();
        const transferredDefaults = DefaultMessageV2WithoutDefault.deserialize(defaults.serialize());

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

        expect(transferredDefaults.one_of_int32).toBe(undefined);
        expect(transferredDefaults.one_of_message).toBe(undefined);

        expect(transferredDefaults.bytes).toEqual(new Uint8Array());
    });

    it("should be serialized proto defaults (v2)", () => {
        const defaults = new DefaultMessageV2WithDefault();
        const transferredDefaults = DefaultMessageV2WithDefault.deserialize(defaults.serialize());

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
        expect(new DefaultMessageV3().toObject()).toEqual({
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

            one_of_int32: undefined,
            one_of_message: undefined,

            bytes: new Uint8Array(),

            optional_int32: undefined,
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

        expect(transferredDefaults.one_of_int32).toBe(undefined);
        expect(transferredDefaults.one_of_message).toBe(undefined);

        expect(transferredDefaults.bytes).toEqual(new Uint8Array());
    });

    it("should omit default values during serialization (v3)", () => {
        const defaults = new DefaultMessageV3();
        const explicitlyProvidedDefaults = new DefaultMessageV3();
        explicitlyProvidedDefaults.enum = DefaultCommonEnum.ZERO;
        explicitlyProvidedDefaults.bool = false;
        explicitlyProvidedDefaults.string = '';
        explicitlyProvidedDefaults.int32 = 0;
        explicitlyProvidedDefaults.fixed32 = 0;
        explicitlyProvidedDefaults.sfixed32 = 0;
        explicitlyProvidedDefaults.uint32 = 0;
        explicitlyProvidedDefaults.sint32 = 0;
        explicitlyProvidedDefaults.int64 = 0;
        explicitlyProvidedDefaults.fixed64 = 0;
        explicitlyProvidedDefaults.sfixed64 = 0;
        explicitlyProvidedDefaults.uint64 = 0;
        explicitlyProvidedDefaults.sint64 = 0;
        explicitlyProvidedDefaults.float = 0;
        explicitlyProvidedDefaults.double = 0;
        explicitlyProvidedDefaults.bytes = new Uint8Array();

        const serializedDefaults = defaults.serialize();
        const serializedExplicitlyProvidedDefaults = explicitlyProvidedDefaults.serialize();

        expect(serializedDefaults.length).toBe(0);
        expect(serializedExplicitlyProvidedDefaults.length).toBe(0);
    });

    it("should serialize oneof properties if explicitly provided (v3)", () => {
        const defaults = new DefaultMessageV3();
        const defaultsHavingOneOfInt32 = new DefaultMessageV3();
        defaultsHavingOneOfInt32.one_of_int32 = 0;

        const transferredDefaults = DefaultMessageV3.deserialize(defaults.serialize());
        const serializedDefaultsHavingOneOfInt32 = defaultsHavingOneOfInt32.serialize();
        const transferredDefaultsHavingOneOfInt32 = DefaultMessageV3.deserialize(serializedDefaultsHavingOneOfInt32);

        expect(transferredDefaults.one_of_int32).toBe(undefined);
        expect(serializedDefaultsHavingOneOfInt32.length).toBeGreaterThan(0);
        expect(transferredDefaultsHavingOneOfInt32.one_of_int32).toBe(0);
    });

    it ("should serialize repeated properties when they are not empty (v3)", () => {
        const defaultsHavingRepeatedProp = new DefaultMessageV3();
        defaultsHavingRepeatedProp.array_int32.push(0);

        const serializedDefaultsHavingRepeatedProp = defaultsHavingRepeatedProp.serialize();
        const transferredDefaultsHavingRepeatedProp = DefaultMessageV3.deserialize(serializedDefaultsHavingRepeatedProp);

        expect(serializedDefaultsHavingRepeatedProp.length).toBeGreaterThan(0);
        expect(transferredDefaultsHavingRepeatedProp.array_int32.length).toBe(1);
        expect(transferredDefaultsHavingRepeatedProp.array_int32[0]).toBe(0);
    });

    it ("should serialize optional properties when they are not null/undefined (v3)", () => {
        const defaults = new DefaultMessageV3();
        const defaultsHavingZeroInOptField = new DefaultMessageV3();
        defaultsHavingZeroInOptField.optional_int32 = 0;

        const transferredDefaults = DefaultMessageV3.deserialize(defaults.serialize());
        const serializedDefaultsHavingZeroInOptField = defaultsHavingZeroInOptField.serialize();
        const transferredDefaultsHavingZeroInOptField = DefaultMessageV3.deserialize(serializedDefaultsHavingZeroInOptField);

        expect(transferredDefaults.optional_int32).toBe(undefined);
        expect(serializedDefaultsHavingZeroInOptField.length).toBeGreaterThan(0);
        expect(transferredDefaultsHavingZeroInOptField.optional_int32).toBe(0);
    });
})
