import type { GatewayRepo, HandlerFn, Payload } from "../types";
import { missing, str } from "../payload";

export const possessesHandlers: Record<string, HandlerFn> = {
  createPossesses: async (repo, payload) => {
    const userId = str(payload, "userId");
    const badgeId = str(payload, "badgeId");
    const acquiredDate = str(payload, "acquiredDate");
    if (!userId || !badgeId || !acquiredDate) {
      return missing("userId", "badgeId", "acquiredDate");
    }
    const possesses = await repo.possesses.addPossesses(
      userId,
      badgeId,
      acquiredDate,
    );
    return { ok: true, possesses };
  },

  getPossesses: async (repo, payload) => {
    const userId = str(payload, "userId");
    const badgeId = str(payload, "badgeId");
    if (!userId || !badgeId) return missing("userId", "badgeId");
    const possesses = await repo.possesses.getPossesses(userId, badgeId);
    return { ok: true, possesses };
  },
};
