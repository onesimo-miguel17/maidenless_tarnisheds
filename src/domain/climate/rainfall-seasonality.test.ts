import { describe, expect, it } from "vitest";
import type { DailyClimateRecord } from "@/lib/nasa-power";
import { analyzeRainfallSeasonality } from "./rainfall-seasonality";

function monthRecords(
  year: number,
  month: number,
  precipitationMm: number,
): DailyClimateRecord[] {
  const expectedDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: expectedDays }, (_, index) => ({
    date: new Date(Date.UTC(year, month - 1, index + 1)).toISOString().slice(0, 10),
    precipitationMm,
    meanTemperatureC: null,
    maxTemperatureC: null,
    minTemperatureC: null,
    relativeHumidityPct: null,
  }));
}

describe("analyzeRainfallSeasonality", () => {
  it("averages matching calendar months across complete years", () => {
    const records = [
      ...monthRecords(2025, 1, 2),
      ...monthRecords(2026, 1, 4),
      ...monthRecords(2025, 2, 1),
    ];

    const result = analyzeRainfallSeasonality(records);

    expect(result.months).toHaveLength(12);
    expect(result.months[0].meanPrecipitationMm).toBe(93);
    expect(result.months[0].completeMonths).toBe(2);
    expect(result.months[0].years).toEqual(["2025", "2026"]);
    expect(result.months[1].meanPrecipitationMm).toBe(28);
    expect(result.completeMonthCount).toBe(3);
    expect(result.excludedIncompleteMonthCount).toBe(0);
  });

  it("excludes incomplete months rather than treating missing days as zero", () => {
    const completeJanuary = monthRecords(2025, 1, 2);
    const partialFebruary = monthRecords(2025, 2, 3).slice(0, 10);
    const result = analyzeRainfallSeasonality([...completeJanuary, ...partialFebruary]);

    expect(result.months[0].meanPrecipitationMm).toBe(62);
    expect(result.months[1].meanPrecipitationMm).toBeNull();
    expect(result.monthlyCoverage[1]).toMatchObject({
      month: "2025-02",
      validDays: 10,
      expectedDays: 28,
      complete: false,
      precipitationTotalMm: null,
    });
    expect(result.excludedIncompleteMonthCount).toBe(1);
  });

  it("keeps a full month with missing precipitation unavailable", () => {
    const records = monthRecords(2024, 2, 1).map((record, index) =>
      index === 4 ? { ...record, precipitationMm: null } : record,
    );
    const result = analyzeRainfallSeasonality(records);

    expect(result.monthlyCoverage[0].expectedDays).toBe(29);
    expect(result.monthlyCoverage[0].validDays).toBe(28);
    expect(result.months[1].meanPrecipitationMm).toBeNull();
  });


  it("rejects duplicate dates even when the record count matches the month length", () => {
    const records = monthRecords(2025, 1, 2);
    records[10] = { ...records[10], date: records[9].date };
    const result = analyzeRainfallSeasonality(records);

    expect(result.monthlyCoverage[0]).toMatchObject({
      month: "2025-01",
      validDays: 31,
      expectedDays: 31,
      complete: false,
      precipitationTotalMm: null,
    });
    expect(result.months[0].meanPrecipitationMm).toBeNull();
  });

  it("returns unavailable month values when no records exist", () => {
    const result = analyzeRainfallSeasonality([]);

    expect(result.months).toHaveLength(12);
    expect(result.months.every((month) => month.meanPrecipitationMm === null)).toBe(true);
    expect(result.monthlyCoverage).toEqual([]);
  });
});
