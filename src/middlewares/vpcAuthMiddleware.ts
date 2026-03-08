import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { Config } from "../config/environment";

const VPC_AUDIENCE = "vpc-db-gateway";

export function extractVpcToken(req: Request): string | null {
  const vpcToken = req.headers["x-vpc-token"] as string;
  if (vpcToken) return vpcToken;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  return null;
}

export function vpcAuthMiddleware(config: Config) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { nodeEnv, jwtSecret } = config;

    if (nodeEnv === "development" || nodeEnv === "test") {
      next();
      return;
    }

    if (req.originalUrl.startsWith("/health")) {
      next();
      return;
    }

    const token = extractVpcToken(req);
    if (!token) {
      res.status(401).json({ error: "Missing or invalid VPC token" });
      return;
    }

    try {
      jwt.verify(token, jwtSecret, { audience: VPC_AUDIENCE });
      next();
    } catch {
      res.status(401).json({ error: "Missing or invalid VPC token" });
    }
  };
}
