import { TypeAchievementRepository } from "../../../repositories/typeAchievementRepository";
import { MockDatabase } from "../../mocks";

describe("typeAchievementRepository (unit)", () => {
  it("add then getById returns the typeAchievement", async () => {
    const db = new MockDatabase();
    const repo = new TypeAchievementRepository(db);
    const created = await repo.add("label1", "data1");
    expect(created.id).toBeDefined();
    expect(created.label).toBe("label1");
    expect(created.data).toBe("data1");
    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });

  it("getById returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new TypeAchievementRepository(db);
    const found = await repo.getById("unknown-id");
    expect(found).toBeNull();
  });
});
