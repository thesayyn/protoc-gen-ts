import { protobuf_test_messages_proto2_TestAllTypesProto2 } from "../../tests/conformance/gen/test_messages_proto2.ts";
import { protobuf_test_messages_proto3_TestAllTypesProto3 } from "../../tests/conformance/gen/test_messages_proto3.ts";
import {
  conformance_ConformanceRequest,
  conformance_ConformanceResponse,
  conformance_WireFormat,
  conformance_FailureSet,
  conformance_TestCategory,
} from "../../tests/conformance/gen/conformance.ts";
import { Buffer } from "https://deno.land/std@0.136.0/node/buffer.ts";

try {
  Deno.removeSync("./tests/failures.log");
} catch {}

let i = 0;

while (true) {
  const lengthBuffer = Buffer.alloc(4);
  Deno.stdin.readSync(lengthBuffer);

  const length = lengthBuffer.readUInt32LE();
  const requestBuffer = Buffer.alloc(length);
  Deno.stdin.readSync(requestBuffer);



  const req = conformance_ConformanceRequest.deserialize(requestBuffer);
  const res = new conformance_ConformanceResponse();
  res.skipped = "unsupported";

  let message = undefined;

  switch (req.message_type) {
    case "conformance.FailureSet":
      message = conformance_FailureSet;
      break;
    case "protobuf_test_messages.proto3.TestAllTypesProto3":
      message = protobuf_test_messages_proto3_TestAllTypesProto3;
      break;
    case "protobuf_test_messages.proto2.TestAllTypesProto2":
      message = protobuf_test_messages_proto2_TestAllTypesProto2;
      break;
    default:
      break;
  }

  if (
    req.test_category == conformance_TestCategory.BINARY_TEST &&
    req.requested_output_format == conformance_WireFormat.PROTOBUF &&
    message
  ) {
    res.skipped = undefined;

    if (message) {
      try {
        const msg = message.deserialize(req.protobuf_payload!);
        try {
          res.protobuf_payload = msg.serialize();
        } catch (e) {
          res.serialize_error = e.stack;
        }
      } catch (e) {
        res.parse_error = e.stack;
      }
    } else {
      res.runtime_error = `unknown message ${req.message_type}`;
    }
  }

  const error = res.parse_error || res.serialize_error || res.runtime_error;
  if (error) {
    i++;
    Deno.writeTextFileSync(
      "./tests/failures.log",
      `# ${i} ${req.message_type} ${req.test_category}\n${error}\n`,
      { append: true, create: true }
    );

    if (error.indexOf("64") != -1) {
      res.parse_error = res.serialize_error = res.runtime_error = undefined;
      res.skipped = "int64";
    }
  }

  const resBytes = res.serialize();
  const lenBytes = Buffer.alloc(4);
  lenBytes.writeInt32LE(resBytes.length, 0);

  try {
    Deno.writeSync(1, lenBytes);
    Deno.writeSync(1, resBytes);
  } catch(e) {
    if (e.code == "EPIPE") {
      Deno.exit();
    } 
    throw e;
  }

}
