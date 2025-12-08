import { UserService } from "../../services/userService";
import { MockDatabase } from "../../database/mockDatabase";

test("UserService add/get flow (unit)", async () => {
  const db = new MockDatabase();
  const repo = {
    getUserById: db.getUserById.bind(db),
    addUser: db.addUser.bind(db),
  } as any;
  const service = new UserService(repo);

  const u = await service.addUser("svc");
  expect(u.username).toBe("svc");
  const got = await service.getUserById(u.id);
  expect(got?.id).toBe(u.id);
});
