import { Request, Response } from "express";
import { createAchievementsController } from "../../../controllers/achievementsController";
import { AchievementRepository } from "../../../repositories/achievementRepository";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("achievementsController (unit)", () => {
  const db = new MockDatabase();
  const achievementRepo = new AchievementRepository(db);
  const userRepo = new UserRepository(db);
  const ctrl = createAchievementsController(achievementRepo, userRepo);

  let type: { id: string; label: string; data: string };
  let type2: { id: string; label: string; data: string };
  beforeAll(async () => {
    type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    type2 = await db.addTypeAchievement({ label: "NewTL", data: "NewTD" });
  });

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 when required fields provided", async () => {
    const req = {
      body: {
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
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "T", label: "L" }),
    );
  });

  it("create returns 404 when typeId not found", async () => {
    const req = {
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "nonexistent-type",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "typeId not found" });
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns 201 with channelId when provided", async () => {
    const ch = await db.addChannel({ id: "ch-ach-ctrl-1", name: "Ch" });
    const req = {
      body: {
        title: "T2",
        description: "D2",
        goal: 2,
        reward: 20,
        label: "L2",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        channelId: ch.id,
        typeId: type.id,
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("update returns 200 with updated achievement", async () => {
    const a = (await db.addAchievement({
      title: "OldCtrl",
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
    const req = {
      params: { achievementId: a.id },
      body: {
        title: "NewCtrl",
        description: "NewD",
        goal: 99,
        reward: 50,
        label: "NewL",
        public: true,
        active: false,
        secret: true,
        image: "new.png",
        typeId: type2.id,
      },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, title: "NewCtrl", goal: 99 }),
    );
  });

  it("update returns 404 when achievement not found", async () => {
    const req = {
      params: { achievementId: "unknown" },
      body: {
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
      },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("update returns 400 when body incomplete", async () => {
    const req = {
      params: { achievementId: "some-id" },
      body: { title: "Only title" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("update returns 400 when achievementId missing", async () => {
    const req = {
      params: {},
      body: {
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
      },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("update returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      update: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = {
      params: { achievementId: "x" },
      body: {
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
      },
    } as unknown as Request;
    const res = mockRes();
    await c.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 200 when found", async () => {
    const a = (await db.addAchievement({
      title: "Found",
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
    const req = { params: { id: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, title: "Found" }),
    );
  });

  it("getUsersByAchievementId returns 200 and array", async () => {
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
    const req = { params: { id: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getUsersByAchievementId(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("getByChannelId returns 400 when channelId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.getByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "channelId required" }),
    );
  });

  it("getByChannelId returns 200 with array", async () => {
    const ch = await db.addChannel({ id: "ch-ach-ctrl-2", name: "Ch" });
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
    const req = { params: { channelId: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ title: "A" })]),
    );
  });

  it("getPublic returns 200 with only public achievements", async () => {
    const freshDb = new MockDatabase();
    const freshAchievementRepo = new AchievementRepository(freshDb);
    const freshUserRepo = new UserRepository(freshDb);
    const freshCtrl = createAchievementsController(
      freshAchievementRepo,
      freshUserRepo,
    );
    const freshType = await freshDb.addTypeAchievement({
      label: "TL",
      data: "TD",
    });
    await freshDb.addAchievement({
      title: "PubCtrl",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      typeId: freshType.id,
    });
    await freshDb.addAchievement({
      title: "PrivCtrl",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: freshType.id,
    });
    const req = {} as unknown as Request;
    const res = mockRes();
    await freshCtrl.getPublic(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "PubCtrl", public: true }),
      ]),
    );
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
  });

  it("getPublic returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      getPublic: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = {} as unknown as Request;
    const res = mockRes();
    await c.getPublic(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getByChannelId returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      getByChannelId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { channelId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getAchievementsByUserAndChannel returns 500 when repo throws", async () => {
    const throwingUserRepo = {
      getAchievementsByUserAndChannel: jest
        .fn()
        .mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createAchievementsController(achievementRepo, throwingUserRepo);
    const req = {
      params: { userId: "u", channelId: "c" },
    } as unknown as Request;
    const res = mockRes();
    await c.getAchievementsByUserAndChannel(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getByUserId returns 200 with achievements + achieved", async () => {
    const freshDb = new MockDatabase();
    const freshAchievementRepo = new AchievementRepository(freshDb);
    const freshUserRepo = new UserRepository(freshDb);
    const freshCtrl = createAchievementsController(
      freshAchievementRepo,
      freshUserRepo,
    );
    const freshType = await freshDb.addTypeAchievement({
      label: "TL",
      data: "TD",
    });
    const ach = (await freshDb.addAchievement({
      title: "CtrlDefAch",
      description: "D",
      goal: 5,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: freshType.id,
    }))!;
    await freshDb.addAchieved({
      achievementId: ach.id,
      userId: "ctrl-def-user",
      count: 2,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-06-01T00:00:00.000Z",
    });
    const req = { params: { userId: "ctrl-def-user" } } as unknown as Request;
    const res = mockRes();
    await freshCtrl.getByUserId(req, res);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("CtrlDefAch");
    expect(result[0].achieved).not.toBeNull();
  });

  it("getByUserId returns 400 when userId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.getByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "userId required" }),
    );
  });

  it("getByUserId returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      getDefinitionsByUserId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { userId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getAchievementsByUserAndChannel returns 400 when userId or channelId missing", async () => {
    const req1 = { params: { userId: "u" } } as unknown as Request;
    const res1 = mockRes();
    await ctrl.getAchievementsByUserAndChannel(req1, res1);
    expect(res1.status).toHaveBeenCalledWith(400);

    const req2 = { params: { channelId: "c" } } as unknown as Request;
    const res2 = mockRes();
    await ctrl.getAchievementsByUserAndChannel(req2, res2);
    expect(res2.status).toHaveBeenCalledWith(400);
  });

  it("getAchievementsByUserAndChannel returns 200 with userId, channelId, achievements", async () => {
    const user = await db.addUser({
      id: "t",
      username: "U",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await db.addChannel({ id: "ch-ach-ctrl-3", name: "Ch" });
    const req = {
      params: { userId: user.id, channelId: ch.id },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.getAchievementsByUserAndChannel(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        channelId: ch.id,
        achievements: expect.any(Array),
      }),
    );
  });

  it("create returns 500 when repo.add throws", async () => {
    const throwingAchievementRepo = {
      add: jest.fn().mockRejectedValue(new Error("db")),
      getById: jest.fn(),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = {
      body: {
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
      },
    } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      add: jest.fn(),
      getById: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getUsersByAchievementId returns 500 when repo throws", async () => {
    const throwingUserRepo = {
      getUsersByAchievementId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createAchievementsController(achievementRepo, throwingUserRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getUsersByAchievementId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("activate returns 400 when achievementId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.activate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "achievementId required" });
  });

  it("deactivate returns 400 when achievementId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.deactivate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "achievementId required" });
  });

  it("makePublic returns 400 when achievementId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.makePublic(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "achievementId required" });
  });

  it("makePrivate returns 400 when achievementId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.makePrivate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "achievementId required" });
  });

  it("activate returns 200 and sets active to true", async () => {
    const a = (await db.addAchievement({
      title: "Inactive",
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
    const req = { params: { achievementId: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.activate(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, active: true }),
    );
  });

  it("activate returns 404 when achievement not found", async () => {
    const req = { params: { achievementId: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.activate(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("activate returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      activate: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { achievementId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.activate(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deactivate returns 200 and sets active to false", async () => {
    const a = (await db.addAchievement({
      title: "Active",
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
    const req = { params: { achievementId: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.deactivate(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, active: false }),
    );
  });

  it("deactivate returns 404 when achievement not found", async () => {
    const req = { params: { achievementId: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.deactivate(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deactivate returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      deactivate: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { achievementId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.deactivate(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("makePublic returns 200 and sets public to true", async () => {
    const a = (await db.addAchievement({
      title: "Private",
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
    const req = { params: { achievementId: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.makePublic(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, public: true }),
    );
  });

  it("makePublic returns 404 when achievement not found", async () => {
    const req = { params: { achievementId: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.makePublic(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("makePublic returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      makePublic: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { achievementId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.makePublic(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("makePrivate returns 200 and sets public to false", async () => {
    const a = (await db.addAchievement({
      title: "Public",
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
    const req = { params: { achievementId: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.makePrivate(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, public: false }),
    );
  });

  it("makePrivate returns 404 when achievement not found", async () => {
    const req = { params: { achievementId: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.makePrivate(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("makePrivate returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      makePrivate: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { achievementId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.makePrivate(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("remove returns 200 with deleted achievement", async () => {
    const a = (await db.addAchievement({
      title: "ToRemove",
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
    const req = { params: { achievementId: a.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.remove(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: a.id, title: "ToRemove" }),
    );
  });

  it("remove returns 404 when achievement not found", async () => {
    const req = { params: { achievementId: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("remove returns 400 when achievementId missing", async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("remove returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      delete: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = { params: { achievementId: "x" } } as unknown as Request;
    const res = mockRes();
    await c.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("create returns 400 when public is a string instead of boolean", async () => {
    const req = {
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
        public: "false",
        active: true,
        secret: false,
        image: "img.png",
        typeId: type.id,
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("create returns 400 when active is a string instead of boolean", async () => {
    const req = {
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
        public: false,
        active: "true",
        secret: false,
        image: "img.png",
        typeId: type.id,
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("create returns 400 when secret is a string instead of boolean", async () => {
    const req = {
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
        public: false,
        active: true,
        secret: "false",
        image: "img.png",
        typeId: type.id,
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("update returns 400 when boolean fields are strings", async () => {
    const req = {
      params: { achievementId: "some-id" },
      body: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 10,
        label: "L",
        public: "true",
        active: true,
        secret: false,
        image: "img.png",
        typeId: type.id,
      },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getLeaderboard returns 400 when channelId missing", async () => {
    const req = { params: {}, query: {} } as unknown as Request;
    const res = mockRes();
    await ctrl.getLeaderboard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "channelId required" });
  });

  it("getLeaderboard returns 200 sorted by xp by default", async () => {
    const freshDb = new MockDatabase();
    const freshAchievementRepo = new AchievementRepository(freshDb);
    const freshUserRepo = new UserRepository(freshDb);
    const freshCtrl = createAchievementsController(
      freshAchievementRepo,
      freshUserRepo,
    );
    const ch = await freshDb.addChannel({ id: "ch-lb-1", name: "LB" });
    const t = await freshDb.addTypeAchievement({ label: "TL", data: "TD" });
    const ach = (await freshDb.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeId: t.id,
    }))!;
    await freshDb.addUser({
      id: "u1",
      username: "Alice",
      xp: 100,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await freshDb.addUser({
      id: "u2",
      username: "Bob",
      xp: 200,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await freshDb.addAchieved({
      achievementId: ach.id,
      userId: "u1",
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: null,
    });
    await freshDb.addAchieved({
      achievementId: ach.id,
      userId: "u2",
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: null,
    });
    const req = {
      params: { channelId: ch.id },
      query: {},
    } as unknown as Request;
    const res = mockRes();
    await freshCtrl.getLeaderboard(req, res);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe("u1");
    expect(result[0].xp).toBe(10);
    expect(result[1].userId).toBe("u2");
    expect(result[1].xp).toBe(0);
  });

  it("getLeaderboard respects limit param", async () => {
    const freshDb = new MockDatabase();
    const freshAchievementRepo = new AchievementRepository(freshDb);
    const freshUserRepo = new UserRepository(freshDb);
    const freshCtrl = createAchievementsController(
      freshAchievementRepo,
      freshUserRepo,
    );
    const ch = await freshDb.addChannel({ id: "ch-lb-2", name: "LB" });
    const t = await freshDb.addTypeAchievement({ label: "TL", data: "TD" });
    const ach = (await freshDb.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeId: t.id,
    }))!;
    await freshDb.addUser({
      id: "u3",
      username: "C",
      xp: 50,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await freshDb.addUser({
      id: "u4",
      username: "D",
      xp: 100,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await freshDb.addAchieved({
      achievementId: ach.id,
      userId: "u3",
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: null,
    });
    await freshDb.addAchieved({
      achievementId: ach.id,
      userId: "u4",
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: null,
    });
    const req = {
      params: { channelId: ch.id },
      query: { limit: "1" },
    } as unknown as Request;
    const res = mockRes();
    await freshCtrl.getLeaderboard(req, res);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
  });

  it("getLeaderboard sorts by completed when sort=completed", async () => {
    const freshDb = new MockDatabase();
    const freshAchievementRepo = new AchievementRepository(freshDb);
    const freshUserRepo = new UserRepository(freshDb);
    const freshCtrl = createAchievementsController(
      freshAchievementRepo,
      freshUserRepo,
    );
    const ch = await freshDb.addChannel({ id: "ch-lb-3", name: "LB" });
    const t = await freshDb.addTypeAchievement({ label: "TL", data: "TD" });
    const ach1 = (await freshDb.addAchievement({
      title: "A1",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeId: t.id,
    }))!;
    const ach2 = (await freshDb.addAchievement({
      title: "A2",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeId: t.id,
    }))!;
    await freshDb.addUser({
      id: "u5",
      username: "E",
      xp: 300,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await freshDb.addUser({
      id: "u6",
      username: "F",
      xp: 50,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await freshDb.addAchieved({
      achievementId: ach1.id,
      userId: "u5",
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: null,
    });
    await freshDb.addAchieved({
      achievementId: ach1.id,
      userId: "u6",
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: null,
    });
    await freshDb.addAchieved({
      achievementId: ach2.id,
      userId: "u6",
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: null,
    });
    const req = {
      params: { channelId: ch.id },
      query: { sort: "completed" },
    } as unknown as Request;
    const res = mockRes();
    await freshCtrl.getLeaderboard(req, res);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result[0].userId).toBe("u6");
    expect(result[0].completed).toBe(2);
    expect(result[1].userId).toBe("u5");
    expect(result[1].completed).toBe(1);
  });

  it("getLeaderboard returns 500 when repo throws", async () => {
    const throwingAchievementRepo = {
      getLeaderboard: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof AchievementRepository>;
    const c = createAchievementsController(throwingAchievementRepo, userRepo);
    const req = {
      params: { channelId: "ch" },
      query: {},
    } as unknown as Request;
    const res = mockRes();
    await c.getLeaderboard(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
