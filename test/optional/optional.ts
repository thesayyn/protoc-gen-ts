import { Optional } from "./optional_proto3";
import { NotOptional } from "./optional_proto2";

new Optional({});
new NotOptional({should_be_required: []});