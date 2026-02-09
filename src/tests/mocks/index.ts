import type { Gateway } from "../../index";
import { MockDatabase } from "./mockDatabase";

export function createMockGateway(): Gateway {
  return { db: new MockDatabase() };
}

export { MockDatabase } from "./mockDatabase";
