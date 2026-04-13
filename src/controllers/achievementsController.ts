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
          public?: boolean;
          active?: boolean;
          secret?: boolean;
          image?: string;
          channelId?: string | null;
          typeId?: string;
        };
        const { title, description, goal, reward, label, channelId, typeId } =
          body;
        if (
          !title ||
          !description ||
          goal == null ||
          reward == null ||
          !label ||
          typeof body.public !== "boolean" ||
          typeof body.active !== "boolean" ||
          typeof body.secret !== "boolean" ||
          !body.image ||
          !typeId
        ) {
          res.status(BAD_REQUEST).json({
            error:
              "title, description, goal, reward, label, public, active, secret, image, typeId required",
          });
          return;
        }
        const achievement = await achievementRepo.add({
          title,
          description,
          goal: Number(goal),
          reward: Number(reward),
          label,
          public: body.public,
          active: body.active,
          secret: body.secret,
          image: body.image,
          channelId: channelId ?? null,
          typeId,
        });
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "typeId not found" });
          return;
        }
        res.status(201).json(achievement);
      } catch (err: unknown) {
        sendInternalError(res, "POST /achievements error", err);
      }
    },

    update: async (req: Request, res: Response): Promise<void> => {
      try {
        const id = paramId(req, "achievementId");
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "achievementId required" });
          return;
        }
        const body = req.body as {
          title?: string;
          description?: string;
          goal?: number;
          reward?: number;
          label?: string;
          public?: boolean;
          active?: boolean;
          secret?: boolean;
          image?: string;
          typeId?: string;
        };
        const { title, description, goal, reward, label, typeId } = body;
        if (
          !title ||
          !description ||
          goal == null ||
          reward == null ||
          !label ||
          typeof body.public !== "boolean" ||
          typeof body.active !== "boolean" ||
          typeof body.secret !== "boolean" ||
          !body.image ||
          !typeId
        ) {
          res.status(BAD_REQUEST).json({
            error:
              "title, description, goal, reward, label, public, active, secret, image, typeId required",
          });
          return;
        }
        const achievement = await achievementRepo.update(id, {
          title,
          description,
          goal: Number(goal),
          reward: Number(reward),
          label,
          public: body.public,
          active: body.active,
          secret: body.secret,
          image: body.image,
          typeId,
        });
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(res, "PUT /achievements/:achievementId error", err);
      }
    },

    remove: async (req: Request, res: Response): Promise<void> => {
      try {
        const id = paramId(req, "achievementId");
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "achievementId required" });
          return;
        }
        const achievement = await achievementRepo.delete(id);
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(
          res,
          "DELETE /achievements/:achievementId error",
          err,
        );
      }
    },

    getPublic: async (_req: Request, res: Response): Promise<void> => {
      try {
        const list = await achievementRepo.getPublic();
        res.json(list);
      } catch (err: unknown) {
        sendInternalError(res, "GET /achievements/public error", err);
      }
    },

    getByUserId: async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = paramId(req, "userId");
        if (!userId) {
          res.status(BAD_REQUEST).json({ error: "userId required" });
          return;
        }
        const list = await achievementRepo.getDefinitionsByUserId(userId);
        res.json(list);
      } catch (err: unknown) {
        sendInternalError(res, "GET /achievements/user/:userId error", err);
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
        sendInternalError(
          res,
          "GET /achievements/channel/:channelId error",
          err,
        );
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

    activate: async (req: Request, res: Response): Promise<void> => {
      try {
        const id = paramId(req, "achievementId");
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "achievementId required" });
          return;
        }
        const achievement = await achievementRepo.activate(id);
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(
          res,
          "PATCH /achievements/:achievementId/activate error",
          err,
        );
      }
    },

    deactivate: async (req: Request, res: Response): Promise<void> => {
      try {
        const id = paramId(req, "achievementId");
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "achievementId required" });
          return;
        }
        const achievement = await achievementRepo.deactivate(id);
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(
          res,
          "PATCH /achievements/:achievementId/deactivate error",
          err,
        );
      }
    },

    makePublic: async (req: Request, res: Response): Promise<void> => {
      try {
        const id = paramId(req, "achievementId");
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "achievementId required" });
          return;
        }
        const achievement = await achievementRepo.makePublic(id);
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(
          res,
          "PATCH /achievements/:achievementId/public error",
          err,
        );
      }
    },

    makePrivate: async (req: Request, res: Response): Promise<void> => {
      try {
        const id = paramId(req, "achievementId");
        if (!id) {
          res.status(BAD_REQUEST).json({ error: "achievementId required" });
          return;
        }
        const achievement = await achievementRepo.makePrivate(id);
        if (!achievement) {
          res.status(NOT_FOUND).json({ error: "not found" });
          return;
        }
        res.json(achievement);
      } catch (err: unknown) {
        sendInternalError(
          res,
          "PATCH /achievements/:achievementId/private error",
          err,
        );
      }
    },
  };
}
