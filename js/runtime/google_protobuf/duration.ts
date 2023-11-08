class Duration extends $wkt_google_protobuf_Duration {
  static fromJson(json: string) {
    if (typeof json !== "string") {
      throw new Error(`duration illegal value: ${typeof json}`);
    }
    const match = json.match(/^(-?[0-9]+)(?:\.([0-9]+))?s/);
    if (match === null) {
      throw new Error(`duration illegal value: null`);
    }
    const longSeconds = Number(match[1]);
    if (longSeconds > 315576000000 || longSeconds < -315576000000) {
      throw new Error(`duration illegal value: out of range`);
    }
    const m = new $wkt_google_protobuf_Duration();

    m.seconds = BigInt(longSeconds);
    if (typeof match[2] == "string") {
      const nanosStr = match[2] + "0".repeat(9 - match[2].length);
      m.nanos = Number(nanosStr);
      if (longSeconds < 0 || Object.is(longSeconds, -0)) {
        m.nanos = -m.nanos;
      }
    }
    return m;
  }

  toJson() {
     if (Number(this.seconds) > 315576000000 || Number(this.seconds) < -315576000000) {
      throw new Error(`cannot encode google.protobuf.Duration to JSON: value out of range`);
    }
    let text = this.seconds.toString();
    if (this.nanos !== 0) {
      let nanosStr = Math.abs(this.nanos).toString();
      nanosStr = "0".repeat(9 - nanosStr.length) + nanosStr;
      if (nanosStr.substring(3) === "000000") {
        nanosStr = nanosStr.substring(0, 3);
      } else if (nanosStr.substring(6) === "000") {
        nanosStr = nanosStr.substring(0, 6);
      }
      text += "." + nanosStr;
      if (this.nanos < 0 && Number(this.seconds) == 0) {
          text = "-" + text;
      }
    }
    return text + "s";
  }
}
