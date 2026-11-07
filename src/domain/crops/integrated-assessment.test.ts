import { describe, expect, it } from "vitest";
import type { ClimateDataset, DailyClimateRecord } from "@/lib/nasa-power";
import { soilProfileSchema } from "../soil/schema";
import type { CropProfile } from "./types";
import { assessCropAtPlot } from "./integrated-assessment";

const crop: CropProfile = {
  id: "milho",
  commonName: "Milho",
  scientificName: "Zea mays",
  description: "",
  botanicalFamily: "Poaceae",
  temperatureC: { min: 18, max: 33, unit: "°C", evidence: "general-guidance", sources: [] },
  annualRainfallMm: { min: 600, max: 1200, unit: "mm/ano", evidence: "general-guidance", sources: [] },
  soilTextures: [],
  phRange: { min: 5, max: 7, unit: "pH", evidence: "general-guidance", sources: [] },
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

function dataset(daily: DailyClimateRecord[]): ClimateDataset {
  return {
    source: "NASA POWER",
    community: "AG",
    timeStandard: "UTC",
    retrievedAt: "2026-11-06T12:00:00.000Z",
    coordinates: { latitude: -12.5, longitude: 13.4 },
    period: { start: daily[0]?.date ?? "2025-01-01", end: daily[daily.length - 1]?.date ?? "2025-01-01" },
    units: { precipitation: "mm/day", temperature: "°C", relativeHumidity: "%" },
    daily,
    monthly: [],
    summary: {
      precipitationTotalMm: null,
      precipitationDays: 0,
      meanTemperatureC: null,
      meanRelativeHumidityPct: null,
      validPrecipitationDays: 0,
      validTemperatureDays: 0,
      missingPrecipitationDays: 0,
      longestDrySpellDays: null,
    },
  };
}

describe("assessCropAtPlot", () => {
  it("combines soil and climate factors while preserving unknown inputs", () => {
    const soil = soilProfileSchema.parse({
      ph: { value: 6.2, measuredAt: "2026-10-01", method: "laboratory" },
      texture: "clayey",
      moisture: "normal",
      drainage: "unknown",
      fertility: "unknown",
      organicMatter: "unknown",
    });
    const climate = dataset([{
      date: "2025-01-01",
      precipitationMm: 2,
      meanTemperatureC: 25,
      maxTemperatureC: 30,
      minTemperatureC: 20,
      relativeHumidityPct: 65,
    }]);

    const result = assessCropAtPlot(soil, climate, crop);

    expect(result.cropId).toBe("milho");
    expect(result.location).toEqual({ latitude: -12.5, longitude: 13.4 });
    expect(result.soil.assessedFactors[0].status).toBe("compatible");
    expect(result.soilContext.texture).toBe("clayey");
    expect(result.soilContext.observedDrainage).toBe("unknown");
    expect(result.climate.factors[0].status).toBe("within-reference");
    expect(result.climate.factors[1].status).toBe("insufficient-data");
    expect(result.interpretation.factorsWithinReference).toBe(2);
    expect(result.interpretation.factorsInsufficientData).toBe(1);
    expect(result.interpretation.statement).toContain("não recomendação");
    expect(result.dataQuality.icappRegionalContextApplied).toBe(false);
    expect(result.dataQuality.blockedMetricIds).toContain("maize-productivity");
    expect(result.dataQuality.reason).toContain("limites geográficos validados");
  });

  it("does not convert a missing soil pH or missing climate observations into compatibility", () => {
    const soil = soilProfileSchema.parse({});
    const climate = dataset([{
      date: "2025-01-01",
      precipitationMm: null,
      meanTemperatureC: null,
      maxTemperatureC: null,
      minTemperatureC: null,
      relativeHumidityPct: null,
    }]);

    const result = assessCropAtPlot(soil, climate, crop);

    expect(result.soil.assessedFactors[0].status).toBe("unknown");
    expect(result.climate.factors[0].status).toBe("insufficient-data");
    expect(result.climate.factors[1].status).toBe("insufficient-data");
    expect(result.interpretation.factorsInsufficientData).toBe(3);
    expect(result.interpretation.factorsWithinReference).toBe(0);
  });
});
