import express from "express";
import request from "supertest";
import { createHealthRoutes } from "../../../routes/healthRoutes";
import { MockDatabase } from "../../mocks";

describe("healthRoutes (unit)", () => {
  it("GET / returns 200 and ok when db up", async () => {
    const app = express();
    app.use("/", createHealthRoutes(new MockDatabase()));
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", db: "up" });
  });
});
