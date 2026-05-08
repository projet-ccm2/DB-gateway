import { BadgeRepository } from "../../../repositories/badgeRepository";
import { MockDatabase } from "../../mocks";

describe("badgeRepository (unit)", () => {
  it("add then getById returns the badge", async () => {
    const db = new MockDatabase();
    const repo = new BadgeRepository(db);
    await db.addChannel({ id: "ch-badge-test", name: "badgetest" });
    const created = (await repo.add("BadgeTitle", "img.png", "ch-badge-test"))!;
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

  it("getByChannelId returns badge with channelId when found", async () => {
    const db = new MockDatabase();
    const repo = new BadgeRepository(db);
    await db.addChannel({ id: "ch-badge-channel", name: "C" });
    await db.addBadge({
      title: "ChannelBadge",
      img: "cb.png",
      channelId: "ch-badge-channel",
    });
    const found = await repo.getByChannelId("ch-badge-channel");
    expect(found).not.toBeNull();
    expect(found?.title).toBe("ChannelBadge");
    expect(found?.img).toBe("cb.png");
    expect(found?.channelId).toBe("ch-badge-channel");
  });

  it("getByChannelId returns null when no badge for channel", async () => {
    const db = new MockDatabase();
    const repo = new BadgeRepository(db);
    const found = await repo.getByChannelId("no-channel");
    expect(found).toBeNull();
  });
});
