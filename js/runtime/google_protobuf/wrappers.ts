class BytesValue {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_BytesValue();
        m.value = base64_lib.decode(json);
        return m
    }
    toJson() {
        return base64_lib.encode(this.value);
    }
}


class DoubleValue {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_DoubleValue();
        m.value = Number(json);
        return m
    }
    toJson() {
        return this.value;
    }
}

class BoolValue {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_BoolValue();
        m.value = json
        return m
    }
    toJson() {
        return this.value;
    }
}


class FloatValue {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_FloatValue();
        m.value = json
        return m
    }
    toJson() {
        return this.value;
    }
}


class StringValue {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_StringValue();
        m.value = json
        return m
    }
    toJson() {
        return this.value;
    }
}

class Int32Value {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_Int32Value();
        m.value = json
        return m
    }
    toJson() {
        return this.value;
    }
}

class UInt32Value {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_UInt32Value();
        m.value = json
        return m
    }
    toJson() {
        return this.value;
    }
}


class Int64Value {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_Int64Value();
        m.value = BigInt(json)
        return m
    }
    toJson() {
        return this.value.toString();
    }
}


class UInt64Value {
    value;
    static fromJson(json) {
        const m = new wkt_google_protobuf_UInt64Value();
        m.value = BigInt(json)
        return m
    }
    toJson() {
        return this.value.toString()
    }
}
