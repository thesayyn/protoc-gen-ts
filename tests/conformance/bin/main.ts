import {}  from "conformance/test_messages_proto2.ts";
import {conformance_ConformanceRequest}  from "conformance/conformance.ts";
import {getStdinSync, getStdinBufferSync } from 'https://deno.land/x/get_stdin/mod.ts';
import {theater_Theater_MessageName} from "./message.ts";

console.log(await getStdinBufferSync());
