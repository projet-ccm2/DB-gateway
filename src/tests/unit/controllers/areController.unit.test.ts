import { Request, Response } from "express";
import { createAreController } from "../../../controllers/areController";
import { AreRepository } from "../../../repositories/areRepository";
import { MockDatabase } from "../../mocks";

describe("areController (unit)", () => {
  const db = new MockDatabase();
  const repo = new AreRepository(db);
  const ctrl = createAreController(repo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when userId, channelId, userType provided", async () => {
    const user = await db.addUser({ username: "u", twitchUserId: "t" });
    const ch = await db.addChannel({ name: "c" });
    const req = {
      body: { userId: user.id, channelId: ch.id, userType: "mod" },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        channelId: ch.id,
        userType: "mod",
      }),
    );
  });

  it("create returns 400 when userType missing", async () => {
    const req = { body: { userId: "u", channelId: "c" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("create returns 500 when repo.add throws", async () => {
    const throwingRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      get: jest.fn(),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = {
      body: { userId: "u", channelId: "c", userType: "mod" },
    } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("get returns 400 when userId or channelId missing", async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("get returns 200 when found", async () => {
    const user = await db.addUser({ username: "u2", twitchUserId: "t2" });
    const ch = await db.addChannel({ name: "c2" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "viewer" });
    const req = {
      query: { userId: user.id, channelId: ch.id },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        channelId: ch.id,
        userType: "viewer",
      }),
    );
  });

  it("get returns 404 when not found", async () => {
    const req = {
      query: { userId: "none", channelId: "none" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("get returns 500 when repo.get throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = {
      query: { userId: "u", channelId: "c" },
    } as unknown as Request;
    const res = mockRes();
    await c.get(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
