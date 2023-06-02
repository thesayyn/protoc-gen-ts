import { protobuf_test_messages_proto2_TestAllTypesProto2 } from "conformance/test_messages_proto2.ts";
import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "conformance/test_messages_proto3.ts";
import {
  conformance_ConformanceRequest,
  conformance_ConformanceResponse,
  conformance_WireFormat,
  conformance_FailureSet,
  conformance_TestCategory,
} from "conformance/conformance.ts";
import { Buffer } from "https://deno.land/std@0.136.0/node/buffer.ts";

while (true) {
  const lengthBuffer = Buffer.alloc(4);
  Deno.stdin.readSync(lengthBuffer);

  const length = lengthBuffer.readUInt32LE();
  const requestBuffer = Buffer.alloc(length);
  Deno.stdin.readSync(requestBuffer);

  const req = conformance_ConformanceRequest.deserialize(requestBuffer);
  const res = new conformance_ConformanceResponse();

  if (req.test_category != conformance_TestCategory.BINARY_TEST) {
    res.skipped = "unsupported";
  } else if (req.requested_output_format != conformance_WireFormat.PROTOBUF) {
    res.skipped = "unsupported";
  } else {
    if (req.message_type == "conformance.FailureSet") {
      const failure_set = new conformance_FailureSet();
      res.protobuf_payload = failure_set.serialize();
    } else if (
      req.message_type == "protobuf_test_messages.proto3.TestAllTypesProto3"
    ) {
      try {
        const msg =
          protobuf_test_messages_proto3_TestAllTypesProto3.deserialize(
            req.protobuf_payload
          );
        res.protobuf_payload = msg.serialize();
      } catch (e) {
        res.parse_error = e.stack;
      }
    } else if (
      req.message_type == "protobuf_test_messages.proto2.TestAllTypesProto2"
    ) {
      try {
        const msg =
          protobuf_test_messages_proto2_TestAllTypesProto2.deserialize(
            req.protobuf_payload
          );
        res.protobuf_payload = msg.serialize();
      } catch (e) {
        res.parse_error = e.toString();
      }
    } else {
      throw new Error(`not implemented ${req.message_type}`);
    }
  }

  if (res.parse_error) {
    Deno.writeTextFileSync(
      "/Users/thesayyn/Documents/thesayyn/protoc-gen-ts/failures.txt",
  `${req.message_type} ${req.test_category}
  ${res.parse_error}

  `,
      { append: true, create: true }
    );
  }

  const resBytes = res.serialize();
  const lenBytes = Buffer.alloc(4);
  lenBytes.writeInt32LE(resBytes.length, 0);

  Deno.writeSync(1, lenBytes);
  Deno.writeSync(1, resBytes);
}
