import { database, chanelDTO } from "../database/database";

export class chanelRepository {
  constructor(private db: database) {}

  async getChanelById(id: string): Promise<chanelDTO | null> {
    return this.db.getChanelById(id);
  }

  async addChanel(name: string): Promise<chanelDTO> {
    return this.db.addChanel({ name });
  }
}
