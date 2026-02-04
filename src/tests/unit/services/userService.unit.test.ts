import { UserService } from "../../../services/userService";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

test("UserService add/get flow (unit)", async () => {
  const db = new MockDatabase();
  const repo = new UserRepository(db);
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
