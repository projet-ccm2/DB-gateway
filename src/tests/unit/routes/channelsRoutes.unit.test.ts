import express from "express";
import request from "supertest";
import { createChannelsRoutes } from "../../../routes/channelsRoutes";
import { MockDatabase } from "../../mocks";

describe("channelsRoutes (unit)", () => {
  it("POST / creates channel and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app).post("/").send({ name: "MyChannel" });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("MyChannel");
  });

  it("GET /:id returns 404 when channel not found", async () => {
    const app = express();
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app).get("/unknown-id");
    expect(res.status).toBe(404);
  });
});
