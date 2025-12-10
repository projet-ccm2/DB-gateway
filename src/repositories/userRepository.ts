import {
  database,
  userDTO,
  userChannelDTO,
  channelUserDTO,
  badgeDTO,
  achievedDTO,
} from "../database/database";

export class UserRepository {
  constructor(private db: database) {}

  async getUserById(id: string): Promise<userDTO | null> {
    return this.db.getUserById(id);
  }

  async addUser(user: {
    username: string;
    twitchUserId: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO> {
    return this.db.addUser(user);
  }

  // ============ NEW: Get related entities by User ID ============

  async getChannelsByUserId(userId: string): Promise<userChannelDTO[]> {
    return this.db.getChannelsByUserId(userId);
  }

  async getBadgesByUserId(userId: string): Promise<badgeDTO[]> {
    return this.db.getBadgesByUserId(userId);
  }

  async getAchievementsByUserId(userId: string): Promise<achievedDTO[]> {
    return this.db.getAchievementsByUserId(userId);
  }

  // ============ NEW: Inverse lookups (get users by entity) ============

  async getUsersByChannelId(channelId: string): Promise<channelUserDTO[]> {
    return this.db.getUsersByChannelId(channelId);
  }

  async getUsersByBadgeId(badgeId: string): Promise<userDTO[]> {
    return this.db.getUsersByBadgeId(badgeId);
  }

  async getUsersByAchievementId(achievementId: string): Promise<userDTO[]> {
    return this.db.getUsersByAchievementId(achievementId);
  }
}
