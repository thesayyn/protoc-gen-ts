export interface Options {
  unary_rpc_promise: boolean;
  grpc_package: string;
  int64_to_string: boolean;
}

export function parse(raw?: string): Options {
  if (!raw) {
    raw = "";
  }
  const options: Options = {
    unary_rpc_promise: false,
    grpc_package: "@grpc/grpc-js",
    int64_to_string: false,
  };

  for (const raw_option of raw.split(",")) {
    let [k, v] = raw_option.split("=", 2);
    let value: string | boolean;
    if (k in options) {
      switch (typeof options[k]) {
        case "boolean":
          value = v != "false";
          break;
        default:
          value = v;
          break;
      }
    }
    options[k] = value
  }
  return options;
}
