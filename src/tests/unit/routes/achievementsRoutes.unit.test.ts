import express from "express";
import request from "supertest";
import { createAchievementsRoutes } from "../../../routes/achievementsRoutes";
import { MockDatabase } from "../../mocks";

describe("achievementsRoutes (unit)", () => {
  it("POST / creates achievement and returns 201", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).post("/").send({
      title: "T",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("T");
  });

  it("PUT /:achievementId updates and returns 200", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const type2 = await db.addTypeAchievement({
      label: "NewTL",
      data: "NewTD",
    });
    const a = (await db.addAchievement({
      title: "Old",
      description: "OldD",
      goal: 1,
      reward: 1,
      label: "OldL",
      public: false,
      active: true,
      secret: false,
      image: "old.png",
      typeId: type.id,
    }))!;
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).put(`/${a.id}`).send({
      title: "New",
      description: "NewD",
      goal: 99,
      reward: 50,
      label: "NewL",
      public: true,
      active: false,
      secret: true,
      image: "new.png",
      typeId: type2.id,
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New");
    expect(res.body.goal).toBe(99);
    expect(res.body.active).toBe(false);
    expect(res.body.typeAchievement.label).toBe("NewTL");
  });

  it("PUT /:achievementId returns 404 when not found", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).put("/unknown").send({
      title: "T",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    });
    expect(res.status).toBe(404);
  });

  it("PUT /:achievementId returns 400 when body incomplete", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app)
      .put("/some-id")
      .send({ title: "Only title" });
    expect(res.status).toBe(400);
  });

  it("GET /channel/:channelId returns 200 and array with typeAchievement", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const ch = await db.addChannel({ id: "ch-ach-route-1", name: "Ch" });
    await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeId: type.id,
    });
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get(`/channel/${ch.id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe("A");
    expect(res.body[0]).toHaveProperty("typeAchievement");
  });

  it("GET /channel/:channelId returns 400 when channelId missing", async () => {
    const app = express();
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).get("/channel/");
    expect(res.status).toBe(404);
  });

  it("GET /public returns 200 and array of public achievements", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    await db.addAchievement({
      title: "Pub",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    });
    await db.addAchievement({
      title: "Priv",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    });
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get("/public");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Pub");
    expect(res.body[0].public).toBe(true);
    expect(res.body[0]).toHaveProperty("typeAchievement");
  });

  it("GET /public returns empty array when no public achievements", async () => {
    const app = express();
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).get("/public");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /user/:userId/channel/:channelId returns 200 with userId, channelId, achievements", async () => {
    const db = new MockDatabase();
    const user = await db.addUser({
      id: "t",
      username: "U",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ach-route-2", name: "Ch" });
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get(`/user/${user.id}/channel/${ch.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId", user.id);
    expect(res.body).toHaveProperty("channelId", ch.id);
    expect(Array.isArray(res.body.achievements)).toBe(true);
  });

  it("GET /user/:userId returns 200 with achievements + achieved", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const user = await db.addUser({
      id: "u-route-def",
      username: "U",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ach = (await db.addAchievement({
      title: "RouteDefAch",
      description: "D",
      goal: 5,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    }))!;
    await db.addAchieved({
      achievementId: ach.id,
      userId: user.id,
      count: 2,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-06-01T00:00:00.000Z",
    });
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get(`/user/${user.id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("RouteDefAch");
    expect(res.body[0]).toHaveProperty("typeAchievement");
    expect(res.body[0]).toHaveProperty("achieved");
    expect(res.body[0].achieved.userId).toBe(user.id);
  });

  it("GET /user/:userId returns empty array when no achieved records", async () => {
    const db = new MockDatabase();
    const app = express();
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).get("/user/some-user");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("PATCH /:achievementId/activate returns 200 and sets active to true", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const a = (await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: false,
      secret: false,
      image: "img.png",
      typeId: type.id,
    }))!;
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).patch(`/${a.id}/activate`);
    expect(res.status).toBe(200);
    expect(res.body.active).toBe(true);
  });

  it("PATCH /:achievementId/activate returns 404 when not found", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).patch("/unknown/activate");
    expect(res.status).toBe(404);
  });

  it("PATCH /:achievementId/deactivate returns 200 and sets active to false", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const a = (await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    }))!;
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).patch(`/${a.id}/deactivate`);
    expect(res.status).toBe(200);
    expect(res.body.active).toBe(false);
  });

  it("PATCH /:achievementId/deactivate returns 404 when not found", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).patch("/unknown/deactivate");
    expect(res.status).toBe(404);
  });

  it("PATCH /:achievementId/public returns 200 and sets public to true", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const a = (await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    }))!;
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).patch(`/${a.id}/public`);
    expect(res.status).toBe(200);
    expect(res.body.public).toBe(true);
  });

  it("PATCH /:achievementId/public returns 404 when not found", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).patch("/unknown/public");
    expect(res.status).toBe(404);
  });

  it("PATCH /:achievementId/private returns 200 and sets public to false", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const a = (await db.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    }))!;
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).patch(`/${a.id}/private`);
    expect(res.status).toBe(200);
    expect(res.body.public).toBe(false);
  });

  it("PATCH /:achievementId/private returns 404 when not found", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).patch("/unknown/private");
    expect(res.status).toBe(404);
  });

  it("DELETE /:achievementId deletes and returns 200", async () => {
    const db = new MockDatabase();
    const type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    const a = (await db.addAchievement({
      title: "Del",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    }))!;
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(db));
    const res = await request(app).delete(`/${a.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(a.id);
    expect(res.body.title).toBe("Del");
    expect(res.body.channelId).toBeDefined();
  });

  it("DELETE /:achievementId returns 404 when not found", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", createAchievementsRoutes(new MockDatabase()));
    const res = await request(app).delete("/unknown");
    expect(res.status).toBe(404);
  });
});
