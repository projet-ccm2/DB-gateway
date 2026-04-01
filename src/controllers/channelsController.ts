import { Request, Response } from "express";
import type { ChannelRepository } from "../repositories/channelRepository";
import type { UserRepository } from "../repositories/userRepository";
import { BAD_REQUEST, NOT_FOUND, paramId, sendInternalError } from "./helpers";

export function createChannelsController(
  channelRepo: ChannelRepository,
  userRepo: UserRepository,
) {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      try {
        const { id, name, discordWebhookUrl } = req.body as {
          id?: string;
          name?: string;
          discordWebhookUrl?: string | null;
        };
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "id required" });
          return;
        }
        if (!name) {
          res.status(BAD_REQUEST).json({ error: "name required" });
          return;
        }
        const channel = await channelRepo.addChannel(
          id,
          name,
          discordWebhookUrl,
        );
        res.status(201).json(channel);
      } catch (err: unknown) {
        sendInternalError(res, "POST /channels error", err);
      }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      try {
        const channel = await channelRepo.getChannelById(paramId(req, "id"));
        if (!channel) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(channel);
      } catch (err: unknown) {
        sendInternalError(res, "GET /channels/:id error", err);
      }
    },

    update: async (req: Request, res: Response): Promise<void> => {
      try {
        const { name, discordWebhookUrl } = req.body as {
          name?: string;
          discordWebhookUrl?: string | null;
        };
        const channel = await channelRepo.updateChannel(paramId(req, "id"), {
          name,
          discordWebhookUrl:
            req.body.discordWebhookUrl === undefined
              ? undefined
              : (discordWebhookUrl ?? null),
        });
        if (!channel) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(channel);
      } catch (err: unknown) {
        sendInternalError(res, "PUT /channels/:id error", err);
      }
    },

    getUsersByChannelId: async (req: Request, res: Response): Promise<void> => {
      try {
        const users = await userRepo.getUsersByChannelId(paramId(req, "id"));
        res.json(users);
      } catch (err: unknown) {
        sendInternalError(res, "GET /channels/:id/users error", err);
      }
    },

    getBadgeByChannelId: async (req: Request, res: Response): Promise<void> => {
      try {
        const badge = await channelRepo.getBadgeByChannelId(paramId(req, "id"));
        if (!badge) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(badge);
      } catch (err: unknown) {
        sendInternalError(res, "GET /channels/:id/badge error", err);
      }
    },
  };
}
