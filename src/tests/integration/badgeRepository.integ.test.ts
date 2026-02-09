import { PrismaDatabase } from "../../database/prismaDatabase";
import { BadgeRepository } from "../../repositories/badgeRepository";

describe("BadgeRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new BadgeRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("add then getById returns the badge", async () => {
    const title = "BadgeInteg_" + Date.now();
    const img = "https://example.com/badge.png";
    const created = await repo.add(title, img);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(title);
    expect(created.img).toBe(img);

    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.title).toBe(title);
    expect(found?.img).toBe(img);
  });

  it("getById with unknown id returns null", async () => {
    const found = await repo.getById("unknown-badge-id");
    expect(found).toBeNull();
  });
});
