import express from "express";
import type { Database } from "../database/database";
import { AchievedRepository } from "../repositories/achievedRepository";
import { createAchievedController } from "../controllers/achievedController";

export function createAchievedRoutes(db: Database): express.Router {
  const router = express.Router();
  const repo = new AchievedRepository(db);
  const c = createAchievedController(repo);
  router.post("/", c.create);
  router.get("/", c.get);
  return router;
}
