import type { AdministrativeUnit } from "./types";

/**
 * First verified municipality/commune tranche.
 *
 * Transcribed from the annex to Law n.º 8/25, Diário da República,
 * I Série, n.º 176, 16 September 2025, page 20315.
 *
 * The annex uses commune code "00" when no commune is listed for a
 * municipality. Those placeholders are not separate commune records.
 */
export const cabindaMunicipalities: AdministrativeUnit[] = [
  { id: "ao-cabinda-cabinda", name: "Cabinda", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0101" },
  { id: "ao-cabinda-cacongo", name: "Cacongo", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0102" },
  { id: "ao-cabinda-buco-zau", name: "Buco Zau", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0103" },
  { id: "ao-cabinda-belize", name: "Belize", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0104" },
  { id: "ao-cabinda-miconje", name: "Miconje", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0105" },
  { id: "ao-cabinda-massabi", name: "Massabi", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0106" },
  { id: "ao-cabinda-necuto", name: "Necuto", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0107" },
  { id: "ao-cabinda-tando-zinze", name: "Tando Zinze", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0108" },
  { id: "ao-cabinda-liambo", name: "Liambo", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0109" },
  { id: "ao-cabinda-ngoio", name: "Ngoio", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0110" },
];

export const cabindaCommunes: AdministrativeUnit[] = [
  { id: "ao-cabinda-cacongo-landana", name: "Landana", level: "commune", parentId: "ao-cabinda-cacongo", officialCode: "AOCDA010201" },
  { id: "ao-cabinda-cacongo-dinge", name: "Dinge", level: "commune", parentId: "ao-cabinda-cacongo", officialCode: "AOCDA010202" },
  { id: "ao-cabinda-belize-belize", name: "Belize", level: "commune", parentId: "ao-cabinda-belize", officialCode: "AOCDA010401" },
  { id: "ao-cabinda-belize-luali", name: "Luali", level: "commune", parentId: "ao-cabinda-belize", officialCode: "AOCDA010402" },
  { id: "ao-cabinda-necuto-necuto", name: "Necuto", level: "commune", parentId: "ao-cabinda-necuto", officialCode: "AOCDA010701" },
  { id: "ao-cabinda-necuto-inhuca", name: "Inhuca", level: "commune", parentId: "ao-cabinda-necuto", officialCode: "AOCDA010702" },
  { id: "ao-cabinda-tando-zinze-tando-zinze", name: "Tando Zinze", level: "commune", parentId: "ao-cabinda-tando-zinze", officialCode: "AOCDA010801" },
  { id: "ao-cabinda-tando-zinze-malembo", name: "Malembo", level: "commune", parentId: "ao-cabinda-tando-zinze", officialCode: "AOCDA010802" },
];
