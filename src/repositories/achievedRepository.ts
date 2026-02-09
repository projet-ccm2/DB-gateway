import { Database, achievedDTO } from "../database/database";

export class AchievedRepository {
  constructor(private readonly db: Database) {}

  async get(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null> {
    return this.db.getAchieved(achievementId, userId);
  }

  async add(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO> {
    return this.db.addAchieved(payload);
  }

  async update(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO | null> {
    return this.db.updateAchieved(payload);
  }
}
