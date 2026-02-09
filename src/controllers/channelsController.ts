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
        const { name } = req.body as { name?: string };
        if (!name) {
          res.status(BAD_REQUEST).json({ error: "name required" });
          return;
        }
        const channel = await channelRepo.addChannel(name);
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

    getUsersByChannelId: async (req: Request, res: Response): Promise<void> => {
      try {
        const users = await userRepo.getUsersByChannelId(paramId(req, "id"));
        res.json(users);
      } catch (err: unknown) {
        sendInternalError(res, "GET /channels/:id/users error", err);
      }
    },
  };
}
