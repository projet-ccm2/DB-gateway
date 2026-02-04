import { actionHandlers } from "./actions";
import type {
  GatewayRepo,
  JsonHandlerResult,
  JsonMessage,
  Payload,
} from "./types";

export type { GatewayRepo, JsonHandlerResult, JsonMessage };

export async function handleJsonMessage(
  repo: GatewayRepo,
  msg: JsonMessage | null | undefined,
): Promise<JsonHandlerResult> {
  const { action, payload = {} } = msg ?? {};
  try {
    const handler = action ? actionHandlers[action] : undefined;
    if (!handler) {
      return { ok: false, error: "unknown action" };
    }
    return await handler(repo, payload as Payload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
