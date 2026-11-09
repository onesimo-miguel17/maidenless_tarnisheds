import { afterEach, describe, expect, it, vi } from "vitest";
import { readFarmerSession, saveFarmerSession } from "./session";
import { soilProfileSchema } from "@/domain/soil/schema";

const sessionId = "123e4567-e89b-42d3-a456-426614174000";

function installSessionStorage(): Map<string, string> {
  const values = new Map<string, string>();
  vi.stubGlobal("window", {
    sessionStorage: {
      getItem: (key: string): string | null => values.get(key) ?? null,
      setItem: (key: string, value: string): void => { values.set(key, value); },
    },
  });
  return values;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("farmer session", () => {
  it("stores and reads a validated farm context for the current tab", () => {
    installSessionStorage();
    const saved = saveFarmerSession(sessionId, {
      farm: {
        name: "Fazenda do Vale",
        areaHa: 3,
        location: { latitude: -8.8, longitude: 13.2, source: "manual" },
      },
      cropId: "maize",
      soilProfile: soilProfileSchema.parse({ texture: "sandy", ph: { value: 6.1 } }),
    });

    expect(saved).toBe(true);
    const session = readFarmerSession(sessionId);
    expect(session?.farm.name).toBe("Fazenda do Vale");
    expect(session?.cropId).toBe("maize");
    expect(session?.soilProfile.texture).toBe("sandy");
    expect(session?.soilProfile.ph?.value).toBe(6.1);
  });

  it("rejects malformed identifiers and invalid session payloads", () => {
    const values = installSessionStorage();
    expect(saveFarmerSession("../invalid", {
      farm: { name: "Exploração", areaHa: null, location: {} },
      cropId: null,
      soilProfile: soilProfileSchema.parse({}),
    })).toBe(false);
    values.set("pambala:farmer-session:" + sessionId, "{not-json");
    expect(readFarmerSession(sessionId)).toBeNull();
    expect(readFarmerSession("not-an-id")).toBeNull();
  });

  it("returns false when tab storage is unavailable", () => {
    vi.stubGlobal("window", {
      get sessionStorage() { throw new Error("Storage blocked"); },
    });
    expect(saveFarmerSession(sessionId, {
      farm: { name: "Exploração", areaHa: null, location: {} },
      cropId: null,
      soilProfile: soilProfileSchema.parse({}),
    })).toBe(false);
    expect(readFarmerSession(sessionId)).toBeNull();
  });
});
