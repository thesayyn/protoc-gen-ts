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
    patch: "@@ -7,11 +7,15 @@"
});

// Sent over the wire
const bytes: Uint8Array = change.serialize();

const receivedChange: Change = Change.deserialize(bytes);

console.log(receivedChange.kind == Kind.UPDATE) // true
console.log(receivedChange.patch) // "@@ -7,11 +7,15 @@"

```


## Key Differences

This protoc plugin does generate;

- Fields as **getter** **setters**.
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

## Roadmap

- <s>Support for repeated non-integer fields</s>
- <s>Generate appropriate service code that is usable with node **grpc** package.</s>
- <s>Support for creating protocol buffer messages directly from their constructors with an object.</s>
- Support `map<TYPE, TYPE>` fields.
- Support for `import` directive.
- Interopability with well knowns.


## Ideas
- Support `map<TYPE, TYPE>` types as ES `Map`.
- Make services strongly typed.
- Support for `Promise` in rpcs.


## Alternatives

| Plugin | google-protobuf | Typescript | Declarations | gRPC Node | gRPC Web | ES6 Support | Notes |
|------------------------------|-----------------|:----------:|:------------:|:---------:|:--------:|:-----------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
| thesayyn/protoc-gen-ts | Yes | Yes | Yes | Yes | Partial | Yes | The generated messages are compatible with ever-green browsers.<br>However, you might need to use third-party packages to use rpcs. |
| improbable-eng/ts-protoc-gen | Yes | No | Yes | No | Yes | Partial | Drawback: You can't bundle generated files with rollup since<br>they are not >= ES6 compatible. |
| stephenh/ts-proto | No | Yes | Yes | No | No | Yes | There is no support for rpcs.<br>See: https://github.com/stephenh/ts-proto/issues/2 |