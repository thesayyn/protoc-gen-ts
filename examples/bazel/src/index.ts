import { Package } from "./message";

const pkg = new Package({
  name: "protoc_gen_ts",
  author: "thesayyn",
  release_date: new Date().toISOString(),
  vcs_url: "https://github.com/thesayyn/protoc-gen-ts",
  tags: ["grpc-node", "protocolbuffers", "grpc", "grpc-web", "typescript"]
});

const transferredPkg = Package.deserialize(pkg.serialize());

console.log(pkg.toObject());
console.log(transferredPkg.toObject());
