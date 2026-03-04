import { Database, areDTO } from "../database/database";

export class AreRepository {
  constructor(private readonly db: Database) {}

  async get(userId: string, channelId: string): Promise<areDTO | null> {
    return this.db.getAre(userId, channelId);
  }

  async getByUserId(userId: string): Promise<areDTO[]> {
    return this.db.getAreByUserId(userId);
  }

  async getByChannelId(channelId: string): Promise<areDTO[]> {
    return this.db.getAreByChannelId(channelId);
  }

  async add(
    userId: string,
    channelId: string,
    userType: string,
  ): Promise<areDTO> {
    return this.db.addAre({ userId, channelId, userType });
  }

  async update(
    userId: string,
    channelId: string,
    data: { userType?: string },
  ): Promise<areDTO | null> {
    return this.db.updateAre(userId, channelId, data);
  }

  async delete(userId: string, channelId: string): Promise<boolean> {
    return this.db.deleteAre(userId, channelId);
  }
}
