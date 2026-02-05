import { PrismaDatabase } from "../../database/prismaDatabase";
import { AchievedRepository } from "../../repositories/achievedRepository";

describe("AchievedRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new AchievedRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("add then get returns the achieved record", async () => {
    const user = await db.addUser({
      username: "AchievedIntegUser_" + Date.now(),
      twitchUserId: "twitch_achieved_integ",
    });
    const channel = await db.addChannel({ name: "AchievedCh_" + Date.now() });
    const achievement = await db.addAchievement({
      title: "AchForAchieved",
      description: "desc",
      goal: 1,
      reward: 10,
      label: "l",
      channelId: channel.id,
    });
    const acquiredDate = new Date().toISOString();
    const created = await repo.add({
      achievementId: achievement.id,
      userId: user.id,
      count: 3,
      finished: true,
      labelActive: false,
      acquiredDate,
    });
    expect(created.achievementId).toBe(achievement.id);
    expect(created.userId).toBe(user.id);
    expect(created.count).toBe(3);
    expect(created.finished).toBe(true);
    expect(created.labelActive).toBe(false);
    expect(created.acquiredDate).toBe(acquiredDate);

    const found = await repo.get(achievement.id, user.id);
    expect(found).not.toBeNull();
    expect(found?.achievementId).toBe(achievement.id);
    expect(found?.userId).toBe(user.id);
    expect(found?.count).toBe(3);
  });

  it("get with unknown achievementId returns null", async () => {
    const user = await db.addUser({
      username: "NoAchievedUser_" + Date.now(),
      twitchUserId: "twitch_no_achieved",
    });
    const found = await repo.get("unknown-achievement-id", user.id);
    expect(found).toBeNull();
  });

  it("get with unknown userId returns null", async () => {
    const channel = await db.addChannel({ name: "ChNoUser_" + Date.now() });
    const achievement = await db.addAchievement({
      title: "AchNoUser",
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
      channelId: channel.id,
    });
    const found = await repo.get(achievement.id, "unknown-user-id");
    expect(found).toBeNull();
  });

  it("add upserts: second add with same achievementId and userId updates record", async () => {
    const user = await db.addUser({
      username: "UpsertUser_" + Date.now(),
      twitchUserId: "twitch_upsert",
    });
    const channel = await db.addChannel({
      name: "UpsertCh_" + Date.now(),
    });
    const achievement = await db.addAchievement({
      title: "UpsertAch",
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
      channelId: channel.id,
    });
    const firstDate = new Date().toISOString();
    const created = await repo.add({
      achievementId: achievement.id,
      userId: user.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: firstDate,
    });
    expect(created.count).toBe(1);
    const secondDate = new Date().toISOString();
    const updated = await repo.add({
      achievementId: achievement.id,
      userId: user.id,
      count: 2,
      finished: true,
      labelActive: false,
      acquiredDate: secondDate,
    });
    expect(updated.count).toBe(2);
    expect(updated.finished).toBe(true);
    const found = await repo.get(achievement.id, user.id);
    expect(found?.count).toBe(2);
    expect(found?.acquiredDate).toBe(secondDate);
  });
});
