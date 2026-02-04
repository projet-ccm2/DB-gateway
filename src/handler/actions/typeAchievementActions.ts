import type { HandlerFn } from "../types";
import { missing, str } from "../payload";

export const typeAchievementHandlers: Record<string, HandlerFn> = {
  createTypeAchievement: async (repo, payload) => {
    const label = str(payload, "label");
    const data = str(payload, "data");
    if (!label || !data) return missing("label", "data");
    const typeAchievement = await repo.typeAchievement.addTypeAchievement(
      label,
      data,
    );
    return { ok: true, typeAchievement };
  },

  getTypeAchievement: async (repo, payload) => {
    const id = str(payload, "typeAchievementId", "id");
    if (!id) return missing("typeAchievementId");
    const typeAchievement =
      await repo.typeAchievement.getTypeAchievementById(id);
    return { ok: true, typeAchievement };
  },
};
