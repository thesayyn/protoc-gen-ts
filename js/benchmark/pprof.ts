import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import * as fs from "node:fs";

const examples = JSON.parse(fs.readFileSync("./dataset/base64_set.json")).map((r) =>
  Buffer.from(r, "base64")
);

const m = new protobuf_test_messages_proto3_TestAllTypesProto3();

for (let x = 0; x < examples.length; x++) {
  const bytes = examples[x];
  for (let i = 0; i < 1; i++) {
    m.mergeFrom(bytes);
  }
}

