import { userRepository } from "../repositories/userRepository";
import type { userDTO } from "../database/database";

export class UserService {
  constructor(private repo: userRepository) {}

  async getUserById(id: string): Promise<userDTO | null> {
    return this.repo.getUserById(id);
  }

  async addUser(username: string): Promise<userDTO> {
    return this.repo.addUser(username);
  }
}
