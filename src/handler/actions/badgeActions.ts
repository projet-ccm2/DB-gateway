import type { HandlerFn } from "../types";
import { missing, str } from "../payload";

export const badgeHandlers: Record<string, HandlerFn> = {
  createBadge: async (repo, payload) => {
    const title = str(payload, "title");
    const img = str(payload, "img");
    const channelId = str(payload, "channelId");
    if (!title || !img || !channelId)
      return missing("title", "img", "channelId");
    const badge = await repo.badge.addBadge(title, img, channelId);
    return { ok: true, badge };
  },

  getBadge: async (repo, payload) => {
    const id = str(payload, "badgeId", "id");
    if (!id) return missing("badgeId");
    const badge = await repo.badge.getBadgeById(id);
    return { ok: true, badge };
  },
};
