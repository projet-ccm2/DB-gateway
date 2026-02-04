import { PrismaDatabase } from "../../database/prismaDatabase";
import { UserRepository } from "../../repositories/userRepository";

describe("Database (integration)", () => {
  const db = new PrismaDatabase();

  afterAll(async () => {
    await db.disconnect();
  });

  it("healthCheck returns true when DB is connected", async () => {
    const ok = await db.healthCheck();
    expect(ok).toBe(true);
  });
});

describe("UserRepository getById edge cases (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new UserRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("getUserById with unknown id returns null", async () => {
    const found = await repo.getUserById("unknown-user-id-999");
    expect(found).toBeNull();
  });

  it("getChannelsByUserId with unknown user returns empty array", async () => {
    const channels = await repo.getChannelsByUserId("unknown-user-id");
    expect(channels).toEqual([]);
  });

  it("getBadgesByUserId with unknown user returns empty array", async () => {
    const badges = await repo.getBadgesByUserId("unknown-user-id");
    expect(badges).toEqual([]);
  });

  it("getAchievementsByUserId with unknown user returns empty array", async () => {
    const achievements = await repo.getAchievementsByUserId("unknown-user-id");
    expect(achievements).toEqual([]);
  });

  it("getUsersByChannelId with unknown channel returns empty array", async () => {
    const users = await repo.getUsersByChannelId("unknown-channel-id");
    expect(users).toEqual([]);
  });

  it("getUsersByBadgeId with unknown badge returns empty array", async () => {
    const users = await repo.getUsersByBadgeId("unknown-badge-id");
    expect(users).toEqual([]);
  });

  it("getUsersByAchievementId with unknown achievement returns empty array", async () => {
    const users = await repo.getUsersByAchievementId("unknown-achievement-id");
    expect(users).toEqual([]);
  });

  it("getAchievementsByChannelId with unknown channel returns empty array", async () => {
    const achievements = await repo.getAchievementsByChannelId(
      "unknown-channel-id",
    );
    expect(achievements).toEqual([]);
  });

  it("getAchievedByUserAndChannels with unknown user returns empty array", async () => {
    const achieved = await repo.getAchievedByUserAndChannels("unknown-user-id", [
      "some-channel-id",
    ]);
    expect(achieved).toEqual([]);
  });
});
