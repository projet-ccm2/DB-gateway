import { database, achievedDTO } from "../database/database";

export class achievedRepository {
  constructor(private db: database) {}

  async get(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null> {
    return this.db.getAchieved(achievementId, userId);
  }

  async add(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    aquiredDate: string;
  }): Promise<achievedDTO> {
    return this.db.addAchieved(a);
  }
}
