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

// Action handlers split by domain to reduce cognitive complexity
const userHandlers = {
  createUser: async (repo: GatewayRepo, payload: any) => {
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
  },
  getUser: async (repo: GatewayRepo, payload: any) => {
    const id = payload.userId || payload.User_ID;
    if (!id) return missing("userId");
    const user = await repo.user.getUserById(id);
    return { ok: true, user };
  },
  getChannelsByUserId: async (repo: GatewayRepo, payload: any) => {
    if (!payload.userId) return missing("userId");
    const channels = await repo.user.getChannelsByUserId(payload.userId);
    return { ok: true, channels };
  },
  getBadgesByUserId: async (repo: GatewayRepo, payload: any) => {
    if (!payload.userId) return missing("userId");
    const badges = await repo.user.getBadgesByUserId(payload.userId);
    return { ok: true, badges };
  },
  getAchievementsByUserId: async (repo: GatewayRepo, payload: any) => {
    if (!payload.userId) return missing("userId");
    const achievements = await repo.user.getAchievementsByUserId(
      payload.userId,
    );
    return { ok: true, achievements };
  },
  getUsersByChannelId: async (repo: GatewayRepo, payload: any) => {
    if (!payload.channelId) return missing("channelId");
    const users = await repo.user.getUsersByChannelId(payload.channelId);
    return { ok: true, users };
  },
  getUsersByBadgeId: async (repo: GatewayRepo, payload: any) => {
    if (!payload.badgeId) return missing("badgeId");
    const users = await repo.user.getUsersByBadgeId(payload.badgeId);
    return { ok: true, users };
  },
  getUsersByAchievementId: async (repo: GatewayRepo, payload: any) => {
    if (!payload.achievementId) return missing("achievementId");
    const users = await repo.user.getUsersByAchievementId(
      payload.achievementId,
    );
    return { ok: true, users };
  },
};

const channelHandlers = {
  createChannel: async (repo: GatewayRepo, payload: any) => {
    if (!payload.name) return missing("name");
    const channel = await repo.channel.addChannel(payload.name);
    return { ok: true, channel };
  },
  getChannel: async (repo: GatewayRepo, payload: any) => {
    const id = payload.channelId || payload.id;
    if (!id) return missing("channelId");
    const channel = await repo.channel.getChannelById(id);
    return { ok: true, channel };
  },
};

const typeAchievementHandlers = {
  createTypeAchievement: async (repo: GatewayRepo, payload: any) => {
    if (!payload.label || !payload.data) return missing("label", "data");
    const typeAchievement = await repo.typeAchievement.addTypeAchievement(
      payload.label,
      payload.data,
    );
    return { ok: true, typeAchievement };
  },
  getTypeAchievement: async (repo: GatewayRepo, payload: any) => {
    const id = payload.typeAchievementId || payload.id;
    if (!id) return missing("typeAchievementId");
    const typeAchievement =
      await repo.typeAchievement.getTypeAchievementById(id);
    return { ok: true, typeAchievement };
  },
};

const achievementHandlers = {
  createAchievement: async (repo: GatewayRepo, payload: any) => {
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
  },
  getAchievement: async (repo: GatewayRepo, payload: any) => {
    const id = payload.achievementId || payload.id;
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.getAchievementById(id);
    return { ok: true, achievement };
  },
};

const badgeHandlers = {
  createBadge: async (repo: GatewayRepo, payload: any) => {
    if (!payload.title || !payload.img) return missing("title", "img");
    const badge = await repo.badge.addBadge(payload.title, payload.img);
    return { ok: true, badge };
  },
  getBadge: async (repo: GatewayRepo, payload: any) => {
    const id = payload.badgeId || payload.id;
    if (!id) return missing("badgeId");
    const badge = await repo.badge.getBadgeById(id);
    return { ok: true, badge };
  },
};

const achievedHandlers = {
  createAchieved: async (repo: GatewayRepo, payload: any) => {
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
  },
  getAchieved: async (repo: GatewayRepo, payload: any) => {
    const { achievementId, userId } = payload;
    if (!achievementId || !userId) return missing("achievementId", "userId");
    const achieved = await repo.achieved.getAchieved(achievementId, userId);
    return { ok: true, achieved };
  },
};

const areHandlers = {
  createAre: async (repo: GatewayRepo, payload: any) => {
    const { userId, channelId, userType } = payload;
    if (!userId || !channelId || !userType)
      return missing("userId", "channelId", "userType");
    const are = await repo.are.addAre(userId, channelId, userType);
    return { ok: true, are };
  },
  getAre: async (repo: GatewayRepo, payload: any) => {
    const { userId, channelId } = payload;
    if (!userId || !channelId) return missing("userId", "channelId");
    const are = await repo.are.getAre(userId, channelId);
    return { ok: true, are };
  },
};

const possessesHandlers = {
  createPossesses: async (repo: GatewayRepo, payload: any) => {
    const { userId, badgeId, acquiredDate } = payload;
    if (!userId || !badgeId || !acquiredDate)
      return missing("userId", "badgeId", "acquiredDate");
    const possesses = await repo.possesses.addPossesses(
      userId,
      badgeId,
      acquiredDate,
    );
    return { ok: true, possesses };
  },
  getPossesses: async (repo: GatewayRepo, payload: any) => {
    const { userId, badgeId } = payload;
    if (!userId || !badgeId) return missing("userId", "badgeId");
    const possesses = await repo.possesses.getPossesses(userId, badgeId);
    return { ok: true, possesses };
  },
};

// Combined action handlers
const actionHandlers: Record<
  string,
  (repo: GatewayRepo, payload: any) => Promise<any>
> = {
  ...userHandlers,
  ...channelHandlers,
  ...typeAchievementHandlers,
  ...achievementHandlers,
  ...badgeHandlers,
  ...achievedHandlers,
  ...areHandlers,
  ...possessesHandlers,
};

export async function handleJsonMessage(repo: GatewayRepo, msg: any) {
  const { action, payload = {} } = msg || {};
  try {
    const handler = actionHandlers[action];
    if (!handler) {
      return { ok: false, error: "unknown action" };
    }
    return await handler(repo, payload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
