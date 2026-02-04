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
      body: { username: "u1", twitchUserId: "twitch1" },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ username: "u1", twitchUserId: "twitch1" }),
    );
  });

  it("create returns 400 when username missing", async () => {
    const req = { body: { twitchUserId: "twitch1" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getById returns user when found", async () => {
    const user = await repo.addUser({
      username: "u2",
      twitchUserId: "twitch2",
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

  it("create returns 400 when twitchUserId missing", async () => {
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
    const req = { body: { username: "u1", twitchUserId: "t1" } } as Request;
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
    const user = await repo.addUser({ username: "ch", twitchUserId: "tch" });
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
    const user = await repo.addUser({ username: "b", twitchUserId: "tb" });
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
    const user = await repo.addUser({ username: "a", twitchUserId: "ta" });
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
});
