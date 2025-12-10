import { PrismaClient } from "@prisma/client";
import {
  database,
  userDTO,
  channelDTO,
  userChannelDTO,
  typeAchievementDTO,
  achievementDTO,
  badgeDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "./database";

// Wrap the generated Prisma client with a simple adapter to satisfy our database interface
export class PrismaDatabase implements database {
  // Generated client expects an options object; allow any for simplicity
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient({});
  }

  async getUserById(id: string): Promise<userDTO | null> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) return null;
    return {
      id: u.id,
      username: u.username,
      twitchUserId: u.twitchUserId,
      profileImageUrl: u.profileImageUrl,
      channelDescription: u.channelDescription,
      scope: u.scope,
    };
  }

  async addUser(user: {
    username: string;
    twitchUserId: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO> {
    const u = await this.prisma.user.create({
      data: {
        username: user.username,
        twitchUserId: user.twitchUserId,
        profileImageUrl: user.profileImageUrl ?? null,
        channelDescription: user.channelDescription ?? null,
        scope: user.scope ?? null,
      },
    });
    return {
      id: u.id,
      username: u.username,
      twitchUserId: u.twitchUserId,
      profileImageUrl: u.profileImageUrl,
      channelDescription: u.channelDescription,
      scope: u.scope,
    };
  }

  // Channel
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

  // TypeAchievement
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

  // Achievement
  async getAchievementById(id: string): Promise<achievementDTO | null> {
    const a = await this.prisma.achievement.findUnique({ where: { id } });
    if (!a) return null;
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      goal: a.goal,
      reward: a.reward,
      label: a.label,
    };
  }

  async addAchievement(a: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
  }): Promise<achievementDTO> {
    const na = await this.prisma.achievement.create({
      data: {
        title: a.title,
        description: a.description,
        goal: a.goal,
        reward: a.reward,
        label: a.label,
        public: false,
        downloads: 0,
        visits: 0,
        active: true,
        secret: false,
        image: "",
      },
    });
    return {
      id: na.id,
      title: na.title,
      description: na.description,
      goal: na.goal,
      reward: na.reward,
      label: na.label,
    };
  }

  // Badge
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

  // Achieved, Are, Possesses: basic implementations
  async getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null> {
    const a = await this.prisma.achieved.findUnique({
      where: { achievementIdUserId: { achievementId, userId } },
    });
    if (!a) return null;
    return {
      achievementId: a.achievementId,
      userId: a.userId,
      count: a.count,
      finished: a.finished,
      labelActive: a.labelActive,
      acquiredDate: a.acquiredDate.toISOString(),
    };
  }

  async addAchieved(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO> {
    const na = await this.prisma.achieved.create({
      data: {
        achievementId: a.achievementId,
        userId: a.userId,
        count: a.count,
        finished: a.finished,
        labelActive: a.labelActive,
        acquiredDate: new Date(a.acquiredDate),
      },
    });
    return {
      achievementId: na.achievementId,
      userId: na.userId,
      count: na.count,
      finished: na.finished,
      labelActive: na.labelActive,
      acquiredDate: na.acquiredDate.toISOString(),
    };
  }

  async getAre(userId: string, channelId: string): Promise<areDTO | null> {
    const r = await this.prisma.are.findUnique({
      where: { userIdChannelId: { userId, channelId } },
    });
    if (!r) return null;
    return { userId: r.userId, channelId: r.channelId, userType: r.userType };
  }

  async addAre(a: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO> {
    const nr = await this.prisma.are.create({
      data: { userId: a.userId, channelId: a.channelId, userType: a.userType },
    });
    return {
      userId: nr.userId,
      channelId: nr.channelId,
      userType: nr.userType,
    };
  }

  async getPossesses(
    userId: string,
    badgeId: string,
  ): Promise<possessesDTO | null> {
    const p = await this.prisma.possesses.findUnique({
      where: { userIdBadgeId: { userId, badgeId } },
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

  // ============ NEW: Get by User ID ============

  async getChannelsByUserId(userId: string): Promise<userChannelDTO[]> {
    const areRecords = await this.prisma.are.findMany({
      where: { userId },
      include: { channel: true },
    });
    return areRecords.map((r: any) => ({
      id: r.channel.id,
      name: r.channel.name,
      userType: r.userType,
    }));
  }

  async getBadgesByUserId(userId: string): Promise<badgeDTO[]> {
    const possessRecords = await this.prisma.possesses.findMany({
      where: { userId },
      include: { badge: true },
    });
    return possessRecords.map((r: any) => ({
      id: r.badge.id,
      title: r.badge.title,
      img: r.badge.img,
    }));
  }

  async getAchievementsByUserId(userId: string): Promise<achievedDTO[]> {
    const achievedRecords = await this.prisma.achieved.findMany({
      where: { userId },
    });
    return achievedRecords.map((r: any) => ({
      achievementId: r.achievementId,
      userId: r.userId,
      count: r.count,
      finished: r.finished,
      labelActive: r.labelActive,
      acquiredDate: r.acquiredDate.toISOString(),
    }));
  }

  // ============ NEW: Inverse lookups (get users by entity) ============

  async getUsersByChannelId(channelId: string): Promise<userDTO[]> {
    const areRecords = await this.prisma.are.findMany({
      where: { channelId },
      include: { user: true },
    });
    return areRecords.map((r: any) => ({
      id: r.user.id,
      username: r.user.username,
      twitchUserId: r.user.twitchUserId,
      profileImageUrl: r.user.profileImageUrl,
      channelDescription: r.user.channelDescription,
      scope: r.user.scope,
    }));
  }

  async getUsersByBadgeId(badgeId: string): Promise<userDTO[]> {
    const possessRecords = await this.prisma.possesses.findMany({
      where: { badgeId },
      include: { user: true },
    });
    return possessRecords.map((r: any) => ({
      id: r.user.id,
      username: r.user.username,
      twitchUserId: r.user.twitchUserId,
      profileImageUrl: r.user.profileImageUrl,
      channelDescription: r.user.channelDescription,
      scope: r.user.scope,
    }));
  }

  async getUsersByAchievementId(achievementId: string): Promise<userDTO[]> {
    const achievedRecords = await this.prisma.achieved.findMany({
      where: { achievementId },
      include: { user: true },
    });
    return achievedRecords.map((r: any) => ({
      id: r.user.id,
      username: r.user.username,
      twitchUserId: r.user.twitchUserId,
      profileImageUrl: r.user.profileImageUrl,
      channelDescription: r.user.channelDescription,
      scope: r.user.scope,
    }));
  }

  async disconnect(): Promise<void> {
    if (this.prisma?.$disconnect) await this.prisma.$disconnect();
  }
}

// Backwards-compat: some tests / code expect a lowercase export name
// legacy alias removed: project now uses PascalCase `PrismaDatabase` throughout
