// Gateway entry: factories to create mock or Prisma-backed gateway instances
import { MockDatabase } from "./database/mockDatabase";
import { PrismaDatabase } from "./database/prismaDatabase";
import { UserRepository } from "./repositories/userRepository";

export function createMockGateway() {
  const db = new MockDatabase();
  const repo = new UserRepository(db);
  return { db, repo };
}

export function createPrismaGateway() {
  const db = new PrismaDatabase();
  const repo = new UserRepository(db);
  return { db, repo };
}

export default { createMockGateway, createPrismaGateway };
