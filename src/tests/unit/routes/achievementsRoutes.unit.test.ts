import express from "express";
import request from "supertest";
import { createAchievementsRoutes } from "../../../routes/achievementsRoutes";
import { MockDatabase } from "../../mocks";

describe("achievementsRoutes (unit)", () => {
  it("POST / creates achievement and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app)
      .post("/")
      .send({
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("T");
  });
});
