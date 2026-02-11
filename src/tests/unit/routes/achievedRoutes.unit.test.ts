import express from "express";
import request from "supertest";
import { createAchievedRoutes } from "../../../routes/achievedRoutes";
import { MockDatabase } from "../../mocks";

describe("achievedRoutes (unit)", () => {
  it("POST / creates achieved and returns 201", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ id: "t", username: "u" });
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
    const res = await request(app).post("/").send({
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

  it("PUT / updates achieved and returns 200", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ id: "t", username: "u" });
    const ach = await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    await db.addAchieved({
      achievementId: ach.id,
      userId: user.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    const app = express();
    app.use(express.json());
    app.use("/", createAchievedRoutes(db));
    const res = await request(app).put("/").send({
      achievementId: ach.id,
      userId: user.id,
      count: 2,
      finished: true,
      labelActive: false,
      acquiredDate: "2024-02-01T00:00:00.000Z",
    });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.finished).toBe(true);
  });

  it("PUT / returns 404 when achieved record does not exist", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievedRoutes(new MockDatabase()));
    const res = await request(app).put("/").send({
      achievementId: "none",
      userId: "none",
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    expect(res.status).toBe(404);
  });
});
