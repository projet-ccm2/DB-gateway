import { database, typeAchievementDTO } from "../database/database";

export class TypeAchievementRepository {
  constructor(private db: database) {}

  async getById(id: string): Promise<typeAchievementDTO | null> {
    return this.db.getTypeAchievementById(id);
  }

  async add(label: string, data: string): Promise<typeAchievementDTO> {
    return this.db.addTypeAchievement({ label, data });
  }
}
