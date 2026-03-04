import express from "express";
import request from "supertest";
import { createAreRoutes } from "../../../routes/areRoutes";
import { MockDatabase } from "../../mocks";

describe("areRoutes (unit)", () => {
  it("POST / creates are and returns 201", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "t",
      username: "u",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-post-are", name: "c" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app)
      .post("/")
      .send({ userId: user.id, channelId: ch.id, userType: "mod" });
    expect(res.status).toBe(201);
    expect(res.body.userType).toBe("mod");
  });

  it("GET / returns are when found", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u1",
      username: "u1",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-get-are-1", name: "c1" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "viewer" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app)
      .get("/")
      .query({ userId: user.id, channelId: ch.id });
    expect(res.status).toBe(200);
    expect(res.body.userType).toBe("viewer");
  });

  it("GET /user/:userId returns all are for user", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u2",
      username: "u2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch1 = await db.addChannel({ id: "ch-user-are-1", name: "c1" });
    const ch2 = await db.addChannel({ id: "ch-user-are-2", name: "c2" });
    await db.addAre({ userId: user.id, channelId: ch1.id, userType: "mod" });
    await db.addAre({ userId: user.id, channelId: ch2.id, userType: "viewer" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app).get(`/user/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("GET /channel/:channelId returns all are for channel", async () => {
    const db = new MockDatabase();
    const u1 = await db.addUser({
      id: "u3",
      username: "u3",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const u2 = await db.addUser({
      id: "u4",
      username: "u4",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-channel-are", name: "c3" });
    await db.addAre({ userId: u1.id, channelId: ch.id, userType: "mod" });
    await db.addAre({ userId: u2.id, channelId: ch.id, userType: "viewer" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app).get(`/channel/${ch.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("PUT /:userId/:channelId updates are", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u5",
      username: "u5",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-put-are", name: "c5" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "viewer" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app)
      .put(`/${user.id}/${ch.id}`)
      .send({ userType: "admin" });
    expect(res.status).toBe(200);
    expect(res.body.userType).toBe("admin");
  });

  it("PUT /:userId/:channelId returns 404 when not found", async () => {
    const db = new MockDatabase();
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app)
      .put("/none/none")
      .send({ userType: "admin" });
    expect(res.status).toBe(404);
  });

  it("DELETE /:userId/:channelId deletes are", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "u6",
      username: "u6",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-del-are", name: "c6" });
    await db.addAre({ userId: user.id, channelId: ch.id, userType: "viewer" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app).delete(`/${user.id}/${ch.id}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /:userId/:channelId returns 404 when not found", async () => {
    const db = new MockDatabase();
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app).delete("/none/none");
    expect(res.status).toBe(404);
  });
});
