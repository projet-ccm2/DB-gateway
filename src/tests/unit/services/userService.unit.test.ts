import { UserService } from "../../../services/userService";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("UserService (unit)", () => {
  test("addUser and getUserById", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);

    const u = await service.addUser({
      id: "twitch_svc",
      username: "svc",
    });
    expect(u.id).toBe("twitch_svc");
    expect(u.username).toBe("svc");
    const got = await service.getUserById(u.id);
    expect(got?.id).toBe(u.id);
  });

  test("getChannelsByUserId returns array", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);
    const u = await service.addUser({ id: "t", username: "u" });
    const channels = await service.getChannelsByUserId(u.id);
    expect(channels).toEqual([]);
  });

  test("getBadgesByUserId returns array", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);
    const u = await service.addUser({ id: "t", username: "u" });
    const badges = await service.getBadgesByUserId(u.id);
    expect(badges).toEqual([]);
  });

  test("getAchievementsByUserId returns array", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);
    const u = await service.addUser({ id: "t", username: "u" });
    const achievements = await service.getAchievementsByUserId(u.id);
    expect(achievements).toEqual([]);
  });

  test("getUsersByChannelId returns array", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);
    const ch = await db.addChannel({ name: "c1" });
    const users = await service.getUsersByChannelId(ch.id);
    expect(users).toEqual([]);
  });

  test("getUsersByBadgeId returns array", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);
    const badge = await db.addBadge({ title: "b1", img: "i1" });
    const users = await service.getUsersByBadgeId(badge.id);
    expect(users).toEqual([]);
  });

  test("getUsersByAchievementId returns array", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const service = new UserService(repo);
    const ach = await db.addAchievement({
      title: "a1",
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
    });
    const users = await service.getUsersByAchievementId(ach.id);
    expect(users).toEqual([]);
  });
});
