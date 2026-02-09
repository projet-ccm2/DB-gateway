import { logger } from "../../../utils/logger";

test("logger exports a logger object", () => {
  expect(typeof logger).toBe("object");
  logger.info("test");
  logger.debug && logger.debug("dbg");
});
