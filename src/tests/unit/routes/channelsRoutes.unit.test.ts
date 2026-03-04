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
});
