export type userDTO = {
  id: string;
  username: string;
  twitchUserId: string;
  profileImageUrl: string | null;
  channelDescription: string | null;
  scope: string | null;
};
export type channelDTO = { id: string; name: string };
export type typeAchievementDTO = { id: string; label: string; data: string };
export type achievementDTO = {
  id: string;
  title: string;
  description: string;
  goal: number;
  reward: number;
  label: string;
};
export type badgeDTO = { id: string; title: string; img: string };
export type achievedDTO = {
  achievementId: string;
  userId: string;
  count: number;
  finished: boolean;
  labelActive: boolean;
  acquiredDate: string; // ISO
};
export type areDTO = { userId: string; channelId: string; userType: string };
export type possessesDTO = {
  userId: string;
  badgeId: string;
  acquiredDate: string;
};

export interface database {
  // User
  getUserById(id: string): Promise<userDTO | null>;
  addUser(user: {
    username: string;
    twitchUserId: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO>;

  // Channel
  getChannelById(id: string): Promise<channelDTO | null>;
  addChannel(channel: { name: string }): Promise<channelDTO>;

  // TypeAchievement
  getTypeAchievementById(id: string): Promise<typeAchievementDTO | null>;
  addTypeAchievement(t: {
    label: string;
    data: string;
  }): Promise<typeAchievementDTO>;

  // Achievement
  getAchievementById(id: string): Promise<achievementDTO | null>;
  addAchievement(a: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
  }): Promise<achievementDTO>;

  // Badge
  getBadgeById(id: string): Promise<badgeDTO | null>;
  addBadge(b: { title: string; img: string }): Promise<badgeDTO>;

  // Achieved (join)
  getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null>;
  addAchieved(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO>;

  // Are (join)
  getAre(userId: string, channelId: string): Promise<areDTO | null>;
  addAre(a: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO>;

  // Possesses (join)
  getPossesses(userId: string, badgeId: string): Promise<possessesDTO | null>;
  addPossesses(p: {
    userId: string;
    badgeId: string;
    acquiredDate: string;
  }): Promise<possessesDTO>;

  // ============ NEW: Get by User ID ============
  getChannelsByUserId(userId: string): Promise<channelDTO[]>;
  getBadgesByUserId(userId: string): Promise<badgeDTO[]>;
  getAchievementsByUserId(userId: string): Promise<achievedDTO[]>;

  // ============ NEW: Inverse lookups (get users by entity) ============
  getUsersByChannelId(channelId: string): Promise<userDTO[]>;
  getUsersByBadgeId(badgeId: string): Promise<userDTO[]>;
  getUsersByAchievementId(achievementId: string): Promise<userDTO[]>;
}
