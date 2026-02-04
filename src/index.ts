import express from "express";
import type { Database } from "./database/database";
import { PrismaDatabase } from "./database/prismaDatabase";
import { mountRoutes } from "./routes";
import { config } from "./config/environment";
import { logger } from "./utils/logger";

export interface Gateway {
  db: Database;
}

export function createPrismaGateway(): Gateway {
  const db = new PrismaDatabase(
    config.databaseUrl || undefined,
  );
  return { db };
}

export function createApp(db: Database): express.Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  mountRoutes(app, db);
  return app;
}

function main(): void {
  const { db } = createPrismaGateway();
  const app = createApp(db);
  const server = app.listen(config.port, () => {
    logger.info(`Server listening on http://localhost:${config.port}`);
  });

  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, shutting down...");
    if ("disconnect" in db && typeof db.disconnect === "function") {
      await db.disconnect();
    }
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  });
}

if (require.main === module) {
  main();
}
