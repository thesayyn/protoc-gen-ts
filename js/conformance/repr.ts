import { protobuf_test_messages_proto2_TestAllTypesProto2 } from "../../tests/conformance/gen/test_messages_proto2.ts";
import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";


let proto2octal = ``
let proto3octal = String.raw`\230\007\000`

let octal: string;
let type: typeof protobuf_test_messages_proto2_TestAllTypesProto2 | typeof protobuf_test_messages_proto3_TestAllTypesProto3;

if (proto2octal) {
    octal = proto2octal;
    type = protobuf_test_messages_proto2_TestAllTypesProto2;
} else {
    octal = proto3octal;
    type = protobuf_test_messages_proto3_TestAllTypesProto3;
}

const bytes = new Uint8Array(octal.split("\\").slice(1).map(r => parseInt(r, 8)))
console.log(bytes)

const message = type.deserialize(bytes);
console.log(message)

const serialized = message.serialize();
console.log(serialized)
