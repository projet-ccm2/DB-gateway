import { database, areDTO } from "../database/database";

export class AreRepository {
  constructor(private db: database) {}

  async get(userId: string, channelId: string): Promise<areDTO | null> {
    return this.db.getAre(userId, channelId);
  }

  async add(
    userId: string,
    channelId: string,
    userType: string,
  ): Promise<areDTO> {
    return this.db.addAre({ userId, channelId, userType });
  }
}
