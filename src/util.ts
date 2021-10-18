import assert from "assert";

export function must<T>(
  input: T,
  message: string = "Cannot be null or undefined",
): NonNullable<T> {
  assert(input !== null && input !== undefined, message);

  return input as NonNullable<T>;
}
