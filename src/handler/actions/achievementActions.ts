import type { HandlerFn, JsonHandlerResult, Payload } from "../types";
import type { GatewayRepo } from "../types/gatewayRepo";
import type { achievementDTO } from "../../database/database";
import { bool, missing, num, str, strOrNull } from "../payload";

const ACHIEVEMENT_FIELDS = [
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
] as const;

function extractAchievementFields(payload: Payload) {
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
    return null;
  }
  return {
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
  };
}

async function toggleAchievement(
  repo: GatewayRepo,
  payload: Payload,
  updater: (id: string) => Promise<achievementDTO | null>,
): Promise<JsonHandlerResult> {
  const id = str(payload, "achievementId", "id");
  if (!id) return missing("achievementId");
  const achievement = await updater(id);
  if (!achievement) return { ok: false, error: "not found" };
  return { ok: true, achievement };
}

export const achievementHandlers: Record<string, HandlerFn> = {
  createAchievement: async (repo, payload) => {
    const fields = extractAchievementFields(payload);
    if (!fields) return missing(...ACHIEVEMENT_FIELDS);
    const achievement = await repo.achievement.addAchievement({
      ...fields,
      channelId: strOrNull(payload, "channelId"),
    });
    return { ok: true, achievement };
  },

  updateAchievement: async (repo, payload) => {
    const id = str(payload, "achievementId", "id");
    if (!id) return missing("achievementId");
    const fields = extractAchievementFields(payload);
    if (!fields) return missing(...ACHIEVEMENT_FIELDS);
    const achievement = await repo.achievement.updateAchievement(id, fields);
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
    const achievementsWithType = await repo.achievement.getPublicAchievements();
    return { ok: true, achievementsWithType };
  },

  getAchievementDefinitionsByUserId: async (repo, payload) => {
    const userId = str(payload, "userId", "id");
    if (!userId) return missing("userId");
    const achievementDefinitions =
      await repo.achievement.getAchievementDefinitionsByUserId(userId);
    return { ok: true, achievementDefinitions };
  },

  activateAchievement: (repo, payload) =>
    toggleAchievement(repo, payload, (id) =>
      repo.achievement.updateAchievementActive(id, true),
    ),

  deactivateAchievement: (repo, payload) =>
    toggleAchievement(repo, payload, (id) =>
      repo.achievement.updateAchievementActive(id, false),
    ),

  publicAchievement: (repo, payload) =>
    toggleAchievement(repo, payload, (id) =>
      repo.achievement.updateAchievementPublic(id, true),
    ),

  privateAchievement: (repo, payload) =>
    toggleAchievement(repo, payload, (id) =>
      repo.achievement.updateAchievementPublic(id, false),
    ),
};
