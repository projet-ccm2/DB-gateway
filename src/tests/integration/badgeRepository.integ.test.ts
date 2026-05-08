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
    const chId = "ch_badge_" + Date.now();
    await db.addChannel({ id: chId, name: "BadgeCh" });
    const created = (await repo.add(title, img, chId))!;
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

  it("getByChannelId returns badge with channelId when found", async () => {
    const chId = "ch_badge_ch_" + Date.now();
    await db.addChannel({ id: chId, name: "BadgeChChannel" });
    const title = "IntegBadgeCh_" + Date.now();
    await db.addBadge({ title, img: "ch.png", channelId: chId });
    const found = await repo.getByChannelId(chId);
    expect(found).not.toBeNull();
    expect(found?.title).toBe(title);
    expect(found?.img).toBe("ch.png");
    expect(found?.channelId).toBe(chId);
  });

  it("getByChannelId returns null when no badge for channel", async () => {
    const found = await repo.getByChannelId("no-badge-channel-integ");
    expect(found).toBeNull();
  });
});
