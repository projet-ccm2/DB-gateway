import express from "express";
import request from "supertest";
import { createAchievedRoutes } from "../../../routes/achievedRoutes";
import { MockDatabase } from "../../mocks";

describe("achievedRoutes (unit)", () => {
  it("POST / creates achieved and returns 201", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ username: "u", twitchUserId: "t" });
    const ach = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    const app = express();
    app.use(express.json());
    app.use("/", createAchievedRoutes(db));
    const res = await request(app)
      .post("/")
      .send({
        achievementId: ach.id,
        userId: user.id,
        count: 1,
        finished: true,
        labelActive: false,
        acquiredDate: new Date().toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body.achievementId).toBe(ach.id);
  });
});
