import { describe, expect, it } from "vitest";
import { soilProfileSchema } from "../soil/schema";
import type { CropProfile } from "./types";
import { assessCropAgainstSoil } from "./recommendation";

const crop: CropProfile = {
  id: "milho",
  commonName: "Milho",
  scientificName: "Zea mays",
  description: "Cultura cerealífera.",
  botanicalFamily: "Poaceae",
  temperatureC: null,
  rainfallMmPerCycle: null,
  soilTextures: [],
  phRange: {
    min: 5,
    max: 7,
    unit: "pH",
    evidence: "general-guidance",
    sources: [],
  },
  cycleDays: null,
  plantingSeasons: [],
  drainage: [],
  droughtTolerance: "unknown",
  waterDemand: "unknown",
  nutrientDemand: "unknown",
  soilContribution: "",
  benefits: [],
  limitations: [],
  rotationNotes: [],
  sources: [],
  validationStatus: "draft",
};

describe("assessCropAgainstSoil", () => {
  it("returns a provisional match when measured pH is within the reference range", () => {
    const soil = soilProfileSchema.parse({ ph: { value: 6.2 } });
    const result = assessCropAgainstSoil(soil, crop);

    expect(result.status).toBe("provisional-match");
    expect(result.assessedFactors[0].status).toBe("compatible");
    expect(result.unassessedFactors).toContain("clima local e época de plantio");
  });

  it("requires review when measured pH is outside the reference range", () => {
    const soil = soilProfileSchema.parse({ ph: { value: 4.2 } });
    const result = assessCropAgainstSoil(soil, crop);

    expect(result.status).toBe("review-required");
    expect(result.assessedFactors[0].status).toBe("outside-range");
  });

  it("does not infer compatibility when pH is unknown", () => {
    const soil = soilProfileSchema.parse({});
    const result = assessCropAgainstSoil(soil, crop);

    expect(result.status).toBe("insufficient-data");
    expect(result.assessedFactors[0].status).toBe("unknown");
  });

  it("does not use ranges awaiting validation", () => {
    const soil = soilProfileSchema.parse({ ph: { value: 6 } });
    const pendingCrop = {
      ...crop,
      phRange: { ...crop.phRange!, evidence: "pending-validation" as const },
    };
    const result = assessCropAgainstSoil(soil, pendingCrop);

    expect(result.status).toBe("insufficient-data");
    expect(result.assessedFactors[0].expectedRange).toBeNull();
  });
});
