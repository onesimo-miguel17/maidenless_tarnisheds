import { describe, expect, it } from "vitest";
import type { ClimateDataset, DailyClimateRecord } from "@/lib/nasa-power";
import type { CropProfile } from "./types";
import { assessCropAgainstClimate } from "./climate-assessment";

const crop: CropProfile = {
  id: "milho",
  commonName: "Milho",
  scientificName: "Zea mays",
  description: "",
  botanicalFamily: "Poaceae",
  temperatureC: { min: 18, max: 33, unit: "°C", evidence: "general-guidance", sources: [] },
  annualRainfallMm: { min: 600, max: 1200, unit: "mm/ano", evidence: "general-guidance", sources: [] },
  soilTextures: [],
  phRange: null,
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

function makeDataset(daily: DailyClimateRecord[]): ClimateDataset {
  return {
    source: "NASA POWER",
    community: "AG",
    timeStandard: "UTC",
    retrievedAt: "2026-01-01T00:00:00.000Z",
    coordinates: { latitude: -12, longitude: 13 },
    period: { start: daily[0]?.date ?? "2025-01-01", end: daily[daily.length - 1]?.date ?? "2025-12-31" },
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

function yearRecords(year: number, precipitation: number): DailyClimateRecord[] {
  const cursor = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const records: DailyClimateRecord[] = [];
  while (cursor < end) {
    records.push({
      date: cursor.toISOString().slice(0, 10),
      precipitationMm: precipitation,
      meanTemperatureC: 25,
      maxTemperatureC: null,
      minTemperatureC: null,
      relativeHumidityPct: null,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return records;
}

describe("assessCropAgainstClimate", () => {
  it("compares mean period temperature and complete calendar-year rainfall", () => {
    const dataset = makeDataset(yearRecords(2024, 2));
    const result = assessCropAgainstClimate(dataset, crop);

    expect(result.factors[0].status).toBe("within-reference");
    expect(result.annualRainfall[0].complete).toBe(true);
    expect(result.annualRainfall[0].precipitationMm).toBe(732);
    expect(result.factors[1].status).toBe("within-reference");
  });

  it("does not compare an incomplete year with an annual rainfall range", () => {
    const records = yearRecords(2025, 2).slice(0, 100);
    const result = assessCropAgainstClimate(makeDataset(records), crop);

    expect(result.annualRainfall[0].complete).toBe(false);
    expect(result.annualRainfall[0].precipitationMm).toBeNull();
    expect(result.factors[1].status).toBe("insufficient-data");
  });

  it("preserves missing temperature and pending evidence as insufficient data", () => {
    const dataset = makeDataset([{
      date: "2025-01-01",
      precipitationMm: null,
      meanTemperatureC: null,
      maxTemperatureC: null,
      minTemperatureC: null,
      relativeHumidityPct: null,
    }]);
    const pendingCrop = {
      ...crop,
      temperatureC: { ...crop.temperatureC!, evidence: "pending-validation" as const },
    };
    const result = assessCropAgainstClimate(dataset, pendingCrop);

    expect(result.factors[0].status).toBe("insufficient-data");
    expect(result.factors[0].observedValue).toBeNull();
    expect(result.factors[1].status).toBe("insufficient-data");
  });
});
