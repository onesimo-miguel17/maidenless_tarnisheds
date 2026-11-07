import { describe, expect, it } from "vitest";
import { getAngolaGeographyCoverage } from "./coverage";

describe("Angola geographic registry coverage", () => {
  it("distinguishes national reference totals from imported records", () => {
    const coverage = getAngolaGeographyCoverage();

    expect(coverage.expected).toEqual({
      provinces: 21,
      municipalities: 326,
      communes: 378,
    });
    expect(coverage.registered).toEqual({
      provinces: 21,
      municipalities: 10,
      communes: 8,
    });
  });

  it("reports detailed hierarchy only for provinces with registered municipalities", () => {
    const coverage = getAngolaGeographyCoverage();

    expect(coverage.provincesWithDetailedHierarchy).toBe(1);
    expect(coverage.provincesWithoutDetailedHierarchy).toBe(20);
    expect(
      coverage.provinces.filter((province) => province.hasDetailedHierarchy).map(
        (province) => province.provinceName,
      ),
    ).toEqual(["Cabinda"]);
  });

  it("keeps unavailable geospatial capabilities explicitly disabled", () => {
    const coverage = getAngolaGeographyCoverage();

    expect(coverage.geometryAvailable).toBe(false);
    expect(coverage.automaticCoordinateAssignmentEnabled).toBe(false);
  });

  it("accounts for every province exactly once", () => {
    const coverage = getAngolaGeographyCoverage();

    expect(coverage.provinces).toHaveLength(coverage.expected.provinces);
    expect(
      coverage.provincesWithDetailedHierarchy +
        coverage.provincesWithoutDetailedHierarchy,
    ).toBe(coverage.provinces.length);
  });
});
