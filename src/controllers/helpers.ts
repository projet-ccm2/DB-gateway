import { Request, Response } from "express";
import { logger } from "../utils/logger";

export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
export const INTERNAL_ERROR = 500;
export const SERVICE_UNAVAILABLE = 503;

export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function paramId(req: Request, name: string): string {
  const p = req.params[name];
  return Array.isArray(p) ? p[0] ?? "" : (p ?? "");
}

export function queryString(
  req: Request,
  name: string,
): string | undefined {
  const q = req.query[name];
  if (q == null) return undefined;
  if (Array.isArray(q)) {
    const first = q[0];
    return typeof first === "string" ? first : undefined;
  }
  return typeof q === "string" ? q : undefined;
}

export function sendInternalError(
  res: Response,
  logContext: string,
  err: unknown,
): void {
  logger.error(logContext, { error: err });
  res.status(INTERNAL_ERROR).json({ error: "Internal server error" });
}
