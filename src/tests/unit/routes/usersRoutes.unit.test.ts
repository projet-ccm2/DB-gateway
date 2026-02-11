import express from "express";
import request from "supertest";
import { createUsersRoutes } from "../../../routes/usersRoutes";
import { MockDatabase } from "../../mocks";

describe("usersRoutes (unit)", () => {
  it("POST / creates user and returns 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createUsersRoutes(new MockDatabase()));
    const res = await request(app)
      .post("/")
      .send({ id: "twitch1", username: "u1" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: "twitch1", username: "u1" });
  });

  it("GET /:id returns 200 when user exists", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ id: "twitch2", username: "u2" });
    const app = express();
    app.use("/", createUsersRoutes(db));
    const res = await request(app).get(`/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("u2");
  });
});
