import { ChannelRepository } from "../../../repositories/channelRepository";
import { MockDatabase } from "../../mocks";

describe("channelRepository (unit)", () => {
  it("addChannel then getChannelById returns the channel", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const created = await repo.addChannel("ch-123", "MyChannel");
    expect(created.id).toBe("ch-123");
    expect(created.name).toBe("MyChannel");
    const found = await repo.getChannelById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe("ch-123");
    expect(found?.name).toBe("MyChannel");
  });

  it("getChannelById returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const found = await repo.getChannelById("unknown-id");
    expect(found).toBeNull();
  });

  it("updateChannel returns updated channel when found", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    await repo.addChannel("ch-upd", "OldName");
    const updated = await repo.updateChannel("ch-upd", { name: "NewName" });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe("NewName");
  });

  it("updateChannel returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const updated = await repo.updateChannel("unknown-id", { name: "N" });
    expect(updated).toBeNull();
  });

  it("addChannel with discordWebhookUrl stores it", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const created = await repo.addChannel(
      "ch-wh",
      "C",
      "https://discord.com/api/webhooks/123",
    );
    expect(created.discordWebhookUrl).toBe(
      "https://discord.com/api/webhooks/123",
    );
    const found = await repo.getChannelById("ch-wh");
    expect(found?.discordWebhookUrl).toBe(
      "https://discord.com/api/webhooks/123",
    );
  });

  it("addChannel without discordWebhookUrl defaults to null", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const created = await repo.addChannel("ch-no-wh", "C");
    expect(created.discordWebhookUrl).toBeNull();
  });

  it("updateChannel updates discordWebhookUrl", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    await repo.addChannel("ch-upd-wh", "C");
    const updated = await repo.updateChannel("ch-upd-wh", {
      discordWebhookUrl: "https://discord.com/api/webhooks/456",
    });
    expect(updated?.discordWebhookUrl).toBe(
      "https://discord.com/api/webhooks/456",
    );
  });

  it("updateChannel clears discordWebhookUrl when set to null", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    await repo.addChannel(
      "ch-clr-wh",
      "C",
      "https://discord.com/api/webhooks/789",
    );
    const updated = await repo.updateChannel("ch-clr-wh", {
      discordWebhookUrl: null,
    });
    expect(updated?.discordWebhookUrl).toBeNull();
  });

  it("getBadgeByChannelId returns badge when linked", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const ch = await db.addChannel({ id: "ch-badge", name: "C" });
    const badge = await db.addBadge({
      title: "B1",
      img: "i.png",
      channelId: ch.id,
    });
    const found = await repo.getBadgeByChannelId(ch.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(badge.id);
    expect(found?.title).toBe("B1");
  });

  it("getBadgeByChannelId returns null when no badge", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const found = await repo.getBadgeByChannelId("no-ch");
    expect(found).toBeNull();
  });
});
