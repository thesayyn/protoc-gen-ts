"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./test");
// Constructed message
const change = new test_1.Change({
    kind: test_1.Kind.UPDATED,
    patch: "@@ -7,11 +7,15 @@",
    tags: ["no prefix", "as is"]
});
// Sent over the wire
const bytes = change.serialize();
const receivedChange = test_1.Change.deserialize(bytes);
console.log(receivedChange.kind == test_1.Kind.UPDATED); // true
console.log(receivedChange.patch); // "@@ -7,11 +7,15 @@"
console.log(receivedChange.tags); // ["no prefix", "as is"]
if (JSON.stringify(change.toObject()) != JSON.stringify(receivedChange.toObject())) {
    console.error(`Transferred object does not match the source 
  
  Expected:
  
  ${JSON.stringify(change.toObject())}
  
  Got: 
  
  ${JSON.stringify(receivedChange.toObject())}
  `);
    process.exit(1);
}
else {
    process.exit(0);
}
