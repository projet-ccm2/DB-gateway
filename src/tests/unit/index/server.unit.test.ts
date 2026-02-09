import request from "supertest";
import { createApp } from "../../../index";
import { createMockGateway } from "../../mocks";
import { describe, test, expect } from "@jest/globals";

const { db } = createMockGateway();
const app = createApp(db);

describe("server (unit) - mock-backed", () => {
  test("POST /users creates a user and GET /users/:id returns it", async () => {
    const resp = await request(app)
      .post("/users")
      .send({ username: "testuser", twitchUserId: "twitch_testuser" });
    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty("id");
    expect(resp.body.username).toBe("testuser");
    expect(resp.body.twitchUserId).toBe("twitch_testuser");

    const id = resp.body.id;
    const getResp = await request(app).get(`/users/${id}`);
    expect(getResp.status).toBe(200);
    expect(getResp.body.id).toBe(id);
    expect(getResp.body.username).toBe("testuser");
  });
});
