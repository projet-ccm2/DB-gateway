import { Request, Response } from "express";
import { createAchievedController } from "../../../controllers/achievedController";
import { AchievedRepository } from "../../../repositories/achievedRepository";
import { MockDatabase } from "../../mocks";

describe("achievedController (unit)", () => {
  const db = new MockDatabase();
  const repo = new AchievedRepository(db);
  const ctrl = createAchievedController(repo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when all fields provided", async () => {
    const user = await db.addUser({ username: "u", twitchUserId: "t" });
    const ach = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const req = {
      body: {
        achievementId: ach.id,
        userId: user.id,
        count: 1,
        finished: true,
        labelActive: false,
        acquiredDate: new Date().toISOString(),
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ achievementId: ach.id, userId: user.id }),
    );
  });

  it("create returns 400 when required field missing", async () => {
    const req = { body: { achievementId: "a", userId: "u" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
