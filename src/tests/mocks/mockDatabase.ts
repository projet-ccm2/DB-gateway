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

  async getPublicAchievements(): Promise<achievementWithTypeDTO[]> {
    const list = this.achievements.filter(
      (achievement) => achievement.public === true,
    );
    return list.map((achievement) => ({
      ...achievement,
      typeAchievement: achievement.typeAchievement,
    }));
  }

  async getAchievementsByChannelId(
    channelId: string,
  ): Promise<achievementWithTypeDTO[]> {
    const list = this.achievements.filter(
      (achievement) => achievement.channelId === channelId,
    );
    return list.map((achievement) => ({
      ...achievement,
      typeAchievement: achievement.typeAchievement,
    }));
  }

  async getAchievementsByUserAndChannel(
    userId: string,
    channelId: string,
  ): Promise<userChannelAchievementsDTO> {
    const list = this.achievements.filter(
      (achievement) => achievement.channelId === channelId,
    );
    const achievements: achievementWithTypeAndAchievedDTO[] = await Promise.all(
      list.map(async (achievement) => {
        const achievedRecord = await this.getAchieved(achievement.id, userId);
        return {
          ...achievement,
          typeAchievement: achievement.typeAchievement,
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
      (record) => record.userId === userId && (channelIds.length === 0 || true),
    );
  }
  private readonly users: userDTO[] = [];
  private readonly channels: channelDTO[] = [];
  private readonly types: typeAchievementDTO[] = [];
  private readonly achievements: achievementDTO[] = [];
  private readonly badges: (badgeDTO & { channelId?: string | null })[] = [];
  private readonly achieved: achievedDTO[] = [];
  private readonly are: areDTO[] = [];
  private readonly possesses: possessesDTO[] = [];

  async getUserById(id: string): Promise<userDTO | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async addUser(user: {
    id: string;
    username: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
    xp?: number;
    lastUpdateTimestamp: string;
  }): Promise<userDTO> {
    const newUser: userDTO = {
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl ?? null,
      channelDescription: user.channelDescription ?? null,
      scope: user.scope ?? null,
      xp: user.xp ?? 0,
      lastUpdateTimestamp: user.lastUpdateTimestamp,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getAllUsers(): Promise<userDTO[]> {
    return [...this.users];
  }

  async updateUser(
    id: string,
    data: {
      username?: string;
      profileImageUrl?: string | null;
      channelDescription?: string | null;
      scope?: string | null;
      xp?: number;
      lastUpdateTimestamp?: string;
    },
  ): Promise<userDTO | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    if (data.username !== undefined) user.username = data.username;
    if (data.profileImageUrl !== undefined)
      user.profileImageUrl = data.profileImageUrl;
    if (data.channelDescription !== undefined)
      user.channelDescription = data.channelDescription;
    if (data.scope !== undefined) user.scope = data.scope;
    if (data.xp !== undefined) user.xp = data.xp;
    if (data.lastUpdateTimestamp !== undefined)
      user.lastUpdateTimestamp = data.lastUpdateTimestamp;
    return user;
  }

  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.channels.find((channel) => channel.id === id) ?? null;
  }

  async addChannel(channel: {
    id: string;
    name: string;
    discordWebhookUrl?: string | null;
  }): Promise<channelDTO> {
    const newC: channelDTO = {
      id: channel.id,
      name: channel.name,
      discordWebhookUrl: channel.discordWebhookUrl ?? null,
    };
    this.channels.push(newC);
    return newC;
  }

  async updateChannel(
    id: string,
    data: { name?: string; discordWebhookUrl?: string | null },
  ): Promise<channelDTO | null> {
    const channel = this.channels.find((c) => c.id === id);
    if (!channel) return null;
    if (data.name !== undefined) channel.name = data.name;
    if (data.discordWebhookUrl !== undefined)
      channel.discordWebhookUrl = data.discordWebhookUrl ?? null;
    return channel;
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
    return (
      this.achievements.find((achievement) => achievement.id === id) ?? null
    );
  }

  async updateAchievementActive(
    id: string,
    active: boolean,
  ): Promise<achievementDTO | null> {
    const achievement = this.achievements.find((a) => a.id === id);
    if (!achievement) return null;
    achievement.active = active;
    return { ...achievement };
  }

  async updateAchievementPublic(
    id: string,
    isPublic: boolean,
  ): Promise<achievementDTO | null> {
    const achievement = this.achievements.find((a) => a.id === id);
    if (!achievement) return null;
    achievement.public = isPublic;
    return { ...achievement };
  }

  async updateAchievement(
    id: string,
    data: {
      title?: string;
      description?: string;
      goal?: number;
      reward?: number;
      label?: string;
      public?: boolean;
      active?: boolean;
      secret?: boolean;
      image?: string;
      typeId?: string;
    },
  ): Promise<achievementDTO | null> {
    const achievement = this.achievements.find((a) => a.id === id);
    if (!achievement) return null;
    if (data.title !== undefined) achievement.title = data.title;
    if (data.description !== undefined)
      achievement.description = data.description;
    if (data.goal !== undefined) achievement.goal = data.goal;
    if (data.reward !== undefined) achievement.reward = data.reward;
    if (data.label !== undefined) achievement.label = data.label;
    if (data.public !== undefined) achievement.public = data.public;
    if (data.active !== undefined) achievement.active = data.active;
    if (data.secret !== undefined) achievement.secret = data.secret;
    if (data.image !== undefined) achievement.image = data.image;
    if (data.typeId !== undefined) {
      const typeRecord = this.types.find((t) => t.id === data.typeId);
      if (!typeRecord) return null;
      achievement.typeAchievement = { ...typeRecord };
    }
    return { ...achievement };
  }

  async deleteAchievement(id: string): Promise<achievementDTO | null> {
    const idx = this.achievements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const [removed] = this.achievements.splice(idx, 1);
    const typeIdx = this.types.findIndex(
      (t) => t.id === removed.typeAchievement.id,
    );
    if (typeIdx !== -1) this.types.splice(typeIdx, 1);
    for (let i = this.achieved.length - 1; i >= 0; i--) {
      if (this.achieved[i].achievementId === id) this.achieved.splice(i, 1);
    }
    return removed;
  }

  async addAchievement(achievement: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    public: boolean;
    active: boolean;
    secret: boolean;
    image: string;
    channelId?: string | null;
    typeId: string;
  }): Promise<achievementDTO | null> {
    const typeAchievement = this.types.find((t) => t.id === achievement.typeId);
    if (!typeAchievement) return null;
    const created: achievementDTO = {
      id: randomUUID(),
      title: achievement.title,
      description: achievement.description,
      goal: achievement.goal,
      reward: achievement.reward,
      label: achievement.label,
      public: achievement.public,
      downloads: 0,
      visits: 0,
      active: achievement.active,
      secret: achievement.secret,
      image: achievement.image,
      channelId: achievement.channelId ?? null,
      typeAchievement: { ...typeAchievement },
    };
    this.achievements.push(created);
    return created;
  }

  async getBadgeById(id: string): Promise<badgeDTO | null> {
    const badge = this.badges.find((b) => b.id === id);
    if (!badge) return null;
    return { id: badge.id, title: badge.title, img: badge.img };
  }

  async getBadgeByChannelId(channelId: string): Promise<badgeDTO | null> {
    const badge = this.badges.find((b) => b.channelId === channelId);
    if (!badge) return null;
    return { id: badge.id, title: badge.title, img: badge.img };
  }

  async addBadge(b: {
    title: string;
    img: string;
    channelId: string;
  }): Promise<badgeDTO | null> {
    const channelExists = this.channels.find((c) => c.id === b.channelId);
    if (!channelExists) return null;
    const nb = {
      id: randomUUID(),
      title: b.title,
      img: b.img,
      channelId: b.channelId,
    };
    this.badges.push(nb);
    return { id: nb.id, title: nb.title, img: nb.img };
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

  async updateAchieved(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO | null> {
    const index = this.achieved.findIndex(
      (record) =>
        record.achievementId === payload.achievementId &&
        record.userId === payload.userId,
    );
    if (index < 0) return null;
    const record: achievedDTO = {
      achievementId: payload.achievementId,
      userId: payload.userId,
      count: payload.count,
      finished: payload.finished,
      labelActive: payload.labelActive,
      acquiredDate: payload.acquiredDate,
    };
    this.achieved[index] = record;
    return record;
  }

  async getAre(userId: string, channelId: string): Promise<areDTO | null> {
    return (
      this.are.find(
        (record) => record.userId === userId && record.channelId === channelId,
      ) ?? null
    );
  }

  async getAreByUserId(userId: string): Promise<areDTO[]> {
    return this.are.filter((record) => record.userId === userId);
  }

  async getAreByChannelId(channelId: string): Promise<areDTO[]> {
    return this.are.filter((record) => record.channelId === channelId);
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

  async updateAre(
    userId: string,
    channelId: string,
    data: { userType?: string },
  ): Promise<areDTO | null> {
    const record = this.are.find(
      (r) => r.userId === userId && r.channelId === channelId,
    );
    if (!record) return null;
    if (data.userType !== undefined) record.userType = data.userType;
    return record;
  }

  async deleteAre(userId: string, channelId: string): Promise<boolean> {
    const index = this.are.findIndex(
      (r) => r.userId === userId && r.channelId === channelId,
    );
    if (index === -1) return false;
    this.are.splice(index, 1);
    return true;
  }

  async getPossesses(
    userId: string,
    badgeId: string,
  ): Promise<possessesDTO | null> {
    return (
      this.possesses.find(
        (record) => record.userId === userId && record.badgeId === badgeId,
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

  async getAchievementDefinitionsByUserId(
    userId: string,
  ): Promise<achievementWithTypeAndAchievedDTO[]> {
    const userAchievedIds = new Set(
      this.achieved
        .filter((record) => record.userId === userId)
        .map((record) => record.achievementId),
    );
    const matchingAchievements = this.achievements.filter((a) =>
      userAchievedIds.has(a.id),
    );
    return Promise.all(
      matchingAchievements.map(async (achievement) => {
        const achievedRecord = await this.getAchieved(achievement.id, userId);
        return {
          ...achievement,
          typeAchievement: achievement.typeAchievement,
          achieved: achievedRecord,
        };
      }),
    );
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
          profileImageUrl: user.profileImageUrl,
          channelDescription: user.channelDescription,
          scope: user.scope,
          xp: user.xp,
          lastUpdateTimestamp: user.lastUpdateTimestamp,
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

  async nukeUser(userId: string): Promise<boolean> {
    const userIdx = this.users.findIndex((u) => u.id === userId);
    if (userIdx === -1) return false;

    // 1. Delete user's own achieved records
    this.spliceAll(this.achieved, (r) => r.userId === userId);

    // 2. Delete user's own possesses records
    this.spliceAll(this.possesses, (r) => r.userId === userId);

    // 3. Delete user's own are records
    this.spliceAll(this.are, (r) => r.userId === userId);

    // 4. Delete other users' achieved on achievements linked to user's channel
    const channelAchievementIds = new Set(
      this.achievements.filter((a) => a.channelId === userId).map((a) => a.id),
    );
    if (channelAchievementIds.size > 0) {
      this.spliceAll(this.achieved, (r) =>
        channelAchievementIds.has(r.achievementId),
      );
    }

    // 5. Delete other users' possesses for the badge linked to user's channel
    const channelBadge = this.badges.find((b) => b.channelId === userId);
    if (channelBadge) {
      this.spliceAll(this.possesses, (r) => r.badgeId === channelBadge.id);
    }

    // 6. Delete other users' are records for user's channel
    this.spliceAll(this.are, (r) => r.channelId === userId);

    // 7. Delete achievements linked to user's channel
    this.spliceAll(this.achievements, (a) => a.channelId === userId);

    // 8. Delete badge linked to user's channel
    if (channelBadge) {
      this.spliceAll(this.badges, (b) => b.id === channelBadge.id);
    }

    // 9. Delete user's channel
    this.spliceAll(this.channels, (c) => c.id === userId);

    // 10. Delete the user
    this.users.splice(userIdx, 1);

    return true;
  }

  /** Remove all items matching predicate from an array (mutates in-place). */
  private spliceAll<T>(arr: T[], predicate: (item: T) => boolean): void {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i])) arr.splice(i, 1);
    }
  }
}
