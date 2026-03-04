import { Request, Response } from "express";
import { createChannelsController } from "../../../controllers/channelsController";
import { ChannelRepository } from "../../../repositories/channelRepository";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("channelsController (unit)", () => {
  const db = new MockDatabase();
  const channelRepo = new ChannelRepository(db);
  const userRepo = new UserRepository(db);
  const ctrl = createChannelsController(channelRepo, userRepo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 and channel when body valid", async () => {
    const req = { body: { id: "ch-test", name: "MyChannel" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ch-test", name: "MyChannel" }),
    );
  });

  it("getById returns channel when found", async () => {
    const ch = await channelRepo.addChannel("ch-get", "Ch1");
    const req = { params: { id: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: ch.id }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns 400 when id missing", async () => {
    const req = { body: { name: "N" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "id required" });
  });

  it("create returns 400 when name missing", async () => {
    const req = { body: { id: "ch-x" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "name required" });
  });

  it("update returns updated channel when found", async () => {
    const ch = await channelRepo.addChannel("ch-upd", "OldName");
    const req = {
      params: { id: ch.id },
      body: { name: "NewName" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: ch.id, name: "NewName" }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("update returns 404 when not found", async () => {
    const req = {
      params: { id: "unknown" },
      body: { name: "N" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getUsersByChannelId returns 200 and array", async () => {
    const ch = await db.addChannel({ id: "ch-users", name: "C" });
    const req = { params: { id: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getUsersByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("create returns 500 when repo.addChannel throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn().mockRejectedValue(new Error("db")),
      getChannelById: jest.fn(),
      updateChannel: jest.fn(),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = { body: { id: "ch-err", name: "N" } } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn(),
      getChannelById: jest.fn().mockRejectedValue(new Error("db")),
      updateChannel: jest.fn(),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("update returns 500 when repo throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn(),
      getChannelById: jest.fn(),
      updateChannel: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = {
      params: { id: "x" },
      body: { name: "N" },
    } as unknown as Request;
    const res = mockRes();
    await c.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getUsersByChannelId returns 500 when repo throws", async () => {
    const throwingUserRepo = {
      getUsersByChannelId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createChannelsController(channelRepo, throwingUserRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getUsersByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
