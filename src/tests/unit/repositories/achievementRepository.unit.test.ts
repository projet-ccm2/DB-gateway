import { AchievementRepository } from "../../../repositories/achievementRepository";
import { MockDatabase } from "../../mocks";

describe("achievementRepository (unit)", () => {
  it("add then getById returns the achievement", async () => {
    const db = new MockDatabase();
    const ch = await db.addChannel({ name: "Ch" });
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "T",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      channelId: ch.id,
    });
    expect(created.id).toBeDefined();
    expect(created.title).toBe("T");
    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });

  it("getById returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const found = await repo.getById("unknown-id");
    expect(found).toBeNull();
  });

  it("getByChannelId returns achievements with typeAchievement", async () => {
    const db = new MockDatabase();
    const ch = await db.addChannel({ name: "Ch" });
    const repo = new AchievementRepository(db);
    await repo.add({
      title: "T1",
      description: "D1",
      goal: 1,
      reward: 10,
      label: "L1",
      channelId: ch.id,
    });
    const list = await repo.getByChannelId(ch.id);
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("T1");
    expect(list[0]).toHaveProperty("typeAchievement");
    expect(list[0].typeAchievement).toBeNull();
  });
});
