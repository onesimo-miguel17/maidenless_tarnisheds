import { describe, expect, it } from "vitest";
import { soilProfileSchema } from "./schema";

describe("soilProfileSchema", () => {
  it("accepts a profile when optional observations are unknown", () => {
    const result = soilProfileSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.texture).toBe("unknown");
      expect(result.data.ph).toBeNull();
      expect(result.data.moisture).toBe("unknown");
    }
  });

  it("accepts a measured pH within the valid scale", () => {
    const result = soilProfileSchema.safeParse({ ph: { value: 6.4, method: "Teste laboratorial" } });
    expect(result.success).toBe(true);
  });

  it("rejects a pH outside the 0–14 scale", () => {
    const result = soilProfileSchema.safeParse({ ph: { value: 15 } });
    expect(result.success).toBe(false);
  });

  it("rejects coordinates outside geographic bounds", () => {
    const result = soilProfileSchema.safeParse({
      location: { latitude: 120, longitude: 18 },
    });
    expect(result.success).toBe(false);
  });
});
