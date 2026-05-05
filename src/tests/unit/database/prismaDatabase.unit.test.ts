interface MockUserData {
  id: string;
  username: string;
  profileImageUrl?: string | null;
  channelDescription?: string | null;
  scope?: string | null;
  xp?: number;
  lastUpdateTimestamp: Date | string;
}
interface MockChannelData {
  id: string;
  name: string;
  discordWebhookUrl?: string | null;
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
  public?: boolean;
  downloads?: number;
  visits?: number;
  active?: boolean;
  secret?: boolean;
  image?: string;
  channelId?: string | null;
  typeId: string;
}
interface MockBadgeData {
  title: string;
  img: string;
  channelId: string;
}
interface MockAchievedData {
  achievementId: string;
  userId: string;
  count: number;
  finished: boolean;
  labelActive: boolean;
  acquiredDate: Date | string | null;
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
            update: (arg: {
              where: { id: string };
              data: Partial<MockUserData>;
            }) => Promise<unknown>;
            delete: (arg: { where: { id: string } }) => Promise<unknown>;
          };
          channel!: unknown;
          typeAchievement!: unknown;
          achievement!: unknown;
          badge!: unknown;
          achieved!: unknown;
          are!: unknown;
          possesses!: unknown;
          $disconnect!: () => Promise<void>;
          $transaction!: (
            fn: (tx: unknown) => Promise<unknown>,
          ) => Promise<unknown>;
          $queryRaw!: (
            strings: TemplateStringsArray,
            ...values: unknown[]
          ) => Promise<unknown[]>;

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
                  xp: data.xp ?? 0,
                  lastUpdateTimestamp:
                    typeof data.lastUpdateTimestamp === "string"
                      ? new Date(data.lastUpdateTimestamp)
                      : data.lastUpdateTimestamp,
                };
                this._users.set(data.id, row);
                return row;
              },
              findMany: async () => Array.from(this._users.values()),
              update: async ({
                where,
                data,
              }: {
                where: { id: string };
                data: Partial<MockUserData>;
              }) => {
                const existing = this._users.get(where.id);
                if (!existing) {
                  const err = new Error("Record not found") as Error & {
                    code: string;
                  };
                  err.code = "P2025";
                  throw err;
                }
                const updated = { ...existing, ...data };
                this._users.set(where.id, updated);
                return updated;
              },
              delete: async ({ where }: { where: { id: string } }) => {
                const row = this._users.get(where.id);
                if (!row) throw Object.assign(new Error(), { code: "P2025" });
                this._users.delete(where.id);
                return row;
              },
            };

            this.channel = {
              findUnique: async ({ where }: { where: { id: string } }) =>
                this._channels.get(where.id) ?? null,
              create: async ({ data }: { data: MockChannelData }) => {
                const row = {
                  id: data.id,
                  name: data.name,
                  discordWebhookUrl: data.discordWebhookUrl ?? null,
                };
                this._channels.set(data.id, row);
                return row;
              },
              update: async ({
                where,
                data,
              }: {
                where: { id: string };
                data: Partial<MockChannelData>;
              }) => {
                const existing = this._channels.get(where.id);
                if (!existing) {
                  const err = new Error("Record not found") as Error & {
                    code: string;
                  };
                  err.code = "P2025";
                  throw err;
                }
                const updated = { ...existing, ...data };
                this._channels.set(where.id, updated);
                return updated;
              },
              delete: async ({ where }: { where: { id: string } }) => {
                const row = this._channels.get(where.id);
                if (!row) throw Object.assign(new Error(), { code: "P2025" });
                this._channels.delete(where.id);
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
              delete: async ({ where }: { where: { id: string } }) => {
                const row = this._types.get(where.id);
                if (!row) throw Object.assign(new Error(), { code: "P2025" });
                this._types.delete(where.id);
                return row;
              },
            };

            this.achievement = {
              findUnique: async ({ where }: { where: { id: string } }) => {
                const row = this._achievements.get(where.id) ?? null;
                if (!row) return null;
                const typeRow = row.typeId
                  ? (this._types.get(row.typeId) ?? null)
                  : null;
                return { ...row, type: typeRow };
              },
              create: async ({ data }: { data: MockAchievementData }) => {
                const id = "a_" + Math.random().toString(36).slice(2, 8);
                const row = {
                  id,
                  title: data.title,
                  description: data.description,
                  goal: data.goal,
                  reward: data.reward,
                  label: data.label,
                  public: data.public ?? false,
                  downloads: data.downloads ?? 0,
                  visits: data.visits ?? 0,
                  active: data.active ?? true,
                  secret: data.secret ?? false,
                  image: data.image ?? "",
                  channelId: data.channelId ?? null,
                  typeId: data.typeId,
                  type: this._types.get(data.typeId) ?? null,
                };
                this._achievements.set(id, row);
                return row;
              },
              update: async ({
                where,
                data,
              }: {
                where: { id: string };
                data: Partial<MockAchievementData> & {
                  type?: { update?: { label?: string; data?: string } };
                };
                include?: unknown;
              }) => {
                const row = this._achievements.get(where.id);
                if (!row) {
                  const err = new Error("Record not found") as Error & {
                    code: string;
                  };
                  err.code = "P2025";
                  throw err;
                }
                const { type: typeNested, ...rest } = data;
                Object.assign(row, rest);
                if (typeNested?.update && row.typeId) {
                  const typeRow = this._types.get(row.typeId);
                  if (typeRow) {
                    if (typeNested.update.label !== undefined)
                      typeRow.label = typeNested.update.label;
                    if (typeNested.update.data !== undefined)
                      typeRow.data = typeNested.update.data;
                  }
                }
                const typeRow = row.typeId
                  ? (this._types.get(row.typeId) ?? null)
                  : null;
                return { ...row, type: typeRow };
              },
              findMany: async (opts?: {
                where?: {
                  channelId?: string;
                  public?: boolean;
                  achieved?: { some?: { userId?: string } };
                };
                include?: {
                  type?: boolean;
                  achieved?: { where?: { userId?: string } };
                };
                orderBy?: unknown;
              }) => {
                const { where, include } = opts ?? {};
                const results: unknown[] = [];
                for (const [, v] of this._achievements) {
                  if (where?.channelId && v.channelId !== where.channelId)
                    continue;
                  if (where?.public !== undefined && v.public !== where.public)
                    continue;
                  if (where?.achieved?.some?.userId) {
                    const uid = where.achieved.some.userId;
                    let found = false;
                    for (const [, ac] of this._achieved) {
                      if (ac.achievementId === v.id && ac.userId === uid) {
                        found = true;
                        break;
                      }
                    }
                    if (!found) continue;
                  }
                  const typeRow = v.typeId
                    ? (this._types.get(v.typeId) ?? null)
                    : null;
                  const row: Record<string, unknown> = { ...v, type: typeRow };
                  if (include?.achieved) {
                    const uid = include.achieved.where?.userId;
                    const achievedRows: unknown[] = [];
                    for (const [, ac] of this._achieved) {
                      if (
                        ac.achievementId === v.id &&
                        (!uid || ac.userId === uid)
                      ) {
                        achievedRows.push({
                          ...ac,
                          acquiredDate:
                            ac.acquiredDate instanceof Date
                              ? ac.acquiredDate
                              : new Date(ac.acquiredDate as string),
                        });
                      }
                    }
                    row.achieved = achievedRows;
                  }
                  results.push(row);
                }
                return results;
              },
              delete: async ({ where }: { where: { id: string } }) => {
                const row = this._achievements.get(where.id);
                if (!row) throw Object.assign(new Error(), { code: "P2025" });
                this._achievements.delete(where.id);
                return row;
              },
              deleteMany: async ({
                where,
              }: {
                where: { channelId?: string };
              }) => {
                let count = 0;
                for (const [key, v] of this._achievements) {
                  if (where?.channelId && v.channelId !== where.channelId)
                    continue;
                  this._achievements.delete(key);
                  count++;
                }
                return { count };
              },
            };

            this.badge = {
              findUnique: async ({
                where,
              }: {
                where: { id?: string; channelId?: string };
              }) => {
                if (where.id) return this._badges.get(where.id) ?? null;
                if (where.channelId) {
                  for (const [, b] of this._badges) {
                    if (b.channelId === where.channelId) return b;
                  }
                }
                return null;
              },
              create: async ({ data }: { data: MockBadgeData }) => {
                const id = "b_" + Math.random().toString(36).slice(2, 8);
                const row = {
                  id,
                  title: data.title,
                  img: data.img,
                  channelId: data.channelId,
                };
                this._badges.set(id, row);
                return row;
              },
              delete: async ({ where }: { where: { id: string } }) => {
                const row = this._badges.get(where.id);
                if (!row) throw Object.assign(new Error(), { code: "P2025" });
                this._badges.delete(where.id);
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
              deleteMany: async ({
                where,
              }: {
                where: {
                  achievementId?: string | { in: string[] };
                  userId?: string;
                };
              }) => {
                let count = 0;
                for (const [key, v] of this._achieved) {
                  let match = true;
                  if (where?.userId && v.userId !== where.userId) match = false;
                  if (where?.achievementId) {
                    if (typeof where.achievementId === "string") {
                      if (v.achievementId !== where.achievementId)
                        match = false;
                    } else if (
                      !where.achievementId.in.includes(v.achievementId)
                    )
                      match = false;
                  }
                  if (match) {
                    this._achieved.delete(key);
                    count++;
                  }
                }
                return { count };
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
                  raw.acquiredDate == null
                    ? null
                    : raw.acquiredDate instanceof Date
                      ? raw.acquiredDate
                      : new Date(raw.acquiredDate);
                return { ...raw, acquiredDate };
              },
              update: async ({
                where,
                data,
              }: {
                where: {
                  achievementId_userId: {
                    achievementId: string;
                    userId: string;
                  };
                };
                data: Partial<MockAchievedData>;
              }) => {
                const key =
                  where.achievementId_userId.achievementId +
                  "|" +
                  where.achievementId_userId.userId;
                const existing = this._achieved.get(key);
                if (!existing)
                  throw Object.assign(new Error(), { code: "P2025" });
                const updated = { ...existing, ...data };
                this._achieved.set(key, updated);
                const acquiredDate =
                  updated.acquiredDate == null
                    ? null
                    : updated.acquiredDate instanceof Date
                      ? updated.acquiredDate
                      : new Date(updated.acquiredDate as string);
                return { ...updated, acquiredDate };
              },
              findMany: async (opts?: {
                where?: FindManyWhere & {
                  achievement?: { channelId?: string | { in?: string[] } };
                };
                include?: FindManyInclude & { achievement?: boolean };
                select?: {
                  userId?: boolean;
                  finished?: boolean;
                  user?: { select?: { username?: boolean; xp?: boolean } };
                  achievement?: { select?: { reward?: boolean } };
                };
              }) => {
                const { where, include, select } = opts ?? {};
                const results: unknown[] = [];
                for (const [, v] of this._achieved) {
                  if (where?.userId && v.userId !== where.userId) continue;
                  if (
                    where?.achievementId &&
                    v.achievementId !== where.achievementId
                  )
                    continue;
                  if (where?.achievement) {
                    const ach = [...this._achievements.values()].find(
                      (a) => a.id === v.achievementId,
                    );
                    if (!ach) continue;
                    const chFilter = where.achievement.channelId;
                    if (chFilter) {
                      if (typeof chFilter === "string") {
                        if (ach.channelId !== chFilter) continue;
                      } else if (
                        chFilter.in &&
                        !chFilter.in.includes(ach.channelId ?? "")
                      ) {
                        continue;
                      }
                    }
                  }
                  if (select) {
                    const row: Record<string, unknown> = {};
                    if (select.userId) row.userId = v.userId;
                    if (select.finished) row.finished = v.finished;
                    if (select.user) {
                      const u = this._users.get(v.userId);
                      row.user = u
                        ? {
                            username: u.username,
                            xp: (u as unknown as { xp?: number }).xp ?? 0,
                          }
                        : null;
                    }
                    if (select.achievement) {
                      const ach = [...this._achievements.values()].find(
                        (a) => a.id === v.achievementId,
                      );
                      row.achievement = ach
                        ? {
                            reward:
                              (ach as unknown as { reward?: number }).reward ??
                              0,
                          }
                        : { reward: 0 };
                    }
                    results.push(row);
                  } else {
                    const row: Record<string, unknown> = { ...v };
                    if (include?.user) row.user = this._users.get(v.userId);
                    if (include?.achievement) {
                      const ach = [...this._achievements.values()].find(
                        (a) => a.id === v.achievementId,
                      );
                      row.achievement = ach ?? null;
                    }
                    results.push(row);
                  }
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
              deleteMany: async ({
                where,
              }: {
                where: { userId?: string; channelId?: string };
              }) => {
                let count = 0;
                for (const [key, v] of this._are) {
                  let match = true;
                  if (where?.userId && v.userId !== where.userId) match = false;
                  if (where?.channelId && v.channelId !== where.channelId)
                    match = false;
                  if (match) {
                    this._are.delete(key);
                    count++;
                  }
                }
                return { count };
              },
              update: async ({
                where,
                data,
              }: {
                where: {
                  userId_channelId: { userId: string; channelId: string };
                };
                data: Partial<MockAreData>;
              }) => {
                const key =
                  where.userId_channelId.userId +
                  "|" +
                  where.userId_channelId.channelId;
                const existing = this._are.get(key);
                if (!existing)
                  throw Object.assign(new Error(), { code: "P2025" });
                const updated = { ...existing, ...data };
                this._are.set(key, updated);
                return updated;
              },
              delete: async ({
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
                const existing = this._are.get(key);
                if (!existing)
                  throw Object.assign(new Error(), { code: "P2025" });
                this._are.delete(key);
                return existing;
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
              deleteMany: async ({
                where,
              }: {
                where: { userId?: string; badgeId?: string };
              }) => {
                let count = 0;
                for (const [key, v] of this._possesses) {
                  let match = true;
                  if (where?.userId && v.userId !== where.userId) match = false;
                  if (where?.badgeId && v.badgeId !== where.badgeId)
                    match = false;
                  if (match) {
                    this._possesses.delete(key);
                    count++;
                  }
                }
                return { count };
              },
            };

            this.$disconnect = async () => {};
            this.$transaction = async (fn: (tx: unknown) => Promise<unknown>) =>
              fn(this);
            this.$queryRaw = async () => [{ 1: 1 }];
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
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      });
      expect(addedUser.username).toBe("alice");
      expect(addedUser.id).toBe("twitch_alice");
      const gotUser = await db.getUserById(addedUser.id);
      expect(gotUser?.id).toBe(addedUser.id);
      expect(await db.getUserById("nope")).toBeNull();

      const ch = await db.addChannel({ id: "ch-test-1", name: "ch1" });
      expect(ch.name).toBe("ch1");
      expect(ch.discordWebhookUrl).toBeNull();
      expect((await db.getChannelById(ch.id))?.id).toBe(ch.id);

      const t = await db.addTypeAchievement({ label: "L", data: "D" });
      expect(t.label).toBe("L");

      const a = await db.addAchievement({
        title: "T",
        description: "D",
        goal: 1,
        reward: 2,
        label: "lab",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: t.id,
      });
      expect(a).not.toBeNull();
      expect(a!.title).toBe("T");

      const activated = await db.updateAchievementActive(a!.id, false);
      expect(activated).not.toBeNull();
      expect(activated?.active).toBe(false);

      const reactivated = await db.updateAchievementActive(a!.id, true);
      expect(reactivated).not.toBeNull();
      expect(reactivated?.active).toBe(true);

      const notFound = await db.updateAchievementActive("unknown", true);
      expect(notFound).toBeNull();

      const madePublic = await db.updateAchievementPublic(a!.id, true);
      expect(madePublic).not.toBeNull();
      expect(madePublic?.public).toBe(true);

      const madePrivate = await db.updateAchievementPublic(a!.id, false);
      expect(madePrivate).not.toBeNull();
      expect(madePrivate?.public).toBe(false);

      const publicNotFound = await db.updateAchievementPublic("unknown", true);
      expect(publicNotFound).toBeNull();

      // Test updateAchievement
      const t2 = await db.addTypeAchievement({ label: "newTL", data: "newTD" });
      const fullUpdated = await db.updateAchievement(a!.id, {
        title: "Updated",
        description: "New D",
        goal: 99,
        reward: 50,
        label: "newLab",
        public: true,
        active: false,
        secret: true,
        image: "new.png",
        typeId: t2.id,
      });
      expect(fullUpdated).not.toBeNull();
      expect(fullUpdated?.title).toBe("Updated");
      expect(fullUpdated?.description).toBe("New D");
      expect(fullUpdated?.goal).toBe(99);
      expect(fullUpdated?.reward).toBe(50);
      expect(fullUpdated?.label).toBe("newLab");
      expect(fullUpdated?.public).toBe(true);
      expect(fullUpdated?.active).toBe(false);
      expect(fullUpdated?.secret).toBe(true);
      expect(fullUpdated?.image).toBe("new.png");
      expect(fullUpdated?.typeAchievement.label).toBe("newTL");
      expect(fullUpdated?.typeAchievement.data).toBe("newTD");

      const updateNotFound = await db.updateAchievement("unknown", {
        title: "X",
      });
      expect(updateNotFound).toBeNull();

      // Test deleteAchievement (create a fresh one to delete)
      const toDelete = await db.addAchievement({
        title: "DelMe",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: t.id,
      });
      expect(toDelete).not.toBeNull();
      const deleted = await db.deleteAchievement(toDelete!.id);
      expect(deleted).not.toBeNull();
      expect(deleted?.id).toBe(toDelete!.id);
      expect(deleted?.title).toBe("DelMe");

      const deleteNotFound = await db.deleteAchievement("unknown");
      expect(deleteNotFound).toBeNull();

      const pubList = await db.getPublicAchievements();
      expect(Array.isArray(pubList)).toBe(true);

      await db.addChannel({ id: "ch-prisma", name: "prisma" });
      const b = (await db.addBadge({
        title: "B",
        img: "i",
        channelId: "ch-prisma",
      }))!;
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
      expect(achv.acquiredDate).not.toBeNull();
      expect(await db.getAchieved(a.id, "missing_user")).toBeNull();

      // addAchieved with null acquiredDate
      const a2 = (await db.addAchievement({
        title: "NullDateAch",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: t.id,
      }))!;
      const achvNull = await db.addAchieved({
        achievementId: a2.id,
        userId: addedUser.id,
        count: 0,
        finished: false,
        labelActive: true,
        acquiredDate: null,
      });
      expect(achvNull.acquiredDate).toBeNull();
      const fetchedNull = await db.getAchieved(a2.id, addedUser.id);
      expect(fetchedNull?.acquiredDate).toBeNull();

      // updateAchieved with a date
      const updatedAchv = await db.updateAchieved({
        achievementId: a.id,
        userId: addedUser.id,
        count: 5,
        finished: true,
        labelActive: false,
        acquiredDate: "2025-06-01T00:00:00.000Z",
      });
      expect(updatedAchv).not.toBeNull();
      expect(updatedAchv?.count).toBe(5);
      expect(updatedAchv?.acquiredDate).toBe("2025-06-01T00:00:00.000Z");

      // updateAchieved with null acquiredDate
      const updatedNull = await db.updateAchieved({
        achievementId: a.id,
        userId: addedUser.id,
        count: 5,
        finished: true,
        labelActive: false,
        acquiredDate: null,
      });
      expect(updatedNull).not.toBeNull();
      expect(updatedNull?.acquiredDate).toBeNull();

      // updateAchieved returns null for non-existent record
      const updatedMissing = await db.updateAchieved({
        achievementId: "missing",
        userId: "missing",
        count: 1,
        finished: false,
        labelActive: true,
        acquiredDate: null,
      });
      expect(updatedMissing).toBeNull();

      // Test getAchievementDefinitionsByUserId
      const defList = await db.getAchievementDefinitionsByUserId(addedUser.id);
      expect(Array.isArray(defList)).toBe(true);
      expect(defList.length).toBeGreaterThanOrEqual(1);
      expect(defList[0]).toHaveProperty("typeAchievement");
      expect(defList[0]).toHaveProperty("achieved");
      expect(defList[0].achieved).not.toBeNull();

      // No achieved records for unknown user
      const emptyDefList = await db.getAchievementDefinitionsByUserId("no-one");
      expect(emptyDefList).toHaveLength(0);

      const ar = await db.addAre({
        userId: addedUser.id,
        channelId: ch.id,
        userType: "admin",
      });
      expect(ar.userType).toBe("admin");
      expect(await db.getAre("x", "y")).toBeNull();

      // getAre found branch
      const arFound = await db.getAre(addedUser.id, ch.id);
      expect(arFound).not.toBeNull();
      expect(arFound?.userType).toBe("admin");

      const p = await db.addPossesses({
        userId: addedUser.id,
        badgeId: b.id,
        acquiredDate: new Date().toISOString(),
      });
      expect(p.badgeId).toBe(b.id);
      expect(await db.getPossesses("x", "y")).toBeNull();

      // Test getAllUsers
      const allUsers = await db.getAllUsers();
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0].id).toBe("twitch_alice");

      // Test updateUser
      const updatedUser = await db.updateUser("twitch_alice", {
        username: "alice_updated",
        profileImageUrl: "http://example.com/img.png",
        channelDescription: "New description",
        scope: "read:user",
      });
      expect(updatedUser?.username).toBe("alice_updated");
      expect(updatedUser?.profileImageUrl).toBe("http://example.com/img.png");
      expect(updatedUser?.channelDescription).toBe("New description");
      expect(updatedUser?.scope).toBe("read:user");

      // Test updateUser with lastUpdateTimestamp
      const updatedUserWithTimestamp = await db.updateUser("twitch_alice", {
        lastUpdateTimestamp: "2024-06-15T12:30:00.000Z",
      });
      expect(updatedUserWithTimestamp?.lastUpdateTimestamp).toBe(
        "2024-06-15T12:30:00.000Z",
      );

      // Test updateChannel
      const updatedChannel = await db.updateChannel(ch.id, {
        name: "UpdatedChannelName",
      });
      expect(updatedChannel?.name).toBe("UpdatedChannelName");

      // Test addChannel with discordWebhookUrl
      const chWithUrl = await db.addChannel({
        id: "ch-wh-1",
        name: "wh1",
        discordWebhookUrl: "https://discord.com/api/webhooks/test",
      });
      expect(chWithUrl.discordWebhookUrl).toBe(
        "https://discord.com/api/webhooks/test",
      );
      const fetchedChWithUrl = await db.getChannelById("ch-wh-1");
      expect(fetchedChWithUrl?.discordWebhookUrl).toBe(
        "https://discord.com/api/webhooks/test",
      );

      // Test updateChannel discordWebhookUrl
      const updatedChUrl = await db.updateChannel(ch.id, {
        discordWebhookUrl: "https://discord.com/api/webhooks/updated",
      });
      expect(updatedChUrl?.discordWebhookUrl).toBe(
        "https://discord.com/api/webhooks/updated",
      );

      // Test updateChannel clear discordWebhookUrl
      const clearedChUrl = await db.updateChannel(ch.id, {
        discordWebhookUrl: null,
      });
      expect(clearedChUrl?.discordWebhookUrl).toBeNull();

      // Test updateChannel for non-existent channel
      const nonExistentChannelUpdate = await db.updateChannel("nonexistent", {
        name: "test",
      });
      expect(nonExistentChannelUpdate).toBeNull();

      // Test updateUser for non-existent user
      const nonExistentUpdate = await db.updateUser("nonexistent", {
        username: "test",
      });
      expect(nonExistentUpdate).toBeNull();

      // ── healthCheck ─────────────────────────────────────────────────
      const healthy = await db.healthCheck();
      expect(healthy).toBe(true);

      // ── getAchievementsByChannelId ──────────────────────────────────
      // First, set a channelId on our existing achievement
      const achWithCh = await db.updateAchievement(a!.id, {
        channelId: ch.id,
      });
      expect(achWithCh).not.toBeNull();

      const achByCh = await db.getAchievementsByChannelId(ch.id);
      expect(Array.isArray(achByCh)).toBe(true);
      expect(achByCh.length).toBeGreaterThanOrEqual(1);
      expect(achByCh[0]).toHaveProperty("typeAchievement");

      // ── getAchievementsByUserAndChannel ─────────────────────────────
      const userChAchs = await db.getAchievementsByUserAndChannel(
        addedUser.id,
        ch.id,
      );
      expect(userChAchs).toHaveProperty("userId", addedUser.id);
      expect(userChAchs).toHaveProperty("channelId", ch.id);
      expect(Array.isArray(userChAchs.achievements)).toBe(true);

      // ── getAchievedByUserAndChannels ────────────────────────────────
      const achByUserChans = await db.getAchievedByUserAndChannels(
        addedUser.id,
        [ch.id],
      );
      expect(Array.isArray(achByUserChans)).toBe(true);

      // ── getAchievementById ──────────────────────────────────────────
      const achById = await db.getAchievementById(a!.id);
      expect(achById).not.toBeNull();
      expect(achById?.id).toBe(a!.id);
      expect(achById?.title).toBeDefined();

      // getAchievementById returns null for missing
      expect(await db.getAchievementById("no-such-id")).toBeNull();

      // ── getBadgeById & getBadgeByChannelId ──────────────────────────
      const badgeById = await db.getBadgeById(b.id);
      expect(badgeById).not.toBeNull();
      expect(badgeById?.id).toBe(b.id);

      const badgeByCh = await db.getBadgeByChannelId("ch-prisma");
      expect(badgeByCh).not.toBeNull();
      expect(badgeByCh?.id).toBe(b.id);

      // not found
      expect(await db.getBadgeById("nope")).toBeNull();
      expect(await db.getBadgeByChannelId("nope")).toBeNull();

      // ── getAreByUserId & getAreByChannelId ──────────────────────────
      const areByUser = await db.getAreByUserId(addedUser.id);
      expect(Array.isArray(areByUser)).toBe(true);
      expect(areByUser.length).toBeGreaterThanOrEqual(1);
      expect(areByUser[0]).toHaveProperty("userType");

      const areByCh = await db.getAreByChannelId(ch.id);
      expect(Array.isArray(areByCh)).toBe(true);
      expect(areByCh.length).toBeGreaterThanOrEqual(1);

      // ── updateAre ──────────────────────────────────────────────────
      const updAre = await db.updateAre(addedUser.id, ch.id, {
        userType: "moderator",
      });
      expect(updAre).not.toBeNull();
      expect(updAre?.userType).toBe("moderator");

      // updateAre returns null for non-existent
      const updAreNotFound = await db.updateAre("nope", "nope", {
        userType: "x",
      });
      expect(updAreNotFound).toBeNull();

      // ── deleteAre ──────────────────────────────────────────────────
      // Add a temp are to delete
      await db.addAre({
        userId: addedUser.id,
        channelId: "ch-prisma",
        userType: "viewer",
      });
      const delAre = await db.deleteAre(addedUser.id, "ch-prisma");
      expect(delAre).toBe(true);

      // deleteAre returns false for non-existent
      const delAreNotFound = await db.deleteAre("nope", "nope");
      expect(delAreNotFound).toBe(false);

      // ── getPossesses (found branch) ────────────────────────────────
      const pFound = await db.getPossesses(addedUser.id, b.id);
      expect(pFound).not.toBeNull();
      expect(pFound?.userId).toBe(addedUser.id);
      expect(pFound?.badgeId).toBe(b.id);
      expect(pFound?.acquiredDate).toBeDefined();

      // ── getChannelsByUserId ────────────────────────────────────────
      const chByUser = await db.getChannelsByUserId(addedUser.id);
      expect(Array.isArray(chByUser)).toBe(true);
      expect(chByUser.length).toBeGreaterThanOrEqual(1);
      expect(chByUser[0]).toHaveProperty("name");
      expect(chByUser[0]).toHaveProperty("userType");

      // ── getBadgesByUserId ──────────────────────────────────────────
      const badgesByUser = await db.getBadgesByUserId(addedUser.id);
      expect(Array.isArray(badgesByUser)).toBe(true);
      expect(badgesByUser.length).toBeGreaterThanOrEqual(1);
      expect(badgesByUser[0]).toHaveProperty("title");

      // ── getAchievementsByUserId ────────────────────────────────────
      const achByUser = await db.getAchievementsByUserId(addedUser.id);
      expect(Array.isArray(achByUser)).toBe(true);
      expect(achByUser.length).toBeGreaterThanOrEqual(1);

      // ── getUsersByChannelId ────────────────────────────────────────
      const usersByCh = await db.getUsersByChannelId(ch.id);
      expect(Array.isArray(usersByCh)).toBe(true);
      expect(usersByCh.length).toBeGreaterThanOrEqual(1);
      expect(usersByCh[0]).toHaveProperty("userType");
      expect(usersByCh[0]).toHaveProperty("username");

      // ── getUsersByBadgeId ──────────────────────────────────────────
      const usersByBadge = await db.getUsersByBadgeId(b.id);
      expect(Array.isArray(usersByBadge)).toBe(true);
      expect(usersByBadge.length).toBeGreaterThanOrEqual(1);
      expect(usersByBadge[0]).toHaveProperty("username");

      // ── getLeaderboardByChannelId ──────────────────────────────────
      // Add a second achievement on same channel so user has multiple achieved entries
      const a3 = await db.addAchievement({
        title: "LeaderAch",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "",
        typeId: t.id,
        channelId: ch.id,
      });
      await db.addAchieved({
        achievementId: a3!.id,
        userId: addedUser.id,
        count: 1,
        finished: true,
        labelActive: true,
        acquiredDate: new Date().toISOString(),
      });

      // Add a second user for leaderboard with different xp
      const lbUser2 = await db.addUser({
        id: "twitch_bob",
        username: "bob",
        xp: 100,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      });
      await db.addAchieved({
        achievementId: a3!.id,
        userId: lbUser2.id,
        count: 1,
        finished: false,
        labelActive: true,
        acquiredDate: null,
      });

      // Add a third user with same xp as bob (tie-break by completed for xp sort)
      // and also same completed as bob (tie-break by xp for completed sort)
      const lbUser3 = await db.addUser({
        id: "twitch_carol",
        username: "carol",
        xp: 100,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      });
      // carol has 1 achieved, not finished (same as bob: completed=0, xp=100)
      await db.addAchieved({
        achievementId: a3!.id,
        userId: lbUser3.id,
        count: 1,
        finished: false,
        labelActive: true,
        acquiredDate: null,
      });
      // Also add carol to achievement a (finished=true) so she has completed=1
      // This makes her different from bob (0) for xp-sort tie-break
      await db.addAchieved({
        achievementId: a!.id,
        userId: lbUser3.id,
        count: 1,
        finished: true,
        labelActive: true,
        acquiredDate: new Date().toISOString(),
      });

      // Add fourth user: same xp=100, completed=1 (same as carol) to force completed-sort tie-break by xp
      const lbUser4 = await db.addUser({
        id: "twitch_dave",
        username: "dave",
        xp: 50,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      });
      await db.addAchieved({
        achievementId: a3!.id,
        userId: lbUser4.id,
        count: 1,
        finished: true,
        labelActive: true,
        acquiredDate: new Date().toISOString(),
      });

      const lbXp = await db.getLeaderboardByChannelId(ch.id, 10, "xp");
      expect(Array.isArray(lbXp)).toBe(true);
      expect(lbXp.length).toBeGreaterThanOrEqual(2);
      expect(lbXp[0]).toHaveProperty("userId");
      expect(lbXp[0]).toHaveProperty("username");
      expect(lbXp[0]).toHaveProperty("xp");
      expect(lbXp[0]).toHaveProperty("completed");

      // Sort by completed
      const lbCompleted = await db.getLeaderboardByChannelId(
        ch.id,
        10,
        "completed",
      );
      expect(Array.isArray(lbCompleted)).toBe(true);

      // Limit works
      const lbLimited = await db.getLeaderboardByChannelId(ch.id, 1, "xp");
      expect(lbLimited.length).toBeLessThanOrEqual(1);

      // ── handleP2025 rethrow (non-P2025 error) ─────────────────────
      // updateUser re-throws non-P2025 errors (line 295)
      // This is tested indirectly — the mock update throws P2025 for missing records
      // To cover the rethrow: we rely on updateAre with P2025 already tested above

      // ── nukeUser ────────────────────────────────────────────────────
      // Create a second user with a full channel ecosystem
      const nukeTarget = await db.addUser({
        id: "twitch_nuke",
        username: "nuke_me",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      });
      const nukeCh = await db.addChannel({ id: nukeTarget.id, name: "nukeCh" });
      const nukeType = await db.addTypeAchievement({ label: "NL", data: "ND" });
      const nukeAch = await db.addAchievement({
        title: "NukeAch",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        typeId: nukeType.id,
        public: false,
        active: true,
        secret: false,
        image: "",
      });
      // Manually set channelId since addAchievement may not wire it
      // The mock stores the row, so we update it directly via the adapter
      const nukeAchUpdated = await db.updateAchievement(nukeAch!.id, {
        channelId: nukeCh.id,
      });
      expect(nukeAchUpdated).not.toBeNull();

      const nukeBadge = (await db.addBadge({
        title: "NukeBadge",
        img: "nb.png",
        channelId: nukeCh.id,
      }))!;

      // Target user's own records
      await db.addAchieved({
        achievementId: nukeAch!.id,
        userId: nukeTarget.id,
        count: 1,
        finished: false,
        labelActive: true,
        acquiredDate: new Date().toISOString(),
      });
      await db.addPossesses({
        userId: nukeTarget.id,
        badgeId: nukeBadge.id,
        acquiredDate: new Date().toISOString(),
      });
      await db.addAre({
        userId: nukeTarget.id,
        channelId: nukeCh.id,
        userType: "admin",
      });

      // Another user (alice) linked to nuke target's channel
      await db.addAchieved({
        achievementId: nukeAch!.id,
        userId: "twitch_alice",
        count: 2,
        finished: true,
        labelActive: false,
        acquiredDate: new Date().toISOString(),
      });
      await db.addPossesses({
        userId: "twitch_alice",
        badgeId: nukeBadge.id,
        acquiredDate: new Date().toISOString(),
      });
      await db.addAre({
        userId: "twitch_alice",
        channelId: nukeCh.id,
        userType: "viewer",
      });

      // nukeUser returns false for nonexistent
      expect(await db.nukeUser("nonexistent")).toBe(false);

      // nukeUser succeeds
      expect(await db.nukeUser(nukeTarget.id)).toBe(true);

      // The nuked user should be gone
      expect(await db.getUserById(nukeTarget.id)).toBeNull();

      // Channel should be gone
      expect(await db.getChannelById(nukeCh.id)).toBeNull();

      // alice should still exist (she wasn't the target)
      expect(await db.getUserById("twitch_alice")).not.toBeNull();

      // Type achievement should still exist (nukeUser does not delete types)
      expect(await db.getTypeAchievementById(nukeType.id)).not.toBeNull();

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
          badge!: {
            findUnique: () => Promise<null>;
          };
          achieved!: { findUnique: () => Promise<null> };
          are!: { findUnique: () => Promise<null> };
          possesses!: { findUnique: () => Promise<null> };
          $disconnect!: () => Promise<void>;
          constructor() {
            this.user = { findUnique: async () => null };
            this.channel = { findUnique: async () => null };
            this.typeAchievement = { findUnique: async () => null };
            this.achievement = { findUnique: async () => null };
            this.badge = {
              findUnique: async () => null,
            };
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
      expect(await db.getBadgeByChannelId("no")).toBeNull();
      expect(await db.getAchieved("no", "no")).toBeNull();
      expect(await db.getAre("no", "no")).toBeNull();
      expect(await db.getPossesses("no", "no")).toBeNull();
      await db.disconnect();
    });
  });
});

