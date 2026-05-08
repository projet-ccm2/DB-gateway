import { Database, badgeDTO, badgeWithChannelDTO } from "../database/database";

export class BadgeRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<badgeDTO | null> {
    return this.db.getBadgeById(id);
  }

  async getByChannelId(channelId: string): Promise<badgeWithChannelDTO | null> {
    return this.db.getBadgeWithChannelByChannelId(channelId);
  }

  async add(
    title: string,
    img: string,
    channelId: string,
  ): Promise<badgeDTO | null> {
    return this.db.addBadge({ title, img, channelId });
  }
}
