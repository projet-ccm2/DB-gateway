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

  it("create upserts: second POST with same achievementId and userId returns 201 with updated body", async () => {
    const user = await db.addUser({ username: "u3", twitchUserId: "t3" });
    const ach = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const first = {
      achievementId: ach.id,
      userId: user.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    };
    const req1 = { body: first } as Request;
    const res1 = mockRes();
    await ctrl.create(req1, res1);
    expect(res1.status).toHaveBeenCalledWith(201);
    const req2 = {
      body: {
        ...first,
        count: 2,
        finished: true,
        labelActive: false,
        acquiredDate: "2024-02-01T00:00:00.000Z",
      },
    } as Request;
    const res2 = mockRes();
    await ctrl.create(req2, res2);
    expect(res2.status).toHaveBeenCalledWith(201);
    expect(res2.json).toHaveBeenCalledWith(
      expect.objectContaining({
        achievementId: ach.id,
        userId: user.id,
        count: 2,
        finished: true,
        labelActive: false,
        acquiredDate: "2024-02-01T00:00:00.000Z",
      }),
    );
  });

  it("create returns 400 when required field missing", async () => {
    const req = { body: { achievementId: "a", userId: "u" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("create returns 500 when repo.add throws", async () => {
    const throwingRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      get: jest.fn(),
    } as unknown as InstanceType<typeof AchievedRepository>;
    const c = createAchievedController(throwingRepo);
    const req = {
      body: {
        achievementId: "a",
        userId: "u",
        count: 1,
        finished: true,
        labelActive: true,
        acquiredDate: "2024-01-01T00:00:00Z",
      },
    } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("get returns 400 when achievementId or userId missing", async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("get returns 200 and achieved when found", async () => {
    const user = await db.addUser({ username: "u2", twitchUserId: "t2" });
    const ach = await db.addAchievement({
      title: "A2",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    await db.addAchieved({
      achievementId: ach.id,
      userId: user.id,
      count: 2,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00Z",
    });
    const req = {
      query: { achievementId: ach.id, userId: user.id },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ achievementId: ach.id, userId: user.id }),
    );
  });

  it("get returns 404 when not found", async () => {
    const req = {
      query: { achievementId: "none", userId: "none" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("get returns 500 when repo.get throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievedRepository>;
    const c = createAchievedController(throwingRepo);
    const req = {
      query: { achievementId: "a", userId: "u" },
    } as unknown as Request;
    const res = mockRes();
    await c.get(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
