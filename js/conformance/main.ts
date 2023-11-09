import * as proto2 from "../../tests/conformance/gen/test_messages_proto2.ts";
import * as proto3 from "../../tests/conformance/gen/test_messages_proto3.ts";
import * as conformance from "../../tests/conformance/gen/conformance.ts";
import * as any from "../../tests/well_known/gen/google/protobuf/any.ts";
import * as duration from "../../tests/well_known/gen/google/protobuf/duration.ts";
import * as timestamp from "../../tests/well_known/gen/google/protobuf/timestamp.ts";
import * as struct from "../../tests/well_known/gen/google/protobuf/struct.ts";
import * as wrappers from "../../tests/well_known/gen/google/protobuf/wrappers.ts";
import * as field_mask from "../../tests/well_known/gen/google/protobuf/field_mask.ts";

import { Buffer } from "https://deno.land/std@0.136.0/node/buffer.ts";
import * as base64 from "https://deno.land/std@0.202.0/encoding/base64.ts";

globalThis.protobuf = new (class TypeRegistry {
  registry = new Map<string, unknown>();
  get(name: string) {
    return this.registry.get(name);
  }
  append(message) {
    this.registry.set(message.type, message);
  }
})();

const messages = [
  proto2.protobuf_test_messages_proto2_TestAllTypesProto2,
  proto3.protobuf_test_messages_proto3_TestAllTypesProto3,
  conformance.conformance_ConformanceRequest,
  conformance.conformance_ConformanceResponse,
  conformance.conformance_FailureSet,
  conformance.conformance_JspbEncodingConfig,
  any.google_protobuf_Any,
  duration.google_protobuf_Duration,
  timestamp.google_protobuf_Timestamp,
  struct.google_protobuf_Struct,
  struct.google_protobuf_ListValue,
  struct.google_protobuf_Value,
  wrappers.google_protobuf_BoolValue,
  wrappers.google_protobuf_BytesValue,
  wrappers.google_protobuf_DoubleValue,
  wrappers.google_protobuf_FloatValue,
  wrappers.google_protobuf_Int32Value,
  wrappers.google_protobuf_Int64Value,
  wrappers.google_protobuf_StringValue,
  wrappers.google_protobuf_UInt32Value,
  wrappers.google_protobuf_UInt64Value,
  field_mask.google_protobuf_FieldMask,
];

for (const message of messages) {
  globalThis.protobuf.append(message);
}

while (true) {
  const lengthBuffer = Buffer.alloc(4);
  Deno.stdin.readSync(lengthBuffer);

  const length = lengthBuffer.readUInt32LE();
  const requestBuffer = Buffer.alloc(length);
  Deno.stdin.readSync(requestBuffer);

  const req = conformance.conformance_ConformanceRequest.deserialize(requestBuffer);
  const res = new conformance.conformance_ConformanceResponse();

  let message = globalThis.protobuf.get(req.message_type);

  if (!message) {
    res.runtime_error = `unknown message ${req.message_type}`;
  } else {
    let i: InstanceType<typeof message> | undefined = undefined;

    try {
      if (req.json_payload) {
        i = message!.fromJson(JSON.parse(req.json_payload!));
      } else if (req.protobuf_payload) {
        i = message!.deserialize(req.protobuf_payload!);
      } else {
        res.skipped = "unsupported payload";
      }
    } catch (e) {
      res.parse_error = `${e.stack}\n\n     ${base64.encode(req.protobuf_payload!)}`;
    }

    if (i != undefined) {
      try {
        if (req.requested_output_format == conformance.conformance_WireFormat.JSON) {
          res.json_payload = JSON.stringify(i.toJson(), undefined, "  ");
        } else if (req.requested_output_format == conformance.conformance_WireFormat.PROTOBUF) {
          res.protobuf_payload = i!.serialize();
        } else {
          res.skipped = "unsupported output type";
        }
      } catch (e) {
        res.serialize_error = `${e.stack}\n\n     ${base64.encode(req.protobuf_payload!)}`;
      }
    }
  }

  const resBytes = res.serialize();
  const lenBytes = Buffer.alloc(4);
  lenBytes.writeInt32LE(resBytes.length, 0);

  try {
    Deno.writeSync(1, lenBytes);
    Deno.writeSync(1, resBytes);
  } catch (e) {
    if (e.code == "EPIPE") {
      Deno.exit();
    }
    throw e;
  }
}
