import { afterEach, describe, expect, it, vi } from "vitest";
import { clearFarmerSession, readFarmerSession, saveFarmerSession } from "./session";
import { soilProfileSchema } from "../soil/schema";

const sessionId = "123e4567-e89b-42d3-a456-426614174000";

function installSessionStorage(): Map<string, string> {
  const values = new Map<string, string>();
  vi.stubGlobal("window", {
    sessionStorage: {
      getItem: (key: string): string | null => values.get(key) ?? null,
      setItem: (key: string, value: string): void => { values.set(key, value); },
      removeItem: (key: string): void => { values.delete(key); },
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

  it("updates plot coordinates while preserving their provenance", () => {
    installSessionStorage();
    const initial = {
      farm: {
        name: "Fazenda do Vale",
        areaHa: 3,
        location: { latitude: -8.8, longitude: 13.2, source: "manual" as const },
      },
      cropId: null,
      soilProfile: soilProfileSchema.parse({}),
    };
    expect(saveFarmerSession(sessionId, initial)).toBe(true);

    const updated = {
      ...initial,
      farm: {
        ...initial.farm,
        location: {
          latitude: -9.1,
          longitude: 13.4,
          source: "device" as const,
          accuracyMeters: 18,
        },
      },
    };
    expect(saveFarmerSession(sessionId, updated)).toBe(true);
    expect(readFarmerSession(sessionId)?.farm.location).toMatchObject({
      latitude: -9.1,
      longitude: 13.4,
      source: "device",
      accuracyMeters: 18,
    });
  });

  it("clears the active temporary session", () => {
    const values = installSessionStorage();
    values.set("pambala:farmer-session:" + sessionId, JSON.stringify({}));
    clearFarmerSession(sessionId);
    expect(readFarmerSession(sessionId)).toBeNull();
    expect(values.size).toBe(0);
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
