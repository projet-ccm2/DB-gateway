import type { HandlerFn } from "../types";
import { bool, missing, num, str, strOrNull } from "../payload";

export const achievementHandlers: Record<string, HandlerFn> = {
  createAchievement: async (repo, payload) => {
    const title = str(payload, "title");
    const description = str(payload, "description");
    const goal = num(payload, "goal");
    const reward = num(payload, "reward");
    const label = str(payload, "label");
    const isPublic = bool(payload, "public");
    const active = bool(payload, "active");
    const secret = bool(payload, "secret");
    const image = str(payload, "image");
    const typeLabel = str(payload, "typeLabel");
    const typeData = str(payload, "typeData");
    if (
      !title ||
      !description ||
      goal == null ||
      reward == null ||
      !label ||
      isPublic == null ||
      active == null ||
      secret == null ||
      image == null ||
      !typeLabel ||
      !typeData
    ) {
      return missing(
        "title",
        "description",
        "goal",
        "reward",
        "label",
        "public",
        "active",
        "secret",
        "image",
        "typeLabel",
        "typeData",
      );
    }
    const achievement = await repo.achievement.addAchievement({
      title,
      description,
      goal,
      reward,
      label,
      public: isPublic,
      active,
      secret,
      image,
      channelId: strOrNull(payload, "channelId"),
      typeLabel,
      typeData,
    });
    return { ok: true, achievement };
  },

  updateAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const title = str(payload, "title");
    const description = str(payload, "description");
    const goal = num(payload, "goal");
    const reward = num(payload, "reward");
    const label = str(payload, "label");
    const isPublic = bool(payload, "public");
    const active = bool(payload, "active");
    const secret = bool(payload, "secret");
    const image = str(payload, "image");
    const typeLabel = str(payload, "typeLabel");
    const typeData = str(payload, "typeData");
    if (
      !title ||
      !description ||
      goal == null ||
      reward == null ||
      !label ||
      isPublic == null ||
      active == null ||
      secret == null ||
      image == null ||
      !typeLabel ||
      !typeData
    ) {
      return missing(
        "title",
        "description",
        "goal",
        "reward",
        "label",
        "public",
        "active",
        "secret",
        "image",
        "typeLabel",
        "typeData",
      );
    }
    const achievement = await repo.achievement.updateAchievement(id, {
      title,
      description,
      goal,
      reward,
      label,
      public: isPublic,
      active,
      secret,
      image,
      typeLabel,
      typeData,
    });
    if (!achievement) return { ok: false, error: "not found" };
    return { ok: true, achievement };
  },

  deleteAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.deleteAchievement(id);
    if (!achievement) return { ok: false, error: "not found" };
    return { ok: true, achievement };
  },

  getAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.getAchievementById(id);
    return { ok: true, achievement };
  },

  getPublicAchievements: async (repo) => {
    const achievements = await repo.achievement.getPublicAchievements();
    return { ok: true, achievements };
  },

  getAchievementDefinitionsByUserId: async (repo, payload) => {
    const userId = str(payload, "userId", "id");
    if (!userId) return missing("userId");
    const achievements =
      await repo.achievement.getAchievementDefinitionsByUserId(userId);
    return { ok: true, achievements };
  },

  activateAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.updateAchievementActive(
      id,
      true,
    );
    if (!achievement) return { ok: false, error: "not found" };
    return { ok: true, achievement };
  },

  deactivateAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.updateAchievementActive(
      id,
      false,
    );
    if (!achievement) return { ok: false, error: "not found" };
    return { ok: true, achievement };
  },

  publicAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.updateAchievementPublic(
      id,
      true,
    );
    if (!achievement) return { ok: false, error: "not found" };
    return { ok: true, achievement };
  },

  privateAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const achievement = await repo.achievement.updateAchievementPublic(
      id,
      false,
    );
    if (!achievement) return { ok: false, error: "not found" };
    return { ok: true, achievement };
  },
};
