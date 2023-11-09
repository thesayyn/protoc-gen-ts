class Any extends $wkt_google_protobuf_Any {
  static fromJson(json: object) {
    if (json === null || Array.isArray(json) || typeof json != "object") {
      throw new Error(`cannot decode message google.protobuf.Any`);
    }
    const type_url = json["@type"];
    if (typeof type_url !== "string" || !type_url) {
      throw new Error(
        `cannot decode message google.protobuf.Any since @type is empty`
      );
    }
    const name = type_url.substring(type_url.lastIndexOf("/") + 1);
    const message_type = $type_registry$.get(name);
    if (!message_type) {
      throw new Error(`unknown message type ${name}}`);
    }
    let message;
    if (name.startsWith("google.protobuf.") && "value" in json) {
      message = message_type.fromJson(json["value"]);
    } else {
      message = message_type.fromJson(json);
    }
    const m = new $wkt_google_protobuf_Any();
    m.type_url = `type.googleapis.com/${message_type.type}`;
    m.value = message.serialize();
    return m;
  }
  toJson() {
    if (!this.type_url) {
      return {};
    }
    const name = this.type_url.substring(this.type_url.lastIndexOf("/") + 1);
    const message_type = $type_registry$.get(name);
    if (!message_type) {
      throw new Error(`unknown message type ${this.type_url}}`);
    }

    const message = message_type.deserialize(this.value);

    let json: any = message.toJson();

    if (
      name.startsWith("google.protobuf.") ||
      json === null ||
      Array.isArray(json) ||
      typeof json !== "object"
    ) {
      json = { value: json };
    }

    json["@type"] = this.type_url;

    return json;
  }
}
