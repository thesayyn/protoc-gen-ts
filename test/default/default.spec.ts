import { MessageWithDefault, MessageWithImplicitDefault } from "./default";
import { DefaultMessageV2WithoutDefault, DefaultMessageV2WithDefault } from "./default_proto2";
import { DefaultMessageOptionalV3, DefaultMessageV3 } from "./default_proto3";
import { DefaultCommonEnum, DefaultCommonMessage, DefaultCommonMessageOneOf } from "./default_common";

function toObjectPreservingUndefined(message: Object): Object {
    function correctFieldValue(fieldValue: unknown): unknown {
        return fieldValue instanceof Map ? { ...fieldValue } : fieldValue;
    }
    const classPropertyDescriptors = Object.getOwnPropertyDescriptors(message.constructor.prototype);
    const getters = Object.keys(classPropertyDescriptors)
        .filter((k) => classPropertyDescriptors[k]!.get != null && classPropertyDescriptors[k]!.set != null);
    return Object.fromEntries(getters.map((g) => [g, correctFieldValue((message as any)[g])]));
}

describe("defaults", () => {

    it("should return defaults", () => {
        const message = new MessageWithDefault();

        expect(message.bool_field).toBe(true);
        expect(message.int32_field).toBe(12);
        expect(message.string_field).toBe("default value");
    });

    it("should return defaults in the output of toObject()", () => {
        const message = new MessageWithDefault();

        expect(message.toObject()).toEqual({
            bool_field: true,
            int32_field: 12,
            string_field: "default value",
        });
    });

    it("should return implicit defaults for optional fields (v2)", () => {
        const message = new MessageWithImplicitDefault();

        expect(message.bool_field).toBe(false);
        expect(message.int32_field).toBe(0);
        expect(message.string_field).toBe("");
    });

    it("should return implicit defaults in the output of toObject() (v2)", () => {
        const message = new MessageWithImplicitDefault();

        expect(message.toObject()).toEqual({
            bool_field: false,
            int32_field: 0,
            string_field: "",
        });
    });

    it("should not serialize optional fields that were not assigned a value (v2)", () => {
        const message1 = new MessageWithDefault();
        const message2 = new MessageWithImplicitDefault();

        const serializedMessage1 = message1.serialize();
        const serializedMessage2 = message2.serialize();

        expect(serializedMessage1.length).toBe(0);
        expect(serializedMessage2.length).toBe(0);
    });

    it("should serialize optional fields explicitly set to their default value (v2)", () => {
        const message1 = new MessageWithDefault();
        message1.int32_field = 12; // 12 is the default field value give in proto file
        const message2 = new MessageWithImplicitDefault();
        message2.int32_field = 0; // 0 is the implicit default for optional int32 field

        const serializedMessage1 = message1.serialize();
        const serializedMessage2 = message2.serialize();

        expect(serializedMessage1.length).toBeGreaterThan(0);
        expect(serializedMessage2.length).toBeGreaterThan(0);
    });

    it("should not return defaults for required fields without [default=] (v2)", () => {
        expect(toObjectPreservingUndefined(new DefaultMessageV2WithoutDefault())).toEqual({
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
        });

        expect(new DefaultMessageV2WithoutDefault().toObject()).toEqual({
            // maps are not required
            map_string_string: {},
            map_string_message: {},

            array_int32: [],
            array_message: [],
            one_of_int32: 0, // scalar oneof fields have implicit defaults
        });
    });

    it("should return explicitly specified defaults (v2)", () => {
        expect(new DefaultMessageV2WithDefault().toObject()).toEqual({
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

            one_of_int32: 18
        });
    });

    it("should not serialize required fields that have not been set (v2)", () => {
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

    it("should not serialize required fields that have not been set, even when they have explicit default values (v2)", () => {
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
        expect(toObjectPreservingUndefined(new DefaultMessageV3())).toEqual({
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

            int_but_string: "0",

            map_string_string: {},
            map_string_message: {},

            array_int32: [],
            array_message: [],

            one_of_int32: 0,
            one_of_message: undefined,

            bytes: new Uint8Array()
        })

        expect(new DefaultMessageV3().toObject()).toEqual({
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

            int_but_string: "0",

            map_string_string: {},
            map_string_message: {},

            array_int32: [],
            array_message: [],

            one_of_int32: 0,

            bytes: new Uint8Array()
        });
    });

    it("should omit default values during serialization (v3)", () => {
        const defaults = new DefaultMessageV3();
        const serializedDefaults = defaults.serialize();
        const transferredDefaults = DefaultMessageV3.deserialize(serializedDefaults);

        expect(serializedDefaults.length).toBe(0);

        // below values are just the defaults in transferredDefaults message, not something that arrived over the wire
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

        expect(transferredDefaults.int_but_string).toBe("0");

        expect(transferredDefaults.map_string_string.values.length).toBe(0);
        expect(transferredDefaults.map_string_message.values.length).toBe(0);

        expect(transferredDefaults.array_int32).toEqual([]);
        expect(transferredDefaults.array_message).toEqual([]);

        expect(transferredDefaults.one_of_int32).toBe(0);
        expect(transferredDefaults.one_of_message).toBe(undefined);

        expect(transferredDefaults.bytes).toEqual(new Uint8Array());
    });

    it("should omit fields that were explicitly assigned their default values during serialization (v3)", () => {
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
        explicitlyProvidedDefaults.int_but_string = "0";
        explicitlyProvidedDefaults.bytes = new Uint8Array();

        const serializedExplicitlyProvidedDefaults = explicitlyProvidedDefaults.serialize();

        expect(serializedExplicitlyProvidedDefaults.length).toBe(0);
    });

    it("should serialize oneof fields if explicitly assigned, even when they were assigned their default value (v3)", () => {
        const messageHavingInt32 = new DefaultCommonMessageOneOf();
        messageHavingInt32.int32 = 0;
        const messageHavingString = new DefaultCommonMessageOneOf();
        messageHavingString.string = "";
        const messageHavingSubmessage = new DefaultCommonMessageOneOf();
        messageHavingSubmessage.message = new DefaultCommonMessage();

        const serializedMessageHavingInt32 = messageHavingInt32.serialize();
        const transferredMessageHavingInt32 = DefaultCommonMessageOneOf.deserialize(serializedMessageHavingInt32);
        const serializedMessageHavingString = messageHavingString.serialize();
        const transferredMessageHavingString = DefaultCommonMessageOneOf.deserialize(serializedMessageHavingString);
        const serializedMessageHavingSubmessage = messageHavingSubmessage.serialize();
        const transferredMessageHavingSubmessage = DefaultCommonMessageOneOf.deserialize(serializedMessageHavingSubmessage);

        expect(serializedMessageHavingInt32.length).toBeGreaterThan(0);
        expect(transferredMessageHavingInt32.has_int32).toBe(true);
        expect(transferredMessageHavingInt32.oneof).toBe("int32");

        expect(serializedMessageHavingString.length).toBeGreaterThan(0);
        expect(transferredMessageHavingString.has_string).toBe(true);
        expect(transferredMessageHavingString.oneof).toBe("string");

        expect(serializedMessageHavingSubmessage.length).toBeGreaterThan(0);
        expect(transferredMessageHavingSubmessage.has_message).toBe(true);
        expect(transferredMessageHavingSubmessage.oneof).toBe("message");
    });

    it ("should serialize repeated properties when they occur at least once (v3)", () => {
        const defaultsHavingRepeatedProp = new DefaultMessageV3();
        defaultsHavingRepeatedProp.array_int32.push(0);

        const serializedDefaultsHavingRepeatedProp = defaultsHavingRepeatedProp.serialize();
        const transferredDefaultsHavingRepeatedProp = DefaultMessageV3.deserialize(serializedDefaultsHavingRepeatedProp);

        expect(serializedDefaultsHavingRepeatedProp.length).toBeGreaterThan(0);
        expect(transferredDefaultsHavingRepeatedProp.array_int32.length).toBe(1);
        expect(transferredDefaultsHavingRepeatedProp.array_int32[0]).toBe(0);
    });

    it("should serialize proto3 optional fields if explicitly assigned, even when they were assigned their default value (v3)", () => {
        const implicitDefaults = new DefaultMessageOptionalV3();
        const explicitlyProvidedDefaults1 = new DefaultMessageOptionalV3({ enum: DefaultCommonEnum.ZERO });
        const explicitlyProvidedDefaults2 = new DefaultMessageOptionalV3({ bool: false });
        const explicitlyProvidedDefaults3 = new DefaultMessageOptionalV3({ string: '' });
        const explicitlyProvidedDefaults4 = new DefaultMessageOptionalV3({ int32: 0 });
        const explicitlyProvidedDefaults5 = new DefaultMessageOptionalV3({ fixed32: 0 });
        const explicitlyProvidedDefaults6 = new DefaultMessageOptionalV3({ sfixed32: 0 });
        const explicitlyProvidedDefaults7 = new DefaultMessageOptionalV3({ uint32: 0 });
        const explicitlyProvidedDefaults8 = new DefaultMessageOptionalV3({ sint32: 0 });
        const explicitlyProvidedDefaults9 = new DefaultMessageOptionalV3({ int64: 0 });
        const explicitlyProvidedDefaults10 = new DefaultMessageOptionalV3({ fixed64: 0 });
        const explicitlyProvidedDefaults11 = new DefaultMessageOptionalV3({ sfixed64: 0 });
        const explicitlyProvidedDefaults12 = new DefaultMessageOptionalV3({ uint64: 0 });
        const explicitlyProvidedDefaults13 = new DefaultMessageOptionalV3({ sint64: 0 });
        const explicitlyProvidedDefaults14 = new DefaultMessageOptionalV3({ float: 0 });
        const explicitlyProvidedDefaults15 = new DefaultMessageOptionalV3({ double: 0 });
        const explicitlyProvidedDefaults16 = new DefaultMessageOptionalV3({ int_but_string: "0" });
        const explicitlyProvidedDefaults17 = new DefaultMessageOptionalV3({ bytes: new Uint8Array() });

        expect(implicitDefaults.serialize().length).toBe(0);
        expect(explicitlyProvidedDefaults1.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults2.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults3.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults4.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults5.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults6.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults7.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults8.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults9.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults10.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults11.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults12.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults13.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults14.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults15.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults16.serialize().length).toBeGreaterThan(0);
        expect(explicitlyProvidedDefaults17.serialize().length).toBeGreaterThan(0);
    });
    it('should create the same object via fromObject method', () => {

        interface MessageConstructor<T> {
          new(...args: any[]): T,
          fromObject(data?: {}): any
        }

        function checkEquality<T>(messageCtor: MessageConstructor<T>){
          const withDefaultFromObject = messageCtor.fromObject();
          const withDefaultConstructed = new messageCtor();
          expect(toObjectPreservingUndefined(withDefaultFromObject))
            .toEqual(toObjectPreservingUndefined(withDefaultConstructed));
        }

        checkEquality(MessageWithDefault);
        checkEquality(MessageWithImplicitDefault);
        checkEquality(DefaultCommonMessageOneOf);
        checkEquality(DefaultMessageV2WithoutDefault);
        checkEquality(DefaultMessageV2WithDefault);
        checkEquality(DefaultMessageV3);
        checkEquality(DefaultMessageOptionalV3);
    })
});
