import { Database, typeAchievementDTO } from "../database/database";

export class TypeAchievementRepository {
  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<typeAchievementDTO | null> {
    return this.db.getTypeAchievementById(id);
  }

  async add(label: string, data: string): Promise<typeAchievementDTO> {
    return this.db.addTypeAchievement({ label, data });
  }
}
