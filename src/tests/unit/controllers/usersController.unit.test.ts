import { Request, Response } from "express";
import { createUsersController } from "../../../controllers/usersController";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("usersController (unit)", () => {
  const db = new MockDatabase();
  const repo = new UserRepository(db);
  const ctrl = createUsersController(repo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 and user when body valid", async () => {
    const req = { body: { username: "u1", twitchUserId: "twitch1" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ username: "u1", twitchUserId: "twitch1" }),
    );
  });

  it("create returns 400 when username missing", async () => {
    const req = { body: { twitchUserId: "twitch1" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getById returns user when found", async () => {
    const user = await repo.addUser({ username: "u2", twitchUserId: "twitch2" });
    const req = { params: { id: user.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id, username: "u2" }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown-id" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
