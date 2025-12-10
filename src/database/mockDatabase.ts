import {
  database,
  userDTO,
  channelDTO,
  userChannelDTO,
  channelUserDTO,
  typeAchievementDTO,
  achievementDTO,
  badgeDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "./database";
import { randomUUID } from "crypto";

export class MockDatabase implements database {
  private users: userDTO[] = [];
  private channels: channelDTO[] = [];
  private types: typeAchievementDTO[] = [];
  private achievements: achievementDTO[] = [];
  private badges: badgeDTO[] = [];
  private achieved: achievedDTO[] = [];
  private are: areDTO[] = [];
  private possesses: possessesDTO[] = [];

  // User
  async getUserById(id: string): Promise<userDTO | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async addUser(user: {
    username: string;
    twitchUserId: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO> {
    const newUser: userDTO = {
      id: randomUUID(),
      username: user.username,
      twitchUserId: user.twitchUserId,
      profileImageUrl: user.profileImageUrl ?? null,
      channelDescription: user.channelDescription ?? null,
      scope: user.scope ?? null,
    };
    this.users.push(newUser);
    return newUser;
  }

  // Channel
  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.channels.find((c) => c.id === id) ?? null;
  }

  async addChannel(channel: { name: string }): Promise<channelDTO> {
    const newC: channelDTO = { id: randomUUID(), name: channel.name };
    this.channels.push(newC);
    return newC;
  }

  // TypeAchievement
  async getTypeAchievementById(id: string): Promise<typeAchievementDTO | null> {
    return this.types.find((t) => t.id === id) ?? null;
  }

  async addTypeAchievement(t: {
    label: string;
    data: string;
  }): Promise<typeAchievementDTO> {
    const nt: typeAchievementDTO = {
      id: randomUUID(),
      label: t.label,
      data: t.data,
    };
    this.types.push(nt);
    return nt;
  }

  // Achievement
  async getAchievementById(id: string): Promise<achievementDTO | null> {
    return this.achievements.find((a) => a.id === id) ?? null;
  }

  async addAchievement(a: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
  }): Promise<achievementDTO> {
    const na: achievementDTO = {
      id: randomUUID(),
      title: a.title,
      description: a.description,
      goal: a.goal,
      reward: a.reward,
      label: a.label,
    };
    this.achievements.push(na);
    return na;
  }

  // Badge
  async getBadgeById(id: string): Promise<badgeDTO | null> {
    return this.badges.find((b) => b.id === id) ?? null;
  }

  async addBadge(b: { title: string; img: string }): Promise<badgeDTO> {
    const nb: badgeDTO = { id: randomUUID(), title: b.title, img: b.img };
    this.badges.push(nb);
    return nb;
  }

  // Achieved
  async getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null> {
    return (
      this.achieved.find(
        (x) => x.achievementId === achievementId && x.userId === userId,
      ) ?? null
    );
  }

  async addAchieved(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO> {
    const na: achievedDTO = {
      achievementId: a.achievementId,
      userId: a.userId,
      count: a.count,
      finished: a.finished,
      labelActive: a.labelActive,
      acquiredDate: a.acquiredDate,
    };
    this.achieved.push(na);
    return na;
  }

  // Are
  async getAre(userId: string, channelId: string): Promise<areDTO | null> {
    return (
      this.are.find((x) => x.userId === userId && x.channelId === channelId) ??
      null
    );
  }

  async addAre(a: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO> {
    const na: areDTO = {
      userId: a.userId,
      channelId: a.channelId,
      userType: a.userType,
    };
    this.are.push(na);
    return na;
  }

  // Possesses
  async getPossesses(
    userId: string,
    badgeId: string,
  ): Promise<possessesDTO | null> {
    return (
      this.possesses.find(
        (x) => x.userId === userId && x.badgeId === badgeId,
      ) ?? null
    );
  }

  async addPossesses(p: {
    userId: string;
    badgeId: string;
    acquiredDate: string;
  }): Promise<possessesDTO> {
    const np: possessesDTO = {
      userId: p.userId,
      badgeId: p.badgeId,
      acquiredDate: p.acquiredDate,
    };
    this.possesses.push(np);
    return np;
  }

  // ============ NEW: Get by User ID ============

  async getChannelsByUserId(userId: string): Promise<userChannelDTO[]> {
    // Find all Are records for this user, then return corresponding channels with userType
    const userAreRecords = this.are.filter((a) => a.userId === userId);
    return userAreRecords
      .map((areRecord) => {
        const channel = this.channels.find((c) => c.id === areRecord.channelId);
        if (!channel) return null;
        return {
          id: channel.id,
          name: channel.name,
          userType: areRecord.userType,
        };
      })
      .filter((c): c is userChannelDTO => c !== null);
  }

  async getBadgesByUserId(userId: string): Promise<badgeDTO[]> {
    // Find all Possesses records for this user, then return corresponding badges
    const userBadgeIds = this.possesses
      .filter((p) => p.userId === userId)
      .map((p) => p.badgeId);
    return this.badges.filter((b) => userBadgeIds.includes(b.id));
  }

  async getAchievementsByUserId(userId: string): Promise<achievedDTO[]> {
    // Return all Achieved records for this user
    return this.achieved.filter((a) => a.userId === userId);
  }

  // ============ NEW: Inverse lookups (get users by entity) ============

  async getUsersByChannelId(channelId: string): Promise<channelUserDTO[]> {
    // Find all Are records for this channel, then return corresponding users with userType
    return this.are
      .filter((a) => a.channelId === channelId)
      .map((a) => {
        const user = this.users.find((u) => u.id === a.userId);
        return {
          id: user!.id,
          username: user!.username,
          twitchUserId: user!.twitchUserId,
          profileImageUrl: user!.profileImageUrl,
          channelDescription: user!.channelDescription,
          scope: user!.scope,
          userType: a.userType,
        };
      });
  }

  async getUsersByBadgeId(badgeId: string): Promise<userDTO[]> {
    // Find all Possesses records for this badge, then return corresponding users
    const badgeUserIds = this.possesses
      .filter((p) => p.badgeId === badgeId)
      .map((p) => p.userId);
    return this.users.filter((u) => badgeUserIds.includes(u.id));
  }

  async getUsersByAchievementId(achievementId: string): Promise<userDTO[]> {
    // Find all Achieved records for this achievement, then return corresponding users
    const achievementUserIds = this.achieved
      .filter((a) => a.achievementId === achievementId)
      .map((a) => a.userId);
    return this.users.filter((u) => achievementUserIds.includes(u.id));
  }
}
