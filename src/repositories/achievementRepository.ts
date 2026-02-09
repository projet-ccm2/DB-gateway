import {
  Database,
  achievementDTO,
  achievementWithTypeDTO,
} from "../database/database";

export class AchievementRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<achievementDTO | null> {
    return this.db.getAchievementById(id);
  }

  async getByChannelId(channelId: string): Promise<achievementWithTypeDTO[]> {
    return this.db.getAchievementsByChannelId(channelId);
  }

  async add(achievement: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    channelId?: string | null;
  }): Promise<achievementDTO> {
    return this.db.addAchievement(achievement);
  }
}
