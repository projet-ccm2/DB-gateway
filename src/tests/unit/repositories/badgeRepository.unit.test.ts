import { BadgeRepository } from "../../../repositories/badgeRepository";
import { MockDatabase } from "../../mocks";

describe("badgeRepository (unit)", () => {
  it("add then getById returns the badge", async () => {
    const db = new MockDatabase();
    const repo = new BadgeRepository(db);
    const created = await repo.add("BadgeTitle", "img.png");
    expect(created.id).toBeDefined();
    expect(created.title).toBe("BadgeTitle");
    expect(created.img).toBe("img.png");
    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });

  it("getById returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new BadgeRepository(db);
    const found = await repo.getById("unknown-id");
    expect(found).toBeNull();
  });
});
