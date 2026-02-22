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
});
