import { Request, Response } from "express";
import { createAchievementsController } from "../../../controllers/achievementsController";
import { AchievementRepository } from "../../../repositories/achievementRepository";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("achievementsController (unit)", () => {
  const db = new MockDatabase();
  const achievementRepo = new AchievementRepository(db);
  const userRepo = new UserRepository(db);
  const ctrl = createAchievementsController(achievementRepo, userRepo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when required fields provided", async () => {
    const req = {
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "T", label: "L" }),
    );
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
