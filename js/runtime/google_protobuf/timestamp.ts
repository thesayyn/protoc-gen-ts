class Timestamp extends $wkt_google_protobuf_Timestamp {
  static fromJson(json: string) {
    if (typeof json !== "string") {
      throw new Error(`cannot decode google.protobuf.Timestamp from JSON`);
    }
    const matches = json.match(
      /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/
    );
    if (!matches) {
      throw new Error(
        `cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`
      );
    }
    const ms = Date.parse(
      matches[1] +
        "-" +
        matches[2] +
        "-" +
        matches[3] +
        "T" +
        matches[4] +
        ":" +
        matches[5] +
        ":" +
        matches[6] +
        (matches[8] ? matches[8] : "Z")
    );
    if (Number.isNaN(ms)) {
      throw new Error(
        `cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`
      );
    }
    if (
      ms < Date.parse("0001-01-01T00:00:00Z") ||
      ms > Date.parse("9999-12-31T23:59:59Z")
    ) {
      throw new Error(
        `cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`
      );
    }
    const m = new $wkt_google_protobuf_Timestamp();
    m.seconds = BigInt(ms / 1000);
    m.nanos = 0;
    if (matches[7]) {
      m.nanos =
        parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) -
        1000000000;
    }
    return m;
  }

  toJson() {
    const ms = Number(this.seconds) * 1000;
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
      throw new Error(`cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
    }
    if (this.nanos < 0) {
      throw new Error(`cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative`);
    }
    let z = "Z";
    if (this.nanos > 0) {
      const nanosStr = (this.nanos + 1000000000).toString().substring(1);
      if (nanosStr.substring(3) === "000000") {
        z = "." + nanosStr.substring(0, 3) + "Z";
      } else if (nanosStr.substring(6) === "000") {
        z = "." + nanosStr.substring(0, 6) + "Z";
      } else {
        z = "." + nanosStr + "Z";
      }
    }
    return new Date(ms).toISOString().replace(".000Z", z);
  }
}
