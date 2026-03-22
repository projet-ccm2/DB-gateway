import type { HandlerFn } from "../types";
import { missing, str } from "../payload";

export const possessesHandlers: Record<string, HandlerFn> = {
  createPossesses: async (repo, payload) => {
    const userId = str(payload, "userId");
    const badgeId = str(payload, "badgeId");
    const acquiredDate = str(payload, "acquiredDate");
    if (!userId || !badgeId || !acquiredDate) {
      return missing("userId", "badgeId", "acquiredDate");
    }
    const existing = await repo.possesses.getPossesses(userId, badgeId);
    if (existing) {
      return { ok: false, error: "already exists" };
    }
    try {
      const possesses = await repo.possesses.addPossesses(
        userId,
        badgeId,
        acquiredDate,
      );
      return { ok: true, possesses };
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        "code" in err &&
        (err as { code: string }).code === "P2002"
      ) {
        return { ok: false, error: "already exists" };
      }
      throw err;
    }
  },

  getPossesses: async (repo, payload) => {
    const userId = str(payload, "userId");
    const badgeId = str(payload, "badgeId");
    if (!userId || !badgeId) return missing("userId", "badgeId");
    const possesses = await repo.possesses.getPossesses(userId, badgeId);
    return { ok: true, possesses };
  },
};
