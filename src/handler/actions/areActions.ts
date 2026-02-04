import type { HandlerFn } from "../types";
import { missing, str } from "../payload";

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
};
