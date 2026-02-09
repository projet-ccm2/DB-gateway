import { Request, Response } from "express";
import { createBadgesController } from "../../../controllers/badgesController";
import { BadgeRepository } from "../../../repositories/badgeRepository";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("badgesController (unit)", () => {
  const db = new MockDatabase();
  const badgeRepo = new BadgeRepository(db);
  const userRepo = new UserRepository(db);
  const ctrl = createBadgesController(badgeRepo, userRepo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when title and img provided", async () => {
    const req = { body: { title: "Badge", img: "img.png" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Badge", img: "img.png" }),
    );
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns 400 when title or img missing", async () => {
    const req = { body: { title: "T" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getById returns 200 when found", async () => {
    const badge = await db.addBadge({ title: "Found", img: "f.png" });
    const req = { params: { id: badge.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: badge.id, title: "Found" }),
    );
  });

  it("getUsersByBadgeId returns 200 and array", async () => {
    const badge = await db.addBadge({ title: "B", img: "i.png" });
    const req = { params: { id: badge.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getUsersByBadgeId(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("create returns 500 when repo.add throws", async () => {
    const throwingBadgeRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      getById: jest.fn(),
    } as unknown as InstanceType<typeof BadgeRepository>;
    const c = createBadgesController(throwingBadgeRepo, userRepo);
    const req = { body: { title: "T", img: "i" } } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo throws", async () => {
    const throwingBadgeRepo = {
      add: jest.fn(),
      getById: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof BadgeRepository>;
    const c = createBadgesController(throwingBadgeRepo, userRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getUsersByBadgeId returns 500 when repo throws", async () => {
    const throwingUserRepo = {
      getUsersByBadgeId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createBadgesController(badgeRepo, throwingUserRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getUsersByBadgeId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
