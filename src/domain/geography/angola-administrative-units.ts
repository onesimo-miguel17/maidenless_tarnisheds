import type { AdministrativeUnit } from "./types";

/**
 * Verified municipality/commune tranches.
 *
 * Transcribed from the annex to Law n.º 8/25, Diário da República,
 * I Série, n.º 176, 16 September 2025:
 * - Cabinda: page 20315.
 * - Zaire: page 20316.
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

export const zaireMunicipalities: AdministrativeUnit[] = [
  { id: "ao-zaire-soyo", name: "Soyo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0201" },
  { id: "ao-zaire-mbanza-kongo", name: "Mbanza Kongo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0202" },
  { id: "ao-zaire-nzeto", name: "N'zeto", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0203" },
  { id: "ao-zaire-tomboco", name: "Tomboco", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0204" },
  { id: "ao-zaire-cuimba", name: "Cuimba", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0205" },
  { id: "ao-zaire-noqui", name: "Nóqui", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0206" },
  { id: "ao-zaire-luvo", name: "Luvo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0207" },
  { id: "ao-zaire-lufico", name: "Lufico", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0208" },
  { id: "ao-zaire-quelo", name: "Quelo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0209" },
  { id: "ao-zaire-serra-de-canda", name: "Serra de Canda", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0210" },
  { id: "ao-zaire-quindeje", name: "Quindeje", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0211" },
];

export const zaireCommunes: AdministrativeUnit[] = [
  { id: "ao-zaire-soyo-soyo", name: "Soyo", level: "commune", parentId: "ao-zaire-soyo", officialCode: "AOZRE020101" },
  { id: "ao-zaire-soyo-pedra-de-feitico", name: "Pedra de Feitiço", level: "commune", parentId: "ao-zaire-soyo", officialCode: "AOZRE020102" },
  { id: "ao-zaire-mbanza-kongo-mbanza-kongo", name: "Mbanza Kongo", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020201" },
  { id: "ao-zaire-mbanza-kongo-madimba", name: "Madimba", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020202" },
  { id: "ao-zaire-mbanza-kongo-caluca", name: "Caluca", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020203" },
  { id: "ao-zaire-mbanza-kongo-quiende", name: "Quiende", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020204" },
  { id: "ao-zaire-nzeto-nzeto", name: "N'zeto", level: "commune", parentId: "ao-zaire-nzeto", officialCode: "AOZRE020301" },
  { id: "ao-zaire-nzeto-mussera", name: "Mussera", level: "commune", parentId: "ao-zaire-nzeto", officialCode: "AOZRE020302" },
  { id: "ao-zaire-tomboco-tomboco", name: "Tomboco", level: "commune", parentId: "ao-zaire-tomboco", officialCode: "AOZRE020401" },
  { id: "ao-zaire-tomboco-quinsimba", name: "Quinsimba", level: "commune", parentId: "ao-zaire-tomboco", officialCode: "AOZRE020402" },
  { id: "ao-zaire-tomboco-quinzau", name: "Quinzau", level: "commune", parentId: "ao-zaire-tomboco", officialCode: "AOZRE020403" },
  { id: "ao-zaire-cuimba-cuimba", name: "Cuimba", level: "commune", parentId: "ao-zaire-cuimba", officialCode: "AOZRE020501" },
  { id: "ao-zaire-cuimba-buela", name: "Buela", level: "commune", parentId: "ao-zaire-cuimba", officialCode: "AOZRE020502" },
  { id: "ao-zaire-cuimba-luvaca", name: "Luvaca", level: "commune", parentId: "ao-zaire-cuimba", officialCode: "AOZRE020503" },
  { id: "ao-zaire-lufico-lufico", name: "Lufico", level: "commune", parentId: "ao-zaire-lufico", officialCode: "AOZRE020801" },
  { id: "ao-zaire-lufico-mpala", name: "Mpala", level: "commune", parentId: "ao-zaire-lufico", officialCode: "AOZRE020802" },
  { id: "ao-zaire-quindeje-quibala-norte", name: "Quibala-Norte", level: "commune", parentId: "ao-zaire-quindeje", officialCode: "AOZRE021101" },
  { id: "ao-zaire-quindeje-quindeje", name: "Quindeje", level: "commune", parentId: "ao-zaire-quindeje", officialCode: "AOZRE021102" },
];
