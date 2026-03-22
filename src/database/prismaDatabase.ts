import { PrismaClient } from "@prisma/client";
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
} from "./database";

export class PrismaDatabase implements Database {
  async getPublicAchievements(): Promise<achievementWithTypeDTO[]> {
    const achievements = await this.prisma.achievement.findMany({
      where: { public: true },
      include: { type: true },
      orderBy: { id: "asc" },
    });
    return achievements.map(
      (achievement: {
        id: string;
        title: string;
        description: string;
        goal: number;
        reward: number;
        label: string;
        public: boolean;
        downloads: number;
        visits: number;
        active: boolean;
        secret: boolean;
        image: string;
        channelId: string | null;
        type: { id: string; label: string; data: string };
      }) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        goal: achievement.goal,
        reward: achievement.reward,
        label: achievement.label,
        public: achievement.public,
        downloads: achievement.downloads,
        visits: achievement.visits,
        active: achievement.active,
        secret: achievement.secret,
        image: achievement.image,
        channelId: achievement.channelId,
        typeAchievement: {
          id: achievement.type.id,
          label: achievement.type.label,
          data: achievement.type.data,
        },
      }),
    );
  }

  async getAchievementsByChannelId(
    channelId: string,
  ): Promise<achievementWithTypeDTO[]> {
    const achievements = await this.prisma.achievement.findMany({
      where: { channelId },
      include: { type: true },
      orderBy: { id: "asc" },
    });
    return achievements.map(
      (achievement: {
        id: string;
        title: string;
        description: string;
        goal: number;
        reward: number;
        label: string;
        public: boolean;
        downloads: number;
        visits: number;
        active: boolean;
        secret: boolean;
        image: string;
        channelId: string | null;
        type: { id: string; label: string; data: string };
      }) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        goal: achievement.goal,
        reward: achievement.reward,
        label: achievement.label,
        public: achievement.public,
        downloads: achievement.downloads,
        visits: achievement.visits,
        active: achievement.active,
        secret: achievement.secret,
        image: achievement.image,
        channelId: achievement.channelId,
        typeAchievement: {
          id: achievement.type.id,
          label: achievement.type.label,
          data: achievement.type.data,
        },
      }),
    );
  }

  async getAchievementsByUserAndChannel(
    userId: string,
    channelId: string,
  ): Promise<userChannelAchievementsDTO> {
    const achievements = await this.prisma.achievement.findMany({
      where: { channelId },
      include: {
        type: true,
        achieved: { where: { userId } },
      },
      orderBy: { id: "asc" },
    });
    const list: achievementWithTypeAndAchievedDTO[] = achievements.map(
      (achievement: {
        id: string;
        title: string;
        description: string;
        goal: number;
        reward: number;
        label: string;
        public: boolean;
        downloads: number;
        visits: number;
        active: boolean;
        secret: boolean;
        image: string;
        channelId: string | null;
        type: { id: string; label: string; data: string };
        achieved: Array<{
          achievementId: string;
          userId: string;
          count: number;
          finished: boolean;
          labelActive: boolean;
          acquiredDate: Date;
        }>;
      }) => {
        const achievedRecord = achievement.achieved[0];
        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          goal: achievement.goal,
          reward: achievement.reward,
          label: achievement.label,
          public: achievement.public,
          downloads: achievement.downloads,
          visits: achievement.visits,
          active: achievement.active,
          secret: achievement.secret,
          image: achievement.image,
          channelId: achievement.channelId,
          typeAchievement: {
            id: achievement.type.id,
            label: achievement.type.label,
            data: achievement.type.data,
          },
          achieved: achievedRecord
            ? {
                achievementId: achievedRecord.achievementId,
                userId: achievedRecord.userId,
                count: achievedRecord.count,
                finished: achievedRecord.finished,
                labelActive: achievedRecord.labelActive,
                acquiredDate: achievedRecord.acquiredDate.toISOString(),
              }
            : null,
        };
      },
    );
    return { userId, channelId, achievements: list };
  }

  async getAchievedByUserAndChannels(
    userId: string,
    channelIds: string[],
  ): Promise<achievedDTO[]> {
    const achieved = await this.prisma.achieved.findMany({
      where: {
        userId,
        achievement: {
          channelId: { in: channelIds },
        },
      },
      include: { achievement: true },
    });
    return achieved.map(
      (r: {
        achievementId: string;
        userId: string;
        count: number;
        finished: boolean;
        labelActive: boolean;
        acquiredDate: Date;
      }) => ({
        achievementId: r.achievementId,
        userId: r.userId,
        count: r.count,
        finished: r.finished,
        labelActive: r.labelActive,
        acquiredDate: r.acquiredDate.toISOString(),
      }),
    );
  }
  private readonly prisma: PrismaClient;

  constructor(databaseUrl?: string) {
    this.prisma = databaseUrl
      ? new PrismaClient({ datasources: { db: { url: databaseUrl } } })
      : new PrismaClient();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async getUserById(id: string): Promise<userDTO | null> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) return null;
    return {
      id: u.id,
      username: u.username,
      profileImageUrl: u.profileImageUrl,
      channelDescription: u.channelDescription,
      scope: u.scope,
      xp: u.xp,
      lastUpdateTimestamp: u.lastUpdateTimestamp.toISOString(),
    };
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
    const u = await this.prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl ?? null,
        channelDescription: user.channelDescription ?? null,
        scope: user.scope ?? null,
        xp: user.xp ?? 0,
        lastUpdateTimestamp: new Date(user.lastUpdateTimestamp),
      },
    });
    return {
      id: u.id,
      username: u.username,
      profileImageUrl: u.profileImageUrl,
      channelDescription: u.channelDescription,
      scope: u.scope,
      xp: u.xp,
      lastUpdateTimestamp: u.lastUpdateTimestamp.toISOString(),
    };
  }

  async getAllUsers(): Promise<userDTO[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      (u: {
        id: string;
        username: string;
        profileImageUrl: string | null;
        channelDescription: string | null;
        scope: string | null;
        xp: number;
        lastUpdateTimestamp: Date;
      }) => ({
        id: u.id,
        username: u.username,
        profileImageUrl: u.profileImageUrl,
        channelDescription: u.channelDescription,
        scope: u.scope,
        xp: u.xp,
        lastUpdateTimestamp: u.lastUpdateTimestamp.toISOString(),
      }),
    );
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
    // Build update payload with only provided fields
    const updateData: {
      username?: string;
      profileImageUrl?: string | null;
      channelDescription?: string | null;
      scope?: string | null;
      xp?: number;
      lastUpdateTimestamp?: Date;
    } = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.profileImageUrl !== undefined)
      updateData.profileImageUrl = data.profileImageUrl;
    if (data.channelDescription !== undefined)
      updateData.channelDescription = data.channelDescription;
    if (data.scope !== undefined) updateData.scope = data.scope;
    if (data.xp !== undefined) updateData.xp = data.xp;
    if (data.lastUpdateTimestamp !== undefined)
      updateData.lastUpdateTimestamp = new Date(data.lastUpdateTimestamp);

    try {
      const u = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
      return {
        id: u.id,
        username: u.username,
        profileImageUrl: u.profileImageUrl,
        channelDescription: u.channelDescription,
        scope: u.scope,
        xp: u.xp,
        lastUpdateTimestamp: u.lastUpdateTimestamp.toISOString(),
      };
    } catch (error: unknown) {
      // Prisma throws P2025 when record not found
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async getChannelById(id: string): Promise<channelDTO | null> {
    const c = await this.prisma.channel.findUnique({ where: { id } });
    if (!c) return null;
    return { id: c.id, name: c.name };
  }

  async addChannel(channel: { id: string; name: string }): Promise<channelDTO> {
    const c = await this.prisma.channel.create({
      data: { id: channel.id, name: channel.name },
    });
    return { id: c.id, name: c.name };
  }

  async updateChannel(
    id: string,
    data: { name?: string },
  ): Promise<channelDTO | null> {
    const updateData: { name?: string } = {};
    if (data.name !== undefined) updateData.name = data.name;

    try {
      const c = await this.prisma.channel.update({
        where: { id },
        data: updateData,
      });
      return { id: c.id, name: c.name };
    } catch (error: unknown) {
      // Prisma throws P2025 when record not found
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async getTypeAchievementById(id: string): Promise<typeAchievementDTO | null> {
    const t = await this.prisma.typeAchievement.findUnique({ where: { id } });
    if (!t) return null;
    return { id: t.id, label: t.label, data: t.data };
  }

  async addTypeAchievement(t: {
    label: string;
    data: string;
  }): Promise<typeAchievementDTO> {
    const nt = await this.prisma.typeAchievement.create({
      data: { label: t.label, data: t.data },
    });
    return { id: nt.id, label: nt.label, data: nt.data };
  }

  async getAchievementById(id: string): Promise<achievementDTO | null> {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!achievement) return null;
    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      goal: achievement.goal,
      reward: achievement.reward,
      label: achievement.label,
      public: achievement.public,
      downloads: achievement.downloads,
      visits: achievement.visits,
      active: achievement.active,
      secret: achievement.secret,
      image: achievement.image,
      channelId: achievement.channelId,
      typeAchievement: {
        id: achievement.type.id,
        label: achievement.type.label,
        data: achievement.type.data,
      },
    };
  }

  async updateAchievementActive(
    id: string,
    active: boolean,
  ): Promise<achievementDTO | null> {
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!existing) return null;
    const updated = await this.prisma.achievement.update({
      where: { id },
      data: { active },
      include: { type: true },
    });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      goal: updated.goal,
      reward: updated.reward,
      label: updated.label,
      public: updated.public,
      downloads: updated.downloads,
      visits: updated.visits,
      active: updated.active,
      secret: updated.secret,
      image: updated.image,
      channelId: updated.channelId,
      typeAchievement: {
        id: updated.type.id,
        label: updated.type.label,
        data: updated.type.data,
      },
    };
  }

  async updateAchievementPublic(
    id: string,
    isPublic: boolean,
  ): Promise<achievementDTO | null> {
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!existing) return null;
    const updated = await this.prisma.achievement.update({
      where: { id },
      data: { public: isPublic },
      include: { type: true },
    });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      goal: updated.goal,
      reward: updated.reward,
      label: updated.label,
      public: updated.public,
      downloads: updated.downloads,
      visits: updated.visits,
      active: updated.active,
      secret: updated.secret,
      image: updated.image,
      channelId: updated.channelId,
      typeAchievement: {
        id: updated.type.id,
        label: updated.type.label,
        data: updated.type.data,
      },
    };
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
      typeLabel?: string;
      typeData?: string;
    },
  ): Promise<achievementDTO | null> {
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!existing) return null;
    const { typeLabel, typeData: typeDataVal, ...achievementData } = data;
    const typeUpdate =
      typeLabel !== undefined || typeDataVal !== undefined
        ? {
            type: {
              update: {
                ...(typeLabel !== undefined ? { label: typeLabel } : {}),
                ...(typeDataVal !== undefined ? { data: typeDataVal } : {}),
              },
            },
          }
        : {};
    const updated = await this.prisma.achievement.update({
      where: { id },
      data: {
        ...achievementData,
        ...typeUpdate,
      },
      include: { type: true },
    });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      goal: updated.goal,
      reward: updated.reward,
      label: updated.label,
      public: updated.public,
      downloads: updated.downloads,
      visits: updated.visits,
      active: updated.active,
      secret: updated.secret,
      image: updated.image,
      channelId: updated.channelId,
      typeAchievement: {
        id: updated.type.id,
        label: updated.type.label,
        data: updated.type.data,
      },
    };
  }

  async deleteAchievement(id: string): Promise<achievementDTO | null> {
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!existing) return null;
    await this.prisma.achieved.deleteMany({ where: { achievementId: id } });
    await this.prisma.achievement.delete({ where: { id } });
    await this.prisma.typeAchievement.delete({
      where: { id: existing.typeId },
    });
    return {
      id: existing.id,
      title: existing.title,
      description: existing.description,
      goal: existing.goal,
      reward: existing.reward,
      label: existing.label,
      public: existing.public,
      downloads: existing.downloads,
      visits: existing.visits,
      active: existing.active,
      secret: existing.secret,
      image: existing.image,
      channelId: existing.channelId,
      typeAchievement: {
        id: existing.type.id,
        label: existing.type.label,
        data: existing.type.data,
      },
    };
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
    typeLabel: string;
    typeData: string;
  }): Promise<achievementDTO> {
    const t = await this.prisma.typeAchievement.create({
      data: {
        label: achievement.typeLabel,
        data: achievement.typeData,
      },
    });
    const typeId = t.id;
    const created = await this.prisma.achievement.create({
      data: {
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
        channelId: achievement.channelId ?? undefined,
        typeId,
      },
      include: { type: true },
    });
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      goal: created.goal,
      reward: created.reward,
      label: created.label,
      public: created.public,
      downloads: created.downloads,
      visits: created.visits,
      active: created.active,
      secret: created.secret,
      image: created.image,
      channelId: created.channelId,
      typeAchievement: {
        id: created.type.id,
        label: created.type.label,
        data: created.type.data,
      },
    };
  }

  async getBadgeById(id: string): Promise<badgeDTO | null> {
    const b = await this.prisma.badge.findUnique({ where: { id } });
    if (!b) return null;
    return { id: b.id, title: b.title, img: b.img };
  }

  async getBadgeByChannelId(channelId: string): Promise<badgeDTO | null> {
    const b = await this.prisma.badge.findFirst({ where: { channelId } });
    if (!b) return null;
    return { id: b.id, title: b.title, img: b.img };
  }

  async addBadge(b: {
    title: string;
    img: string;
    channelId?: string | null;
  }): Promise<badgeDTO> {
    const nb = await this.prisma.badge.create({
      data: {
        title: b.title,
        img: b.img,
        ...(b.channelId ? { channelId: b.channelId } : {}),
      },
    });
    return { id: nb.id, title: nb.title, img: nb.img };
  }

  async getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null> {
    const record = await this.prisma.achieved.findUnique({
      where: {
        // Prisma compound unique key name from schema
        achievementId_userId: { achievementId, userId }, // eslint-disable-line camelcase
      },
    });
    if (!record) return null;
    return {
      achievementId: record.achievementId,
      userId: record.userId,
      count: record.count,
      finished: record.finished,
      labelActive: record.labelActive,
      acquiredDate: record.acquiredDate.toISOString(),
    };
  }

  async addAchieved(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO> {
    const result = await this.prisma.achieved.upsert({
      where: {
        // eslint-disable-next-line camelcase -- Prisma compound unique key name from schema
        achievementId_userId: {
          achievementId: payload.achievementId,
          userId: payload.userId,
        },
      },
      create: {
        achievementId: payload.achievementId,
        userId: payload.userId,
        count: payload.count,
        finished: payload.finished,
        labelActive: payload.labelActive,
        acquiredDate: new Date(payload.acquiredDate),
      },
      update: {
        count: payload.count,
        finished: payload.finished,
        labelActive: payload.labelActive,
        acquiredDate: new Date(payload.acquiredDate),
      },
    });
    return {
      achievementId: result.achievementId,
      userId: result.userId,
      count: result.count,
      finished: result.finished,
      labelActive: result.labelActive,
      acquiredDate: result.acquiredDate.toISOString(),
    };
  }

  async updateAchieved(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO | null> {
    const existing = await this.prisma.achieved.findUnique({
      where: {
        // Prisma compound unique key name from schema
        // eslint-disable-next-line camelcase
        achievementId_userId: {
          achievementId: payload.achievementId,
          userId: payload.userId,
        },
      },
    });
    if (!existing) return null;
    const result = await this.prisma.achieved.update({
      where: {
        // eslint-disable-next-line camelcase
        achievementId_userId: {
          achievementId: payload.achievementId,
          userId: payload.userId,
        },
      },
      data: {
        count: payload.count,
        finished: payload.finished,
        labelActive: payload.labelActive,
        acquiredDate: new Date(payload.acquiredDate),
      },
    });
    return {
      achievementId: result.achievementId,
      userId: result.userId,
      count: result.count,
      finished: result.finished,
      labelActive: result.labelActive,
      acquiredDate: result.acquiredDate.toISOString(),
    };
  }

  async getAre(userId: string, channelId: string): Promise<areDTO | null> {
    const r = await this.prisma.are.findUnique({
      // eslint-disable-next-line camelcase -- Prisma compound unique key name from schema
      where: { userId_channelId: { userId, channelId } },
    });
    if (!r) return null;
    return { userId: r.userId, channelId: r.channelId, userType: r.userType };
  }

  async getAreByUserId(userId: string): Promise<areDTO[]> {
    const records = await this.prisma.are.findMany({
      where: { userId },
    });
    return records.map(
      (r: { userId: string; channelId: string; userType: string }) => ({
        userId: r.userId,
        channelId: r.channelId,
        userType: r.userType,
      }),
    );
  }

  async getAreByChannelId(channelId: string): Promise<areDTO[]> {
    const records = await this.prisma.are.findMany({
      where: { channelId },
    });
    return records.map(
      (r: { userId: string; channelId: string; userType: string }) => ({
        userId: r.userId,
        channelId: r.channelId,
        userType: r.userType,
      }),
    );
  }

  async addAre(payload: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO> {
    const created = await this.prisma.are.create({
      data: {
        userId: payload.userId,
        channelId: payload.channelId,
        userType: payload.userType,
      },
    });
    return {
      userId: created.userId,
      channelId: created.channelId,
      userType: created.userType,
    };
  }

  async updateAre(
    userId: string,
    channelId: string,
    data: { userType?: string },
  ): Promise<areDTO | null> {
    const updateData: { userType?: string } = {};
    if (data.userType !== undefined) updateData.userType = data.userType;

    try {
      const updated = await this.prisma.are.update({
        // eslint-disable-next-line camelcase -- Prisma compound unique key name from schema
        where: { userId_channelId: { userId, channelId } },
        data: updateData,
      });
      return {
        userId: updated.userId,
        channelId: updated.channelId,
        userType: updated.userType,
      };
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async deleteAre(userId: string, channelId: string): Promise<boolean> {
    try {
      await this.prisma.are.delete({
        // eslint-disable-next-line camelcase -- Prisma compound unique key name from schema
        where: { userId_channelId: { userId, channelId } },
      });
      return true;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return false;
      }
      throw error;
    }
  }

  async getPossesses(
    userId: string,
    badgeId: string,
  ): Promise<possessesDTO | null> {
    const p = await this.prisma.possesses.findUnique({
      // eslint-disable-next-line camelcase -- Prisma compound unique key name from schema
      where: { userId_badgeId: { userId, badgeId } },
    });
    if (!p) return null;
    return {
      userId: p.userId,
      badgeId: p.badgeId,
      acquiredDate: p.acquiredDate.toISOString(),
    };
  }

  async addPossesses(p: {
    userId: string;
    badgeId: string;
    acquiredDate: string;
  }): Promise<possessesDTO> {
    const np = await this.prisma.possesses.create({
      data: {
        userId: p.userId,
        badgeId: p.badgeId,
        acquiredDate: new Date(p.acquiredDate),
      },
    });
    return {
      userId: np.userId,
      badgeId: np.badgeId,
      acquiredDate: np.acquiredDate.toISOString(),
    };
  }

  async getChannelsByUserId(userId: string): Promise<userChannelDTO[]> {
    const areRecords = await this.prisma.are.findMany({
      where: { userId },
      include: { channel: true },
    });
    return areRecords.map(
      (r: { channel: { id: string; name: string }; userType: string }) => ({
        id: r.channel.id,
        name: r.channel.name,
        userType: r.userType,
      }),
    );
  }

  async getBadgesByUserId(userId: string): Promise<badgeDTO[]> {
    const possessRecords = await this.prisma.possesses.findMany({
      where: { userId },
      include: { badge: true },
    });
    return possessRecords.map(
      (r: { badge: { id: string; title: string; img: string } }) => ({
        id: r.badge.id,
        title: r.badge.title,
        img: r.badge.img,
      }),
    );
  }

  async getAchievementsByUserId(userId: string): Promise<achievedDTO[]> {
    const achievedRecords = await this.prisma.achieved.findMany({
      where: { userId },
    });
    return achievedRecords.map(
      (r: {
        achievementId: string;
        userId: string;
        count: number;
        finished: boolean;
        labelActive: boolean;
        acquiredDate: Date;
      }) => ({
        achievementId: r.achievementId,
        userId: r.userId,
        count: r.count,
        finished: r.finished,
        labelActive: r.labelActive,
        acquiredDate: r.acquiredDate.toISOString(),
      }),
    );
  }

  async getAchievementDefinitionsByUserId(
    userId: string,
  ): Promise<achievementWithTypeAndAchievedDTO[]> {
    const achievements = await this.prisma.achievement.findMany({
      where: { achieved: { some: { userId } } },
      include: {
        type: true,
        achieved: { where: { userId } },
      },
      orderBy: { id: "asc" },
    });
    return achievements.map(
      (achievement: {
        id: string;
        title: string;
        description: string;
        goal: number;
        reward: number;
        label: string;
        public: boolean;
        downloads: number;
        visits: number;
        active: boolean;
        secret: boolean;
        image: string;
        channelId: string | null;
        type: { id: string; label: string; data: string };
        achieved: Array<{
          achievementId: string;
          userId: string;
          count: number;
          finished: boolean;
          labelActive: boolean;
          acquiredDate: Date;
        }>;
      }) => {
        const achievedRecord = achievement.achieved[0];
        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          goal: achievement.goal,
          reward: achievement.reward,
          label: achievement.label,
          public: achievement.public,
          downloads: achievement.downloads,
          visits: achievement.visits,
          active: achievement.active,
          secret: achievement.secret,
          image: achievement.image,
          channelId: achievement.channelId,
          typeAchievement: {
            id: achievement.type.id,
            label: achievement.type.label,
            data: achievement.type.data,
          },
          achieved: achievedRecord
            ? {
                achievementId: achievedRecord.achievementId,
                userId: achievedRecord.userId,
                count: achievedRecord.count,
                finished: achievedRecord.finished,
                labelActive: achievedRecord.labelActive,
                acquiredDate: achievedRecord.acquiredDate.toISOString(),
              }
            : null,
        };
      },
    );
  }

  async getUsersByChannelId(channelId: string): Promise<channelUserDTO[]> {
    const areRecords = await this.prisma.are.findMany({
      where: { channelId },
      include: { user: true },
    });
    return areRecords.map(
      (r: {
        user: {
          id: string;
          username: string;
          profileImageUrl: string | null;
          channelDescription: string | null;
          scope: string | null;
          xp: number;
          lastUpdateTimestamp: Date;
        };
        userType: string;
      }) => ({
        id: r.user.id,
        username: r.user.username,
        profileImageUrl: r.user.profileImageUrl,
        channelDescription: r.user.channelDescription,
        scope: r.user.scope,
        xp: r.user.xp,
        lastUpdateTimestamp: r.user.lastUpdateTimestamp.toISOString(),
        userType: r.userType,
      }),
    );
  }

  async getUsersByBadgeId(badgeId: string): Promise<userDTO[]> {
    const possessRecords = await this.prisma.possesses.findMany({
      where: { badgeId },
      include: { user: true },
    });
    return possessRecords.map(
      (r: {
        user: {
          id: string;
          username: string;
          profileImageUrl: string | null;
          channelDescription: string | null;
          scope: string | null;
          xp: number;
          lastUpdateTimestamp: Date;
        };
      }) => ({
        id: r.user.id,
        username: r.user.username,
        profileImageUrl: r.user.profileImageUrl,
        channelDescription: r.user.channelDescription,
        scope: r.user.scope,
        xp: r.user.xp,
        lastUpdateTimestamp: r.user.lastUpdateTimestamp.toISOString(),
      }),
    );
  }

  async getUsersByAchievementId(achievementId: string): Promise<userDTO[]> {
    const achievedRecords = await this.prisma.achieved.findMany({
      where: { achievementId },
      include: { user: true },
    });
    return achievedRecords.map(
      (r: {
        user: {
          id: string;
          username: string;
          profileImageUrl: string | null;
          channelDescription: string | null;
          scope: string | null;
          xp: number;
          lastUpdateTimestamp: Date;
        };
      }) => ({
        id: r.user.id,
        username: r.user.username,
        profileImageUrl: r.user.profileImageUrl,
        channelDescription: r.user.channelDescription,
        scope: r.user.scope,
        xp: r.user.xp,
        lastUpdateTimestamp: r.user.lastUpdateTimestamp.toISOString(),
      }),
    );
  }

  async disconnect(): Promise<void> {
    if (this.prisma?.$disconnect) await this.prisma.$disconnect();
  }
}
