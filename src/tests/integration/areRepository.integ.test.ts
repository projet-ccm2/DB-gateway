import { PrismaDatabase } from "../../database/prismaDatabase";
import { AreRepository } from "../../repositories/areRepository";

describe("AreRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new AreRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("add then get returns the are record", async () => {
    const user = await db.addUser({
      username: "AreIntegUser_" + Date.now(),
      twitchUserId: "twitch_are_integ",
    });
    const channel = await db.addChannel({ name: "AreChannel_" + Date.now() });
    const userType = "moderator";
    const created = await repo.add(user.id, channel.id, userType);
    expect(created.userId).toBe(user.id);
    expect(created.channelId).toBe(channel.id);
    expect(created.userType).toBe(userType);

    const found = await repo.get(user.id, channel.id);
    expect(found).not.toBeNull();
    expect(found?.userId).toBe(user.id);
    expect(found?.channelId).toBe(channel.id);
    expect(found?.userType).toBe(userType);
  });

  it("get with unknown userId returns null", async () => {
    const channel = await db.addChannel({ name: "ChNoAre_" + Date.now() });
    const found = await repo.get("unknown-user-id", channel.id);
    expect(found).toBeNull();
  });

  it("get with unknown channelId returns null", async () => {
    const user = await db.addUser({
      username: "UserNoAre_" + Date.now(),
      twitchUserId: "twitch_user_no_are",
    });
    const found = await repo.get(user.id, "unknown-channel-id");
    expect(found).toBeNull();
  });
});
