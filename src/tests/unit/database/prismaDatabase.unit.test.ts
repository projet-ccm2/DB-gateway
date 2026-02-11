interface MockUserData {
  id: string;
  username: string;
  profileImageUrl?: string | null;
  channelDescription?: string | null;
  scope?: string | null;
}
interface MockChannelData {
  name: string;
}
interface MockTypeData {
  label: string;
  data: string;
}
interface MockAchievementData {
  title: string;
  description: string;
  goal: number;
  reward: number;
  label: string;
}
interface MockBadgeData {
  title: string;
  img: string;
}
interface MockAchievedData {
  achievementId: string;
  userId: string;
  count: number;
  finished: boolean;
  labelActive: boolean;
  acquiredDate: Date | string;
}
interface MockAreData {
  userId: string;
  channelId: string;
  userType: string;
}
interface MockPossessesData {
  userId: string;
  badgeId: string;
  acquiredDate: Date | string;
}
interface FindManyWhere {
  userId?: string;
  channelId?: string;
  achievementId?: string;
  badgeId?: string;
}
interface FindManyInclude {
  user?: boolean;
  channel?: boolean;
  badge?: boolean;
}

describe("prismaDatabase adapter (mocked GeneratedPrismaClient)", () => {
  jest.isolateModules(() => {
    jest.doMock("@prisma/client", () => {
      return {
        PrismaClient: class {
          _users!: Map<string, MockUserData & { id: string }>;
          _channels!: Map<string, MockChannelData & { id: string }>;
          _types!: Map<string, MockTypeData & { id: string }>;
          _achievements!: Map<string, MockAchievementData & { id: string }>;
          _badges!: Map<string, MockBadgeData & { id: string }>;
          _achieved!: Map<
            string,
            MockAchievedData & { achievementId: string; userId: string }
          >;
          _are!: Map<string, MockAreData>;
          _possesses!: Map<string, MockPossessesData>;

          user!: {
            findUnique: (arg: { where: { id: string } }) => Promise<unknown>;
            create: (arg: { data: MockUserData }) => Promise<unknown>;
            findMany: () => Promise<unknown[]>;
          };
          channel!: unknown;
          typeAchievement!: unknown;
          achievement!: unknown;
          badge!: unknown;
          achieved!: unknown;
          are!: unknown;
          possesses!: unknown;
          $disconnect!: () => Promise<void>;

          constructor() {
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
              create: async ({ data }: { data: MockUserData }) => {
                const row = {
                  id: data.id,
                  username: data.username,
                  profileImageUrl: data.profileImageUrl ?? null,
                  channelDescription: data.channelDescription ?? null,
                  scope: data.scope ?? null,
                };
                this._users.set(data.id, row);
                return row;
              },
              findMany: async () => [],
            };

            this.channel = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._channels.get(where.id) ?? null,
              create: async ({ data }: { data: MockChannelData }) => {
                const id = "c_" + Math.random().toString(36).slice(2, 8);
                const row = { id, name: data.name };
                this._channels.set(id, row);
                return row;
              },
            };

            this.typeAchievement = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._types.get(where.id) ?? null,
              create: async ({ data }: { data: MockTypeData }) => {
                const id = "t_" + Math.random().toString(36).slice(2, 8);
                const row = { id, label: data.label, data: data.data };
                this._types.set(id, row);
                return row;
              },
            };

            this.achievement = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._achievements.get(where.id) ?? null,
              create: async ({ data }: { data: MockAchievementData }) => {
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
              create: async ({ data }: { data: MockBadgeData }) => {
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
              create: async ({ data }: { data: MockAchievedData }) => {
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
              upsert: async ({
                where,
                create: createPayload,
                update,
              }: {
                where: {
                  achievementId_userId: {
                    achievementId: string;
                    userId: string;
                  };
                };
                create: MockAchievedData | { data: MockAchievedData };
                update: Partial<MockAchievedData>;
              }) => {
                const key =
                  where.achievementId_userId.achievementId +
                  "|" +
                  where.achievementId_userId.userId;
                const existing = this._achieved.get(key);
                const createData =
                  "data" in createPayload && createPayload.data
                    ? createPayload.data
                    : (createPayload as MockAchievedData);
                const raw = existing
                  ? { ...existing, ...update }
                  : {
                      achievementId: createData.achievementId,
                      userId: createData.userId,
                      count: createData.count,
                      finished: createData.finished,
                      labelActive: createData.labelActive,
                      acquiredDate: createData.acquiredDate,
                    };
                this._achieved.set(key, raw);
                const acquiredDate =
                  raw.acquiredDate instanceof Date
                    ? raw.acquiredDate
                    : new Date(raw.acquiredDate);
                return { ...raw, acquiredDate };
              },
              findMany: async (opts?: {
                where?: FindManyWhere;
                include?: FindManyInclude;
              }) => {
                const { where, include } = opts ?? {};
                const results: unknown[] = [];
                for (const [, v] of this._achieved) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (
                    where?.achievementId &&
                    v.achievementId !== where.achievementId
                  )
                    continue;
                  const row: Record<string, unknown> = { ...v };
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
              create: async ({ data }: { data: MockAreData }) => {
                const key = data.userId + "|" + data.channelId;
                const row = {
                  userId: data.userId,
                  channelId: data.channelId,
                  userType: data.userType,
                };
                this._are.set(key, row);
                return row;
              },
              findMany: async (opts?: {
                where?: FindManyWhere;
                include?: FindManyInclude;
              }) => {
                const { where, include } = opts ?? {};
                const results: unknown[] = [];
                for (const [, v] of this._are) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (where?.channelId && v.channelId !== where.channelId)
                    continue;
                  const row: Record<string, unknown> = { ...v };
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
              create: async ({ data }: { data: MockPossessesData }) => {
                const key = data.userId + "|" + data.badgeId;
                const row = {
                  userId: data.userId,
                  badgeId: data.badgeId,
                  acquiredDate: data.acquiredDate,
                };
                this._possesses.set(key, row);
                return row;
              },
              findMany: async (opts?: {
                where?: FindManyWhere;
                include?: FindManyInclude;
              }) => {
                const { where, include } = opts ?? {};
                const results: unknown[] = [];
                for (const [, v] of this._possesses) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (where?.badgeId && v.badgeId !== where.badgeId) continue;
                  const row: Record<string, unknown> = { ...v };
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

    const { PrismaDatabase } = require("../../../database/prismaDatabase");
    test("PrismaDatabase methods (mocked) exercise success and not-found branches", async () => {
      const db = new PrismaDatabase();

      const addedUser = await db.addUser({
        id: "twitch_alice",
        username: "alice",
      });
      expect(addedUser.username).toBe("alice");
      expect(addedUser.id).toBe("twitch_alice");
      const gotUser = await db.getUserById(addedUser.id);
      expect(gotUser?.id).toBe(addedUser.id);
      expect(await db.getUserById("nope")).toBeNull();

      const ch = await db.addChannel({ name: "ch1" });
      expect(ch.name).toBe("ch1");
      expect((await db.getChannelById(ch.id))?.id).toBe(ch.id);

      const t = await db.addTypeAchievement({ label: "L", data: "D" });
      expect(t.label).toBe("L");

      const a = await db.addAchievement({
        title: "T",
        description: "D",
        goal: 1,
        reward: 2,
        label: "lab",
      });
      expect(a.title).toBe("T");

      const b = await db.addBadge({ title: "B", img: "i" });
      expect(b.title).toBe("B");

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

      const ar = await db.addAre({
        userId: addedUser.id,
        channelId: ch.id,
        userType: "admin",
      });
      expect(ar.userType).toBe("admin");
      expect(await db.getAre("x", "y")).toBeNull();

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

describe("prismaDatabase not-found branches", () => {
  jest.isolateModules(() => {
    jest.doMock("@prisma/client", () => {
      return {
        PrismaClient: class {
          user!: { findUnique: () => Promise<null> };
          channel!: { findUnique: () => Promise<null> };
          typeAchievement!: { findUnique: () => Promise<null> };
          achievement!: { findUnique: () => Promise<null> };
          badge!: { findUnique: () => Promise<null> };
          achieved!: { findUnique: () => Promise<null> };
          are!: { findUnique: () => Promise<null> };
          possesses!: { findUnique: () => Promise<null> };
          $disconnect!: () => Promise<void>;
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

    const { PrismaDatabase } = require("../../../database/prismaDatabase");
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
