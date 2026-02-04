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
});
