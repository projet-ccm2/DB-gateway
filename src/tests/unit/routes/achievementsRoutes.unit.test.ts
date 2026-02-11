import express from "express";
import request from "supertest";
import { createAchievementsRoutes } from "../../../routes/achievementsRoutes";
import { MockDatabase } from "../../mocks";

describe("achievementsRoutes (unit)", () => {
  it("POST / creates achievement and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).post("/").send({
      title: "T",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("T");
  });

  it("GET /channel/:channelId returns 200 and array with typeAchievement", async () => {
    const db = new MockDatabase();
    const ch = await db.addChannel({ name: "Ch" });
    await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      channelId: ch.id,
    });
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get(`/channel/${ch.id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe("A");
    expect(res.body[0]).toHaveProperty("typeAchievement");
  });

  it("GET /channel/:channelId returns 400 when channelId missing", async () => {
    const app = express();
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).get("/channel/");
    expect(res.status).toBe(404);
  });

  it("GET /user/:userId/channel/:channelId returns 200 with userId, channelId, achievements", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ id: "t", username: "U" });
    const ch = await db.addChannel({ name: "Ch" });
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get(`/user/${user.id}/channel/${ch.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId", user.id);
    expect(res.body).toHaveProperty("channelId", ch.id);
    expect(Array.isArray(res.body.achievements)).toBe(true);
  });
});
