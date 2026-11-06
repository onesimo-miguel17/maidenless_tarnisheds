import { describe, expect, it } from "vitest";
import { normalizePowerResponse } from "./nasa-power";

describe("normalizePowerResponse", () => {
  it("normalizes daily values and summarizes available observations", () => {
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
    );

    expect(result.daily).toHaveLength(3);
    expect(result.daily[0].date).toBe("2026-01-01");
    expect(result.daily[2].precipitationMm).toBeNull();
    expect(result.summary.precipitationTotalMm).toBe(2);
    expect(result.summary.precipitationDays).toBe(1);
    expect(result.summary.meanTemperatureC).toBe(25);
    expect(result.summary.meanRelativeHumidityPct).toBeCloseTo(67.67, 1);
    expect(result.timeStandard).toBe("UTC");
  });

  it("rejects a response without parameter data", () => {
    expect(() =>
      normalizePowerResponse({}, -12.5, 13.4, "2026-01-01", "2026-01-03"),
    ).toThrow("não contém dados");
  });

  it("rejects an empty time series", () => {
    expect(() =>
      normalizePowerResponse(
        { properties: { parameter: { T2M: {} } } },
        -12.5,
        13.4,
        "2026-01-01",
        "2026-01-03",
      ),
    ).toThrow("não devolveu observações");
  });
});
