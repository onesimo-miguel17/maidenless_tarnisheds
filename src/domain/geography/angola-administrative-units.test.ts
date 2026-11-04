import { describe, expect, it } from "vitest";
import { angolaProvinces } from "./angola";
import { cabindaCommunes, cabindaMunicipalities } from "./angola-administrative-units";

describe("Angola administrative hierarchy — Cabinda tranche", () => {
  it("contains the ten municipalities transcribed for Cabinda", () => {
    expect(cabindaMunicipalities).toHaveLength(10);
    expect(cabindaMunicipalities.map((unit) => unit.officialCode)).toEqual([
      "AOCDA0101",
      "AOCDA0102",
      "AOCDA0103",
      "AOCDA0104",
      "AOCDA0105",
      "AOCDA0106",
      "AOCDA0107",
      "AOCDA0108",
      "AOCDA0109",
      "AOCDA0110",
    ]);
  });

  it("links each municipality to the Cabinda province", () => {
    const cabinda = angolaProvinces.find((province) => province.id === "ao-cabinda");
    expect(cabinda).toBeDefined();
    expect(cabindaMunicipalities.every((unit) => unit.parentId === cabinda?.id)).toBe(true);
    expect(cabindaMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains only the eight communes explicitly listed in the legal annex", () => {
    expect(cabindaCommunes).toHaveLength(8);
    expect(cabindaCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOCDA010201",
      "AOCDA010202",
      "AOCDA010401",
      "AOCDA010402",
      "AOCDA010701",
      "AOCDA010702",
      "AOCDA010801",
      "AOCDA010802",
    ]);
  });

  it("links every commune to an existing Cabinda municipality", () => {
    const municipalityIds = new Set(cabindaMunicipalities.map((unit) => unit.id));
    expect(cabindaCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(cabindaCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not turn the legal 00 commune placeholder into a commune record", () => {
    const communeParentIds = new Set(cabindaCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = cabindaMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );

    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Cabinda",
      "Buco Zau",
      "Miconje",
      "Massabi",
      "Liambo",
      "Ngoio",
    ]);
  });

  it("keeps internal IDs and official codes unique within the tranche", () => {
    const units = [...cabindaMunicipalities, ...cabindaCommunes];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});
