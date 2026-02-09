import express from "express";
import type { Database } from "../database/database";
import { createHealthRoutes } from "./healthRoutes";
import { createUsersRoutes } from "./usersRoutes";
import { createChannelsRoutes } from "./channelsRoutes";
import { createTypeAchievementsRoutes } from "./typeAchievementsRoutes";
import { createAchievementsRoutes } from "./achievementsRoutes";
import { createBadgesRoutes } from "./badgesRoutes";
import { createAchievedRoutes } from "./achievedRoutes";
import { createAreRoutes } from "./areRoutes";
import { createPossessesRoutes } from "./possessesRoutes";

export function mountRoutes(app: express.Express, db: Database): void {
  app.use("/health", createHealthRoutes(db));
  app.use("/users", createUsersRoutes(db));
  app.use("/channels", createChannelsRoutes(db));
  app.use("/type-achievements", createTypeAchievementsRoutes(db));
  app.use("/achievements", createAchievementsRoutes(db));
  app.use("/badges", createBadgesRoutes(db));
  app.use("/achieved", createAchievedRoutes(db));
  app.use("/are", createAreRoutes(db));
  app.use("/possesses", createPossessesRoutes(db));
}
