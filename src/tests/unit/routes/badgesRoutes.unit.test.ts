import express from "express";
import request from "supertest";
import { createBadgesRoutes } from "../../../routes/badgesRoutes";
import { MockDatabase } from "../../mocks";

describe("badgesRoutes (unit)", () => {
  it("POST / creates badge and returns 201", async () => {
    const db = new MockDatabase();
    await db.addChannel({ id: "ch-route-test", name: "routetest" });
    const app = express();
    app.use(express.json());
    app.use("/", createBadgesRoutes(db));
    const res = await request(app)
      .post("/")
      .send({ title: "Badge", img: "img.png", channelId: "ch-route-test" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: "Badge", img: "img.png" });
  });
});
