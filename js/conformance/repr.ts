import { protobuf_test_messages_proto2_TestAllTypesProto2 } from "../../tests/conformance/gen/test_messages_proto2.ts";
import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import {TestAllTypesProto2} from "./test_messages_proto2_pb.ts"
import {TestAllTypesProto3} from "./test_messages_proto3_pb.ts"

let proto2octal = String.raw`\250\001\201\200\200\200\200\200\200\200\200\001`
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

const bytes = new Uint8Array(octal.split("\\").slice(1).map(r => parseInt(r, 8)))
console.log(bytes)


// second
const secondMessage = secondType.fromBinary(bytes);
console.log(secondMessage.optionalNestedEnum)

const secondSerialized = secondMessage.toBinary();
console.log(secondSerialized)


// first
const message = type.deserialize(bytes);
console.log(message.optional_nested_enum)

const serialized = message.serialize();
console.log(serialized)
