import type { HandlerFn } from "../types";
import { missing, str, strOrNull } from "../payload";

export const channelHandlers: Record<string, HandlerFn> = {
  createChannel: async (repo, payload) => {
    const id = str(payload, "channelId", "id");
    if (!id) return missing("channelId");
    const name = str(payload, "name");
    if (!name) return missing("name");
    if (
      "discordWebhookUrl" in payload &&
      payload.discordWebhookUrl !== null &&
      payload.discordWebhookUrl !== undefined &&
      typeof payload.discordWebhookUrl !== "string"
    ) {
      return { ok: false, error: "invalid discordWebhookUrl" };
    }
    const discordWebhookUrl = strOrNull(payload, "discordWebhookUrl");
    const channel = await repo.channel.addChannel(id, name, discordWebhookUrl);
    return { ok: true, channel };
  },

  getChannel: async (repo, payload) => {
    const id = str(payload, "channelId", "id");
    if (!id) return missing("channelId");
    const channel = await repo.channel.getChannelById(id);
    return { ok: true, channel };
  },

  updateChannel: async (repo, payload) => {
    const id = str(payload, "channelId", "id");
    if (!id) return missing("channelId");
    const name = str(payload, "name");
    if (
      "discordWebhookUrl" in payload &&
      payload.discordWebhookUrl !== null &&
      payload.discordWebhookUrl !== undefined &&
      typeof payload.discordWebhookUrl !== "string"
    ) {
      return { ok: false, error: "invalid discordWebhookUrl" };
    }
    const discordWebhookUrl = strOrNull(payload, "discordWebhookUrl");
    const channel = await repo.channel.updateChannel(id, {
      name,
      discordWebhookUrl:
        payload.discordWebhookUrl === undefined ? undefined : discordWebhookUrl,
    });
    return { ok: true, channel };
  },

  getBadgeByChannelId: async (repo, payload) => {
    const id = str(payload, "channelId", "id");
    if (!id) return missing("channelId");
    const badge = await repo.channel.getBadgeByChannelId(id);
    return { ok: true, badge };
  },
};
