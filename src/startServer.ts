import { createApp } from "./server";
import { createPrismaGateway } from "./index";
import { config } from "./config/environment";
import { logger } from "./utils/logger";

const { db, repo } = createPrismaGateway();
const app = createApp({ repo });

const server = app.listen(config.port, () => {
  logger.info(`Server listening on http://localhost:${config.port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down...");
  await db.disconnect?.();
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});
