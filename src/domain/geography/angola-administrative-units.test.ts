import { describe, expect, it } from "vitest";
import { angolaProvinces } from "./angola";
import {
  cabindaCommunes,
  cabindaMunicipalities,
  zaireCommunes,
  zaireMunicipalities,
} from "./angola-administrative-units";

describe("Angola administrative hierarchy — Cabinda tranche", () => {
  it("contains the ten municipalities transcribed for Cabinda", () => {
    expect(cabindaMunicipalities).toHaveLength(10);
    expect(cabindaMunicipalities.map((unit) => unit.officialCode)).toEqual([
      "AOCDA0101", "AOCDA0102", "AOCDA0103", "AOCDA0104", "AOCDA0105",
      "AOCDA0106", "AOCDA0107", "AOCDA0108", "AOCDA0109", "AOCDA0110",
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
      "AOCDA010201", "AOCDA010202", "AOCDA010401", "AOCDA010402",
      "AOCDA010701", "AOCDA010702", "AOCDA010801", "AOCDA010802",
    ]);
  });

  it("links every Cabinda commune to an existing municipality", () => {
    const municipalityIds = new Set(cabindaMunicipalities.map((unit) => unit.id));
    expect(cabindaCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(cabindaCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not turn Cabinda's legal 00 commune placeholder into a commune record", () => {
    const communeParentIds = new Set(cabindaCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = cabindaMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Cabinda", "Buco Zau", "Miconje", "Massabi", "Liambo", "Ngoio",
    ]);
  });
});

describe("Angola administrative hierarchy — Zaire tranche", () => {
  it("contains the eleven municipalities with their exact legal codes", () => {
    expect(zaireMunicipalities).toHaveLength(11);
    expect(zaireMunicipalities.map((unit) => unit.officialCode)).toEqual([
      "AOZRE0201", "AOZRE0202", "AOZRE0203", "AOZRE0204", "AOZRE0205",
      "AOZRE0206", "AOZRE0207", "AOZRE0208", "AOZRE0209", "AOZRE0210",
      "AOZRE0211",
    ]);
    expect(zaireMunicipalities.map((unit) => unit.name)).toEqual([
      "Soyo", "Mbanza Kongo", "N'zeto", "Tomboco", "Cuimba", "Nóqui",
      "Luvo", "Lufico", "Quelo", "Serra de Canda", "Quindeje",
    ]);
  });

  it("links all Zaire municipalities to the Zaire province", () => {
    const zaire = angolaProvinces.find((province) => province.id === "ao-zaire");
    expect(zaire).toBeDefined();
    expect(zaireMunicipalities.every((unit) => unit.parentId === zaire?.id)).toBe(true);
    expect(zaireMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the eighteen explicitly listed Zaire communes with exact codes", () => {
    expect(zaireCommunes).toHaveLength(18);
    expect(zaireCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOZRE020101", "AOZRE020102", "AOZRE020201", "AOZRE020202",
      "AOZRE020203", "AOZRE020204", "AOZRE020301", "AOZRE020302",
      "AOZRE020401", "AOZRE020402", "AOZRE020403", "AOZRE020501",
      "AOZRE020502", "AOZRE020503", "AOZRE020801", "AOZRE020802",
      "AOZRE021101", "AOZRE021102",
    ]);
  });

  it("links each Zaire commune to an existing Zaire municipality", () => {
    const municipalityIds = new Set(zaireMunicipalities.map((unit) => unit.id));
    expect(zaireCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(zaireCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not create communes for the four municipality rows marked 00", () => {
    const communeParentIds = new Set(zaireCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = zaireMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Nóqui", "Luvo", "Quelo", "Serra de Canda",
    ]);
  });

  it("keeps IDs and official codes unique across both verified tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});
