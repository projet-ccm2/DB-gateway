import { database, channelDTO } from "../database/database";

export class ChannelRepository {
  constructor(private db: database) {}

  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.db.getChannelById(id);
  }

  async addChannel(name: string): Promise<channelDTO> {
    return this.db.addChannel({ name });
  }
}
