import { PrismaDatabase } from "../../database/prismaDatabase";
import { UserRepository } from "../../repositories/userRepository";

describe("UserRepository (integration: Prisma + MySQL)", () => {
  const db = new PrismaDatabase();
  const service = new UserRepository(db);

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
