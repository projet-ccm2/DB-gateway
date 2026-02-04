import { Request, Response } from "express";
import { createHealthController } from "../../../controllers/healthController";

describe("healthController", () => {
  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  test("get returns 200 and db up when healthCheck is true", async () => {
    const db = { healthCheck: async () => true };
    const ctrl = createHealthController(db as never);
    const res = mockRes();
    await ctrl.get({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "ok", db: "up" });
  });

  test("get returns 503 and db down when healthCheck is false", async () => {
    const db = { healthCheck: async () => false };
    const ctrl = createHealthController(db as never);
    const res = mockRes();
    await ctrl.get({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ status: "degraded", db: "down" });
  });

  test("get returns 500 when healthCheck throws", async () => {
    const db = { healthCheck: async () => { throw new Error("db error"); } };
    const ctrl = createHealthController(db as never);
    const res = mockRes();
    await ctrl.get({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error", db: "error", error: "db error" }),
    );
  });
});
