import express from "express";
import type { Database } from "../database/database";
import { createHealthController } from "../controllers/healthController";

export function createHealthRoutes(db: Database): express.Router {
  const router = express.Router();
  const c = createHealthController(db);
  router.get("/", c.get);
  return router;
}
