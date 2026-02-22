import { PrismaDatabase } from "../../database/prismaDatabase";
import { PossessesRepository } from "../../repositories/possessesRepository";

describe("PossessesRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new PossessesRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("add then get returns the possesses record", async () => {
    const user = await db.addUser({
      id: "twitch_possesses_integ",
      username: "PossessesIntegUser_" + Date.now(),
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const badge = await db.addBadge({
      title: "PossessesBadge_" + Date.now(),
      img: "img.png",
    });
    const acquiredDate = new Date().toISOString();
    const created = await repo.add(user.id, badge.id, acquiredDate);
    expect(created.userId).toBe(user.id);
    expect(created.badgeId).toBe(badge.id);
    expect(created.acquiredDate).toBe(acquiredDate);

    const found = await repo.get(user.id, badge.id);
    expect(found).not.toBeNull();
    expect(found?.userId).toBe(user.id);
    expect(found?.badgeId).toBe(badge.id);
    expect(found?.acquiredDate).toBe(acquiredDate);
  });

  it("get with unknown userId returns null", async () => {
    const badge = await db.addBadge({
      title: "BadgeNoPoss_" + Date.now(),
      img: "x.png",
    });
    const found = await repo.get("unknown-user-id", badge.id);
    expect(found).toBeNull();
  });

  it("get with unknown badgeId returns null", async () => {
    const user = await db.addUser({
      id: "twitch_no_poss",
      username: "UserNoPoss_" + Date.now(),
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const found = await repo.get(user.id, "unknown-badge-id");
    expect(found).toBeNull();
  });
});
