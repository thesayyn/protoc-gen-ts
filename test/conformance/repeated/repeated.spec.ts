import * as fs from "fs";
import * as path from "path";
import { repeated } from "./proto/repeated_checked";

describe("repeated conformance", () => {
  const bin = fs.readFileSync(path.join(__dirname, "repeated.bin"));
  //   repeated int64 implicitly_packed = 1;
  //   repeated int64 explicitly_packed = 2 [packed = true]; // should same as default value
  //   repeated int64 explicitly_not_packed = 3 [packed = false];
  //   repeated int64 implicitly_packed_options = 4 [jstype = JS_NUMBER]; // options should have no effect
  it("should handle packed option", () => {
    const object = repeated.RepeatedWithOptions.deserialize(bin);
    expect(object.toObject()).toEqual({
      implicitly_packed: [1, 2, 3],
      explicitly_packed: [4, 5, 6],
      explicitly_not_packed: [7, 8, 9],
      implicitly_packed_options: [10, 11, 12],
    })
  })
})