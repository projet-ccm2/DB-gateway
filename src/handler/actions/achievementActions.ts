import type { GatewayRepo, HandlerFn, Payload } from "../types";
import { missing, num, str } from "../payload";

export const achievementHandlers: Record<string, HandlerFn> = {
  createAchievement: async (repo, payload) => {
    const title = str(payload, "title");
    const description = str(payload, "description");
    const goal = num(payload, "goal");
    const reward = num(payload, "reward");
    const label = str(payload, "label");
    if (!title || !description || goal == null || reward == null || !label) {
      return missing("title", "description", "goal", "reward", "label");
    }
    const achievement = await repo.achievement.addAchievement({
      title,
      description,
      goal,
      reward,
      label,
    });
    return { ok: true, achievement };
  },

  getAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.getAchievementById(id);
    return { ok: true, achievement };
  },
};
