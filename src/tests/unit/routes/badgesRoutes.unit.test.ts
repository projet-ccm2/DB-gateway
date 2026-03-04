import express from "express";
import request from "supertest";
import { createBadgesRoutes } from "../../../routes/badgesRoutes";
import { MockDatabase } from "../../mocks";

describe("badgesRoutes (unit)", () => {
  it("POST / creates badge and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createBadgesRoutes(new MockDatabase()));
    const res = await request(app)
      .post("/")
      .send({ title: "Badge", img: "img.png" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: "Badge", img: "img.png" });
  });
});
