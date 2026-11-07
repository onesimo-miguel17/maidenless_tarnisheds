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
  it("preserves the municipality and commune totals for each province", () => {
    const coverage = getAngolaGeographyCoverage();
    expect(
      coverage.provinces.map(({ provinceId, municipalityCount, communeCount }) => ({
        provinceId,
        municipalityCount,
        communeCount,
      })),
    ).toEqual([
      { provinceId: "ao-cabinda", municipalityCount: 10, communeCount: 8 },
      { provinceId: "ao-zaire", municipalityCount: 11, communeCount: 18 },
      { provinceId: "ao-uige", municipalityCount: 23, communeCount: 44 },
      { provinceId: "ao-bengo", municipalityCount: 12, communeCount: 19 },
      { provinceId: "ao-luanda", municipalityCount: 16, communeCount: 13 },
      { provinceId: "ao-icolo-e-bengo", municipalityCount: 7, communeCount: 11 },
      { provinceId: "ao-cuanza-norte", municipalityCount: 17, communeCount: 24 },
      { provinceId: "ao-cuanza-sul", municipalityCount: 24, communeCount: 23 },
      { provinceId: "ao-malanje", municipalityCount: 27, communeCount: 38 },
      { provinceId: "ao-lunda-norte", municipalityCount: 19, communeCount: 20 },
      { provinceId: "ao-lunda-sul", municipalityCount: 14, communeCount: 4 },
      { provinceId: "ao-moxico", municipalityCount: 12, communeCount: 13 },
      { provinceId: "ao-moxico-leste", municipalityCount: 9, communeCount: 4 },
      { provinceId: "ao-bie", municipalityCount: 19, communeCount: 30 },
      { provinceId: "ao-huambo", municipalityCount: 17, communeCount: 30 },
      { provinceId: "ao-benguela", municipalityCount: 23, communeCount: 12 },
      { provinceId: "ao-namibe", municipalityCount: 9, communeCount: 11 },
      { provinceId: "ao-huila", municipalityCount: 23, communeCount: 28 },
      { provinceId: "ao-cunene", municipalityCount: 14, communeCount: 10 },
      { provinceId: "ao-cubango", municipalityCount: 11, communeCount: 12 },
      { provinceId: "ao-cuando", municipalityCount: 9, communeCount: 6 },
    ]);
  });

});
