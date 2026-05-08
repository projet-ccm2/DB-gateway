import type {
  userDTO,
  channelDTO,
  userChannelDTO,
  channelUserDTO,
  typeAchievementDTO,
  achievementDTO,
  achievementWithTypeDTO,
  achievementWithTypeAndAchievedDTO,
  badgeDTO,
  badgeWithChannelDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "../../database/database";

export type JsonHandlerResult =
  | {
      ok: true;
      user?: userDTO | null;
      users?: userDTO[] | channelUserDTO[];
      channel?: channelDTO | null;
      channels?: userChannelDTO[];
      typeAchievement?: typeAchievementDTO | null;
      achievement?: achievementDTO | null;
      achievedRecords?: achievedDTO[];
      achievementsWithType?: achievementWithTypeDTO[];
      achievementDefinitions?: achievementWithTypeAndAchievedDTO[];
      badge?: badgeDTO | null;
      badgeWithChannel?: badgeWithChannelDTO | null;
      badges?: badgeDTO[];
      achieved?: achievedDTO | null;
      are?: areDTO | null;
      records?: areDTO[];
      possesses?: possessesDTO | null;
    }
  | { ok: false; error: string };
