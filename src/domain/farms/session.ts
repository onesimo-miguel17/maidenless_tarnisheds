import { z } from "zod";
import { farmSchema } from "./schema";
import { soilProfileSchema } from "../soil/schema";

export const farmerSessionSchema = z.object({
  farm: farmSchema,
  cropId: z.string().nullable().default(null),
  soilProfile: soilProfileSchema,
  updatedAt: z.string().datetime(),
});

export type FarmerSession = z.output<typeof farmerSessionSchema>;

const SESSION_PREFIX = "pambala:farmer-session:";

export function createFarmerSessionId(): string {
  return crypto.randomUUID();
}

export function saveFarmerSession(id: string, value: Omit<FarmerSession, "updatedAt">): boolean {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  try {
    const parsed = farmerSessionSchema.safeParse({ ...value, updatedAt: new Date().toISOString() });
    if (!parsed.success) return false;
    window.sessionStorage.setItem(`${SESSION_PREFIX}${id}`, JSON.stringify(parsed.data));
    return true;
  } catch {
    return false;
  }
}

export function readFarmerSession(id: string): FarmerSession | null {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  try {
    const raw = window.sessionStorage.getItem(`${SESSION_PREFIX}${id}`);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const result = farmerSessionSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
