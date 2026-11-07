import { describe, expect, it } from "vitest";
import { farmLocationSchema, farmSchema } from "./schema";

describe("farmSchema", () => {
  it("accepts a farm without optional area or location data", () => {
    const result = farmSchema.safeParse({ name: "Exploração familiar" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.areaHa).toBeNull();
      expect(result.data.location).toEqual({});
    }
  });

  it("normalizes the farm name and accepts a positive area", () => {
    const result = farmSchema.safeParse({
      name: "  Fazenda do Vale  ",
      areaHa: 2.5,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Fazenda do Vale");
      expect(result.data.areaHa).toBe(2.5);
    }
  });

  it("rejects an empty name and a non-positive area", () => {
    expect(farmSchema.safeParse({ name: " " }).success).toBe(false);
    expect(farmSchema.safeParse({ name: "Exploração", areaHa: 0 }).success).toBe(false);
  });

  it("accepts manually entered coordinates when both values and source are present", () => {
    const result = farmLocationSchema.safeParse({
      latitude: -8.8,
      longitude: 13.2,
      source: "manual",
    });

    expect(result.success).toBe(true);
  });

  it("accepts device coordinates and keeps device accuracy separate", () => {
    const result = farmLocationSchema.safeParse({
      latitude: -8.8,
      longitude: 13.2,
      source: "device",
      accuracyMeters: 18,
    });

    expect(result.success).toBe(true);
  });

  it("rejects partial coordinates", () => {
    const result = farmLocationSchema.safeParse({
      latitude: -8.8,
      source: "manual",
    });

    expect(result.success).toBe(false);
  });

  it("rejects coordinates without a declared source", () => {
    const result = farmLocationSchema.safeParse({
      latitude: -8.8,
      longitude: 13.2,
    });

    expect(result.success).toBe(false);
  });

  it("does not accept device accuracy for manually entered coordinates", () => {
    const result = farmLocationSchema.safeParse({
      latitude: -8.8,
      longitude: 13.2,
      source: "manual",
      accuracyMeters: 18,
    });

    expect(result.success).toBe(false);
  });

  it("rejects coordinates outside geographic bounds", () => {
    const result = farmLocationSchema.safeParse({
      latitude: -91,
      longitude: 13.2,
      source: "manual",
    });

    expect(result.success).toBe(false);
  });

  it("preserves administrative labels as user-entered text", () => {
    const result = farmLocationSchema.safeParse({
      provinceLabel: "Luanda",
      municipalityLabel: "Label introduzida pelo agricultor",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.provinceLabel).toBe("Luanda");
      expect(result.data.municipalityLabel).toBe("Label introduzida pelo agricultor");
      expect(result.data.latitude).toBeUndefined();
    }
  });
});
