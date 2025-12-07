import { PrismaClient } from "@prisma/client";
import {
  database,
  userDTO,
  chanelDTO,
  typeAchievementDTO,
  achievementDTO,
  badgeDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "./database";

// Wrap the generated Prisma client with a simple adapter to satisfy our database interface
export class prismaDatabase implements database {
  // Generated client expects an options object; allow any for simplicity
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient({});
  }

  async getUserById(id: string): Promise<userDTO | null> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) return null;
    return { id: u.id, username: u.username };
  }

  async addUser(username: string): Promise<userDTO> {
    const u = await this.prisma.user.create({ data: { username } });
    return { id: u.id, username: u.username };
  }

  // Chanel
  async getChanelById(id: string): Promise<chanelDTO | null> {
    const c = await this.prisma.chanel.findUnique({ where: { id } });
    if (!c) return null;
    return { id: c.id, name: c.name };
  }

  async addChanel(chanel: { name: string }): Promise<chanelDTO> {
    const c = await this.prisma.chanel.create({ data: { name: chanel.name } });
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
      aquiredDate: a.aquiredDate.toISOString(),
    };
  }

  async addAchieved(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    aquiredDate: string;
  }): Promise<achievedDTO> {
    const na = await this.prisma.achieved.create({
      data: {
        achievementId: a.achievementId,
        userId: a.userId,
        count: a.count,
        finished: a.finished,
        labelActive: a.labelActive,
        aquiredDate: new Date(a.aquiredDate),
      },
    });
    return {
      achievementId: na.achievementId,
      userId: na.userId,
      count: na.count,
      finished: na.finished,
      labelActive: na.labelActive,
      aquiredDate: na.aquiredDate.toISOString(),
    };
  }

  async getAre(userId: string, chanelId: string): Promise<areDTO | null> {
    const r = await this.prisma.are.findUnique({
      where: { userIdChanelId: { userId, chanelId } },
    });
    if (!r) return null;
    return { userId: r.userId, chanelId: r.chanelId, userType: r.userType };
  }

  async addAre(a: {
    userId: string;
    chanelId: string;
    userType: string;
  }): Promise<areDTO> {
    const nr = await this.prisma.are.create({
      data: { userId: a.userId, chanelId: a.chanelId, userType: a.userType },
    });
    return { userId: nr.userId, chanelId: nr.chanelId, userType: nr.userType };
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
      aquiredDate: p.aquiredDate.toISOString(),
    };
  }

  async addPossesses(p: {
    userId: string;
    badgeId: string;
    aquiredDate: string;
  }): Promise<possessesDTO> {
    const np = await this.prisma.possesses.create({
      data: {
        userId: p.userId,
        badgeId: p.badgeId,
        aquiredDate: new Date(p.aquiredDate),
      },
    });
    return {
      userId: np.userId,
      badgeId: np.badgeId,
      aquiredDate: np.aquiredDate.toISOString(),
    };
  }

  async disconnect(): Promise<void> {
    if (this.prisma?.$disconnect) await this.prisma.$disconnect();
  }
}
