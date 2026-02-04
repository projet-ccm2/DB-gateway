import type { HandlerFn } from "../types";
import { missing, str, strOrNull } from "../payload";

export const userHandlers: Record<string, HandlerFn> = {
  createUser: async (repo, payload) => {
    const username = str(payload, "username");
    const twitchUserId = str(payload, "twitchUserId");
    if (!username || !twitchUserId) return missing("username", "twitchUserId");
    const user = await repo.user.addUser({
      username,
      twitchUserId,
      profileImageUrl: strOrNull(payload, "profileImageUrl"),
      channelDescription: strOrNull(payload, "channelDescription"),
      scope: strOrNull(payload, "scope"),
    });
    return { ok: true, user };
  },

  getUser: async (repo, payload) => {
    const id = str(payload, "userId", "User_ID");
    if (!id) return missing("userId");
    const user = await repo.user.getUserById(id);
    return { ok: true, user };
  },

  getChannelsByUserId: async (repo, payload) => {
    const userId = str(payload, "userId");
    if (!userId) return missing("userId");
    const channels = await repo.user.getChannelsByUserId(userId);
    return { ok: true, channels };
  },

  getBadgesByUserId: async (repo, payload) => {
    const userId = str(payload, "userId");
    if (!userId) return missing("userId");
    const badges = await repo.user.getBadgesByUserId(userId);
    return { ok: true, badges };
  },

  getAchievementsByUserId: async (repo, payload) => {
    const userId = str(payload, "userId");
    if (!userId) return missing("userId");
    const achievements = await repo.user.getAchievementsByUserId(userId);
    return { ok: true, achievements };
  },

  getUsersByChannelId: async (repo, payload) => {
    const channelId = str(payload, "channelId");
    if (!channelId) return missing("channelId");
    const users = await repo.user.getUsersByChannelId(channelId);
    return { ok: true, users };
  },

  getUsersByBadgeId: async (repo, payload) => {
    const badgeId = str(payload, "badgeId");
    if (!badgeId) return missing("badgeId");
    const users = await repo.user.getUsersByBadgeId(badgeId);
    return { ok: true, users };
  },

  getUsersByAchievementId: async (repo, payload) => {
    const achievementId = str(payload, "achievementId");
    if (!achievementId) return missing("achievementId");
    const users = await repo.user.getUsersByAchievementId(achievementId);
    return { ok: true, users };
  },
};
