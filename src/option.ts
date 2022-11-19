export type Target = "node" | "web"


export interface Options {
  unary_rpc_promise: boolean;
  grpc_package: string;
  no_namespace: boolean;
  json_names: boolean;
  explicit_override: boolean;
  target: Target;
}

export function parse(raw?: string): Options {
  if (!raw) {
    raw = "";
  }
  const options: Options = {
    unary_rpc_promise: false,
    grpc_package: "@grpc/grpc-js",
    no_namespace: false,
    json_names: false,
    explicit_override: false,
    target: "node"
  };
  for (const raw_option of raw.split(",")) {
    let [k, v] = raw_option.split("=", 2);
    switch (k) {
      case 'unary_rpc_promise': options[k] = v != "false"; break;
      case 'grpc_package':      options[k] = v;            break;
      case 'no_namespace':      options[k] = v != "false"; break;
      case 'json_names':        options[k] = v != "false"; break;
      case 'explicit_override': options[k] = v != "false"; break;
      case 'target':            options[k] = v as Target;  break;
    }
  }
  return options;
}
