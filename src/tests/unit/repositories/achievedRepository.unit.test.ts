import { AchievedRepository } from "../../../repositories/achievedRepository";
import { MockDatabase } from "../../mocks";

describe("achievedRepository (unit)", () => {
  it("add then get returns the achieved", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ username: "u", twitchUserId: "t" });
    const ach = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const repo = new AchievedRepository(db);
    const created = await repo.add({
      achievementId: ach.id,
      userId: user.id,
      count: 1,
      finished: true,
      labelActive: false,
      acquiredDate: new Date().toISOString(),
    });
    expect(created.achievementId).toBe(ach.id);
    expect(created.userId).toBe(user.id);
    const found = await repo.get(ach.id, user.id);
    expect(found).not.toBeNull();
    expect(found?.achievementId).toBe(ach.id);
  });

  it("get returns null for unknown keys", async () => {
    const db = new MockDatabase();
    const repo = new AchievedRepository(db);
    const found = await repo.get("aid", "uid");
    expect(found).toBeNull();
  });
});
