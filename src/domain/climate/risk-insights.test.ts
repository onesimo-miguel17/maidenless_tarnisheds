import { describe, expect, it } from "vitest";
import type { DailyClimateRecord } from "@/lib/nasa-power";
import { analyzeClimateRiskInsights } from "./risk-insights";

function record(date: string, precipitationMm: number | null): DailyClimateRecord {
  return {
    date,
    precipitationMm,
    meanTemperatureC: null,
    maxTemperatureC: null,
    minTemperatureC: null,
    relativeHumidityPct: null,
  };
}

describe("analyzeClimateRiskInsights", () => {
  it("finds the longest consecutive sequence below 1 mm/day", () => {
    const result = analyzeClimateRiskInsights([
      record("2026-01-01", 0),
      record("2026-01-02", 0.5),
      record("2026-01-03", 1),
      record("2026-01-04", 0.2),
      record("2026-01-05", 0),
      record("2026-01-06", 0.8),
    ]);

    expect(result.drySpell).toEqual({
      startDate: "2026-01-04",
      endDate: "2026-01-06",
      durationDays: 3,
    });
    expect(result.precipitationCoverage).toMatchObject({
      validDays: 6,
      totalDays: 6,
      missingDays: 0,
      percentage: 100,
      status: "complete",
    });
  });

  it("interrupts a dry spell when precipitation is missing", () => {
    const result = analyzeClimateRiskInsights([
      record("2026-01-01", 0),
      record("2026-01-02", null),
      record("2026-01-03", 0),
    ]);

    expect(result.drySpell?.durationDays).toBe(1);
    expect(result.precipitationCoverage.status).toBe("partial");
    expect(result.precipitationCoverage.missingDays).toBe(1);
  });

  it("interrupts a dry spell when calendar dates are not consecutive", () => {
    const result = analyzeClimateRiskInsights([
      record("2026-01-01", 0),
      record("2026-01-03", 0),
    ]);

    expect(result.drySpell?.durationDays).toBe(1);
  });

  it("keeps dry-spell observations unavailable when all precipitation is missing", () => {
    const result = analyzeClimateRiskInsights([
      record("2026-01-01", null),
      record("2026-01-02", null),
    ]);

    expect(result.drySpell).toBeNull();
    expect(result.precipitationCoverage).toMatchObject({
      validDays: 0,
      totalDays: 2,
      missingDays: 2,
      percentage: 0,
      status: "unavailable",
    });
  });

  it("returns unavailable coverage for an empty record set", () => {
    const result = analyzeClimateRiskInsights([]);

    expect(result.drySpell).toBeNull();
    expect(result.precipitationCoverage).toMatchObject({
      validDays: 0,
      totalDays: 0,
      missingDays: 0,
      percentage: null,
      status: "unavailable",
    });
  });
});
