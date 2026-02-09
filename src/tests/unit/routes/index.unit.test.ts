import express from "express";
import request from "supertest";
import { mountRoutes } from "../../../routes";
import { MockDatabase } from "../../mocks";

describe("routes/mountRoutes", () => {
  test("mounts health and returns 200 when db is up", async () => {
    const db = new MockDatabase();
    const app = express();
    mountRoutes(app, db);
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", db: "up" });
  });

  test("mounts /users route", async () => {
    const db = new MockDatabase();
    const app = express();
    app.use(express.json());
    mountRoutes(app, db);
    const res = await request(app)
      .post("/users")
      .send({ username: "routetest", twitchUserId: "twitch_route" });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe("routetest");
  });
});
