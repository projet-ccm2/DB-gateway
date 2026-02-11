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
        type: { id: string; label: string; data: string } | null;
      }) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        goal: achievement.goal,
        reward: achievement.reward,
        label: achievement.label,
        typeAchievement: achievement.type
          ? {
              id: achievement.type.id,
              label: achievement.type.label,
              data: achievement.type.data,
            }
          : null,
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
        type: { id: string; label: string; data: string } | null;
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
          typeAchievement: achievement.type
            ? {
                id: achievement.type.id,
                label: achievement.type.label,
                data: achievement.type.data,
              }
            : null,
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
    };
  }

  async addUser(user: {
    id: string;
    username: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO> {
    const u = await this.prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl ?? null,
        channelDescription: user.channelDescription ?? null,
        scope: user.scope ?? null,
      },
    });
    return {
      id: u.id,
      username: u.username,
      profileImageUrl: u.profileImageUrl,
      channelDescription: u.channelDescription,
      scope: u.scope,
    };
  }

  async getChannelById(id: string): Promise<channelDTO | null> {
    const c = await this.prisma.channel.findUnique({ where: { id } });
    if (!c) return null;
    return { id: c.id, name: c.name };
  }

  async addChannel(channel: { name: string }): Promise<channelDTO> {
    const c = await this.prisma.channel.create({
      data: { name: channel.name },
    });
    return { id: c.id, name: c.name };
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
    });
    if (!achievement) return null;
    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      goal: achievement.goal,
      reward: achievement.reward,
      label: achievement.label,
    };
  }

  async addAchievement(achievement: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    channelId?: string | null;
  }): Promise<achievementDTO> {
    const created = await this.prisma.achievement.create({
      data: {
        title: achievement.title,
        description: achievement.description,
        goal: achievement.goal,
        reward: achievement.reward,
        label: achievement.label,
        channelId: achievement.channelId ?? undefined,
        public: false,
        downloads: 0,
        visits: 0,
        active: true,
        secret: false,
        image: "",
      },
    });
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      goal: created.goal,
      reward: created.reward,
      label: created.label,
    };
  }

  async getBadgeById(id: string): Promise<badgeDTO | null> {
    const b = await this.prisma.badge.findUnique({ where: { id } });
    if (!b) return null;
    return { id: b.id, title: b.title, img: b.img };
  }

  async addBadge(b: { title: string; img: string }): Promise<badgeDTO> {
    const nb = await this.prisma.badge.create({
      data: { title: b.title, img: b.img },
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
        };
        userType: string;
      }) => ({
        id: r.user.id,
        username: r.user.username,
        profileImageUrl: r.user.profileImageUrl,
        channelDescription: r.user.channelDescription,
        scope: r.user.scope,
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
        };
      }) => ({
        id: r.user.id,
        username: r.user.username,
        profileImageUrl: r.user.profileImageUrl,
        channelDescription: r.user.channelDescription,
        scope: r.user.scope,
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
        };
      }) => ({
        id: r.user.id,
        username: r.user.username,
        profileImageUrl: r.user.profileImageUrl,
        channelDescription: r.user.channelDescription,
        scope: r.user.scope,
      }),
    );
  }

  async disconnect(): Promise<void> {
    if (this.prisma?.$disconnect) await this.prisma.$disconnect();
  }
}
