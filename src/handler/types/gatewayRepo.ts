import type {
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
} from "../../database/database";

export type GatewayRepo = {
  user: {
    addUser(user: {
      id: string;
      username: string;
      profileImageUrl?: string | null;
      channelDescription?: string | null;
      scope?: string | null;
    }): Promise<userDTO>;
    getUserById(id: string): Promise<userDTO | null>;
    getAllUsers(): Promise<userDTO[]>;
    updateUser(
      id: string,
      data: {
        username?: string;
        profileImageUrl?: string | null;
        channelDescription?: string | null;
        scope?: string | null;
      },
    ): Promise<userDTO | null>;
    getChannelsByUserId(userId: string): Promise<userChannelDTO[]>;
    getBadgesByUserId(userId: string): Promise<badgeDTO[]>;
    getAchievementsByUserId(userId: string): Promise<achievedDTO[]>;
    getUsersByChannelId(channelId: string): Promise<channelUserDTO[]>;
    getUsersByBadgeId(badgeId: string): Promise<userDTO[]>;
    getUsersByAchievementId(achievementId: string): Promise<userDTO[]>;
  };
  channel: {
    addChannel(name: string): Promise<channelDTO>;
    getChannelById(id: string): Promise<channelDTO | null>;
  };
  typeAchievement: {
    addTypeAchievement(
      label: string,
      data: string,
    ): Promise<typeAchievementDTO>;
    getTypeAchievementById(id: string): Promise<typeAchievementDTO | null>;
  };
  achievement: {
    addAchievement(achievement: {
      title: string;
      description: string;
      goal: number;
      reward: number;
      label: string;
    }): Promise<achievementDTO>;
    getAchievementById(id: string): Promise<achievementDTO | null>;
  };
  badge: {
    addBadge(title: string, img: string): Promise<badgeDTO>;
    getBadgeById(id: string): Promise<badgeDTO | null>;
  };
  achieved: {
    addAchieved(payload: {
      achievementId: string;
      userId: string;
      count: number;
      finished: boolean;
      labelActive: boolean;
      acquiredDate: string;
    }): Promise<achievedDTO>;
    getAchieved(
      achievementId: string,
      userId: string,
    ): Promise<achievedDTO | null>;
  };
  are: {
    addAre(
      userId: string,
      channelId: string,
      userType: string,
    ): Promise<areDTO>;
    getAre(userId: string, channelId: string): Promise<areDTO | null>;
  };
  possesses: {
    addPossesses(
      userId: string,
      badgeId: string,
      acquiredDate: string,
    ): Promise<possessesDTO>;
    getPossesses(userId: string, badgeId: string): Promise<possessesDTO | null>;
  };
};
