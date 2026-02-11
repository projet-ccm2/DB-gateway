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
    const user = await db.addUser({ id: "t", username: "u" });
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

  it("create returns 500 when repo.add throws", async () => {
    const throwingRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      get: jest.fn(),
    } as unknown as InstanceType<typeof PossessesRepository>;
    const c = createPossessesController(throwingRepo);
    const req = {
      body: {
        userId: "u",
        badgeId: "b",
        acquiredDate: "2024-01-01T00:00:00Z",
      },
    } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("get returns 400 when userId or badgeId missing", async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("get returns 200 when found", async () => {
    const user = await db.addUser({ id: "t2", username: "u2" });
    const badge = await db.addBadge({ title: "B2", img: "i2.png" });
    await db.addPossesses({
      userId: user.id,
      badgeId: badge.id,
      acquiredDate: "2024-01-01T00:00:00Z",
    });
    const req = {
      query: { userId: user.id, badgeId: badge.id },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id, badgeId: badge.id }),
    );
  });

  it("get returns 404 when not found", async () => {
    const req = {
      query: { userId: "none", badgeId: "none" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.get(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("get returns 500 when repo.get throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      get: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof PossessesRepository>;
    const c = createPossessesController(throwingRepo);
    const req = {
      query: { userId: "u", badgeId: "b" },
    } as unknown as Request;
    const res = mockRes();
    await c.get(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
