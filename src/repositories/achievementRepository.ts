import { Database, achievementDTO } from "../database/database";

export class AchievementRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<achievementDTO | null> {
    return this.db.getAchievementById(id);
  }

  async add(a: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    channelId: string;
  }): Promise<achievementDTO> {
    return this.db.addAchievement(a);
  }
}
