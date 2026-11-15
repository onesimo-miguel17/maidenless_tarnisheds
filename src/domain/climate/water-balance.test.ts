import { describe, expect, it } from "vitest";
import type { DailyClimateRecord } from "../../lib/nasa-power";
import { analyzeWaterBalance, calculateDailyReferenceEt0 } from "./water-balance";

const completeDay: DailyClimateRecord = {
  date: "2026-06-15",
  precipitationMm: 1.2,
  meanTemperatureC: 25,
  maxTemperatureC: 31,
  minTemperatureC: 19,
  relativeHumidityPct: 60,
  windSpeed2mMs: 2.1,
  solarRadiationMjM2Day: 18.5,
};

describe("FAO-56 reference evapotranspiration", () => {
  it("calculates a finite non-negative daily ET0 when all required inputs exist", () => {
    const result = calculateDailyReferenceEt0(completeDay, -12.5, 120);
    expect(result).not.toBeNull();
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(15);
  });

  it("does not calculate ET0 when a required meteorological input is missing", () => {
    expect(calculateDailyReferenceEt0({
      ...completeDay,
      windSpeed2mMs: null,
    }, -12.5, 120)).toBeNull();
  });

  it("rejects invalid humidity and inverted temperature ranges", () => {
    expect(calculateDailyReferenceEt0({
      ...completeDay,
      relativeHumidityPct: 120,
    }, -12.5, 120)).toBeNull();
    expect(calculateDailyReferenceEt0({
      ...completeDay,
      maxTemperatureC: 18,
    }, -12.5, 120)).toBeNull();
  });
});

describe("analyzeWaterBalance", () => {
  it("withholds cumulative values when meteorological coverage is incomplete", () => {
    const result = analyzeWaterBalance([
      completeDay,
      { ...completeDay, date: "2026-06-16", windSpeed2mMs: null },
    ], -12.5, 120);

    expect(result.status).toBe("partial");
    expect(result.validEt0Days).toBe(1);
    expect(result.totalEt0Mm).toBeNull();
    expect(result.climateBalanceMm).toBeNull();
  });

  it("requires a valid grid elevation before calculating ET0", () => {
    const result = analyzeWaterBalance([completeDay], -12.5, null);
    expect(result.status).toBe("unavailable");
    expect(result.daily[0].referenceEt0Mm).toBeNull();
    expect(result.limitation).toContain("altitude");
  });

  it("reports cumulative climate balance only with complete paired observations", () => {
    const result = analyzeWaterBalance([
      completeDay,
      { ...completeDay, date: "2026-06-16", precipitationMm: 2 },
    ], -12.5, 120);

    expect(result.status).toBe("available");
    expect(result.validEt0Days).toBe(2);
    expect(result.completePairedDays).toBe(2);
    expect(result.totalEt0Mm).not.toBeNull();
    expect(result.climateBalanceMm).not.toBeNull();
  });
});
