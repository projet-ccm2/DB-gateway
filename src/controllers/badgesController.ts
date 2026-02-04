import { Request, Response } from "express";
import type { BadgeRepository } from "../repositories/badgeRepository";
import type { UserRepository } from "../repositories/userRepository";
import {
  BAD_REQUEST,
  NOT_FOUND,
  paramId,
  sendInternalError,
} from "./helpers";

export function createBadgesController(
  badgeRepo: BadgeRepository,
  userRepo: UserRepository,
) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const { title, img } = req.body as { title?: string; img?: string };
        if (!title || !img) {
          res.status(BAD_REQUEST).json({ error: "title and img required" });
          return;
        }
        const badge = await badgeRepo.add(title, img);
        res.status(201).json(badge);
      } catch (err: unknown) {
        sendInternalError(res, "POST /badges error", err);
      }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      try {
        const badge = await badgeRepo.getById(paramId(req, "id"));
        if (!badge) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(badge);
      } catch (err: unknown) {
        sendInternalError(res, "GET /badges/:id error", err);
      }
    },

    getUsersByBadgeId: async (req: Request, res: Response): Promise<void> => {
      try {
        const users = await userRepo.getUsersByBadgeId(paramId(req, "id"));
        res.json(users);
      } catch (err: unknown) {
        sendInternalError(res, "GET /badges/:id/users error", err);
      }
    },
  };
}
