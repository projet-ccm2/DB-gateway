import { PrismaDatabase } from "../../database/prismaDatabase";
import { ChannelRepository } from "../../repositories/channelRepository";

describe("ChannelRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new ChannelRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("addChannel then getChannelById returns the channel", async () => {
    const id = "ch_integ_" + Date.now();
    const name = "ChannelInteg_" + Date.now();
    const created = await repo.addChannel(id, name);
    expect(created.id).toBe(id);
    expect(created.name).toBe(name);

    const found = await repo.getChannelById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(id);
    expect(found?.name).toBe(name);
  });

  it("getChannelById with unknown id returns null", async () => {
    const found = await repo.getChannelById("unknown-id-12345");
    expect(found).toBeNull();
  });

  it("updateChannel returns updated channel when found", async () => {
    const id = "ch_upd_" + Date.now();
    await repo.addChannel(id, "OldName");
    const updated = await repo.updateChannel(id, { name: "NewName" });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe("NewName");
  });

  it("updateChannel returns null for unknown id", async () => {
    const updated = await repo.updateChannel("unknown-ch-xyz", {
      name: "N",
    });
    expect(updated).toBeNull();
  });
});
