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
    const req = { body: { name: "MyChannel" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ name: "MyChannel" }),
    );
  });

  it("getById returns channel when found", async () => {
    const ch = await channelRepo.addChannel("Ch1");
    const req = { params: { id: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: ch.id }));
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
