import { Help, Topic } from "./help.ts";
import * as base64 from "https://deno.land/std@0.202.0/encoding/base64.ts";

const help = new Help();
help.topic = Topic.PACK;
help.message = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
help.short =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
help.generated_via = "cli";
console.log(base64.encode(help.serialize()));