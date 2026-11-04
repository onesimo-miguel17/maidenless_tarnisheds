import { describe, expect, it } from "vitest";
import {
  angola,
  angolaGeographyMetadata,
  angolaProvinces,
  getProvinceById,
  getProvinceByName,
} from "./angola";

describe("Angola geographic foundation", () => {
  it("defines Angola as the root administrative unit", () => {
    expect(angola).toMatchObject({
      id: "ao",
      name: "Angola",
      level: "country",
      officialCode: "AO",
    });
  });

  it("contains the 21 provinces established by Law 14/24", () => {
    expect(angolaProvinces).toHaveLength(21);
    expect(new Set(angolaProvinces.map((province) => province.id)).size).toBe(21);
    expect(angolaProvinces.every((province) => province.parentId === "ao")).toBe(true);
    expect(angolaProvinces.every((province) => province.level === "province")).toBe(true);
  });

  it("includes the three provinces introduced by the new administrative division", () => {
    const names = angolaProvinces.map((province) => province.name);
    expect(names).toContain("Icolo e Bengo");
    expect(names).toContain("Moxico Leste");
    expect(names).toContain("Cuando");
  });

  it("preserves the provincial seats stated in the law", () => {
    expect(getProvinceByName("Luanda")?.administrativeSeat).toBe("Ingombota");
    expect(getProvinceByName("Icolo e Bengo")?.administrativeSeat).toBe("Catete");
    expect(getProvinceByName("Moxico Leste")?.administrativeSeat).toBe("Cazombo");
  });

  it("uses the 21 official provincial codes published in the annex to Law 8/25", () => {
    const expectedCodes = [
      "AOCDA01", "AOZRE02", "AOUGE03", "AOBGO04", "AOLDA05", "AOIBE06",
      "AOCNO07", "AOCSU08", "AOMJE09", "AOLNO10", "AOLSU11", "AOMCO12",
      "AOMLE13", "AOBIE14", "AOHBO15", "AOBLA16", "AONBE17", "AOHLA18",
      "AOCNE19", "AOCGO20", "AOCDO21",
    ];

    expect(angolaProvinces.map((province) => province.officialCode)).toEqual(expectedCodes);
    expect(new Set(expectedCodes).size).toBe(21);
  });

  it("does not invent geospatial coordinates", () => {
    expect(angolaProvinces.every((province) => !("latitude" in province))).toBe(true);
    expect(angolaProvinces.every((province) => !("longitude" in province))).toBe(true);
  });

  it("records source provenance and dataset limitations", () => {
    expect(angolaGeographyMetadata.sources.length).toBeGreaterThanOrEqual(4);
    expect(angolaGeographyMetadata.sources.some((source) => source.url.endsWith(".pdf"))).toBe(true);
    expect(angolaGeographyMetadata.administrativeCounts).toEqual({
      provinces: 21,
      municipalities: 326,
      communes: 378,
    });
    expect(angolaGeographyMetadata.limitations.length).toBeGreaterThan(0);
    expect(angolaGeographyMetadata.administrativeReferenceDate).toBe("2025-01-01");
  });

  it("supports province lookup by stable internal id and name", () => {
    expect(getProvinceById("ao-huila")?.name).toBe("Huíla");
    expect(getProvinceByName("  HUÍLA  ")?.id).toBe("ao-huila");
    expect(getProvinceById("unknown")).toBeUndefined();
  });
});
