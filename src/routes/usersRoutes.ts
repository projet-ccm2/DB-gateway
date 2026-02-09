import express from "express";
import type { Database } from "../database/database";
import { UserRepository } from "../repositories/userRepository";
import { createUsersController } from "../controllers/usersController";

export function createUsersRoutes(db: Database): express.Router {
  const router = express.Router();
  const repo = new UserRepository(db);
  const c = createUsersController(repo);
  router.post("/", c.create);
  router.get("/:id", c.getById);
  router.get("/:id/channels", c.getChannelsByUserId);
  router.get("/:id/badges", c.getBadgesByUserId);
  router.get("/:id/achievements", c.getAchievementsByUserId);
  return router;
}
