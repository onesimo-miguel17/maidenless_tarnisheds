import { describe, expect, it } from "vitest";
import { normalizePowerResponse } from "./nasa-power";

describe("normalizePowerResponse", () => {
  it("normalizes real-shaped daily values, monthly totals and coverage", () => {
    const result = normalizePowerResponse(
      {
        properties: {
          parameter: {
            PRECTOTCORR: { "2026010100": 2, "2026010200": 0, "2026010300": -999 },
            T2M: { "2026010100": 24, "2026010200": 26, "2026010300": 25 },
            T2M_MAX: { "2026010100": 30, "2026010200": 32, "2026010300": 31 },
            T2M_MIN: { "2026010100": 19, "2026010200": 20, "2026010300": 20 },
            RH2M: { "2026010100": 70, "2026010200": 65, "2026010300": 68 },
          },
        },
      },
      -12.5,
      13.4,
      "2026-01-01",
      "2026-01-03",
      "2026-01-04T00:00:00.000Z",
    );

    expect(result.daily).toHaveLength(3);
    expect(result.daily[0].date).toBe("2026-01-01");
    expect(result.daily[2].precipitationMm).toBeNull();
    expect(result.summary.precipitationTotalMm).toBeNull();
    expect(result.summary.precipitationDays).toBe(1);
    expect(result.summary.meanTemperatureC).toBe(25);
    expect(result.summary.meanRelativeHumidityPct).toBeCloseTo(67.67, 1);
    expect(result.summary.validPrecipitationDays).toBe(2);
    expect(result.summary.missingPrecipitationDays).toBe(1);
    expect(result.summary.longestDrySpellDays).toBe(1);
    expect(result.monthly[0].precipitationTotalMm).toBeNull();
    expect(result.retrievedAt).toBe("2026-01-04T00:00:00.000Z");
    expect(result.timeStandard).toBe("UTC");
  });

  it("uses all available parameter dates instead of only temperature dates", () => {
    const result = normalizePowerResponse(
      {
        properties: {
          parameter: {
            PRECTOTCORR: { "2026010100": 0, "2026010200": 3 },
            T2M: { "2026010100": 25 },
          },
        },
      },
      0,
      0,
      "2026-01-01",
      "2026-01-02",
    );

    expect(result.daily).toHaveLength(2);
    expect(result.daily[1].meanTemperatureC).toBeNull();
    expect(result.daily[1].precipitationMm).toBe(3);
  });

  it("does not bridge missing precipitation days when calculating dry spells", () => {
    const result = normalizePowerResponse(
      {
        properties: {
          parameter: {
            PRECTOTCORR: {
              "2026010100": 0,
              "2026010200": 0,
              "2026010300": -999,
              "2026010400": 0,
              "2026010500": 0,
              "2026010600": 0,
            },
          },
        },
      },
      0,
      0,
      "2026-01-01",
      "2026-01-06",
    );

    expect(result.summary.longestDrySpellDays).toBe(3);
  });

  it("fills requested calendar dates missing entirely from the NASA response", () => {
    const result = normalizePowerResponse(
      {
        properties: {
          parameter: {
            PRECTOTCORR: { "2026010100": 0, "2026010300": 4 },
          },
        },
      },
      0,
      0,
      "2026-01-01",
      "2026-01-03",
    );

    expect(result.daily.map((record) => record.date)).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
    ]);
    expect(result.daily[1].precipitationMm).toBeNull();
    expect(result.summary.missingPrecipitationDays).toBe(1);
    expect(result.summary.longestDrySpellDays).toBe(1);
  });


  it("calculates period and monthly precipitation totals only with complete requested coverage", () => {
    const complete = normalizePowerResponse(
      {
        properties: {
          parameter: {
            PRECTOTCORR: { "2026010100": 2, "2026010200": 0, "2026010300": 4 },
          },
        },
      },
      0,
      0,
      "2026-01-01",
      "2026-01-03",
    );

    expect(complete.summary.precipitationTotalMm).toBe(6);
    expect(complete.monthly[0].precipitationTotalMm).toBe(6);
  });

  it("rejects malformed responses and empty time series", () => {
    expect(() =>
      normalizePowerResponse({}, 0, 0, "2026-01-01", "2026-01-03"),
    ).toThrow("estrutura inesperada");
    expect(() =>
      normalizePowerResponse(
        { properties: { parameter: { T2M: {} } } },
        0,
        0,
        "2026-01-01",
        "2026-01-03",
      ),
    ).toThrow("não devolveu observações");
  });
});
