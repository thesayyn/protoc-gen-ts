import { Integers } from "./integers";

describe("integers", () => {
  it("should set & get int32", () => {
    const message = new Integers({
      int32: 5456,
      int64: 25656
    });
    expect(message.int32).toBe(5456);
    expect(message.int64).toBe(25656);
  });

  it("should set falsy values", () => {
    const message = new Integers({
      int32: 0,
      int64: 0
    });
    const transferredMessage = Integers.deserialize(message.serialize());
    expect(transferredMessage.int32).toBe(0);
    expect(transferredMessage.int64).toBe(0);
  });
});
