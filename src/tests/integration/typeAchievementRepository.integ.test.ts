import { PrismaDatabase } from "../../database/prismaDatabase";
import { TypeAchievementRepository } from "../../repositories/typeAchievementRepository";

describe("TypeAchievementRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new TypeAchievementRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("add then getById returns the typeAchievement", async () => {
    const label = "TypeInteg_" + Date.now();
    const data = '{"key":"value"}';
    const created = await repo.add(label, data);
    expect(created.id).toBeDefined();
    expect(created.label).toBe(label);
    expect(created.data).toBe(data);

    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.label).toBe(label);
    expect(found?.data).toBe(data);
  });

  it("getById with unknown id returns null", async () => {
    const found = await repo.getById("unknown-type-id");
    expect(found).toBeNull();
  });
});
