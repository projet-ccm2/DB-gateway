import { Request, Response } from "express";
import type { UserRepository } from "../repositories/userRepository";
import { BAD_REQUEST, NOT_FOUND, paramId, sendInternalError } from "./helpers";

export function createUsersController(repo: UserRepository) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body as {
          id?: string;
          username?: string;
          profileImageUrl?: string | null;
          channelDescription?: string | null;
          scope?: string | null;
        };
        const { id, username, profileImageUrl, channelDescription, scope } =
          body;
        if (!username || !id) {
          res.status(BAD_REQUEST).json({
            error: "username and userId required",
          });
          return;
        }
        const user = await repo.addUser({
          id,
          username,
          profileImageUrl: profileImageUrl ?? null,
          channelDescription: channelDescription ?? null,
          scope: scope ?? null,
        });
        res.status(201).json(user);
      } catch (err: unknown) {
        sendInternalError(res, "POST /users error", err);
      }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      try {
        const user = await repo.getUserById(paramId(req, "id"));
        if (!user) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(user);
      } catch (err: unknown) {
        sendInternalError(res, "GET /users/:id error", err);
      }
    },

    getChannelsByUserId: async (req: Request, res: Response): Promise<void> => {
      try {
        const channels = await repo.getChannelsByUserId(paramId(req, "id"));
        res.json(channels);
      } catch (err: unknown) {
        sendInternalError(res, "GET /users/:id/channels error", err);
      }
    },

    getBadgesByUserId: async (req: Request, res: Response): Promise<void> => {
      try {
        const badges = await repo.getBadgesByUserId(paramId(req, "id"));
        res.json(badges);
      } catch (err: unknown) {
        sendInternalError(res, "GET /users/:id/badges error", err);
      }
    },

    getAchievementsByUserId: async (
      req: Request,
      res: Response,
    ): Promise<void> => {
      try {
        const achievements = await repo.getAchievementsByUserId(
          paramId(req, "id"),
        );
        res.json(achievements);
      } catch (err: unknown) {
        sendInternalError(res, "GET /users/:id/achievements error", err);
      }
    },
  };
}
