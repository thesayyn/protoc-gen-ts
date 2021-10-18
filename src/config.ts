export type ConfigParams = {
  unary_rpc_promise: boolean;
  grpc_package: string;
};

/**
 * @param {string | undefined | null} parameters
 * @return{ConfigParameters}
 */
export function parseParameters(parameters: string): ConfigParams {
  /** @type{ConfigParameters} */
  const defaultValues: ConfigParams = {
    unary_rpc_promise: false,
    grpc_package: "@grpc/grpc-js",
  };

  /** @type{{ [K keyof ConfigParameters]: (value: string) => ConfigParameters[K] }} */
  const parsers = {
    unary_rpc_promise: (value: string) => value === "true",
    grpc_package: (value: string) => value,
  };

  /** @type{Partial<ConfigParameters>} */
  const inputParams: Partial<Record<keyof typeof parsers, any>> = {};

  // comma separated
  (parameters || "").split(",").forEach((param: string) => {
    const [key, value = "true"] = param.split("=", 2);

    if (key in parsers) {
      const kv: keyof ConfigParams = key as any;
      inputParams[kv] = parsers[kv](value);
    }
  });

  // Legacy Environment variables
  const legacy = {
    ...(process.env.EXPERIMENTAL_FEATURES ? { unary_rpc_promise: true } : {}),
    ...(process.env.GRPC_PACKAGE_NAME
      ? { grpc_package: process.env.GRPC_PACKAGE_NAME }
      : {}),
  };

  return { ...defaultValues, ...legacy, ...inputParams };
}
