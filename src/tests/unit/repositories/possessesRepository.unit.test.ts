import { PossessesRepository } from "../../../repositories/possessesRepository";
import { MockDatabase } from "../../mocks";

describe("possessesRepository (unit)", () => {
  it("add then get returns the possesses", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ username: "u", twitchUserId: "t" });
    const badge = await db.addBadge({ title: "B", img: "i.png" });
    const repo = new PossessesRepository(db);
    const acquiredDate = new Date().toISOString();
    const created = await repo.add(user.id, badge.id, acquiredDate);
    expect(created.userId).toBe(user.id);
    expect(created.badgeId).toBe(badge.id);
    expect(created.acquiredDate).toBe(acquiredDate);
    const found = await repo.get(user.id, badge.id);
    expect(found).not.toBeNull();
    expect(found?.badgeId).toBe(badge.id);
  });

  it("get returns null for unknown userId/badgeId", async () => {
    const db = new MockDatabase();
    const repo = new PossessesRepository(db);
    const found = await repo.get("uid", "bid");
    expect(found).toBeNull();
  });
});
