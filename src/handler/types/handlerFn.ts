import type { GatewayRepo } from "./gatewayRepo";
import type { JsonHandlerResult } from "./jsonHandlerResult";
import type { Payload } from "./payload";

export type HandlerFn = (
  repo: GatewayRepo,
  payload: Payload,
) => Promise<JsonHandlerResult>;
