import type { Payload } from "./payload";

export interface JsonMessage {
  action?: string;
  payload?: Payload;
}
