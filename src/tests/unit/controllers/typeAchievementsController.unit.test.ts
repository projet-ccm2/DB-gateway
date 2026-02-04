import { Request, Response } from "express";
import { createTypeAchievementsController } from "../../../controllers/typeAchievementsController";
import { TypeAchievementRepository } from "../../../repositories/typeAchievementRepository";
import { MockDatabase } from "../../mocks";

describe("typeAchievementsController (unit)", () => {
  const db = new MockDatabase();
  const repo = new TypeAchievementRepository(db);
  const ctrl = createTypeAchievementsController(repo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when label and data provided", async () => {
    const req = { body: { label: "L", data: "D" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ label: "L", data: "D" }),
    );
  });

  it("create returns 400 when label missing", async () => {
    const req = { body: { data: "D" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns 400 when data missing", async () => {
    const req = { body: { label: "L" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getById returns 200 when found", async () => {
    const t = await db.addTypeAchievement({ label: "L2", data: "D2" });
    const req = { params: { id: t.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: t.id, label: "L2", data: "D2" }),
    );
  });

  it("create returns 500 when repo.add throws", async () => {
    const throwingRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      getById: jest.fn(),
    } as unknown as InstanceType<typeof TypeAchievementRepository>;
    const c = createTypeAchievementsController(throwingRepo);
    const req = { body: { label: "L", data: "D" } } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo.getById throws", async () => {
    const throwingRepo = {
      add: jest.fn(),
      getById: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof TypeAchievementRepository>;
    const c = createTypeAchievementsController(throwingRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
