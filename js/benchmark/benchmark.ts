import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import { TestAllTypesProto3 } from "./test_messages_proto3_pb.ts";
import Benchmarkify from "npm:benchmarkify";
import * as base64 from "https://deno.land/std@0.202.0/encoding/base64.ts";

const ref = base64.decode(
  "+AEA+AG5YPgBueCAAPgBueCAgICAgIAA+AH/////B/gBgICAgPj/////AfgBgICAgCD4Af////8f+AH//////////3/4AYGAgICAgICAgAE="
);

const benchmark = new Benchmarkify("Protobuf", {
  chartImage: true,
}).printHeader();

const deserialize = benchmark.createSuite("deserialize", {
  time: 500,
  description: "Benchmark popular packages",
});
const serialize = benchmark.createSuite("serialize", {
  time: 500,
  description: "Benchmark popular packages",
});

deserialize
  .add("protoc-gen-ts", () => {
    protobuf_test_messages_proto3_TestAllTypesProto3.deserialize(ref);
  })
  .ref("protobuf-es", () => {
    TestAllTypesProto3.fromBinary(ref);
  });

let des = protobuf_test_messages_proto3_TestAllTypesProto3.deserialize(ref);
let des2 = TestAllTypesProto3.fromBinary(ref);
serialize
  .add("protoc-gen-ts", () => {
    const result = des.serialize();
  })
  .ref("protobuf-es", () => {
    const result = des2.toBinary();
  });

benchmark.run()