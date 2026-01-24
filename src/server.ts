const express = require("express");

import { createPrismaGateway } from "./index";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { repo } = createPrismaGateway();

// Health check route
app.get("/health", (_req: any, res: any) => {
  res.status(200).json({ status: "ok" });
});

app.post("/users", async (req: any, res: any) => {
  try {
    const {
      username,
      twitchUserId,
      profileImageUrl,
      channelDescription,
      scope,
    } = req.body as {
      username?: string;
      twitchUserId?: string;
      profileImageUrl?: string;
      channelDescription?: string;
      scope?: string;
    };
    if (!username || !twitchUserId)
      return res
        .status(400)
        .json({ error: "username and twitchUserId required" });
    const user = await repo.addUser({
      username,
      twitchUserId,
      profileImageUrl: profileImageUrl ?? null,
      channelDescription: channelDescription ?? null,
      scope: scope ?? null,
    });
    res.status(201).json(user);
  } catch (err: any) {
    logger.error("POST /users error", { error: err });
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:id", async (req: any, res: any) => {
  try {
    const user = await repo.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "not found" });
    res.json(user);
  } catch (err: any) {
    logger.error("GET /users/:id error", { error: err });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
