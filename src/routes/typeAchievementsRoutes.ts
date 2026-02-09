import express from "express";
import type { Database } from "../database/database";
import { TypeAchievementRepository } from "../repositories/typeAchievementRepository";
import { createTypeAchievementsController } from "../controllers/typeAchievementsController";

export function createTypeAchievementsRoutes(db: Database): express.Router {
  const router = express.Router();
  const repo = new TypeAchievementRepository(db);
  const c = createTypeAchievementsController(repo);
  router.post("/", c.create);
  router.get("/:id", c.getById);
  return router;
}
