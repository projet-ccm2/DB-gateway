import express from "express";
import type { Database } from "../database/database";
import { PossessesRepository } from "../repositories/possessesRepository";
import { createPossessesController } from "../controllers/possessesController";

export function createPossessesRoutes(db: Database): express.Router {
  const router = express.Router();
  const repo = new PossessesRepository(db);
  const c = createPossessesController(repo);
  router.post("/", c.create);
  router.get("/", c.get);
  return router;
}