describe("prismaDatabase healthCheck failure", () => {
  jest.isolateModules(() => {
    jest.doMock("@prisma/client", () => {
      return {
        PrismaClient: class {
          $queryRaw = async () => {
            throw new Error("connection refused");
          };
          $disconnect = async () => {};
        },
      };
    });

    const { PrismaDatabase } = require("../../../database/prismaDatabase");
    test("healthCheck returns false when $queryRaw throws", async () => {
      const db = new PrismaDatabase();
      expect(await db.healthCheck()).toBe(false);
      await db.disconnect();
    });
  });
});

describe("prismaDatabase handleP2025 rethrows non-P2025 errors", () => {
  jest.isolateModules(() => {
    jest.doMock("@prisma/client", () => {
      return {
        PrismaClient: class {
          user = {
            findUnique: async () => ({
              id: "u1",
              username: "u",
              profileImageUrl: null,
              channelDescription: null,
              scope: null,
              xp: 0,
              lastUpdateTimestamp: new Date(),
            }),
            update: async () => {
              throw new Error("Some random DB error");
            },
          };
          achievement = {
            update: async () => {
              throw new Error("Some random DB error");
            },
          };
          are = {
            delete: async () => {
              throw new Error("Non-P2025 are error");
            },
          };
          $disconnect = async () => {};
          $transaction = async (fn: (tx: unknown) => Promise<unknown>) =>
            fn({
              user: {
                findUnique: async () => ({ id: "u1" }),
                delete: async () => {
                  throw new Error("tx-error");
                },
              },
              achieved: { deleteMany: async () => ({ count: 0 }) },
              possesses: { deleteMany: async () => ({ count: 0 }) },
              are: { deleteMany: async () => ({ count: 0 }) },
              achievement: {
                findMany: async () => [],
                deleteMany: async () => ({ count: 0 }),
              },
              badge: { findUnique: async () => null, delete: async () => {} },
              channel: {
                findUnique: async () => null,
                delete: async () => {},
              },
            });
        },
      };
    });

    const { PrismaDatabase } = require("../../../database/prismaDatabase");
    test("updateUser rethrows non-P2025 error", async () => {
      const db = new PrismaDatabase();
      await expect(db.updateUser("u1", { username: "fail" })).rejects.toThrow(
        "Some random DB error",
      );
      await db.disconnect();
    });
    test("updateAchievementActive rethrows non-P2025 error via handleP2025", async () => {
      const db = new PrismaDatabase();
      await expect(db.updateAchievementActive("a1", true)).rejects.toThrow(
        "Some random DB error",
      );
      await db.disconnect();
    });
    test("deleteAre rethrows non-P2025 error", async () => {
      const db = new PrismaDatabase();
      await expect(db.deleteAre("u1", "c1")).rejects.toThrow(
        "Non-P2025 are error",
      );
      await db.disconnect();
    });
    test("nukeUser rethrows non-P2025/non-USER_NOT_FOUND error", async () => {
      const db = new PrismaDatabase();
      await expect(db.nukeUser("u1")).rejects.toThrow("tx-error");
      await db.disconnect();
    });
  });
});
