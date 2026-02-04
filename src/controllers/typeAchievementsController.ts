import { Request, Response } from "express";
import type { TypeAchievementRepository } from "../repositories/typeAchievementRepository";
import {
  BAD_REQUEST,
  NOT_FOUND,
  paramId,
  sendInternalError,
} from "./helpers";

export function createTypeAchievementsController(
  repo: TypeAchievementRepository,
) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const { label, data } = req.body as { label?: string; data?: string };
        if (!label || !data) {
          res.status(BAD_REQUEST).json({ error: "label and data required" });
          return;
        }
        const typeAchievement = await repo.add(label, data);
        res.status(201).json(typeAchievement);
      } catch (err: unknown) {
        sendInternalError(res, "POST /type-achievements error", err);
      }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      try {
        const typeAchievement = await repo.getById(paramId(req, "id"));
        if (!typeAchievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(typeAchievement);
      } catch (err: unknown) {
        sendInternalError(res, "GET /type-achievements/:id error", err);
      }
    },
  };
}
