import { AreRepository } from "../../../repositories/areRepository";
import { MockDatabase } from "../../mocks";

describe("areRepository (unit)", () => {
  it("add then get returns the are", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "t",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-are-add", name: "c" });
    const repo = new AreRepository(db);
    const created = await repo.add(user.id, ch.id, "moderator");
    expect(created.userId).toBe(user.id);
    expect(created.channelId).toBe(ch.id);
    expect(created.userType).toBe("moderator");
    const found = await repo.get(user.id, ch.id);
    expect(found).not.toBeNull();
    expect(found?.userType).toBe("moderator");
  });

  it("get returns null for unknown userId/channelId", async () => {
    const db = new MockDatabase();
    const repo = new AreRepository(db);
    const found = await repo.get("uid", "cid");
    expect(found).toBeNull();
  });

  it("getByUserId returns all are for a user", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u1",
      username: "user1",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch1 = await db.addChannel({ id: "ch-by-user-1", name: "ch1" });
    const ch2 = await db.addChannel({ id: "ch-by-user-2", name: "ch2" });
    const repo = new AreRepository(db);
    await repo.add(user.id, ch1.id, "mod");
    await repo.add(user.id, ch2.id, "viewer");
    const records = await repo.getByUserId(user.id);
    expect(records).toHaveLength(2);
    expect(records.map((r) => r.channelId).sort()).toEqual(
      [ch1.id, ch2.id].sort(),
    );
  });

  it("getByUserId returns empty array for unknown user", async () => {
    const db = new MockDatabase();
    const repo = new AreRepository(db);
    const records = await repo.getByUserId("unknown");
    expect(records).toEqual([]);
  });

  it("getByChannelId returns all are for a channel", async () => {
    const db = new MockDatabase();
    const u1 = await db.addUser({
      id: "u1",
      username: "user1",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const u2 = await db.addUser({
      id: "u2",
      username: "user2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-by-channel", name: "ch" });
    const repo = new AreRepository(db);
    await repo.add(u1.id, ch.id, "mod");
    await repo.add(u2.id, ch.id, "viewer");
    const records = await repo.getByChannelId(ch.id);
    expect(records).toHaveLength(2);
    expect(records.map((r) => r.userId).sort()).toEqual([u1.id, u2.id].sort());
  });

  it("getByChannelId returns empty array for unknown channel", async () => {
    const db = new MockDatabase();
    const repo = new AreRepository(db);
    const records = await repo.getByChannelId("unknown");
    expect(records).toEqual([]);
  });

  it("update updates the userType", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-update-are", name: "c" });
    const repo = new AreRepository(db);
    await repo.add(user.id, ch.id, "viewer");
    const updated = await repo.update(user.id, ch.id, { userType: "admin" });
    expect(updated).not.toBeNull();
    expect(updated?.userType).toBe("admin");
  });

  it("update returns null for non-existent are", async () => {
    const db = new MockDatabase();
    const repo = new AreRepository(db);
    const updated = await repo.update("u", "c", { userType: "admin" });
    expect(updated).toBeNull();
  });

  it("delete removes the are", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-delete-are", name: "c" });
    const repo = new AreRepository(db);
    await repo.add(user.id, ch.id, "viewer");
    const deleted = await repo.delete(user.id, ch.id);
    expect(deleted).toBe(true);
    const found = await repo.get(user.id, ch.id);
    expect(found).toBeNull();
  });

  it("delete returns false for non-existent are", async () => {
    const db = new MockDatabase();
    const repo = new AreRepository(db);
    const deleted = await repo.delete("u", "c");
    expect(deleted).toBe(false);
  });
});
