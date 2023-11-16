class Struct extends $wkt_google_protobuf_Struct {
  static fromJson(json: unknown) {
    const m = new $wkt_google_protobuf_Struct();
    if (typeof json != "object" || json == null || Array.isArray(json)) {
      throw new Error("invalid value");
    }
    for (const [k, v] of Object.entries(json)) {
      m.fields.set(k, $wkt_google_protobuf_Value.fromJson(v));
    }
    return m;
  }
  toJson() {
    const json: { [k: string]: unknown } = {};
    for (const [k, v] of this.fields) {
      json[k] = v.toJson();
    }
    return json;
  }
}

class ListValue extends $wkt_google_protobuf_ListValue {
  static fromJson(json) {
    const m = new $wkt_google_protobuf_ListValue();
    if (!Array.isArray(json)) {
      throw new Error("cannot decode google.protobuf.ListValue from JSON");
    }
    for (let e of json) {
      m.values.push($wkt_google_protobuf_Value.fromJson(e));
    }
    return m;
  }
  toJson() {
    return this.values.map((v) => v.toJson());
  }
}

class Value extends $wkt_google_protobuf_Value {
  static fromJson(json: unknown) {
    const m = new $wkt_google_protobuf_Value();
    switch (typeof json) {
      case "number":
        m.number_value = json;
        break;
      case "string":
        m.string_value = json;
        break;
      case "boolean":
        m.bool_value = json;
        break;
      case "object":
        if (json === null) {
          m.null_value = $wkt_google_protobuf_NullValue.NULL_VALUE;
        } else if (Array.isArray(json)) {
          m.list_value = $wkt_google_protobuf_ListValue.fromJson(json);
        } else {
          m.struct_value = $wkt_google_protobuf_Struct.fromJson(json);
        }
        break;
      default:
        throw new Error("cannot decode google.protobuf.Value from JSON");
    }
    return m;
  }
  toJson() {
    if (this.null_value != undefined) {
      return null;
    } else if (this.number_value != undefined) {
      if (!Number.isFinite(this.number_value)) {
        throw new Error("number value cannot be NaN or Infinity");
      }
      return this.number_value;
    } else if (this.string_value != undefined) {
      return this.string_value;
    } else if (this.bool_value != undefined) {
      return this.bool_value;
    } else if (this.struct_value != undefined) {
      return this.struct_value.toJson();
    } else if (this.list_value != undefined) {
      return this.list_value.toJson();
    }
  }
}
