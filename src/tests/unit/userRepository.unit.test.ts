import { UserRepository } from "../../repositories/userRepository";
import { MockDatabase } from "../../database/mockDatabase";

describe("userRepository (unit, mock db)", () => {
  it("should create and read a user using mockDatabase", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const created = await service.addUser("Bob");
    expect(created).toHaveProperty("id");
    expect(created.username).toBe("Bob");

    const fetched = await service.getUserById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.username).toBe("Bob");
  });

  it("adding same email updates name", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const a = await service.addUser("Bobby");
    const b = await service.addUser("Robert");

    expect(a.id).not.toBe(b.id);
    expect(b.username).toBe("Robert");
  });
});
