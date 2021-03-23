import * as fs from "fs";

describe("Conformance", () => {
  it("should conform the path with golang", () => {
    const file = fs
      .readFileSync(require.resolve("./conformance"))
      .toString();
    expect(file).toContain('path: "/main.Conformance/Method",');
  });
});
