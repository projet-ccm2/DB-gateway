import {
  getErrorMessage,
  paramId,
  queryString,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_ERROR,
  SERVICE_UNAVAILABLE,
} from "../../../controllers/helpers";

describe("controllers/helpers", () => {
  test("getErrorMessage returns message for Error", () => {
    expect(getErrorMessage(new Error("fail"))).toBe("fail");
  });

  test("getErrorMessage returns String for non-Error", () => {
    expect(getErrorMessage("oops")).toBe("oops");
    expect(getErrorMessage(42)).toBe("42");
  });

  test("paramId returns param from request", () => {
    const req = { params: { id: "abc-123" } } as unknown as Parameters<
      typeof paramId
    >[0];
    expect(paramId(req, "id")).toBe("abc-123");
  });

  test("paramId returns empty string when param missing", () => {
    const req = { params: {} } as unknown as Parameters<typeof paramId>[0];
    expect(paramId(req, "id")).toBe("");
  });

  test("paramId handles array params", () => {
    const req = { params: { id: ["first", "second"] } } as unknown as Parameters<
      typeof paramId
    >[0];
    expect(paramId(req, "id")).toBe("first");
  });

  test("queryString returns string query", () => {
    const req = { query: { filter: "active" } } as unknown as Parameters<
      typeof queryString
    >[0];
    expect(queryString(req, "filter")).toBe("active");
  });

  test("queryString returns undefined when missing", () => {
    const req = { query: {} } as unknown as Parameters<typeof queryString>[0];
    expect(queryString(req, "filter")).toBeUndefined();
  });

  test("queryString handles array and takes first", () => {
    const req = {
      query: { filter: ["a", "b"] },
    } as unknown as Parameters<typeof queryString>[0];
    expect(queryString(req, "filter")).toBe("a");
  });

  test("status constants are numbers", () => {
    expect(BAD_REQUEST).toBe(400);
    expect(NOT_FOUND).toBe(404);
    expect(INTERNAL_ERROR).toBe(500);
    expect(SERVICE_UNAVAILABLE).toBe(503);
  });
});
