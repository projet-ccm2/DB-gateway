import type { JsonHandlerResult } from "./types";
import type { Payload } from "./types";

export function str(p: Payload, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = p[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return undefined;
}

export function strOrNull(p: Payload, key: string): string | null {
  const v = p[key];
  if (v == null) return null;
  return typeof v === "string" ? v : null;
}

export function num(p: Payload, key: string): number | undefined {
  const v = p[key];
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

export function bool(p: Payload, key: string): boolean | undefined {
  const v = p[key];
  if (typeof v === "boolean") return v;
  return undefined;
}

export function missing(...fields: string[]): JsonHandlerResult {
  return { ok: false, error: `missing: ${fields.join(", ")}` };
}
