import type { HandlerFn } from "../types";
import { missing, str } from "../payload";

export const badgeHandlers: Record<string, HandlerFn> = {
  createBadge: async (repo, payload) => {
    const title = str(payload, "title");
    const img = str(payload, "img");
    const channelId = str(payload, "channelId");
    if (!title || !img || !channelId)
      return missing("title", "img", "channelId");
    try {
      const badge = await repo.badge.addBadge(title, img, channelId);
      if (!badge) return { ok: false, error: "channelId not found" };
      return { ok: true, badge };
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        "code" in err &&
        (err as { code: string }).code === "P2002"
      ) {
        return { ok: false, error: "badge already exists for channel" };
      }
      throw err;
    }
  },

  getBadge: async (repo, payload) => {
    const id = str(payload, "badgeId", "id");
    if (!id) return missing("badgeId");
    const badge = await repo.badge.getBadgeById(id);
    return { ok: true, badge };
  },
};
