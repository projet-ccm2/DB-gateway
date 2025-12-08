import { database, userDTO } from "../database/database";

export class UserRepository {
  constructor(private db: database) {}

  async getUserById(id: string): Promise<userDTO | null> {
    return this.db.getUserById(id);
  }

  async addUser(username: string): Promise<userDTO> {
    return this.db.addUser(username);
  }
}
