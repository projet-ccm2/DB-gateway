import type { GatewayRepo, HandlerFn, Payload } from "../types";
import { bool, missing, num, str } from "../payload";

export const achievedHandlers: Record<string, HandlerFn> = {
  createAchieved: async (repo, payload) => {
    const achievementId = str(payload, "achievementId");
    const userId = str(payload, "userId");
    const count = num(payload, "count");
    const finished = bool(payload, "finished");
    const labelActive = bool(payload, "labelActive");
    const acquiredDate = str(payload, "acquiredDate");
    if (
      !achievementId ||
      !userId ||
      count == null ||
      finished == null ||
      labelActive == null ||
      !acquiredDate
    ) {
      return missing(
        "achievementId",
        "userId",
        "count",
        "finished",
        "labelActive",
        "acquiredDate",
      );
    }
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

  getAchieved: async (repo, payload) => {
    const achievementId = str(payload, "achievementId");
    const userId = str(payload, "userId");
    if (!achievementId || !userId) return missing("achievementId", "userId");
    const achieved = await repo.achieved.getAchieved(achievementId, userId);
    return { ok: true, achieved };
  },
};
