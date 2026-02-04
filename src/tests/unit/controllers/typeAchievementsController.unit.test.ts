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
});
