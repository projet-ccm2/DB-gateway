import { Request, Response } from "express";
import { createChannelsController } from "../../../controllers/channelsController";
import { ChannelRepository } from "../../../repositories/channelRepository";
import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("channelsController (unit)", () => {
  const db = new MockDatabase();
  const channelRepo = new ChannelRepository(db);
  const userRepo = new UserRepository(db);
  const ctrl = createChannelsController(channelRepo, userRepo);

  const mockRes = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  it("create returns 201 and channel when body valid", async () => {
    const req = { body: { id: "ch-test", name: "MyChannel" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ch-test", name: "MyChannel" }),
    );
  });

  it("getById returns channel when found", async () => {
    const ch = await channelRepo.addChannel("ch-get", "Ch1");
    const req = { params: { id: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: ch.id }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("getById returns 404 when not found", async () => {
    const req = { params: { id: "unknown" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns 400 when id missing", async () => {
    const req = { body: { name: "N" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "id required" });
  });

  it("create returns 400 when name missing", async () => {
    const req = { body: { id: "ch-x" } } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "name required" });
  });

  it("update returns updated channel when found", async () => {
    const ch = await channelRepo.addChannel("ch-upd", "OldName");
    const req = {
      params: { id: ch.id },
      body: { name: "NewName" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: ch.id, name: "NewName" }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("update returns 404 when not found", async () => {
    const req = {
      params: { id: "unknown" },
      body: { name: "N" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("create returns discordWebhookUrl when provided", async () => {
    const req = {
      body: {
        id: "ch-webhook",
        name: "Webhook",
        discordWebhookUrl: "https://discord.com/api/webhooks/123",
      },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "ch-webhook",
        discordWebhookUrl: "https://discord.com/api/webhooks/123",
      }),
    );
  });

  it("create returns discordWebhookUrl null when not provided", async () => {
    const req = {
      body: { id: "ch-no-webhook", name: "NoWebhook" },
    } as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "ch-no-webhook",
        discordWebhookUrl: null,
      }),
    );
  });

  it("update sets discordWebhookUrl", async () => {
    await channelRepo.addChannel("ch-upd-wh", "C");
    const req = {
      params: { id: "ch-upd-wh" },
      body: { discordWebhookUrl: "https://discord.com/api/webhooks/456" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        discordWebhookUrl: "https://discord.com/api/webhooks/456",
      }),
    );
  });

  it("update clears discordWebhookUrl when set to null", async () => {
    await channelRepo.addChannel(
      "ch-clr-wh",
      "C",
      "https://discord.com/api/webhooks/789",
    );
    const req = {
      params: { id: "ch-clr-wh" },
      body: { discordWebhookUrl: null },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        discordWebhookUrl: null,
      }),
    );
  });

  it("create returns 400 when discordWebhookUrl is not a string", async () => {
    const req = {
      body: { id: "ch-bad-wh", name: "BadWH", discordWebhookUrl: 12345 },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid discordWebhookUrl",
    });
  });

  it("update returns 400 when discordWebhookUrl is not a string", async () => {
    await channelRepo.addChannel("ch-upd-bad-wh", "C");
    const req = {
      params: { id: "ch-upd-bad-wh" },
      body: { discordWebhookUrl: { url: "x" } },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid discordWebhookUrl",
    });
  });

  it("getUsersByChannelId returns 200 and array", async () => {
    const ch = await db.addChannel({ id: "ch-users", name: "C" });
    const req = { params: { id: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getUsersByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("create returns 500 when repo.addChannel throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn().mockRejectedValue(new Error("db")),
      getChannelById: jest.fn(),
      updateChannel: jest.fn(),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = { body: { id: "ch-err", name: "N" } } as Request;
    const res = mockRes();
    await c.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getById returns 500 when repo throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn(),
      getChannelById: jest.fn().mockRejectedValue(new Error("db")),
      updateChannel: jest.fn(),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("update returns 500 when repo throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn(),
      getChannelById: jest.fn(),
      updateChannel: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = {
      params: { id: "x" },
      body: { name: "N" },
    } as unknown as Request;
    const res = mockRes();
    await c.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getUsersByChannelId returns 500 when repo throws", async () => {
    const throwingUserRepo = {
      getUsersByChannelId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof UserRepository>;
    const c = createChannelsController(channelRepo, throwingUserRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getUsersByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getBadgeByChannelId returns badge when found", async () => {
    const ch = await channelRepo.addChannel("ch-badge", "C");
    await db.addBadge({ title: "Badge1", img: "b.png", channelId: ch.id });
    const req = { params: { id: ch.id } } as unknown as Request;
    const res = mockRes();
    await ctrl.getBadgeByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Badge1", img: "b.png" }),
    );
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("getBadgeByChannelId returns 404 when not found", async () => {
    const req = { params: { id: "no-badge-ch" } } as unknown as Request;
    const res = mockRes();
    await ctrl.getBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getBadgeByChannelId returns 500 when repo throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn(),
      getChannelById: jest.fn(),
      updateChannel: jest.fn(),
      getBadgeByChannelId: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = { params: { id: "x" } } as unknown as Request;
    const res = mockRes();
    await c.getBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateBadgeByChannelId returns updated badge when title provided", async () => {
    const ch = await channelRepo.addChannel("ch-upd-badge-ctrl", "C");
    await db.addBadge({ title: "OldTitle", img: "old.png", channelId: ch.id });
    const req = {
      params: { id: ch.id },
      body: { title: "NewTitle" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "NewTitle", img: "old.png" }),
    );
    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("updateBadgeByChannelId returns updated badge when img provided", async () => {
    const ch = await channelRepo.addChannel("ch-upd-badge-img-ctrl", "C");
    await db.addBadge({ title: "T", img: "old.png", channelId: ch.id });
    const req = {
      params: { id: ch.id },
      body: { img: "new.png" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "T", img: "new.png" }),
    );
  });

  it("updateBadgeByChannelId returns updated badge when both provided", async () => {
    const ch = await channelRepo.addChannel("ch-upd-badge-both-ctrl", "C");
    await db.addBadge({ title: "OldT", img: "old.png", channelId: ch.id });
    const req = {
      params: { id: ch.id },
      body: { title: "NewT", img: "new.png" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "NewT", img: "new.png" }),
    );
  });

  it("updateBadgeByChannelId returns 400 when body empty", async () => {
    const req = {
      params: { id: "ch-x" },
      body: {},
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "at least one of title or img is required",
    });
  });

  it("updateBadgeByChannelId returns 400 when title is empty string", async () => {
    const req = {
      params: { id: "ch-x" },
      body: { title: "   " },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid title" });
  });

  it("updateBadgeByChannelId returns 400 when img is empty string", async () => {
    const req = {
      params: { id: "ch-x" },
      body: { img: "" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid img" });
  });

  it("updateBadgeByChannelId returns 400 when title is not a string", async () => {
    const req = {
      params: { id: "ch-x" },
      body: { title: 123 },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid title" });
  });

  it("updateBadgeByChannelId returns 400 when img is not a string", async () => {
    const req = {
      params: { id: "ch-x" },
      body: { img: true },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid img" });
  });

  it("updateBadgeByChannelId returns 404 when no badge", async () => {
    const req = {
      params: { id: "ch-no-badge" },
      body: { title: "T" },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateBadgeByChannelId trims whitespace from title and img", async () => {
    const ch = await channelRepo.addChannel("ch-upd-badge-trim", "C");
    await db.addBadge({ title: "OldT", img: "old.png", channelId: ch.id });
    const req = {
      params: { id: ch.id },
      body: { title: "  Trimmed  ", img: "  badge.png  " },
    } as unknown as Request;
    const res = mockRes();
    await ctrl.updateBadgeByChannelId(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Trimmed", img: "badge.png" }),
    );
  });

  it("updateBadgeByChannelId returns 500 when repo throws", async () => {
    const throwingChannelRepo = {
      addChannel: jest.fn(),
      getChannelById: jest.fn(),
      updateChannel: jest.fn(),
      getBadgeByChannelId: jest.fn(),
      updateBadgeByChannelId: jest
        .fn()
        .mockRejectedValue(new Error("db error")),
    } as unknown as InstanceType<typeof ChannelRepository>;
    const c = createChannelsController(throwingChannelRepo, userRepo);
    const req = {
      params: { id: "ch-x" },
      body: { title: "T" },
    } as unknown as Request;
    const res = mockRes();
    await c.updateBadgeByChannelId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
