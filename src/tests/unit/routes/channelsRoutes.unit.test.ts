import express from "express";
import request from "supertest";
import { createChannelsRoutes } from "../../../routes/channelsRoutes";
import { MockDatabase } from "../../mocks";

describe("channelsRoutes (unit)", () => {
  it("POST / creates channel and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app)
      .post("/")
      .send({ id: "ch-route-1", name: "MyChannel" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("ch-route-1");
    expect(res.body.name).toBe("MyChannel");
  });

  it("POST / returns 400 when id missing", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app).post("/").send({ name: "MyChannel" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("id required");
  });

  it("GET /:id returns 404 when channel not found", async () => {
    const app = express();
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app).get("/unknown-id");
    expect(res.status).toBe(404);
  });

  it("PUT /:id updates channel and returns 200", async () => {
    const db = new MockDatabase();
    await db.addChannel({ id: "ch-put", name: "OldName" });
    const app = express();
    app.use(express.json());
    app.use("/", createChannelsRoutes(db));
    const res = await request(app).put("/ch-put").send({ name: "NewName" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("NewName");
  });

  it("PUT /:id returns 404 when channel not found", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app).put("/unknown").send({ name: "N" });
    expect(res.status).toBe(404);
  });

  it("GET /:id/badge returns badge when found", async () => {
    const db = new MockDatabase();
    const ch = await db.addChannel({ id: "ch-badge", name: "C" });
    await db.addBadge({ title: "MyBadge", img: "badge.png", channelId: ch.id });
    const app = express();
    app.use("/", createChannelsRoutes(db));
    const res = await request(app).get("/ch-badge/badge");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("MyBadge");
    expect(res.body.img).toBe("badge.png");
  });

  it("GET /:id/badge returns 404 when no badge for channel", async () => {
    const app = express();
    app.use("/", createChannelsRoutes(new MockDatabase()));
    const res = await request(app).get("/unknown-ch/badge");
    expect(res.status).toBe(404);
  });
});
