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
} from "../database/database";

// Central repo shape for all actions
export type GatewayRepo = {
  user: {
    addUser(user: {
      username: string;
      twitchUserId: string;
      profileImageUrl?: string | null;
      channelDescription?: string | null;
      scope?: string | null;
    }): Promise<userDTO>;
    getUserById(id: string): Promise<userDTO | null>;
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
    addAchievement(a: {
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
    addAchieved(a: {
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

// Minimalist validation helper
function missing(...fields: string[]) {
  return { ok: false, error: `missing: ${fields.join(", ")}` };
}

export async function handleJsonMessage(repo: GatewayRepo, msg: any) {
  const { action, payload = {} } = msg || {};
  try {
    switch (action) {
      // User
      case "createUser": {
        if (!payload.username || !payload.twitchUserId)
          return missing("username", "twitchUserId");
        const user = await repo.user.addUser({
          username: payload.username,
          twitchUserId: payload.twitchUserId,
          profileImageUrl: payload.profileImageUrl ?? null,
          channelDescription: payload.channelDescription ?? null,
          scope: payload.scope ?? null,
        });
        return { ok: true, user };
      }
      case "getUser": {
        const id = payload.userId || payload.User_ID;
        if (!id) return missing("userId");
        const user = await repo.user.getUserById(id);
        return { ok: true, user };
      }
      case "getChannelsByUserId": {
        const userId = payload.userId;
        if (!userId) return missing("userId");
        const channels = await repo.user.getChannelsByUserId(userId);
        return { ok: true, channels };
      }
      case "getBadgesByUserId": {
        const userId = payload.userId;
        if (!userId) return missing("userId");
        const badges = await repo.user.getBadgesByUserId(userId);
        return { ok: true, badges };
      }
      case "getAchievementsByUserId": {
        const userId = payload.userId;
        if (!userId) return missing("userId");
        const achievements = await repo.user.getAchievementsByUserId(userId);
        return { ok: true, achievements };
      }
      case "getUsersByChannelId": {
        const channelId = payload.channelId;
        if (!channelId) return missing("channelId");
        const users = await repo.user.getUsersByChannelId(channelId);
        return { ok: true, users };
      }
      case "getUsersByBadgeId": {
        const badgeId = payload.badgeId;
        if (!badgeId) return missing("badgeId");
        const users = await repo.user.getUsersByBadgeId(badgeId);
        return { ok: true, users };
      }
      case "getUsersByAchievementId": {
        const achievementId = payload.achievementId;
        if (!achievementId) return missing("achievementId");
        const users = await repo.user.getUsersByAchievementId(achievementId);
        return { ok: true, users };
      }

      // Channel
      case "createChannel": {
        if (!payload.name) return missing("name");
        const channel = await repo.channel.addChannel(payload.name);
        return { ok: true, channel };
      }
      case "getChannel": {
        const id = payload.channelId || payload.id;
        if (!id) return missing("channelId");
        const channel = await repo.channel.getChannelById(id);
        return { ok: true, channel };
      }

      // TypeAchievement
      case "createTypeAchievement": {
        if (!payload.label || !payload.data) return missing("label", "data");
        const typeAchievement = await repo.typeAchievement.addTypeAchievement(
          payload.label,
          payload.data,
        );
        return { ok: true, typeAchievement };
      }
      case "getTypeAchievement": {
        const id = payload.typeAchievementId || payload.id;
        if (!id) return missing("typeAchievementId");
        const typeAchievement =
          await repo.typeAchievement.getTypeAchievementById(id);
        return { ok: true, typeAchievement };
      }

      // Achievement
      case "createAchievement": {
        const { title, description, goal, reward, label } = payload;
        if (!title || !description || goal == null || reward == null || !label)
          return missing("title", "description", "goal", "reward", "label");
        const achievement = await repo.achievement.addAchievement({
          title,
          description,
          goal,
          reward,
          label,
        });
        return { ok: true, achievement };
      }
      case "getAchievement": {
        const id = payload.achievementId || payload.id;
        if (!id) return missing("achievementId");
        const achievement = await repo.achievement.getAchievementById(id);
        return { ok: true, achievement };
      }

      // Badge
      case "createBadge": {
        if (!payload.title || !payload.img) return missing("title", "img");
        const badge = await repo.badge.addBadge(payload.title, payload.img);
        return { ok: true, badge };
      }
      case "getBadge": {
        const id = payload.badgeId || payload.id;
        if (!id) return missing("badgeId");
        const badge = await repo.badge.getBadgeById(id);
        return { ok: true, badge };
      }

      // Achieved
      case "createAchieved": {
        const {
          achievementId,
          userId,
          count,
          finished,
          labelActive,
          acquiredDate,
        } = payload;
        if (
          !achievementId ||
          !userId ||
          count == null ||
          finished == null ||
          labelActive == null ||
          !acquiredDate
        )
          return missing(
            "achievementId",
            "userId",
            "count",
            "finished",
            "labelActive",
            "acquiredDate",
          );
        const achieved = await repo.achieved.addAchieved({
          achievementId,
          userId,
          count,
          finished,
          labelActive,
          acquiredDate,
        });
        return { ok: true, achieved };
      }
      case "getAchieved": {
        const { achievementId, userId } = payload;
        if (!achievementId || !userId)
          return missing("achievementId", "userId");
        const achieved = await repo.achieved.getAchieved(achievementId, userId);
        return { ok: true, achieved };
      }

      // Are
      case "createAre": {
        const { userId, channelId, userType } = payload;
        if (!userId || !channelId || !userType)
          return missing("userId", "channelId", "userType");
        const are = await repo.are.addAre(userId, channelId, userType);
        return { ok: true, are };
      }
      case "getAre": {
        const { userId, channelId } = payload;
        if (!userId || !channelId) return missing("userId", "channelId");
        const are = await repo.are.getAre(userId, channelId);
        return { ok: true, are };
      }

      // Possesses
      case "createPossesses": {
        const { userId, badgeId, acquiredDate } = payload;
        if (!userId || !badgeId || !acquiredDate)
          return missing("userId", "badgeId", "acquiredDate");
        const possesses = await repo.possesses.addPossesses(
          userId,
          badgeId,
          acquiredDate,
        );
        return { ok: true, possesses };
      }
      case "getPossesses": {
        const { userId, badgeId } = payload;
        if (!userId || !badgeId) return missing("userId", "badgeId");
        const possesses = await repo.possesses.getPossesses(userId, badgeId);
        return { ok: true, possesses };
      }

      default:
        return { ok: false, error: "unknown action" };
    }
  } catch (err: any) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
}
