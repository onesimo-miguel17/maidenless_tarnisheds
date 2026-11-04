import { describe, expect, it } from "vitest";
import { cropCatalog, getCropById } from "./catalog";

describe("cropCatalog", () => {
  it("contains the six initial crops with unique identifiers", () => {
    const ids = cropCatalog.map((crop) => crop.id);

    expect(ids).toEqual([
      "milho",
      "feijao-comum",
      "mandioca",
      "amendoim",
      "sorgo",
      "batata-doce",
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps all initial profiles in draft pending local validation", () => {
    expect(cropCatalog.every((crop) => crop.validationStatus === "draft")).toBe(true);
  });

  it("marks general reference ranges as guidance, not local verification", () => {
    for (const crop of cropCatalog) {
      expect(crop.phRange?.evidence).toBe("general-guidance");
      expect(crop.temperatureC?.evidence).toBe("general-guidance");
      expect(crop.annualRainfallMm?.unit).toBe("mm/ano");
      expect(crop.sources.length).toBeGreaterThan(0);
    }
  });

  it("does not invent missing agronomic characteristics", () => {
    for (const crop of cropCatalog) {
      expect(crop.soilTextures).toEqual([]);
      expect(crop.drainage).toEqual([]);
      expect(crop.droughtTolerance).toBe("unknown");
      expect(crop.waterDemand).toBe("unknown");
      expect(crop.nutrientDemand).toBe("unknown");
      expect(crop.plantingSeasons).toEqual([]);
    }
  });

  it("retrieves a crop by its stable identifier", () => {
    expect(getCropById("mandioca")?.scientificName).toBe("Manihot esculenta");
    expect(getCropById("crop-unknown")).toBeUndefined();
  });
});
