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
});
