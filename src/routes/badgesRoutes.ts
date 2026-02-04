import express from "express";
import type { Database } from "../database/database";
import { BadgeRepository } from "../repositories/badgeRepository";
import { UserRepository } from "../repositories/userRepository";
import { createBadgesController } from "../controllers/badgesController";

export function createBadgesRoutes(db: Database): express.Router {
  const router = express.Router();
  const badgeRepo = new BadgeRepository(db);
  const userRepo = new UserRepository(db);
  const c = createBadgesController(badgeRepo, userRepo);
  router.post("/", c.create);
  router.get("/:id", c.getById);
  router.get("/:id/users", c.getUsersByBadgeId);
  return router;
}
