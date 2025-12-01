export type userDTO = { id: string; username: string };
export type chanelDTO = { id: string; name: string };
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
  aquiredDate: string; // ISO
};
export type areDTO = { userId: string; chanelId: string; userType: string };
export type possessesDTO = { userId: string; badgeId: string; aquiredDate: string };

export interface database {
  // User
  getUserById(id: string): Promise<userDTO | null>;
  addUser(username: string): Promise<userDTO>;

  // Chanel
  getChanelById(id: string): Promise<chanelDTO | null>;
  addChanel(chanel: { name: string }): Promise<chanelDTO>;

  // TypeAchievement
  getTypeAchievementById(id: string): Promise<typeAchievementDTO | null>;
  addTypeAchievement(t: { label: string; data: string }): Promise<typeAchievementDTO>;

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
  getAchieved(achievementId: string, userId: string): Promise<achievedDTO | null>;
  addAchieved(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    aquiredDate: string;
  }): Promise<achievedDTO>;

  // Are (join)
  getAre(userId: string, chanelId: string): Promise<areDTO | null>;
  addAre(a: { userId: string; chanelId: string; userType: string }): Promise<areDTO>;

  // Possesses (join)
  getPossesses(userId: string, badgeId: string): Promise<possessesDTO | null>;
  addPossesses(p: { userId: string; badgeId: string; aquiredDate: string }): Promise<possessesDTO>;
}
