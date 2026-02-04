import { Request, Response } from "express";
import type { Database } from "../database/database";
import {
  INTERNAL_ERROR,
  SERVICE_UNAVAILABLE,
  getErrorMessage,
} from "./helpers";

export function createHealthController(db: Database) {
  return {
    get: async (_req: Request, res: Response): Promise<void> => {
      try {
        const dbOk = await db.healthCheck();
        if (dbOk) {
          res.status(200).json({ status: "ok", db: "up" });
        } else {
          res
            .status(SERVICE_UNAVAILABLE)
            .json({ status: "degraded", db: "down" });
        }
      } catch (err: unknown) {
        res
          .status(INTERNAL_ERROR)
          .json({ status: "error", db: "error", error: getErrorMessage(err) });
      }
    },
  };
}
