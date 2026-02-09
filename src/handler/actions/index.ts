import { achievedHandlers } from "./achievedActions";
import { achievementHandlers } from "./achievementActions";
import { areHandlers } from "./areActions";
import { badgeHandlers } from "./badgeActions";
import { channelHandlers } from "./channelActions";
import { possessesHandlers } from "./possessesActions";
import { typeAchievementHandlers } from "./typeAchievementActions";
import { userHandlers } from "./userActions";

export const actionHandlers = {
  ...userHandlers,
  ...channelHandlers,
  ...typeAchievementHandlers,
  ...achievementHandlers,
  ...badgeHandlers,
  ...achievedHandlers,
  ...areHandlers,
  ...possessesHandlers,
};
