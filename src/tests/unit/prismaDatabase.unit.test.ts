// Dynamic Jest mock structure does not match Prisma types; use 'any' for mock classes and snake_case keys with eslint-disable-next-line camelcase where needed.
describe("prismaDatabase adapter (mocked GeneratedPrismaClient)", () => {
  jest.isolateModules(() => {
    jest.doMock("@prisma/client", () => {
      return {
        PrismaClient: class {
          // Use 'any' for dynamic properties to satisfy TypeScript
          [key: string]: any;
          constructor() {
            // simple in-memory stores
            this._users = new Map();
            this._channels = new Map();
            this._types = new Map();
            this._achievements = new Map();
            this._badges = new Map();
            this._achieved = new Map();
            this._are = new Map();
            this._possesses = new Map();

            this.user = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._users.get(where.id) ?? null,
              create: async ({ data }: { data: any }) => {
                const id = "u_" + Math.random().toString(36).slice(2, 8);
                const row = {
                  id,
                  username: data.username,
                  twitchUserId: data.twitchUserId,
                  profileImageUrl: data.profileImageUrl ?? null,
                  channelDescription: data.channelDescription ?? null,
                  scope: data.scope ?? null,
                };
                this._users.set(id, row);
                return row;
              },
              findMany: async () => [],
            };

            this.channel = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._channels.get(where.id) ?? null,
              create: async ({ data }: { data: any }) => {
                const id = "c_" + Math.random().toString(36).slice(2, 8);
                const row = { id, name: data.name };
                this._channels.set(id, row);
                return row;
              },
            };

            this.typeAchievement = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._types.get(where.id) ?? null,
              create: async ({ data }: { data: any }) => {
                const id = "t_" + Math.random().toString(36).slice(2, 8);
                const row = { id, label: data.label, data: data.data };
                this._types.set(id, row);
                return row;
              },
            };

            this.achievement = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._achievements.get(where.id) ?? null,
              create: async ({ data }: { data: any }) => {
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
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._badges.get(where.id) ?? null,
              create: async ({ data }: { data: any }) => {
                const id = "b_" + Math.random().toString(36).slice(2, 8);
                const row = { id, title: data.title, img: data.img };
                this._badges.set(id, row);
                return row;
              },
            };

            this.achieved = {
              findUnique: async ({
                where,
              }: {
                where: {
                  achievementId_userId: {
                    achievementId: string;
                    userId: string;
                  };
                };
              }) => {
                const key =
                  where.achievementId_userId.achievementId +
                  "|" +
                  where.achievementId_userId.userId;
                return this._achieved.get(key) ?? null;
              },
              create: async ({ data }: { data: any }) => {
                const key = data.achievementId + "|" + data.userId;
                const row = {
                  achievementId: data.achievementId,
                  userId: data.userId,
                  count: data.count,
                  finished: data.finished,
                  labelActive: data.labelActive,
                  acquiredDate: data.acquiredDate,
                };
                this._achieved.set(key, row);
                return row;
              },
              findMany: async ({
                where,
                include,
              }: {
                where?: any;
                include?: any;
              }) => {
                const results = [];
                for (const [, v] of this._achieved) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (
                    where?.achievementId &&
                    v.achievementId !== where.achievementId
                  )
                    continue;
                  const row = { ...v };
                  if (include?.user) row.user = this._users.get(v.userId);
                  results.push(row);
                }
                return results;
              },
            };

            this.are = {
              findUnique: async ({
                where,
              }: {
                where: {
                  userId_channelId: { userId: string; channelId: string };
                };
              }) => {
                const key =
                  where.userId_channelId.userId +
                  "|" +
                  where.userId_channelId.channelId;
                return this._are.get(key) ?? null;
              },
              create: async ({ data }: { data: any }) => {
                const key = data.userId + "|" + data.channelId;
                const row = {
                  userId: data.userId,
                  channelId: data.channelId,
                  userType: data.userType,
                };
                this._are.set(key, row);
                return row;
              },
              findMany: async ({
                where,
                include,
              }: {
                where?: any;
                include?: any;
              }) => {
                const results = [];
                for (const [, v] of this._are) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (where?.channelId && v.channelId !== where.channelId)
                    continue;
                  const row = { ...v };
                  if (include?.channel)
                    row.channel = this._channels.get(v.channelId);
                  if (include?.user) row.user = this._users.get(v.userId);
                  results.push(row);
                }
                return results;
              },
            };

            this.possesses = {
              findUnique: async ({
                where,
              }: {
                where: { userId_badgeId: { userId: string; badgeId: string } };
              }) => {
                const key =
                  where.userId_badgeId.userId +
                  "|" +
                  where.userId_badgeId.badgeId;
                return this._possesses.get(key) ?? null;
              },
              create: async ({ data }: { data: any }) => {
                const key = data.userId + "|" + data.badgeId;
                const row = {
                  userId: data.userId,
                  badgeId: data.badgeId,
                  acquiredDate: data.acquiredDate,
                };
                this._possesses.set(key, row);
                return row;
              },
              findMany: async ({
                where,
                include,
              }: {
                where?: any;
                include?: any;
              }) => {
                const results = [];
                for (const [, v] of this._possesses) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (where?.badgeId && v.badgeId !== where.badgeId) continue;
                  const row = { ...v };
                  if (include?.badge) row.badge = this._badges.get(v.badgeId);
                  if (include?.user) row.user = this._users.get(v.userId);
                  results.push(row);
                }
                return results;
              },
            };

            this.$disconnect = async () => {};
          }
        },
      };
    });

    const { PrismaDatabase } = require("../../database/prismaDatabase");
    test("PrismaDatabase methods (mocked) exercise success and not-found branches", async () => {
      const db = new PrismaDatabase();

      // User paths
      const addedUser = await db.addUser({
        username: "alice",
        twitchUserId: "twitch_alice",
      });
      expect(addedUser.username).toBe("alice");
      expect(addedUser.twitchUserId).toBe("twitch_alice");
      const gotUser = await db.getUserById(addedUser.id);
      expect(gotUser?.id).toBe(addedUser.id);
      expect(await db.getUserById("nope")).toBeNull();

      // Channel
      const ch = await db.addChannel({ name: "ch1" });
      expect(ch.name).toBe("ch1");
      expect((await db.getChannelById(ch.id))?.id).toBe(ch.id);

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
        acquiredDate: new Date().toISOString(),
      });
      expect(achv.achievementId).toBe(a.id);
      expect(await db.getAchieved(a.id, "missing_user")).toBeNull();

      // Are
      const ar = await db.addAre({
        userId: addedUser.id,
        channelId: ch.id,
        userType: "admin",
      });
      expect(ar.userType).toBe("admin");
      expect(await db.getAre("x", "y")).toBeNull();

      // Possesses
      const p = await db.addPossesses({
        userId: addedUser.id,
        badgeId: b.id,
        acquiredDate: new Date().toISOString(),
      });
      expect(p.badgeId).toBe(b.id);
      expect(await db.getPossesses("x", "y")).toBeNull();

      await db.disconnect();
    });
  });
});
