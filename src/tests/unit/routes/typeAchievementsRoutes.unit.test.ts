import express from "express";
import request from "supertest";
import { createTypeAchievementsRoutes } from "../../../routes/typeAchievementsRoutes";
import { MockDatabase } from "../../mocks";

describe("typeAchievementsRoutes (unit)", () => {
  it("POST / creates typeAchievement and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createTypeAchievementsRoutes(new MockDatabase()));
    const res = await request(app).post("/").send({ label: "L", data: "D" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ label: "L", data: "D" });
  });
});
