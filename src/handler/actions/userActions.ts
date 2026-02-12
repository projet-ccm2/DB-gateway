import type { HandlerFn } from "../types";
import { missing, str, strOrNull } from "../payload";

export const userHandlers: Record<string, HandlerFn> = {
  createUser: async (repo, payload) => {
    const username = str(payload, "username");
    const id = str(payload, "id");
    if (!username || !id) return missing("username", "id");
    const user = await repo.user.addUser({
      id,
      username,
      profileImageUrl: strOrNull(payload, "profileImageUrl"),
      channelDescription: strOrNull(payload, "channelDescription"),
      scope: strOrNull(payload, "scope"),
    });
    return { ok: true, user };
  },

  getAllUsers: async (repo) => {
    const users = await repo.user.getAllUsers();
    return { ok: true, users };
  },

  getUser: async (repo, payload) => {
    const id = str(payload, "userId", "User_ID");
    if (!id) return missing("userId");
    const user = await repo.user.getUserById(id);
    return { ok: true, user };
  },

  updateUser: async (repo, payload) => {
    const id = str(payload, "userId", "id");
    if (!id) return missing("userId");
    const data: {
      username?: string;
      profileImageUrl?: string | null;
      channelDescription?: string | null;
      scope?: string | null;
    } = {};
    if ("username" in payload) {
      const u = strOrNull(payload, "username");
      if (u !== null) data.username = u;
    }
    if ("profileImageUrl" in payload)
      data.profileImageUrl = strOrNull(payload, "profileImageUrl");
    if ("channelDescription" in payload)
      data.channelDescription = strOrNull(payload, "channelDescription");
    if ("scope" in payload) data.scope = strOrNull(payload, "scope");
    const user = await repo.user.updateUser(id, data);
    if (!user) return { ok: false, error: "user not found" };
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
