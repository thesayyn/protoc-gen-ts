class DoubleValue extends $wkt_google_protobuf_DoubleValue {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_DoubleValue();
    m.value = Number(json);
    return m;
  }
  toJson() {
    return this.value;
  }
}

class FloatValue extends $wkt_google_protobuf_FloatValue {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_FloatValue();
    m.value = json;
    return m;
  }
  toJson() {
    return this.value;
  }
}

class Int64Value extends $wkt_google_protobuf_Int64Value {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_Int64Value();
    m.value = BigInt(json);
    return m;
  }
  toJson() {
    return this.value.toString();
  }
}

class UInt64Value extends $wkt_google_protobuf_UInt64Value {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_UInt64Value();
    m.value = BigInt(json);
    return m;
  }
  toJson() {
    return this.value.toString();
  }
}

class Int32Value extends $wkt_google_protobuf_Int32Value {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_Int32Value();
    m.value = json;
    return m;
  }
  toJson() {
    return this.value;
  }
}

class UInt32Value extends $wkt_google_protobuf_UInt32Value {
  static fromJson(json: number) {
    const m = new $wkt_google_protobuf_UInt32Value();
    m.value = json;
    return m;
  }
  toJson() {
    return this.value;
  }
}

class BoolValue extends $wkt_google_protobuf_BoolValue {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_BoolValue();
    m.value = json;
    return m;
  }
  toJson() {
    return this.value;
  }
}

class StringValue extends $wkt_google_protobuf_StringValue {
  static fromJson(json: string) {
    const m = new $wkt_google_protobuf_StringValue();
    m.value = json;
    return m;
  }
  toJson() {
    return this.value;
  }
}

class BytesValue extends $wkt_google_protobuf_BytesValue {
  static fromJson(json: string) {
    const m = new $wkt_google_protobuf_BytesValue();
    m.value = $base64$.decode(json);
    return m;
  }
  toJson() {
    return $base64$.encode(this.value);
  }
}
