import { Request, Response } from "express";
import { createUsersController } from "../../../controllers/usersController";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("usersController (unit)", () => {
  const db = new MockDatabase();
  const repo = new UserRepository(db);
  const ctrl = createUsersController(repo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 and user when body valid", async () => {
    const req = {
      body: {
        id: "twitch1",
        username: "u1",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: "twitch1", username: "u1", xp: 0 }),
    );
  });

  it("create returns 201 with custom xp", async () => {
    const req = {
      body: {
        id: "twitch_xp",
        username: "xpUser",
        xp: 50,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: "twitch_xp", xp: 50 }),
    );
  });

  it("create returns 400 when username missing", async () => {
    const req = { body: { id: "twitch1" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getById returns user when found", async () => {
    const user = await repo.addUser({
      id: "twitch2",
      username: "u2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = { params: { id: user.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id, username: "u2" }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown-id" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns 400 when id missing", async () => {
    const req = { body: { username: "u1" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("create returns 500 when repo.addUser throws", async () => {
    const throwingRepo = {
      addUser: jest.fn().mockRejectedValue(new Error("db error")),
      getUserById: jest.fn(),
      getChannelsByUserId: jest.fn(),
      getBadgesByUserId: jest.fn(),
      getAchievementsByUserId: jest.fn(),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const req = {
      body: {
        id: "t1",
        username: "u1",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo.getUserById throws", async () => {
    const throwingRepo = {
      addUser: jest.fn(),
      getUserById: jest.fn().mockRejectedValue(new Error("db error")),
      getChannelsByUserId: jest.fn(),
      getBadgesByUserId: jest.fn(),
      getAchievementsByUserId: jest.fn(),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const req = { params: { id: "some-id" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getChannelsByUserId returns json and 500 on throw", async () => {
    const user = await repo.addUser({
      id: "tch",
      username: "ch",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = { params: { id: user.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getChannelsByUserId(req, res);
    expect(res.json).toHaveBeenCalled();
    const throwingRepo = {
      addUser: jest.fn(),
      getUserById: jest.fn(),
      getChannelsByUserId: jest.fn().mockRejectedValue(new Error("db")),
      getBadgesByUserId: jest.fn(),
      getAchievementsByUserId: jest.fn(),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const res2 = mockRes();
    await c.getChannelsByUserId(req, res2);
    expect(res2.status).toHaveBeenCalledWith(500);
  });

  it("getBadgesByUserId returns json and 500 on throw", async () => {
    const user = await repo.addUser({
      id: "tb",
      username: "b",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = { params: { id: user.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getBadgesByUserId(req, res);
    expect(res.json).toHaveBeenCalled();
    const throwingRepo = {
      addUser: jest.fn(),
      getUserById: jest.fn(),
      getChannelsByUserId: jest.fn(),
      getBadgesByUserId: jest.fn().mockRejectedValue(new Error("db")),
      getAchievementsByUserId: jest.fn(),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const res2 = mockRes();
    await c.getBadgesByUserId(req, res2);
    expect(res2.status).toHaveBeenCalledWith(500);
  });

  it("getAchievementsByUserId returns json and 500 on throw", async () => {
    const user = await repo.addUser({
      id: "ta",
      username: "a",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = { params: { id: user.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getAchievementsByUserId(req, res);
    expect(res.json).toHaveBeenCalled();
    const throwingRepo = {
      addUser: jest.fn(),
      getUserById: jest.fn(),
      getChannelsByUserId: jest.fn(),
      getBadgesByUserId: jest.fn(),
      getAchievementsByUserId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const res2 = mockRes();
    await c.getAchievementsByUserId(req, res2);
    expect(res2.status).toHaveBeenCalledWith(500);
  });

  it("getAll returns list of users", async () => {
    const res = mockRes();
    const req = {} as Request;
    await ctrl.getAll(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("getAll returns 500 when repo throws", async () => {
    const throwingRepo = {
      getAllUsers: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const res = mockRes();
    await c.getAll({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("update returns updated user when found", async () => {
    const user = await repo.addUser({
      id: "twitchUp",
      username: "old",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { username: "new" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ username: "new" }),
    );
  });

  it("update returns 400 when username is empty string", async () => {
    const user = await repo.addUser({
      id: "twitch_empty_un",
      username: "orig",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { username: "" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "username must be non-empty when provided",
    });
  });

  it("update returns 200 with valid xp", async () => {
    const user = await repo.addUser({
      id: "twitch_xp_ok",
      username: "xpok",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { xp: 100 },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ xp: 100 }));
  });

  it("update returns 404 when user not found", async () => {
    const req = {
      params: { id: "nonexistent" },
      body: { username: "test" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("update returns 500 when repo throws", async () => {
    const throwingRepo = {
      updateUser: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createUsersController(throwingRepo);
    const req = {
      params: { id: "some-id" },
      body: { username: "test" },
    } as unknown as Request;
    const res = mockRes();
    await c.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("create returns 400 when xp is a non-numeric string", async () => {
    const req = {
      body: {
        id: "twitch_xp_str",
        username: "u",
        xp: "abc",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("create returns 400 when xp is negative", async () => {
    const req = {
      body: {
        id: "twitch_xp_neg",
        username: "u",
        xp: -10,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("create coerces string xp to number when valid", async () => {
    const req = {
      body: {
        id: "twitch_xp_coerce",
        username: "u",
        xp: "42",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ xp: 42 }));
  });

  it("create returns 400 when xp is null", async () => {
    const req = {
      body: {
        id: "twitch_xp_null",
        username: "u",
        xp: null,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("create returns 400 when xp is a boolean", async () => {
    const req = {
      body: {
        id: "twitch_xp_bool",
        username: "u",
        xp: true,
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("update returns 400 when xp is null", async () => {
    const user = await repo.addUser({
      id: "twitch_up_xp_null",
      username: "upxpnull",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { xp: null },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("update returns 400 when xp is negative", async () => {
    const user = await repo.addUser({
      id: "twitch_up_xp",
      username: "upxp",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { xp: -5 },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("create returns 400 when xp is empty string", async () => {
    const req = {
      body: {
        id: "twitch_xp_empty",
        username: "u",
        xp: "",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("update returns 400 when xp is empty string", async () => {
    const user = await repo.addUser({
      id: "twitch_up_xp_empty",
      username: "upxpempty",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { xp: "" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });

  it("update returns 400 when xp is a non-numeric string", async () => {
    const user = await repo.addUser({
      id: "twitch_up_xp_str",
      username: "upxpstr",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const req = {
      params: { id: user.id },
      body: { xp: "notanumber" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "xp must be a non-negative number",
    });
  });
});
