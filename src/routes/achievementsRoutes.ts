import express from "express";
import type { Database } from "../database/database";
import { AchievementRepository } from "../repositories/achievementRepository";
import { UserRepository } from "../repositories/userRepository";
import { createAchievementsController } from "../controllers/achievementsController";

export function createAchievementsRoutes(db: Database): express.Router {
  const router = express.Router();
  const achievementRepo = new AchievementRepository(db);
  const userRepo = new UserRepository(db);
  const c = createAchievementsController(achievementRepo, userRepo);
  router.post("/", c.create);
  router.get("/channel/:channelId", c.getByChannelId);
  router.get(
    "/user/:userId/channel/:channelId",
    c.getAchievementsByUserAndChannel,
  );
  router.get("/:id/users", c.getUsersByAchievementId);
  router.get("/:id", c.getById);
  return router;
}
