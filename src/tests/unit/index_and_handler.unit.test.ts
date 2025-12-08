import { handleJsonMessage } from "../../handler/jsonHandler";

test("jsonHandler unknown action returns error", async () => {
  const repo = {
    addUser: async () => {},
    getUserById: async () => null,
  } as any;
  const out = await handleJsonMessage(repo, { action: "nope" });
  expect(out.ok).toBe(false);
});

describe("index factories", () => {
  test("createMockGateway returns db and repo", () => {
    const { createMockGateway } = require("../../index");
    const g = createMockGateway();
    expect(g.db).toBeDefined();
    expect(g.repo).toBeDefined();
  });

  test("createPrismaGateway uses PrismaDatabase mock", () => {
    // mock PrismaDatabase to avoid constructing real client
    jest.isolateModules(() => {
      jest.doMock("../../database/prismaDatabase", () => ({
        PrismaDatabase: class {
          constructor() {
            // noop
          }
        },
      }));
      const { createPrismaGateway } = require("../../index");
      const g = createPrismaGateway();
      expect(g.db).toBeDefined();
      expect(g.repo).toBeDefined();
    });
  });
});
