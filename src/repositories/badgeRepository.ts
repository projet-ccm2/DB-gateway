import { Database, badgeDTO } from "../database/database";

export class BadgeRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<badgeDTO | null> {
    return this.db.getBadgeById(id);
  }

  async add(title: string, img: string): Promise<badgeDTO> {
    return this.db.addBadge({ title, img });
  }
}
