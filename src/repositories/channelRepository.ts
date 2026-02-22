import { Database, channelDTO } from "../database/database";

export class ChannelRepository {
  constructor(private readonly db: Database) {}

  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.db.getChannelById(id);
  }

  async addChannel(id: string, name: string): Promise<channelDTO> {
    return this.db.addChannel({ id, name });
  }

  async updateChannel(
    id: string,
    data: { name?: string },
  ): Promise<channelDTO | null> {
    return this.db.updateChannel(id, data);
  }
}
