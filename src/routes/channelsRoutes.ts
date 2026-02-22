import express from "express";
import type { Database } from "../database/database";
import { ChannelRepository } from "../repositories/channelRepository";
import { UserRepository } from "../repositories/userRepository";
import { createChannelsController } from "../controllers/channelsController";

export function createChannelsRoutes(db: Database): express.Router {
  const router = express.Router();
  const channelRepo = new ChannelRepository(db);
  const userRepo = new UserRepository(db);
  const c = createChannelsController(channelRepo, userRepo);
  router.post("/", c.create);
  router.get("/:id", c.getById);
  router.put("/:id", c.update);
  router.get("/:id/users", c.getUsersByChannelId);
  return router;
}
