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

  it("create returns 201 with channelId when provided", async () => {
    const ch = await db.addChannel({ name: "Ch" });
    const req = {
      body: {
        title: "T2",
        description: "D2",
        goal: 2,
        reward: 20,
        label: "L2",
        channelId: ch.id,
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getById returns 200 when found", async () => {
    const a = await db.addAchievement({
      title: "Found",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const req = { params: { id: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, title: "Found" }),
    );
  });

  it("getUsersByAchievementId returns 200 and array", async () => {
    const a = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const req = { params: { id: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getUsersByAchievementId(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("create returns 500 when repo.add throws", async () => {
    const throwingAchievementRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      getById: jest.fn(),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = {
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
      },
    } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      add: jest.fn(),
      getById: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getUsersByAchievementId returns 500 when repo throws", async () => {
    const throwingUserRepo = {
      getUsersByAchievementId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createAchievementsController(achievementRepo, throwingUserRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getUsersByAchievementId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
