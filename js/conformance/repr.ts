import { protobuf_test_messages_proto2_TestAllTypesProto2 } from "../../tests/conformance/gen/test_messages_proto2.ts";
import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import {TestAllTypesProto2} from "./test_messages_proto2_pb.ts"
import {TestAllTypesProto3} from "./test_messages_proto3_pb.ts"
import * as base64 from "https://deno.land/std@0.202.0/encoding/base64.ts";

let proto2octal = String.raw``
let proto3octal = String.raw``

let octal: string;
let type: typeof protobuf_test_messages_proto2_TestAllTypesProto2 | typeof protobuf_test_messages_proto3_TestAllTypesProto3;
let secondType: typeof TestAllTypesProto2 | typeof TestAllTypesProto3;

if (proto2octal) {
    octal = proto2octal;
    type = protobuf_test_messages_proto2_TestAllTypesProto2;
    secondType = TestAllTypesProto2
} else {
    octal = proto3octal;
    type = protobuf_test_messages_proto3_TestAllTypesProto3;
    secondType = TestAllTypesProto3
}

//const bytes = new Uint8Array(octal.split("\\").slice(1).map(r => parseInt(r, 8)))
const bytes = base64.decode("wgIgAAAAAAAAAAA5MAAAAAAAAP////////9/AAAAAAAAAIA=")
console.log(bytes)

console.log("###")


console.log("-> es")
// second
const secondMessage = secondType.fromBinary(bytes);
console.log(secondMessage)

const secondSerialized = secondMessage.toBinary();
console.log(secondSerialized)


console.log("-> me")
// first
const message = type.deserialize(bytes);
console.log(message)

const serialized = message.serialize();
console.log(serialized)

console.log(arraysEqual(secondSerialized, serialized))

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }