import { Request, Response } from "express";
import { createPossessesController } from "../../../controllers/possessesController";
import { PossessesRepository } from "../../../repositories/possessesRepository";
import { MockDatabase } from "../../mocks";

describe("possessesController (unit)", () => {
  const db = new MockDatabase();
  const repo = new PossessesRepository(db);
  const ctrl = createPossessesController(repo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when userId, badgeId, acquiredDate provided", async () => {
    const user = await db.addUser({ username: "u", twitchUserId: "t" });
    const badge = await db.addBadge({ title: "B", img: "i.png" });
    const req = {
      body: {
        userId: user.id,
        badgeId: badge.id,
        acquiredDate: new Date().toISOString(),
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id, badgeId: badge.id }),
    );
  });

  it("create returns 400 when acquiredDate missing", async () => {
    const req = { body: { userId: "u", badgeId: "b" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
