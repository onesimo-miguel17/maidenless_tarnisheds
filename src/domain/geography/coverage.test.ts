import { describe, expect, it } from "vitest";
import { getAngolaGeographyCoverage } from "./coverage";

describe("Angola geographic registry coverage", () => {
  it("matches the national legal reference totals", () => {
    const coverage = getAngolaGeographyCoverage();
    expect(coverage.expected).toEqual({
      provinces: 21,
      municipalities: 326,
      communes: 378,
    });
    expect(coverage.registered).toEqual({
      provinceList: 21,
      municipalities: 326,
      communes: 378,
    });
  });

  it("reports detailed administrative hierarchy for all provinces", () => {
    const coverage = getAngolaGeographyCoverage();
    expect(coverage.provincesWithDetailedHierarchy).toBe(21);
    expect(coverage.provincesWithoutDetailedHierarchy).toBe(0);
    expect(coverage.provinces.every((province) => province.hasDetailedHierarchy)).toBe(true);
  });

  it("keeps geospatial capabilities disabled until authoritative boundaries are validated", () => {
    const coverage = getAngolaGeographyCoverage();
    expect(coverage.geometryAvailable).toBe(false);
    expect(coverage.automaticCoordinateAssignmentEnabled).toBe(false);
  });

  it("accounts for every province exactly once and preserves its imported counts", () => {
    const coverage = getAngolaGeographyCoverage();
    expect(coverage.provinces).toHaveLength(21);
    expect(coverage.provinces.reduce((sum, province) => sum + province.municipalityCount, 0)).toBe(326);
    expect(coverage.provinces.reduce((sum, province) => sum + province.communeCount, 0)).toBe(378);
  });
});
