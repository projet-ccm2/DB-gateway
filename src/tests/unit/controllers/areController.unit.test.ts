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
      expect.objectContaining({ userId: user.id, channelId: ch.id, userType: "mod" }),
    );
  });

  it("create returns 400 when userType missing", async () => {
    const req = { body: { userId: "u", channelId: "c" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
