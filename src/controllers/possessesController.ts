import { Request, Response } from "express";
import type { PossessesRepository } from "../repositories/possessesRepository";
import {
  BAD_REQUEST,
  NOT_FOUND,
  queryString,
  sendInternalError,
} from "./helpers";

export function createPossessesController(repo: PossessesRepository) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const { userId, badgeId, acquiredDate } = req.body as {
          userId?: string;
          badgeId?: string;
          acquiredDate?: string;
        };
        if (!userId || !badgeId || !acquiredDate) {
          res.status(BAD_REQUEST).json({
            error: "userId, badgeId, acquiredDate required",
          });
          return;
        }
        const possesses = await repo.add(userId, badgeId, acquiredDate);
        res.status(201).json(possesses);
      } catch (err: unknown) {
        sendInternalError(res, "POST /possesses error", err);
      }
    },

    get: async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = queryString(req, "userId");
        const badgeId = queryString(req, "badgeId");
        if (!userId || !badgeId) {
          res.status(BAD_REQUEST).json({
            error: "query params userId and badgeId required",
          });
          return;
        }
        const possesses = await repo.get(userId, badgeId);
        if (!possesses) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(possesses);
      } catch (err: unknown) {
        sendInternalError(res, "GET /possesses error", err);
      }
    },
  };
}
