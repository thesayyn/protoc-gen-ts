# Protoc Gen Typescript 

![conformance](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fthesayyn%2Fprotoc-gen-ts%2Frust-rewrite%2Finfra%2Fstats.json&query=percentile&suffix=%25&label=conformance)
[![test](https://github.com/thesayyn/protoc-gen-ts/actions/workflows/test.yaml/badge.svg)](https://github.com/thesayyn/protoc-gen-ts/actions/workflows/test.yaml)
[![npm](https://img.shields.io/npm/v/protoc-gen-ts)](https://www.npmjs.com/package/protoc-gen-ts?activeTab=versions)
[![npm](https://img.shields.io/npm/dm/protoc-gen-ts)](https://www.npmjs.com/package/protoc-gen-ts?activeTab=versions)
[![npm](https://opencollective.com/protoc-gen-ts/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/protoc-gen-ts)

Compile `.proto` files to plain TypeScript. Supports gRPC Node and gRPC Web.

## Features

- Passes all required conformance tests
- Supports well-known types
- Supports [gRPC](docs/rpc.md) (`@grpc/grpc-js`)
- Supports [gRPC Web](docs/rpc.md) (`grpc-web`)
- Supports json encoding (`toJson`, `fromJson`)
- Supports binary encoding (`toBinary`, `fromBinary`)
- Optimized for [de]serialization speed.

## Usage

```properties
npm install -g protoc-gen-ts

protoc -I=sourcedir --ts_out=dist myproto.proto
```
### Example

```proto
syntax = "proto3";

enum Role {
    ADMIN = 0;
    MOD = 1;
}

message Author {
    Role role = 2;
    oneof id_or_name {
        string id = 4;
        string name = 5;
    }
}
```


```typescript
const author = Author.fromJson({
    role: Kind.ADMIN,
    name: "mary poppins",
});

// Serialize to binary
const bytes: Uint8Array = author.toBinary();

// Deserialize from binary
const received: Change = Change.fromBinary(bytes);

console.log(received.toJson())
```

## Development

```sh
./infra/test.sh
```

## Contributors

![GitHub Contributors Image](https://contrib.rocks/image?repo=thesayyn/protoc-gen-ts)

## Support

We need your constant support to keep protoc-gen-ts well maintained and add new features.

If your corporate has a OSS funding scheme, please consider supporting us monthly through open collective.

<a href="https://opencollective.com/protoc-gen-ts">
<img height="100px" src="https://opencollective.com/protoc-gen-ts/tiers/backer.svg?avatarHeight=36">
</a>