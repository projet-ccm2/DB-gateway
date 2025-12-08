import { database, possessesDTO } from "../database/database";

export class PossessesRepository {
  constructor(private db: database) {}

  async get(userId: string, badgeId: string): Promise<possessesDTO | null> {
    return this.db.getPossesses(userId, badgeId);
  }

  async add(
    userId: string,
    badgeId: string,
    acquiredDate: string,
  ): Promise<possessesDTO> {
    return this.db.addPossesses({ userId, badgeId, acquiredDate });
  }
}
