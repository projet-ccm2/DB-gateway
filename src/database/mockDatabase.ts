import {
  database,
  userDTO,
  channelDTO,
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

  async addUser(username: string): Promise<userDTO> {
    const newUser: userDTO = { id: randomUUID(), username };
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
}
