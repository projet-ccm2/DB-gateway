import { PrismaDatabase } from "../../database/prismaDatabase";
import { ChannelRepository } from "../../repositories/channelRepository";

describe("ChannelRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new ChannelRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("addChannel then getChannelById returns the channel", async () => {
    const name = "ChannelInteg_" + Date.now();
    const created = await repo.addChannel(name);
    expect(created.id).toBeDefined();
    expect(created.name).toBe(name);

    const found = await repo.getChannelById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(name);
  });

  it("getChannelById with unknown id returns null", async () => {
    const found = await repo.getChannelById("unknown-id-12345");
    expect(found).toBeNull();
  });
});
