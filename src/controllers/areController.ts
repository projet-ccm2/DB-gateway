import { Request, Response } from "express";
import type { AreRepository } from "../repositories/areRepository";
import {
  BAD_REQUEST,
  NOT_FOUND,
  paramId,
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

    getByUserId: async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = paramId(req, "userId");
        if (!userId) {
          res.status(BAD_REQUEST).json({ error: "userId required" });
          return;
        }
        const records = await repo.getByUserId(userId);
        res.json(records);
      } catch (err: unknown) {
        sendInternalError(res, "GET /are/user/:userId error", err);
      }
    },

    getByChannelId: async (req: Request, res: Response): Promise<void> => {
      try {
        const channelId = paramId(req, "channelId");
        if (!channelId) {
          res.status(BAD_REQUEST).json({ error: "channelId required" });
          return;
        }
        const records = await repo.getByChannelId(channelId);
        res.json(records);
      } catch (err: unknown) {
        sendInternalError(res, "GET /are/channel/:channelId error", err);
      }
    },

    update: async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = paramId(req, "userId");
        const channelId = paramId(req, "channelId");
        if (!userId || !channelId) {
          res
            .status(BAD_REQUEST)
            .json({ error: "userId and channelId required" });
          return;
        }
        const { userType } = req.body as { userType?: string };
        const updated = await repo.update(userId, channelId, { userType });
        if (!updated) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(updated);
      } catch (err: unknown) {
        sendInternalError(res, "PUT /are/:userId/:channelId error", err);
      }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = paramId(req, "userId");
        const channelId = paramId(req, "channelId");
        if (!userId || !channelId) {
          res
            .status(BAD_REQUEST)
            .json({ error: "userId and channelId required" });
          return;
        }
        const deleted = await repo.delete(userId, channelId);
        if (!deleted) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.status(204).send();
      } catch (err: unknown) {
        sendInternalError(res, "DELETE /are/:userId/:channelId error", err);
      }
    },
  };
}
