import express from "express";
import type { Database } from "../database/database";
import { AreRepository } from "../repositories/areRepository";
import { createAreController } from "../controllers/areController";

export function createAreRoutes(db: Database): express.Router {
  const router = express.Router();
  const repo = new AreRepository(db);
  const c = createAreController(repo);
  router.post("/", c.create);
  router.get("/", c.get);
  router.get("/user/:userId", c.getByUserId);
  router.get("/channel/:channelId", c.getByChannelId);
  router.put("/:userId/:channelId", c.update);
  router.delete("/:userId/:channelId", c.delete);
  return router;
}
