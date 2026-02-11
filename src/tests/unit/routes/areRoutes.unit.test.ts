import express from "express";
import request from "supertest";
import { createAreRoutes } from "../../../routes/areRoutes";
import { MockDatabase } from "../../mocks";

describe("areRoutes (unit)", () => {
  it("POST / creates are and returns 201", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({ id: "t", username: "u" });
    const ch = await db.addChannel({ name: "c" });
    const app = express();
    app.use(express.json());
    app.use("/", createAreRoutes(db));
    const res = await request(app)
      .post("/")
      .send({ userId: user.id, channelId: ch.id, userType: "mod" });
    expect(res.status).toBe(201);
    expect(res.body.userType).toBe("mod");
  });
});
