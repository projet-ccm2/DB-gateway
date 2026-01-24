import app from "./server";
import { config } from "./config/environment";
import { logger } from "./utils/logger";

app.listen(config.port, () => {
  logger.info(`Server listening on http://localhost:${config.port}`);
});
