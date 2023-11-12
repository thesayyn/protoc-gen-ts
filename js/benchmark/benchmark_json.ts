import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import { TestAllTypesProto3 } from "./protobuf-es/test_messages_proto3_pb.ts";
import * as base64 from "https://deno.land/std@0.202.0/encoding/base64.ts";

const binary = base64.decode(
  "+AEA+AG5YPgBueCAAPgBueCAgICAgIAA+AH/////B/gBgICAgPj/////AfgBgICAgCD4Af////8f+AH//////////3/4AYGAgICAgICAgAE="
);

const json = JSON.parse(`{
  "mapStringNestedMessage": {
    "hello": {"a": 1234},
    "world": {"a": 5678}
  }
}`);

let sb1 = TestAllTypesProto3.fromBinary(binary);
let sb2 = protobuf_test_messages_proto3_TestAllTypesProto3.deserialize(binary);

// fromJson
Deno.bench(
  "protobuf-es@fromJson",
  { group: "fromjson", baseline: true },
  () => {
    TestAllTypesProto3.fromJson(json);
  }
);
Deno.bench("protoc-gen-ts@fromJson", { group: "fromjson" }, () => {
  protobuf_test_messages_proto3_TestAllTypesProto3.fromJson(json);
});

// toJson
Deno.bench("protobuf-es@toJson", { group: "tojson", baseline: true }, () => {
  sb1.toJson();
});
Deno.bench("protoc-gen-ts@toJson", { group: "tojson" }, () => {
  sb2.toJson();
});
