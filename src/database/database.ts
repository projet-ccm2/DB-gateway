export type userDTO = {
  id: string;
  username: string;
  profileImageUrl: string | null;
  channelDescription: string | null;
  scope: string | null;
  lastUpdateTimestamp: string;
};
export type channelDTO = { id: string; name: string };
export type userChannelDTO = { id: string; name: string; userType: string };
export type channelUserDTO = {
  id: string;
  username: string;
  profileImageUrl: string | null;
  channelDescription: string | null;
  scope: string | null;
  lastUpdateTimestamp: string;
  userType: string;
};
export type typeAchievementDTO = { id: string; label: string; data: string };
export type achievementDTO = {
  id: string;
  title: string;
  description: string;
  goal: number;
  reward: number;
  label: string;
};
export type achievementWithTypeDTO = achievementDTO & {
  typeAchievement: typeAchievementDTO | null;
};
export type achievementWithTypeAndAchievedDTO = achievementWithTypeDTO & {
  achieved: achievedDTO | null;
};
export type userChannelAchievementsDTO = {
  userId: string;
  channelId: string;
  achievements: achievementWithTypeAndAchievedDTO[];
};
export type badgeDTO = { id: string; title: string; img: string };
export type achievedDTO = {
  achievementId: string;
  userId: string;
  count: number;
  finished: boolean;
  labelActive: boolean;
  acquiredDate: string;
};
export type areDTO = { userId: string; channelId: string; userType: string };
export type possessesDTO = {
  userId: string;
  badgeId: string;
  acquiredDate: string;
};

export interface Database {
  healthCheck(): Promise<boolean>;
  getAchievementsByChannelId(
    channelId: string,
  ): Promise<achievementWithTypeDTO[]>;
  getAchievementsByUserAndChannel(
    userId: string,
    channelId: string,
  ): Promise<userChannelAchievementsDTO>;
  getAchievedByUserAndChannels(
    userId: string,
    channelIds: string[],
  ): Promise<achievedDTO[]>;
  getUserById(id: string): Promise<userDTO | null>;
  getAllUsers(): Promise<userDTO[]>;
  addUser(user: {
    id: string;
    username: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
    lastUpdateTimestamp: string;
  }): Promise<userDTO>;
  updateUser(
    id: string,
    data: {
      username?: string;
      profileImageUrl?: string | null;
      channelDescription?: string | null;
      scope?: string | null;
      lastUpdateTimestamp?: string;
    },
  ): Promise<userDTO | null>;

  getChannelById(id: string): Promise<channelDTO | null>;
  addChannel(channel: { id: string; name: string }): Promise<channelDTO>;
  updateChannel(
    id: string,
    data: { name?: string },
  ): Promise<channelDTO | null>;

  getTypeAchievementById(id: string): Promise<typeAchievementDTO | null>;
  addTypeAchievement(t: {
    label: string;
    data: string;
  }): Promise<typeAchievementDTO>;

  getAchievementById(id: string): Promise<achievementDTO | null>;
  addAchievement(achievement: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
    channelId?: string | null;
  }): Promise<achievementDTO>;

  getBadgeById(id: string): Promise<badgeDTO | null>;
  addBadge(badge: { title: string; img: string }): Promise<badgeDTO>;

  getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null>;
  addAchieved(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO>;
  updateAchieved(payload: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO | null>;

  getAre(userId: string, channelId: string): Promise<areDTO | null>;
  getAreByUserId(userId: string): Promise<areDTO[]>;
  getAreByChannelId(channelId: string): Promise<areDTO[]>;
  addAre(payload: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO>;
  updateAre(
    userId: string,
    channelId: string,
    data: { userType?: string },
  ): Promise<areDTO | null>;
  deleteAre(userId: string, channelId: string): Promise<boolean>;

  getPossesses(userId: string, badgeId: string): Promise<possessesDTO | null>;
  addPossesses(p: {
    userId: string;
    badgeId: string;
    acquiredDate: string;
  }): Promise<possessesDTO>;

  getChannelsByUserId(userId: string): Promise<userChannelDTO[]>;
  getBadgesByUserId(userId: string): Promise<badgeDTO[]>;
  getAchievementsByUserId(userId: string): Promise<achievedDTO[]>;

  getUsersByChannelId(channelId: string): Promise<channelUserDTO[]>;
  getUsersByBadgeId(badgeId: string): Promise<userDTO[]>;
  getUsersByAchievementId(achievementId: string): Promise<userDTO[]>;
}
