import { UserService } from "../../services/userService";
import { MockDatabase } from "../../database/mockDatabase";

test("UserService add/get flow (unit)", async () => {
  const db = new MockDatabase();
  const repo = {
    getUserById: db.getUserById.bind(db),
    addUser: db.addUser.bind(db),
    getChannelsByUserId: db.getChannelsByUserId.bind(db),
    getBadgesByUserId: db.getBadgesByUserId.bind(db),
    getAchievementsByUserId: db.getAchievementsByUserId.bind(db),
    getUsersByChannelId: db.getUsersByChannelId.bind(db),
    getUsersByBadgeId: db.getUsersByBadgeId.bind(db),
    getUsersByAchievementId: db.getUsersByAchievementId.bind(db),
  } as any;
  const service = new UserService(repo);

  const u = await service.addUser({
    username: "svc",
    twitchUserId: "twitch_svc",
  });
  expect(u.username).toBe("svc");
  expect(u.twitchUserId).toBe("twitch_svc");
  const got = await service.getUserById(u.id);
  expect(got?.id).toBe(u.id);
});
