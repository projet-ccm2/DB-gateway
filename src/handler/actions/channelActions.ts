import type { GatewayRepo, HandlerFn, Payload } from "../types";
import { missing, str } from "../payload";

export const channelHandlers: Record<string, HandlerFn> = {
  createChannel: async (repo, payload) => {
    const name = str(payload, "name");
    if (!name) return missing("name");
    const channel = await repo.channel.addChannel(name);
    return { ok: true, channel };
  },

  getChannel: async (repo, payload) => {
    const id = str(payload, "channelId", "id");
    if (!id) return missing("channelId");
    const channel = await repo.channel.getChannelById(id);
    return { ok: true, channel };
  },
};
