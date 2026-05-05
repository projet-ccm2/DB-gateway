import {
  Database,
  achievementDTO,
  achievementWithTypeDTO,
  achievementWithTypeAndAchievedDTO,
  leaderboardEntryDTO,
} from "../database/database";

export class AchievementRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<achievementDTO | null> {
    return this.db.getAchievementById(id);
  }

  async getPublic(): Promise<achievementWithTypeDTO[]> {
    return this.db.getPublicAchievements();
  }

  async getDefinitionsByUserId(
    userId: string,
  ): Promise<achievementWithTypeAndAchievedDTO[]> {
    return this.db.getAchievementDefinitionsByUserId(userId);
  }

  async getByChannelId(channelId: string): Promise<achievementWithTypeDTO[]> {
    return this.db.getAchievementsByChannelId(channelId);
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      goal?: number;
      reward?: number;
      label?: string;
      public?: boolean;
      active?: boolean;
      secret?: boolean;
      image?: string;
      typeId?: string;
    },
  ): Promise<achievementDTO | null> {
    return this.db.updateAchievement(id, data);
  }

  async delete(id: string): Promise<achievementDTO | null> {
    return this.db.deleteAchievement(id);
  }

  async activate(id: string): Promise<achievementDTO | null> {
    return this.db.updateAchievementActive(id, true);
  }

  async deactivate(id: string): Promise<achievementDTO | null> {
    return this.db.updateAchievementActive(id, false);
  }

  async makePublic(id: string): Promise<achievementDTO | null> {
    return this.db.updateAchievementPublic(id, true);
  }

  async makePrivate(id: string): Promise<achievementDTO | null> {
    return this.db.updateAchievementPublic(id, false);
  }

  async getLeaderboard(
    channelId: string,
    limit: number,
    sort: "xp" | "completed",
  ): Promise<leaderboardEntryDTO[]> {
    return this.db.getLeaderboardByChannelId(channelId, limit, sort);
  }

  async add(achievement: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    public: boolean;
    active: boolean;
    secret: boolean;
    image: string;
    channelId?: string | null;
    typeId: string;
  }): Promise<achievementDTO | null> {
    return this.db.addAchievement(achievement);
  }
}
