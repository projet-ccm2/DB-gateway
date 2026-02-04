import { str, strOrNull, num, bool, missing } from "../../../handler/payload";

describe("handler/payload", () => {
  test("str returns first non-empty string for given keys", () => {
    expect(str({ a: "x", b: "y" }, "a")).toBe("x");
    expect(str({ a: "", b: "y" }, "a", "b")).toBe("y");
    expect(str({ userId: "u1", User_ID: "u2" }, "userId", "User_ID")).toBe(
      "u1",
    );
  });

  test("str returns undefined when no key has string", () => {
    expect(str({ a: 1, b: null }, "a", "b")).toBeUndefined();
    expect(str({}, "x")).toBeUndefined();
    expect(str({ a: "" }, "a")).toBeUndefined();
  });

  test("strOrNull returns null for missing or null", () => {
    expect(strOrNull({}, "x")).toBeNull();
    expect(strOrNull({ x: null }, "x")).toBeNull();
  });

  test("strOrNull returns string when present", () => {
    expect(strOrNull({ x: "hello" }, "x")).toBe("hello");
    expect(strOrNull({ x: "" }, "x")).toBe("");
  });

  test("num returns number from payload", () => {
    expect(num({ n: 42 }, "n")).toBe(42);
    expect(num({ n: "10" }, "n")).toBe(10);
  });

  test("num returns undefined for invalid or missing", () => {
    expect(num({ n: "abc" }, "n")).toBeUndefined();
    expect(num({}, "n")).toBeUndefined();
    expect(num({ n: NaN }, "n")).toBeUndefined();
  });

  test("bool returns boolean from payload", () => {
    expect(bool({ b: true }, "b")).toBe(true);
    expect(bool({ b: false }, "b")).toBe(false);
  });

  test("bool returns undefined for non-boolean", () => {
    expect(bool({ b: "true" }, "b")).toBeUndefined();
    expect(bool({}, "b")).toBeUndefined();
  });

  test("missing returns error result with field names", () => {
    const r = missing("userId", "name");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toBe("missing: userId, name");
  });
});
