# Alternatives

| Plugin | google-protobuf | Typescript | Declarations | gRPC Node | gRPC Web | ES6 Support | Notes |
|------------------------------|-----------------|:----------:|:------------:|:---------:|:--------:|:-----------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
| thesayyn/protoc-gen-ts | Yes | Yes | Yes | Yes | Yes | Yes |  |
| improbable-eng/ts-protoc-gen | Yes | No | Yes | No | Yes | Partial | Drawback: You can't bundle generated files with rollup since<br>they are not >= ES6 compatible. |
| stephenh/ts-proto | No | Yes | Yes | No | No | Yes | There is no support for rpcs.<br>See: https://github.com/stephenh/ts-proto/issues/2 |