declare const $base64$: {
  encode(v: Uint8Array): string;
  decode(v: string): Uint8Array;
};

declare function $wkt_Message<JsonRepr>(): {
    new (): {
        toJson(): JsonRepr;
    };
    fromJson(v: JsonRepr): typeof this;
};

// duration.ts
declare class $wkt_google_protobuf_Duration extends $wkt_Message<string>() {
    seconds: bigint;
    nanos: number;
}


// timestamp.ts
declare class $wkt_google_protobuf_Timestamp extends $wkt_Message<string>() {
    seconds: bigint;
    nanos: number;
}


// struct.ts
declare enum $wkt_google_protobuf_NullValue {
    NULL_VALUE = 0,
}

declare class $wkt_google_protobuf_Struct extends $wkt_Message<object>() {
    fields: Map<string, $wkt_google_protobuf_Value>;
}

declare class $wkt_google_protobuf_Value extends $wkt_Message<unknown>() {
    null_value: $wkt_google_protobuf_NullValue;
    number_value: number;
    string_value: string;
    bool_value: boolean;
    struct_value: $wkt_google_protobuf_Struct;
    list_value: $wkt_google_protobuf_ListValue;
}

declare class $wkt_google_protobuf_ListValue extends $wkt_Message<Array<unknown>>() {
    values: $wkt_google_protobuf_Value[];
}


// wrappers.ts
declare function $wkt_Value<WireType, JsonRepr, JsonValue>(): {
    new (): {
        value: WireType;
        toJson(): JsonRepr;
    };
    fromJson(v: JsonValue): {
        value: WireType;
        toJson(): JsonRepr;
    };
};
declare class $wkt_google_protobuf_DoubleValue extends $wkt_Value<number, number, number>() {}
declare class $wkt_google_protobuf_FloatValue extends $wkt_Value<number, number, number>() {}
declare class $wkt_google_protobuf_Int64Value extends $wkt_Value<bigint, string, string>() {}
declare class $wkt_google_protobuf_UInt64Value extends $wkt_Value<bigint, string, string>() {}
declare class $wkt_google_protobuf_Int32Value extends $wkt_Value<number, number, number>() {}
declare class $wkt_google_protobuf_UInt32Value extends $wkt_Value<number, number, number>() {}
declare class $wkt_google_protobuf_BoolValue extends $wkt_Value<boolean, boolean, boolean>() {}
declare class $wkt_google_protobuf_StringValue extends $wkt_Value<string, string, string>() {}
declare class $wkt_google_protobuf_BytesValue extends $wkt_Value<Uint8Array, string, string>() {}