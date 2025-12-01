import { database, achievementDTO } from '../database/database'

export class achievementRepository {
  constructor(private db: database) {}

  async getById(id: string): Promise<achievementDTO | null> {
    return this.db.getAchievementById(id)
  }

  async add(a: {
    title: string
    description: string
    goal: number
    reward: number
    label: string
  }): Promise<achievementDTO> {
    return this.db.addAchievement(a)
  }
}
