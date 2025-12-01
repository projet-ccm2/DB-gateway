import { logger } from "../../utils/logger";

test("logger exports a logger object", () => {
  expect(typeof logger).toBe("object");
  // ensure calling logger methods doesn't throw
  logger.info("test");
  logger.debug && logger.debug("dbg");
});
