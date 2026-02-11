import { AreRepository } from "../../../repositories/areRepository";
import { MockDatabase } from "../../mocks";

describe("areRepository (unit)", () => {
  it("add then get returns the are", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ id: "t", username: "u" });
    const ch = await db.addChannel({ name: "c" });
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
});
