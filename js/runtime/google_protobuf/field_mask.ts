class FieldMask extends $wkt_google_protobuf_FieldMask {
  static fromJson(json: string) {
    if (typeof json !== "string") {
      throw new Error("cannot decode google.protobuf.FieldMask");
    }
    const m = new $wkt_google_protobuf_FieldMask();
    if (json === "") {
      return m;
    }
    function camelToSnake(str: string) {
      if (str.includes("_")) {
        throw new Error(
          "cannot decode google.protobuf.FieldMask from JSON: path names must be lowerCamelCase"
        );
      }
      const sc = str.replace(/[A-Z]/g, (letter) => "_" + letter.toLowerCase());
      return sc[0] === "_" ? sc.substring(1) : sc;
    }
    m.paths = json.split(",").map(camelToSnake);
    return m;
  }

  toJson() {
    function protoCamelCase(snakeCase: string): string {
      let capNext = false;
      const b = [];
      for (let i = 0; i < snakeCase.length; i++) {
        let c = snakeCase.charAt(i);
        switch (c) {
          case "_":
            capNext = true;
            break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            b.push(c);
            capNext = false;
            break;
          default:
            if (capNext) {
              capNext = false;
              c = c.toUpperCase();
            }
            b.push(c);
            break;
        }
      }
      return b.join("");
    }
    return this.paths
      .map((p) => {
        if (p.match(/_[0-9]?_/g) || p.match(/[A-Z]/g)) {
          throw new Error(
            'cannot encode google.protobuf.FieldMask to JSON: lowerCamelCase of path name "' +
              p +
              '" is irreversible'
          );
        }
        return protoCamelCase(p);
      })
      .join(",");
  }
}
