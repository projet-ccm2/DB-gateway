// @ts-nocheck
describe("prismaDatabase adapter (mocked GeneratedPrismaClient)", () => {
  jest.isolateModules(() => {
    jest.doMock("../../generated/prisma/client", () => {
      return {
        PrismaClient: class {
          constructor() {
            // simple in-memory stores
            this._users = new Map();
            this._chanels = new Map();
            this._types = new Map();
            this._achievements = new Map();
            this._badges = new Map();
            this._achieved = new Map();
            this._are = new Map();
            this._possesses = new Map();

            // adapters
            const mkFind =
              (store) =>
              async ({ where: { id } }) =>
                store.get(id) ?? null;
            const mkCreate =
              (store, shapeFn) =>
              async ({ data }) => {
                const id = (Math.random() + 1).toString(36).slice(2, 10);
                const row = { id, ...shapeFn(data) };
                store.set(id, row);
                return row;
              };

            this.user = {
              findUnique: async ({ where: { id } }) =>
                this._users.get(id) ?? null,
              create: async ({ data }) => {
                const id = "u_" + Math.random().toString(36).slice(2, 8);
                const row = { id, username: data.username };
                this._users.set(id, row);
                return row;
              },
            };

            this.chanel = {
              findUnique: async ({ where: { id } }) =>
                this._chanels.get(id) ?? null,
              create: async ({ data }) => {
                const id = "c_" + Math.random().toString(36).slice(2, 8);
                const row = { id, name: data.name };
                this._chanels.set(id, row);
                return row;
              },
            };

            this.typeAchievement = {
              findUnique: async ({ where: { id } }) =>
                this._types.get(id) ?? null,
              create: async ({ data }) => {
                const id = "t_" + Math.random().toString(36).slice(2, 8);
                const row = { id, label: data.label, data: data.data };
                this._types.set(id, row);
                return row;
              },
            };

            this.achievement = {
              findUnique: async ({ where: { id } }) =>
                this._achievements.get(id) ?? null,
              create: async ({ data }) => {
                const id = "a_" + Math.random().toString(36).slice(2, 8);
                const row = {
                  id,
                  title: data.title,
                  description: data.description,
                  goal: data.goal,
                  reward: data.reward,
                  label: data.label,
                };
                this._achievements.set(id, row);
                return row;
              },
            };

            this.badge = {
              findUnique: async ({ where: { id } }) =>
                this._badges.get(id) ?? null,
              create: async ({ data }) => {
                const id = "b_" + Math.random().toString(36).slice(2, 8);
                const row = { id, title: data.title, img: data.img };
                this._badges.set(id, row);
                return row;
              },
            };

            this.achieved = {
              findUnique: async ({ where: { achievementId_userId } }) => {
                const key =
                  achievementId_userId.achievementId +
                  "|" +
                  achievementId_userId.userId;
                return this._achieved.get(key) ?? null;
              },
              create: async ({ data }) => {
                const key = data.achievementId + "|" + data.userId;
                const row = {
                  achievementId: data.achievementId,
                  userId: data.userId,
                  count: data.count,
                  finished: data.finished,
                  labelActive: data.labelActive,
                  aquiredDate: data.aquiredDate,
                };
                this._achieved.set(key, row);
                return row;
              },
            };

            this.are = {
              findUnique: async ({ where: { userId_chanelId } }) => {
                const key =
                  userId_chanelId.userId + "|" + userId_chanelId.chanelId;
                return this._are.get(key) ?? null;
              },
              create: async ({ data }) => {
                const key = data.userId + "|" + data.chanelId;
                const row = {
                  userId: data.userId,
                  chanelId: data.chanelId,
                  userType: data.userType,
                };
                this._are.set(key, row);
                return row;
              },
            };

            this.possesses = {
              findUnique: async ({ where: { userId_badgeId } }) => {
                const key =
                  userId_badgeId.userId + "|" + userId_badgeId.badgeId;
                return this._possesses.get(key) ?? null;
              },
              create: async ({ data }) => {
                const key = data.userId + "|" + data.badgeId;
                const row = {
                  userId: data.userId,
                  badgeId: data.badgeId,
                  aquiredDate: data.aquiredDate,
                };
                this._possesses.set(key, row);
                return row;
              },
            };

            this.$disconnect = async () => {};
          }
        },
      };
    });

    const { prismaDatabase } = require("../../database/prismaDatabase");
    test("prismaDatabase methods (mocked) exercise success and not-found branches", async () => {
      const db = new prismaDatabase();

      // User paths
      const addedUser = await db.addUser("alice");
      expect(addedUser.username).toBe("alice");
      const gotUser = await db.getUserById(addedUser.id);
      expect(gotUser?.id).toBe(addedUser.id);
      expect(await db.getUserById("nope")).toBeNull();

      // Chanel
      const ch = await db.addChanel({ name: "ch1" });
      expect(ch.name).toBe("ch1");
      expect((await db.getChanelById(ch.id))?.id).toBe(ch.id);

      // Type
      const t = await db.addTypeAchievement({ label: "L", data: "D" });
      expect(t.label).toBe("L");

      // Achievement
      const a = await db.addAchievement({
        title: "T",
        description: "D",
        goal: 1,
        reward: 2,
        label: "lab",
      });
      expect(a.title).toBe("T");

      // Badge
      const b = await db.addBadge({ title: "B", img: "i" });
      expect(b.title).toBe("B");

      // Achieved
      const achv = await db.addAchieved({
        achievementId: a.id,
        userId: addedUser.id,
        count: 1,
        finished: false,
        labelActive: true,
        aquiredDate: new Date().toISOString(),
      });
      expect(achv.achievementId).toBe(a.id);
      expect(await db.getAchieved(a.id, "missing_user")).toBeNull();

      // Are
      const ar = await db.addAre({
        userId: addedUser.id,
        chanelId: ch.id,
        userType: "admin",
      });
      expect(ar.userType).toBe("admin");
      expect(await db.getAre("x", "y")).toBeNull();

      // Possesses
      const p = await db.addPossesses({
        userId: addedUser.id,
        badgeId: b.id,
        aquiredDate: new Date().toISOString(),
      });
      expect(p.badgeId).toBe(b.id);
      expect(await db.getPossesses("x", "y")).toBeNull();

      await db.disconnect();
    });
  });
});
