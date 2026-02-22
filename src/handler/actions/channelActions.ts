import type { HandlerFn } from "../types";
import { missing, str } from "../payload";

export const channelHandlers: Record<string, HandlerFn> = {
  createChannel: async (repo, payload) => {
    const id = str(payload, "channelId", "id");
    if (!id) return missing("channelId");
    const name = str(payload, "name");
    if (!name) return missing("name");
    const channel = await repo.channel.addChannel(id, name);
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
    const channel = await repo.channel.updateChannel(id, { name });
    return { ok: true, channel };
  },
};
