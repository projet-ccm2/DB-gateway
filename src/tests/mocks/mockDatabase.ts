import {
  Database,
  userDTO,
  channelDTO,
  userChannelDTO,
  channelUserDTO,
  typeAchievementDTO,
  achievementDTO,
  achievementWithTypeDTO,
  achievementWithTypeAndAchievedDTO,
  userChannelAchievementsDTO,
  badgeDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "../../database/database";
import { randomUUID } from "node:crypto";

export class MockDatabase implements Database {
  async healthCheck(): Promise<boolean> {
    return true;
  }

  async getAchievementsByChannelId(
    channelId: string,
  ): Promise<achievementWithTypeDTO[]> {
    const list = this.achievements.filter((achievement) =>
      (achievement as achievementDTO & { channelId?: string }).channelId
        ? (achievement as achievementDTO & { channelId?: string })
            .channelId === channelId
        : true,
    );
    return list.map((achievement) => ({
      ...achievement,
      typeAchievement: null as typeAchievementDTO | null,
    }));
  }

  async getAchievementsByUserAndChannel(
    userId: string,
    channelId: string,
  ): Promise<userChannelAchievementsDTO> {
    const list = this.achievements.filter((achievement) =>
      (achievement as achievementDTO & { channelId?: string }).channelId
        ? (achievement as achievementDTO & { channelId?: string })
            .channelId === channelId
        : true,
    );
    const achievements: achievementWithTypeAndAchievedDTO[] = await Promise.all(
      list.map(async (achievement) => {
        const achievedRecord = await this.getAchieved(achievement.id, userId);
        return {
          ...achievement,
          typeAchievement: null,
          achieved: achievedRecord,
        };
      }),
    );
    return { userId, channelId, achievements };
  }

  async getAchievedByUserAndChannels(
    userId: string,
    channelIds: string[],
  ): Promise<achievedDTO[]> {
    return this.achieved.filter(
      (record) =>
        record.userId === userId && (channelIds.length === 0 || true),
    );
  }
  private readonly users: userDTO[] = [];
  private readonly channels: channelDTO[] = [];
  private readonly types: typeAchievementDTO[] = [];
  private readonly achievements: achievementDTO[] = [];
  private readonly badges: badgeDTO[] = [];
  private readonly achieved: achievedDTO[] = [];
  private readonly are: areDTO[] = [];
  private readonly possesses: possessesDTO[] = [];

  async getUserById(id: string): Promise<userDTO | null> {
    return this.users.find((user) => user.id === id) ?? null;
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

  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.channels.find((channel) => channel.id === id) ?? null;
  }

  async addChannel(channel: { name: string }): Promise<channelDTO> {
    const newC: channelDTO = { id: randomUUID(), name: channel.name };
    this.channels.push(newC);
    return newC;
  }

  async getTypeAchievementById(id: string): Promise<typeAchievementDTO | null> {
    return this.types.find((type) => type.id === id) ?? null;
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

  async getAchievementById(id: string): Promise<achievementDTO | null> {
    return this.achievements.find((achievement) => achievement.id === id) ?? null;
  }

  async addAchievement(achievement: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    channelId?: string | null;
  }): Promise<achievementDTO> {
    const created: achievementDTO = {
      id: randomUUID(),
      title: achievement.title,
      description: achievement.description,
      goal: achievement.goal,
      reward: achievement.reward,
      label: achievement.label,
    };
    (this.achievements as (achievementDTO & { channelId?: string | null })[]).push(
      {
        ...created,
        channelId: achievement.channelId ?? undefined,
      },
    );
    return created;
  }

  async getBadgeById(id: string): Promise<badgeDTO | null> {
    return this.badges.find((badge) => badge.id === id) ?? null;
  }

  async addBadge(b: { title: string; img: string }): Promise<badgeDTO> {
    const nb: badgeDTO = { id: randomUUID(), title: b.title, img: b.img };
    this.badges.push(nb);
    return nb;
  }

  async getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null> {
    return (
      this.achieved.find(
        (record) =>
          record.achievementId === achievementId && record.userId === userId,
      ) ?? null
    );
  }

  async addAchieved(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO> {
    const existingIndex = this.achieved.findIndex(
      (record) =>
        record.achievementId === payload.achievementId &&
        record.userId === payload.userId,
    );
    const record: achievedDTO = {
      achievementId: payload.achievementId,
      userId: payload.userId,
      count: payload.count,
      finished: payload.finished,
      labelActive: payload.labelActive,
      acquiredDate: payload.acquiredDate,
    };
    if (existingIndex >= 0) {
      this.achieved[existingIndex] = record;
      return record;
    }
    this.achieved.push(record);
    return record;
  }

  async getAre(userId: string, channelId: string): Promise<areDTO | null> {
    return (
      this.are.find(
        (record) =>
          record.userId === userId && record.channelId === channelId,
      ) ?? null
    );
  }

  async addAre(payload: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO> {
    const record: areDTO = {
      userId: payload.userId,
      channelId: payload.channelId,
      userType: payload.userType,
    };
    this.are.push(record);
    return record;
  }

  async getPossesses(
    userId: string,
    badgeId: string,
  ): Promise<possessesDTO | null> {
    return (
      this.possesses.find(
        (record) =>
          record.userId === userId && record.badgeId === badgeId,
      ) ?? null
    );
  }

  async addPossesses(payload: {
    userId: string;
    badgeId: string;
    acquiredDate: string;
  }): Promise<possessesDTO> {
    const record: possessesDTO = {
      userId: payload.userId,
      badgeId: payload.badgeId,
      acquiredDate: payload.acquiredDate,
    };
    this.possesses.push(record);
    return record;
  }

  async getChannelsByUserId(userId: string): Promise<userChannelDTO[]> {
    const userAreRecords = this.are.filter(
      (record) => record.userId === userId,
    );
    return userAreRecords
      .map((areRecord) => {
        const channel = this.channels.find(
          (ch) => ch.id === areRecord.channelId,
        );
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
    const userBadgeIds = new Set(
      this.possesses
        .filter((record) => record.userId === userId)
        .map((record) => record.badgeId),
    );
    return this.badges.filter((badge) => userBadgeIds.has(badge.id));
  }

  async getAchievementsByUserId(userId: string): Promise<achievedDTO[]> {
    return this.achieved.filter((record) => record.userId === userId);
  }

  async getUsersByChannelId(channelId: string): Promise<channelUserDTO[]> {
    return this.are
      .filter((record) => record.channelId === channelId)
      .map((areRecord) => {
        const user = this.users.find((u) => u.id === areRecord.userId);
        if (!user) return null;
        return {
          id: user.id,
          username: user.username,
          twitchUserId: user.twitchUserId,
          profileImageUrl: user.profileImageUrl,
          channelDescription: user.channelDescription,
          scope: user.scope,
          userType: areRecord.userType,
        };
      })
      .filter((u): u is channelUserDTO => u !== null);
  }

  async getUsersByBadgeId(badgeId: string): Promise<userDTO[]> {
    const badgeUserIds = new Set(
      this.possesses
        .filter((record) => record.badgeId === badgeId)
        .map((record) => record.userId),
    );
    return this.users.filter((user) => badgeUserIds.has(user.id));
  }

  async getUsersByAchievementId(achievementId: string): Promise<userDTO[]> {
    const achievementUserIds = new Set(
      this.achieved
        .filter((record) => record.achievementId === achievementId)
        .map((record) => record.userId),
    );
    return this.users.filter((user) => achievementUserIds.has(user.id));
  }

  async disconnect(): Promise<void> {
    return;
  }
}
