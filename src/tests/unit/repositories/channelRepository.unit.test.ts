import { ChannelRepository } from "../../../repositories/channelRepository";
import { MockDatabase } from "../../mocks";

describe("channelRepository (unit)", () => {
  it("addChannel then getChannelById returns the channel", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const created = await repo.addChannel("MyChannel");
    expect(created.id).toBeDefined();
    expect(created.name).toBe("MyChannel");
    const found = await repo.getChannelById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe("MyChannel");
  });

  it("getChannelById returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new ChannelRepository(db);
    const found = await repo.getChannelById("unknown-id");
    expect(found).toBeNull();
  });
});
