# Options

protoc-gen-ts supports various options to the control output.

## Recognized options

* With `--ts_opt=unary_rpc_promise=true`, the service definition will contain a promise based rpc with a calling pattern of `const result = await client.METHOD(message)`.  Note: all of the `metadata` and `options` parameters are still available to you.

* With `--ts_opt=grpc_package=xxxx`, you can specify a different package to import rather than `@grpc/grpc-js`.

* With `--ts_opt=no_namespace`, you can control whether you get nested messages inside namespaces or prefixed with their parent message or directive.

* With `--ts_opt=json_names`, fields will be converted to lowerCamelCase, for compatibility with the [JSON mapping][] done by the first-party protobuf libraries.

[JSON mapping]: https://developers.google.com/protocol-buffers/docs/proto3#json

* With `--ts_opt=target=node`, the generated client class will be compatible with gRPC Node `@grpc/grpc-js` or `grpc`. 

* With `--ts_opt=target=web`, the generated client class will be compatible with gRPC Web via `grpc-web`. 

* With `--ts_opt=no_grpc`, grpc service code won't be generated. 
