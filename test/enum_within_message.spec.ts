import { main } from "./enum_within_message";

describe("Enum inside Message", () => {
  it("should generate enums", () => {
    const code = new main.Code({
      lines: 31,
      language: main.Code.Language.CPP,
    });

    const transferredCode = main.Code.deserialize(code.serialize());
    expect(transferredCode.toObject()).toEqual({
      lines: 31,
      language: main.Code.Language.CPP,
    });
  });
});
