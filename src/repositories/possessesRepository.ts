import { database, possessesDTO } from '../database/database'

export class possessesRepository {
  constructor(private db: database) {}

  async get(userId: string, badgeId: string): Promise<possessesDTO | null> {
    return this.db.getPossesses(userId, badgeId)
  }

  async add(userId: string, badgeId: string, aquiredDate: string): Promise<possessesDTO> {
    return this.db.addPossesses({ userId, badgeId, aquiredDate })
  }
}
