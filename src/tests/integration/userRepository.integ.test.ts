import { prismaDatabase } from "../../database/prismaDatabase";
import { userRepository } from "../../repositories/userRepository";
import dotenv from "dotenv";
dotenv.config();

describe("UserRepository (integration: Prisma + MySQL)", () => {
  const db = new prismaDatabase();
  const service = new userRepository(db);

  afterAll(async () => {
    await (db as any).prisma?.$disconnect();
  });

  it("should add and read a user from real MySQL via Prisma", async () => {
    const u = await service.addUser("IntegrationUser");
    const fetched = await service.getUserById(u.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.username).toBe("IntegrationUser");
  });
});
