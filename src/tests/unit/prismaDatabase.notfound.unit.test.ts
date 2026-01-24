// Dynamic Jest mock structure does not match Prisma types; use 'any' for mock classes and snake_case keys with eslint-disable-next-line camelcase where needed.
describe("prismaDatabase not-found branches", () => {
  jest.isolateModules(() => {
    jest.doMock("@prisma/client", () => {
      return {
        PrismaClient: class {
          // Use 'any' for dynamic properties to satisfy TypeScript
          [key: string]: any;
          constructor() {
            this.user = { findUnique: async () => null };
            this.channel = { findUnique: async () => null };
            this.typeAchievement = { findUnique: async () => null };
            this.achievement = { findUnique: async () => null };
            this.badge = { findUnique: async () => null };
            this.achieved = { findUnique: async () => null };
            this.are = { findUnique: async () => null };
            this.possesses = { findUnique: async () => null };
            this.$disconnect = async () => {};
          }
        },
      };
    });

    const { PrismaDatabase } = require("../../database/prismaDatabase");
    test("all gets return null for missing entries", async () => {
      const db = new PrismaDatabase();
      expect(await db.getUserById("no")).toBeNull();
      expect(await db.getChannelById("no")).toBeNull();
      expect(await db.getTypeAchievementById("no")).toBeNull();
      expect(await db.getAchievementById("no")).toBeNull();
      expect(await db.getBadgeById("no")).toBeNull();
      expect(await db.getAchieved("no", "no")).toBeNull();
      expect(await db.getAre("no", "no")).toBeNull();
      expect(await db.getPossesses("no", "no")).toBeNull();
      await db.disconnect();
    });
  });
});
