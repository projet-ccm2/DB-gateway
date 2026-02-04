import {
  handleJsonMessage,
  type GatewayRepo,
} from "../../../handler/jsonHandler";

test("jsonHandler unknown action returns error", async () => {
  const repo = {} as unknown as GatewayRepo;
  const out = await handleJsonMessage(repo, { action: "nope" });
  expect(out.ok).toBe(false);
});

describe("index factories", () => {
  test("createMockGateway returns db", () => {
    const { createMockGateway } = require("../../mocks");
    const g = createMockGateway();
    expect(g.db).toBeDefined();
  });

  test("createPrismaGateway returns db", () => {
    jest.isolateModules(() => {
      jest.doMock("../../../database/prismaDatabase", () => ({
        PrismaDatabase: class {
          constructor() {}
        },
      }));
      const { createPrismaGateway } = require("../../../index");
      const g = createPrismaGateway();
      expect(g.db).toBeDefined();
    });
  });
});
