const fs = require("fs");
const plugin = require("./dist/plugin.js");

// Using 0 instead of process.stdin.fd.
// see: https://github.com/thesayyn/protoc-gen-ts/issues/222
const bytes = new Uint8Array(fs.readFileSync(0));
process.stdout.write(plugin.run(bytes));