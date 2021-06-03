# Protoc Gen Typescript 

![npm](https://img.shields.io/npm/v/protoc-gen-ts)
![npm bundle size](https://img.shields.io/bundlephobia/min/protoc-gen-ts)
![npm](https://img.shields.io/npm/dm/protoc-gen-ts)

Generates appropriate Protocol Buffer sources from Proto files directly through _TypeScript Compiler API_.

This plugin generates plain **Typescript** files that can be used AMD, UMD, CommonJS module systems.

Aim of this protoc plugin is to make usage of protocol buffers easy in Javascript/Typescript by taking modern approaches.

## Example

```proto
syntax = "proto3";

message Change {
    Kind kind = 1;
    string patch = 2;
    repeated string tags = 3; 
    oneof name_or_id {
        string name = 4;
        string id = 5;
    }
}

enum Kind {
    UPDATED = 0;
    DELETED = 1;
}
```


```typescript
// Constructed message
const change = new Change({
    kind: Kind.UPDATED,
    patch: "@@ -7,11 +7,15 @@",
    tags: ["no prefix", "as is"],
    name: "patch for typescript 4.5"
});

// Sent over the wire
const bytes: Uint8Array = change.serialize();

const receivedChange: Change = Change.deserialize(bytes);

console.log(receivedChange.kind == Kind.UPDATED) // true
console.log(receivedChange.patch) // "@@ -7,11 +7,15 @@"
console.log(receivedChange.tags) // ["no prefix", "as is"]
console.log(receivedChange.name) // "patch for typescript 4.5"
// see which one of the fields were filled
console.log(receivedChange.name_or_id) // "name"
```

## Support

If you find this plugin useful please consider giving us a star to get into open collective.

You can also support me directly by buying me one or two coffee, 

<a href="https://www.buymeacoffee.com/thesayyn">
<img height="40px" src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=🙌&slug=thesayyn&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff">
</a>



## Key Differences

This protoc plugin does generate;

- Fields as **getter** **setters**.
- No such prefixes as "getField" or "getFieldList". If you have repeated field named `users`, then the generated message class will have a `getter` named `users` not `getUsersList` 
- Enums as **enums**.
- Messages within a **namespace** if the proto has a **package** directive.


## Usage

### Without Bazel
```properties
npm install -g protoc-gen-ts

protoc -I=sourcedir --ts_out=dist myproto.proto
```
### With Bazel
```py
# Add protoc-gen-ts to dependencies section of your package.json file.
# Then use it like you would use the other bazel compatible npm packages.

load("@npm_protoc_gen_ts//:index.bzl", "ts_proto_library")

ts_proto_library(
    name = "protos",
    deps = [
        ":some_proto_library_target"
    ]
)

# Checkout the examples/bazel directory for an example.
```


## Environment variables

```sh
# This controls experimental features such as 'Promise' based rpcs.
export EXPERIMENTAL_FEATURES=true;


# This controls the "import statement" for the outputs.
# this is here for legacy purposes.
export GRPC_PACKAGE_NAME="@grpc/grpc-js";
# or 
export GRPC_PACKAGE_NAME="@grpc/grpc";

```
## Roadmap

- <s>Support for repeated non-integer fields</s>
- <s>Generate appropriate service code that is usable with node **grpc** package.</s>
- <s>Support for creating protocol buffer messages directly from their constructors with an object.</s>
- <s>Support for `import` directive.</s>
- <s>Support for `Promise` in rpcs.</s>
- <s>Make services strongly typed.</s>
- <s>Support oneof fields</s>
- Support `map<TYPE, TYPE>` types as ES `Map`.
- Interopability with well knowns.


## Alternatives

| Plugin | google-protobuf | Typescript | Declarations | gRPC Node | gRPC Web | ES6 Support | Notes |
|------------------------------|-----------------|:----------:|:------------:|:---------:|:--------:|:-----------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
| thesayyn/protoc-gen-ts | Yes | Yes | Yes | Yes | Partial | Yes | The generated messages are compatible with ever-green browsers.<br>However, you might need to use third-party packages to use rpcs. |
| improbable-eng/ts-protoc-gen | Yes | No | Yes | No | Yes | Partial | Drawback: You can't bundle generated files with rollup since<br>they are not >= ES6 compatible. |
| stephenh/ts-proto | No | Yes | Yes | No | No | Yes | There is no support for rpcs.<br>See: https://github.com/stephenh/ts-proto/issues/2 |


## Development

```sh
# to run test invoke
yarn test
# additionally if you want to see error details
yarn test --test_output=errors

```
