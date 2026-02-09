import { Request, Response } from "express";
import type { AreRepository } from "../repositories/areRepository";
import {
  BAD_REQUEST,
  NOT_FOUND,
  queryString,
  sendInternalError,
} from "./helpers";

export function createAreController(repo: AreRepository) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const { userId, channelId, userType } = req.body as {
          userId?: string;
          channelId?: string;
          userType?: string;
        };
        if (!userId || !channelId || !userType) {
          res
            .status(BAD_REQUEST)
            .json({ error: "userId, channelId, userType required" });
          return;
        }
        const are = await repo.add(userId, channelId, userType);
        res.status(201).json(are);
      } catch (err: unknown) {
        sendInternalError(res, "POST /are error", err);
      }
    },

    get: async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = queryString(req, "userId");
        const channelId = queryString(req, "channelId");
        if (!userId || !channelId) {
          res.status(BAD_REQUEST).json({
            error: "query params userId and channelId required",
          });
          return;
        }
        const are = await repo.get(userId, channelId);
        if (!are) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(are);
      } catch (err: unknown) {
        sendInternalError(res, "GET /are error", err);
      }
    },
  };
}
