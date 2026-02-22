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
    res.send = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when userId, channelId, userType provided", async () => {
    const user = await db.addUser({
      id: "t",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ctrl-create", name: "c" });
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
      getByUserId: jest.fn(),
      getByChannelId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
    const user = await db.addUser({
      id: "t2",
      username: "u2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ctrl-get", name: "c2" });
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
      getByUserId: jest.fn(),
      getByChannelId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = {
      query: { userId: "u", channelId: "c" },
    } as unknown as Request;
    const res = mockRes();
    await c.get(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getByUserId returns 200 with records", async () => {
    const user = await db.addUser({
      id: "t3",
      username: "u3",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ctrl-byuser", name: "c3" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "sub" });
    const req = { params: { userId: user.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getByUserId(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("getByUserId returns 500 when repo throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn(),
      getByUserId: jest.fn().mockRejectedValue(new Error("db")),
      getByChannelId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = { params: { userId: "u" } } as unknown as Request;
    const res = mockRes();
    await c.getByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getByChannelId returns 200 with records", async () => {
    const user = await db.addUser({
      id: "t4",
      username: "u4",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ctrl-bychannel", name: "c4" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "mod" });
    const req = { params: { channelId: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getByChannelId(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("getByChannelId returns 500 when repo throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn(),
      getByUserId: jest.fn(),
      getByChannelId: jest.fn().mockRejectedValue(new Error("db")),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = { params: { channelId: "c" } } as unknown as Request;
    const res = mockRes();
    await c.getByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("update returns 200 when updated", async () => {
    const user = await db.addUser({
      id: "t5",
      username: "u5",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ctrl-update", name: "c5" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "viewer" });
    const req = {
      params: { userId: user.id, channelId: ch.id },
      body: { userType: "admin" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ userType: "admin" }),
    );
  });

  it("update returns 404 when not found", async () => {
    const req = {
      params: { userId: "none", channelId: "none" },
      body: { userType: "admin" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("update returns 400 when userId missing", async () => {
    const req = {
      params: { channelId: "c" },
      body: { userType: "admin" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("update returns 400 when channelId missing", async () => {
    const req = {
      params: { userId: "u" },
      body: { userType: "admin" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("update returns 500 when repo throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn(),
      getByUserId: jest.fn(),
      getByChannelId: jest.fn(),
      update: jest.fn().mockRejectedValue(new Error("db")),
      delete: jest.fn(),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = {
      params: { userId: "u", channelId: "c" },
      body: { userType: "admin" },
    } as unknown as Request;
    const res = mockRes();
    await c.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("delete returns 204 when deleted", async () => {
    const user = await db.addUser({
      id: "t6",
      username: "u6",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ctrl-delete", name: "c6" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "viewer" });
    const req = {
      params: { userId: user.id, channelId: ch.id },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("delete returns 404 when not found", async () => {
    const req = {
      params: { userId: "none", channelId: "none" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("delete returns 400 when userId missing", async () => {
    const req = {
      params: { channelId: "c" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("delete returns 400 when channelId missing", async () => {
    const req = {
      params: { userId: "u" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("delete returns 500 when repo throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn(),
      getByUserId: jest.fn(),
      getByChannelId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AreRepository>;
    const c = createAreController(throwingRepo);
    const req = {
      params: { userId: "u", channelId: "c" },
    } as unknown as Request;
    const res = mockRes();
    await c.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
