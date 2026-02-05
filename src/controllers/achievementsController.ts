import { Request, Response } from "express";
import type { AchievementRepository } from "../repositories/achievementRepository";
import type { UserRepository } from "../repositories/userRepository";
import { BAD_REQUEST, NOT_FOUND, paramId, sendInternalError } from "./helpers";

export function createAchievementsController(
  achievementRepo: AchievementRepository,
  userRepo: UserRepository,
) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body as {
          title?: string;
          description?: string;
          goal?: number;
          reward?: number;
          label?: string;
          channelId?: string | null;
        };
        const { title, description, goal, reward, label, channelId } = body;
        if (
          title == null ||
          description == null ||
          goal == null ||
          reward == null ||
          label == null
        ) {
          res.status(BAD_REQUEST).json({
            error: "title, description, goal, reward, label required",
          });
          return;
        }
        const achievement = await achievementRepo.add({
          title,
          description,
          goal: Number(goal),
          reward: Number(reward),
          label,
          channelId: channelId ?? null,
        });
        res.status(201).json(achievement);
      } catch (err: unknown) {
        sendInternalError(res, "POST /achievements error", err);
      }
    },

    getByChannelId: async (req: Request, res: Response): Promise<void> => {
      try {
        const channelId = paramId(req, "channelId");
        if (!channelId) {
          res.status(BAD_REQUEST).json({ error: "channelId required" });
          return;
        }
        const list = await achievementRepo.getByChannelId(channelId);
        res.json(list);
      } catch (err: unknown) {
        sendInternalError(res, "GET /achievements/channel/:channelId error", err);
      }
    },

    getAchievementsByUserAndChannel: async (
      req: Request,
      res: Response,
    ): Promise<void> => {
      try {
        const userId = paramId(req, "userId");
        const channelId = paramId(req, "channelId");
        if (!userId || !channelId) {
          res.status(BAD_REQUEST).json({
            error: "userId and channelId required",
          });
          return;
        }
        const data = await userRepo.getAchievementsByUserAndChannel(
          userId,
          channelId,
        );
        res.json(data);
      } catch (err: unknown) {
        sendInternalError(
          res,
          "GET /achievements/user/:userId/channel/:channelId error",
          err,
        );
      }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      try {
        const achievement = await achievementRepo.getById(paramId(req, "id"));
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(res, "GET /achievements/:id error", err);
      }
    },

    getUsersByAchievementId: async (
      req: Request,
      res: Response,
    ): Promise<void> => {
      try {
        const users = await userRepo.getUsersByAchievementId(
          paramId(req, "id"),
        );
        res.json(users);
      } catch (err: unknown) {
        sendInternalError(res, "GET /achievements/:id/users error", err);
      }
    },
  };
}
