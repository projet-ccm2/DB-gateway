import type { HandlerFn } from "../types";
import { missing, str, strOrNull } from "../payload";

export const areHandlers: Record<string, HandlerFn> = {
  createAre: async (repo, payload) => {
    const userId = str(payload, "userId");
    const channelId = str(payload, "channelId");
    const userType = str(payload, "userType");
    if (!userId || !channelId || !userType) {
      return missing("userId", "channelId", "userType");
    }
    const are = await repo.are.addAre(userId, channelId, userType);
    return { ok: true, are };
  },

  getAre: async (repo, payload) => {
    const userId = str(payload, "userId");
    const channelId = str(payload, "channelId");
    if (!userId || !channelId) return missing("userId", "channelId");
    const are = await repo.are.getAre(userId, channelId);
    return { ok: true, are };
  },

  getAreByUserId: async (repo, payload) => {
    const userId = str(payload, "userId");
    if (!userId) return missing("userId");
    const records = await repo.are.getAreByUserId(userId);
    return { ok: true, records };
  },

  getAreByChannelId: async (repo, payload) => {
    const channelId = str(payload, "channelId");
    if (!channelId) return missing("channelId");
    const records = await repo.are.getAreByChannelId(channelId);
    return { ok: true, records };
  },

  updateAre: async (repo, payload) => {
    const userId = str(payload, "userId");
    const channelId = str(payload, "channelId");
    if (!userId || !channelId) return missing("userId", "channelId");
    const data: { userType?: string } = {};
    if ("userType" in payload) {
      const ut = strOrNull(payload, "userType");
      if (ut !== null) data.userType = ut;
    }
    const are = await repo.are.updateAre(userId, channelId, data);
    if (!are) return { ok: false, error: "not found" };
    return { ok: true, are };
  },

  deleteAre: async (repo, payload) => {
    const userId = str(payload, "userId");
    const channelId = str(payload, "channelId");
    if (!userId || !channelId) return missing("userId", "channelId");
    const deleted = await repo.are.deleteAre(userId, channelId);
    if (!deleted) return { ok: false, error: "not found" };
    return { ok: true };
  },
};
