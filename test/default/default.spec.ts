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
            one_of_message: undefined
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

            one_of_int32: 0,
            one_of_message: undefined
        })
    });
})
