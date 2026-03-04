import express from "express";
import request from "supertest";
import { createPossessesRoutes } from "../../../routes/possessesRoutes";
import { MockDatabase } from "../../mocks";

describe("possessesRoutes (unit)", () => {
  it("POST / creates possesses and returns 201", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "t",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const badge = await db.addBadge({ title: "B", img: "i.png" });
    const app = express();
    app.use(express.json());
    app.use("/", createPossessesRoutes(db));
    const res = await request(app).post("/").send({
      userId: user.id,
      badgeId: badge.id,
      acquiredDate: new Date().toISOString(),
    });
    expect(res.status).toBe(201);
    expect(res.body.badgeId).toBe(badge.id);
  });
});
