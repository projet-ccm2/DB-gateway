import { AchievedRepository } from "../../../repositories/achievedRepository";
import { MockDatabase } from "../../mocks";

describe("achievedRepository (unit)", () => {
  it("add then get returns the achieved", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "t",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
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

  it("update returns updated achieved when record exists", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "t",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ach = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const repo = new AchievedRepository(db);
    await repo.add({
      achievementId: ach.id,
      userId: user.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    const updated = await repo.update({
      achievementId: ach.id,
      userId: user.id,
      count: 2,
      finished: true,
      labelActive: false,
      acquiredDate: "2024-02-01T00:00:00.000Z",
    });
    expect(updated).not.toBeNull();
    expect(updated?.count).toBe(2);
    expect(updated?.finished).toBe(true);
    const found = await repo.get(ach.id, user.id);
    expect(found?.count).toBe(2);
  });

  it("update returns null when record does not exist", async () => {
    const db = new MockDatabase();
    const repo = new AchievedRepository(db);
    const updated = await repo.update({
      achievementId: "none",
      userId: "none",
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    expect(updated).toBeNull();
  });
});
