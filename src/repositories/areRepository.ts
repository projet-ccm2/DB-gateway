import { database, areDTO } from '../database/database'

export class areRepository {
  constructor(private db: database) {}

  async get(userId: string, chanelId: string): Promise<areDTO | null> {
    return this.db.getAre(userId, chanelId)
  }

  async add(userId: string, chanelId: string, userType: string): Promise<areDTO> {
    return this.db.addAre({ userId, chanelId, userType })
  }
}
