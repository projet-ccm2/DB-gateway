import { Database, channelDTO, badgeDTO } from "../database/database";

export class ChannelRepository {
  constructor(private readonly db: Database) {}

  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.db.getChannelById(id);
  }

  async getBadgeByChannelId(channelId: string): Promise<badgeDTO | null> {
    return this.db.getBadgeByChannelId(channelId);
  }

  async addChannel(
    id: string,
    name: string,
    discordWebhookUrl?: string | null,
  ): Promise<channelDTO> {
    return this.db.addChannel({ id, name, discordWebhookUrl });
  }

  async updateChannel(
    id: string,
    data: { name?: string; discordWebhookUrl?: string | null },
  ): Promise<channelDTO | null> {
    return this.db.updateChannel(id, data);
  }
}
