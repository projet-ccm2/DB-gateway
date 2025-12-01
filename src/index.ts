// Gateway entry: factories to create mock or Prisma-backed gateway instances
import { mockDatabase } from "./database/mockDatabase";
import { prismaDatabase } from "./database/prismaDatabase";
import { userRepository } from "./repositories/userRepository";

export function createMockGateway() {
  const db = new mockDatabase();
  const repo = new userRepository(db);
  return { db, repo };
}

export function createPrismaGateway() {
  const db = new prismaDatabase();
  const repo = new userRepository(db);
  return { db, repo };
}

export default { createMockGateway, createPrismaGateway };
