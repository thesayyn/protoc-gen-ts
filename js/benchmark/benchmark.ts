import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import { TestAllTypesProto3 } from "./test_messages_proto3_pb.ts";
import * as base64 from "https://deno.land/std@0.202.0/encoding/base64.ts";

const ref = base64.decode(
  "+AEA+AG5YPgBueCAAPgBueCAgICAgIAA+AH/////B/gBgICAgPj/////AfgBgICAgCD4Af////8f+AH//////////3/4AYGAgICAgICAgAE="
);

// 2AQA2AS5YNgEueCAANgEueCAgICAgIAA2AT/////B9gEgICAgPj/////AdgEgICAgCDYBP////8f2AT//////////3/YBIGAgICAgICAgAE=
// +gE8ALlgueCAALnggICAgICAAP////8HgICAgPj/////AYCAgIAg/////x///////////3+BgICAgICAgIAB
// 2gQ8ALlgueCAALnggICAgICAAP////8HgICAgPj/////AYCAgIAg/////x///////////3+BgICAgICAgIAB
// +AEA+AG5YPgBueCAAPgBueCAgICAgIAA+AH/////B/gBgICAgPj/////AfgBgICAgCD4Af////8f+AH//////////3/4AYGAgICAgICAgAE=
// +gE8ALlgueCAALnggICAgICAAP////8HgICAgPj/////AYCAgIAg/////x///////////3+BgICAgICAgIAB

Deno.bench("protobuf-es", { group: "deserialize", baseline: true }, () =>
  TestAllTypesProto3.fromBinary(ref)
);
Deno.bench("protoc-gen-ts", { group: "deserialize" }, () =>
  protobuf_test_messages_proto3_TestAllTypesProto3.deserialize(ref)
);


let sb1 = TestAllTypesProto3.fromBinary(ref);
let sb2 = protobuf_test_messages_proto3_TestAllTypesProto3.deserialize(ref);

Deno.bench("protobuf-es", { group: "serialize", baseline: true }, () => {
  sb1.toBinary()
});
Deno.bench("protoc-gen-ts", { group: "serialize" }, () => {
  sb2.serialize()
});

