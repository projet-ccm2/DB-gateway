import { Request, Response } from "express";
import type { BadgeRepository } from "../repositories/badgeRepository";
import type { UserRepository } from "../repositories/userRepository";
import {
  BAD_REQUEST,
  CONFLICT,
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
        const { title, img, channelId } = req.body as {
          title?: string;
          img?: string;
          channelId?: string;
        };
        if (!title || !img || !channelId) {
          res
            .status(BAD_REQUEST)
            .json({ error: "title, img and channelId required" });
          return;
        }
        const badge = await badgeRepo.add(title, img, channelId);
        if (!badge) {
          res.status(NOT_FOUND).json({ error: "channelId not found" });
          return;
        }
        res.status(201).json(badge);
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          "code" in err &&
          (err as { code: string }).code === "P2002"
        ) {
          res
            .status(CONFLICT)
            .json({ error: "badge already exists for channel" });
          return;
        }
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

    getByChannelId: async (req: Request, res: Response): Promise<void> => {
      try {
        const badge = await badgeRepo.getByChannelId(paramId(req, "channelId"));
        if (!badge) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(badge);
      } catch (err: unknown) {
        sendInternalError(res, "GET /badges/channel/:channelId error", err);
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
