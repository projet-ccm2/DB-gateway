import type {
  userDTO,
  chanelDTO,
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
    addUser(username: string): Promise<userDTO>;
    getUserById(id: string): Promise<userDTO | null>;
  };
  chanel: {
    addChanel(name: string): Promise<chanelDTO>;
    getChanelById(id: string): Promise<chanelDTO | null>;
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
      aquiredDate: string;
    }): Promise<achievedDTO>;
    getAchieved(
      achievementId: string,
      userId: string,
    ): Promise<achievedDTO | null>;
  };
  are: {
    addAre(userId: string, chanelId: string, userType: string): Promise<areDTO>;
    getAre(userId: string, chanelId: string): Promise<areDTO | null>;
  };
  possesses: {
    addPossesses(
      userId: string,
      badgeId: string,
      aquiredDate: string,
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
        if (!payload.username) return missing("username");
        const user = await repo.user.addUser(payload.username);
        return { ok: true, user };
      }
      case "getUser": {
        const id = payload.userId || payload.User_ID;
        if (!id) return missing("userId");
        const user = await repo.user.getUserById(id);
        return { ok: true, user };
      }

      // Chanel
      case "createChanel": {
        if (!payload.name) return missing("name");
        const chanel = await repo.chanel.addChanel(payload.name);
        return { ok: true, chanel };
      }
      case "getChanel": {
        const id = payload.chanelId || payload.id;
        if (!id) return missing("chanelId");
        const chanel = await repo.chanel.getChanelById(id);
        return { ok: true, chanel };
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
          aquiredDate,
        } = payload;
        if (
          !achievementId ||
          !userId ||
          count == null ||
          finished == null ||
          labelActive == null ||
          !aquiredDate
        )
          return missing(
            "achievementId",
            "userId",
            "count",
            "finished",
            "labelActive",
            "aquiredDate",
          );
        const achieved = await repo.achieved.addAchieved({
          achievementId,
          userId,
          count,
          finished,
          labelActive,
          aquiredDate,
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
        const { userId, chanelId, userType } = payload;
        if (!userId || !chanelId || !userType)
          return missing("userId", "chanelId", "userType");
        const are = await repo.are.addAre(userId, chanelId, userType);
        return { ok: true, are };
      }
      case "getAre": {
        const { userId, chanelId } = payload;
        if (!userId || !chanelId) return missing("userId", "chanelId");
        const are = await repo.are.getAre(userId, chanelId);
        return { ok: true, are };
      }

      // Possesses
      case "createPossesses": {
        const { userId, badgeId, aquiredDate } = payload;
        if (!userId || !badgeId || !aquiredDate)
          return missing("userId", "badgeId", "aquiredDate");
        const possesses = await repo.possesses.addPossesses(
          userId,
          badgeId,
          aquiredDate,
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
