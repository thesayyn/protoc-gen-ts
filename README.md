# Protoc Gen Typescript 

[![test](https://github.com/thesayyn/protoc-gen-ts/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/thesayyn/protoc-gen-ts/actions/workflows/test.yaml)
[![npm](https://img.shields.io/npm/v/protoc-gen-ts)](https://www.npmjs.com/package/protoc-gen-ts?activeTab=versions)
[![npm](https://img.shields.io/npm/dm/protoc-gen-ts)](https://www.npmjs.com/package/protoc-gen-ts?activeTab=versions)
[![npm](https://opencollective.com/protoc-gen-ts/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/protoc-gen-ts)

Aim of this protoc plugin is to make usage of protocol buffers easy in Javascript/Typescript by taking a modern approach. 
This plugin generates plain **TypeScript** sources that can be used in ESM, AMD, UMD, and CommonJS module system.

## Key Differences

- No `d.ts` files. Just plain typescript sources with actual code.
- Fields as **getter** **setters**.
- Enums as **enums**.
- Messages within a **namespace** if the proto has a **package** directive. (can be controlled via --ts_opt=no_namespace)
- **fromObject** and **toObject** methods to work with json data.
- Support for gRPC Node and gRPC Web (Work-in-progress) [#102](https://github.com/thesayyn/protoc-gen-ts/pull/102)
- You get what you define in proto files. No such prefixes as "getField" or "getFieldList".
- Generates bindings with either as-is names (`message.field_name`) or JSON-compatible names (`message.fieldName`).

## Example

```proto
syntax = "proto3";

message Author {
    string name = 1;
    string role = 2;
}

message Change {
    Kind kind = 1;
    string patch = 2;
    repeated string tags = 3; 
    oneof name_or_id {
        string name = 4;
        string id = 5;
    }
    Author author = 6;
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
    name: "patch for typescript 4.5",
    author: new Author({
        name: "mary poppins",
        role: "maintainer"
    })
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
console.log(receivedChange.author.name) // "mary poppins"
```

## Support for Message.fromObject and Message.toObject

When mapping raw json data to message classes, dealing with nested structures can be rather annoying.
To overcome this problem, every generated message class has a static method called `fromObject` and `toObject` 
which can handle the mapping bidirectionally for you, even with the deeply structured messages. since it is 
aware of the field graph, it does not rely on any runtime type information thus we get the chance to keep it fast.

One can write code as;

```typescript
const change = Change.fromObject({
    kind: Kind.UPDATED,
    patch: "@@ -7,11 +7,15 @@",
    tags: ["no prefix", "as is"],
    name: "patch for typescript 4.5",
    author: {
        name: "mary poppins",
        role: "maintainer"
    }
});

console.log(change.author instanceof Author) // true
```


## Usage with `@grpc/grpc-js` or `grpc`

There is a seperate documentation for the usage of protoc-gen-ts along with either `@grpc/grpc-js` or `grpc`.  By default
this generated gRPC interfaces will use `@grpc/grpc-js`.

Checkout [rpcs](docs/rpc.md).

## Usage

### Without Bazel
```properties
npm install -g protoc-gen-ts

protoc -I=sourcedir --ts_out=dist myproto.proto
```
### With Bazel
```py
# Add protoc-gen-ts to dependencies section of your package.json file.

load("@npm//protoc-gen-ts:index.bzl", "ts_proto_library")

ts_proto_library(
    name = "protos",
    deps = [
        ":some_proto_library_target"
    ]
)

# Checkout the examples/bazel directory for an example.
```

## Supported Options

* With `--ts_opt=unary_rpc_promise=true`, the service definition will contain a promise based rpc with a calling pattern of `const result = await client.METHOD(message)`.  Note: all of the `metadata` and `options` parameters are still available to you.

* With `--ts_opt=grpc_package=xxxx`, you can specify a different package to import rather than `@grpc/grpc-js`.

* With `--ts_opt=no_namespace`, you can control whether you get nested messages inside namespaces or prefixed with their parent message or directive.

* With `--ts_opt=json_names`, fields will be converted to lowerCamelCase, for compatibility with the [JSON mapping][] done by the first-party protobuf libraries.

[JSON mapping]: https://developers.google.com/protocol-buffers/docs/proto3#json

* With `--ts_opt=explicit_override`, inherited methods are generated with `override` modifier, this fixes transpilation error when `noImplicitOverride` is enabled.

## Support

We need your constant support to keep protoc-gen-ts well maintained and add new features.

If your corporate has a OSS funding scheme, please consider supporting us monthly through open collective.

<a href="https://opencollective.com/protoc-gen-ts">
<img height="100px" src="https://opencollective.com/protoc-gen-ts/tiers/backer.svg?avatarHeight=36">
</a>

## Roadmap

- <s>Support for repeated non-integer fields</s>
- <s>Generate appropriate service code that is usable with node **grpc** package.</s>
- <s>Support for creating protocol buffer messages directly from their constructors with an object.</s>
- <s>Support for `import` directive.</s>
- <s>Support for `Promise` in rpcs.</s>
- <s>Make services strongly typed.</s>
- <s>Support oneof fields</s>
- <s>Support `map<TYPE, TYPE>` types as ES `Map`.</s>
- <s>Support for `@deprecated` annotations via deprecated option.</s>
- Support for grpc-web without any manual intervention.
- Interopability with well knowns.


## Alternatives

| Plugin | google-protobuf | Typescript | Declarations | gRPC Node | gRPC Web | ES6 Support | Notes |
|------------------------------|-----------------|:----------:|:------------:|:---------:|:--------:|:-----------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
| thesayyn/protoc-gen-ts | Yes | Yes | Yes | Yes | Partial | Yes | The generated messages are compatible with ever-green browsers.<br>However, you might need to use third-party packages to use rpcs. |
| improbable-eng/ts-protoc-gen | Yes | No | Yes | No | Yes | Partial | Drawback: You can't bundle generated files with rollup since<br>they are not >= ES6 compatible. |
| stephenh/ts-proto | No | Yes | Yes | No | No | Yes | There is no support for rpcs.<br>See: https://github.com/stephenh/ts-proto/issues/2 |


## Development

Generates appropriate Protocol Buffer sources from Proto files directly through _TypeScript Compiler API_.

```sh
# when you make changes to the plugin, you will have to run the command below
yarn update_checked_in_test
# this command will run the plugin with your changes and update generated test source accordingly.

# then invoke the tests
yarn test
# additionally if you want to see error details
yarn test --test_output=errors
```

## Contributors

![GitHub Contributors Image](https://contrib.rocks/image?repo=thesayyn/protoc-gen-ts)
