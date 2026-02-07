import { Request, Response } from "express";
import type { AchievedRepository } from "../repositories/achievedRepository";
import {
  BAD_REQUEST,
  NOT_FOUND,
  queryString,
  sendInternalError,
} from "./helpers";

export function createAchievedController(repo: AchievedRepository) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body as {
          achievementId?: string;
          userId?: string;
          count?: number;
          finished?: boolean;
          labelActive?: boolean;
          acquiredDate?: string;
        };
        const {
          achievementId,
          userId,
          count,
          finished,
          labelActive,
          acquiredDate,
        } = body;
        if (
          !achievementId ||
          !userId ||
          count == null ||
          finished == null ||
          labelActive == null ||
          !acquiredDate
        ) {
          res.status(BAD_REQUEST).json({
            error:
              "achievementId, userId, count, finished, labelActive, acquiredDate required",
          });
          return;
        }
        const achieved = await repo.add({
          achievementId,
          userId,
          count: Number(count),
          finished: Boolean(finished),
          labelActive: Boolean(labelActive),
          acquiredDate,
        });
        res.status(201).json(achieved);
      } catch (err: unknown) {
        sendInternalError(res, "POST /achieved error", err);
      }
    },

    get: async (req: Request, res: Response): Promise<void> => {
      try {
        const achievementId = queryString(req, "achievementId");
        const userId = queryString(req, "userId");
        if (!achievementId || !userId) {
          res.status(BAD_REQUEST).json({
            error: "query params achievementId and userId required",
          });
          return;
        }
        const achieved = await repo.get(achievementId, userId);
        if (!achieved) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achieved);
      } catch (err: unknown) {
        sendInternalError(res, "GET /achieved error", err);
      }
    },

    update: async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body as {
          achievementId?: string;
          userId?: string;
          count?: number;
          finished?: boolean;
          labelActive?: boolean;
          acquiredDate?: string;
        };
        const {
          achievementId,
          userId,
          count,
          finished,
          labelActive,
          acquiredDate,
        } = body;
        if (
          !achievementId ||
          !userId ||
          count == null ||
          finished == null ||
          labelActive == null ||
          !acquiredDate
        ) {
          res.status(BAD_REQUEST).json({
            error:
              "achievementId, userId, count, finished, labelActive, acquiredDate required",
          });
          return;
        }
        const achieved = await repo.update({
          achievementId,
          userId,
          count: Number(count),
          finished: Boolean(finished),
          labelActive: Boolean(labelActive),
          acquiredDate,
        });
        if (!achieved) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achieved);
      } catch (err: unknown) {
        sendInternalError(res, "PUT /achieved error", err);
      }
    },
  };
}
