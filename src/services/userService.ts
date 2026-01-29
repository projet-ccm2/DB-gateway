import { UserRepository } from "../repositories/userRepository";
import type {
  userDTO,
  badgeDTO,
  achievedDTO,
  userChannelDTO,
  channelUserDTO,
} from "../database/database";

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async getUserById(id: string): Promise<userDTO | null> {
    return this.repo.getUserById(id);
  }

  async addUser(user: {
    username: string;
    twitchUserId: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO> {
    return this.repo.addUser(user);
  }

  async getChannelsByUserId(userId: string): Promise<userChannelDTO[]> {
    return this.repo.getChannelsByUserId(userId);
  }

  async getBadgesByUserId(userId: string): Promise<badgeDTO[]> {
    return this.repo.getBadgesByUserId(userId);
  }

  async getAchievementsByUserId(userId: string): Promise<achievedDTO[]> {
    return this.repo.getAchievementsByUserId(userId);
  }

  async getUsersByChannelId(channelId: string): Promise<channelUserDTO[]> {
    return this.repo.getUsersByChannelId(channelId);
  }

  async getUsersByBadgeId(badgeId: string): Promise<userDTO[]> {
    return this.repo.getUsersByBadgeId(badgeId);
  }

  async getUsersByAchievementId(achievementId: string): Promise<userDTO[]> {
    return this.repo.getUsersByAchievementId(achievementId);
  }
}
