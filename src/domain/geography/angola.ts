import type { AdministrativeUnit, GeographicDatasetMetadata } from "./types";

/**
 * Administrative reference for Angola based on Law 14/24 and the national
 * territorial codes published in the annex to Law 8/25.
 *
 * Internal IDs are application identifiers, not legal territorial codes.
 * Municipality and commune records are maintained in the companion\n * angola-administrative-units.ts module and are not duplicated here.
 */
export const angolaGeographyMetadata: GeographicDatasetMetadata = {
  countryCode: "AO",
  datasetId: "ao-administrative-division-2025",
  title: "Divisão político-administrativa de Angola",
  administrativeReferenceDate: "2025-01-01",
  publishedAt: "2025-09-16",
  accessedAt: "2026-11-04",
  administrativeCounts: { provinces: 21, municipalities: 326, communes: 378 },
  sources: [
    {
      organization: "Assembleia Nacional da República de Angola",
      title: "Lei n.º 14/24, de 5 de Setembro — Lei da Divisão Político-Administrativa",
      url: "https://c2a.portais.gov.ao/uploads/LEI_14_24_5_de_SETEMBRO_LEI_DA_DPA_043a0de85f.pdf",
      notes:
        "Artigos 2.º e 3.º: estabelece 21 províncias, 326 municípios, 378 comunas e identifica as sedes provinciais.",
    },
    {
      organization: "Ministério das Relações Exteriores de Angola",
      title: "Nova divisão política administrativa — início de vigência em 1 de Janeiro de 2025",
      url: "https://brasil.mirex.gov.ao/web/noticias/nova-divisao-politica-administrativa",
      notes: "Comunicação institucional que indica o início de vigência da nova divisão em 1 de Janeiro de 2025.",
    },
    {
      organization: "Instituto Nacional de Estatística de Angola",
      title: "Resultados Definitivos do Recenseamento Geral da População e Habitação 2024",
      url: "https://www.ine.gov.ao/Arquivos/arquivosCarregados/Carregados/Publicacao_638992698392586291.pdf",
      notes:
        "Publicação de Novembro de 2025; apresenta resultados ajustados à nova divisão político-administrativa.",
    },
    {
      organization: "Assembleia Nacional da República de Angola",
      title: "Lei n.º 8/25, de 16 de Setembro — Lei sobre a Codificação das Unidades Territoriais",
      url: "https://files.lex.ao/assembleia-nacional/2025/lei-n-o-8-25-de-16-de-setembro/download/lei-n-o-8-25-de-16-de-setembro_assembleia-nacional_lex-ao.pdf",
      notes:
        "Anexo sobre a Codificação Nacional, publicado no Diário da República, I Série, n.º 176, de 16 de Setembro de 2025. Os códigos provinciais completos foram transcritos do PDF do diploma.",
    },
  ],
  limitations: [
    "Este registo contém as 21 províncias e as respectivas sedes indicadas na Lei n.º 14/24.",
    "Os registos individuais dos 326 municípios e 378 comunas estão em angola-administrative-units.ts, organizados pelas 21 tranches provinciais.",\n    "A cobertura é tabular: este conjunto não inclui polígonos, centroides, coordenadas ou limites territoriais.",
    "Os IDs internos não substituem os códigos territoriais oficiais definidos pela Lei n.º 8/25.",
    "Não são incluídos polígonos, centroides, coordenadas, limites ou áreas territoriais sem uma fonte geoespacial verificável.",
    "A divisão administrativa não representa zonas agroecológicas; estas serão modeladas num domínio separado.",
  ],
};

export const angola: AdministrativeUnit = {
  id: "ao",
  name: "Angola",
  level: "country",
  parentId: null,
  officialCode: "AO",
};

export const angolaProvinces: AdministrativeUnit[] = [
  { id: "ao-cabinda", name: "Cabinda", level: "province", parentId: "ao", administrativeSeat: "Cabinda", officialCode: "AOCDA01" },
  { id: "ao-zaire", name: "Zaire", level: "province", parentId: "ao", administrativeSeat: "Mbanza Kongo", officialCode: "AOZRE02" },
  { id: "ao-uige", name: "Uíge", level: "province", parentId: "ao", administrativeSeat: "Uíge", officialCode: "AOUGE03" },
  { id: "ao-bengo", name: "Bengo", level: "province", parentId: "ao", administrativeSeat: "Dande", officialCode: "AOBGO04" },
  { id: "ao-luanda", name: "Luanda", level: "province", parentId: "ao", administrativeSeat: "Ingombota", officialCode: "AOLDA05" },
  { id: "ao-icolo-e-bengo", name: "Icolo e Bengo", level: "province", parentId: "ao", administrativeSeat: "Catete", officialCode: "AOIBE06" },
  { id: "ao-cuanza-norte", name: "Cuanza-Norte", level: "province", parentId: "ao", administrativeSeat: "Cazengo", officialCode: "AOCNO07" },
  { id: "ao-cuanza-sul", name: "Cuanza-Sul", level: "province", parentId: "ao", administrativeSeat: "Sumbe", officialCode: "AOCSU08" },
  { id: "ao-malanje", name: "Malanje", level: "province", parentId: "ao", administrativeSeat: "Malanje", officialCode: "AOMJE09" },
  { id: "ao-lunda-norte", name: "Lunda-Norte", level: "province", parentId: "ao", administrativeSeat: "Dundo", officialCode: "AOLNO10" },
  { id: "ao-lunda-sul", name: "Lunda-Sul", level: "province", parentId: "ao", administrativeSeat: "Saurimo", officialCode: "AOLSU11" },
  { id: "ao-moxico", name: "Moxico", level: "province", parentId: "ao", administrativeSeat: "Luena", officialCode: "AOMCO12" },
  { id: "ao-moxico-leste", name: "Moxico Leste", level: "province", parentId: "ao", administrativeSeat: "Cazombo", officialCode: "AOMLE13" },
  { id: "ao-bie", name: "Bié", level: "province", parentId: "ao", administrativeSeat: "Cuito", officialCode: "AOBIE14" },
  { id: "ao-huambo", name: "Huambo", level: "province", parentId: "ao", administrativeSeat: "Huambo", officialCode: "AOHBO15" },
  { id: "ao-benguela", name: "Benguela", level: "province", parentId: "ao", administrativeSeat: "Benguela", officialCode: "AOBLA16" },
  { id: "ao-namibe", name: "Namibe", level: "province", parentId: "ao", administrativeSeat: "Moçâmedes", officialCode: "AONBE17" },
  { id: "ao-huila", name: "Huíla", level: "province", parentId: "ao", administrativeSeat: "Lubango", officialCode: "AOHLA18" },
  { id: "ao-cunene", name: "Cunene", level: "province", parentId: "ao", administrativeSeat: "Cuanhama", officialCode: "AOCNE19" },
  { id: "ao-cubango", name: "Cubango", level: "province", parentId: "ao", administrativeSeat: "Menongue", officialCode: "AOCGO20" },
  { id: "ao-cuando", name: "Cuando", level: "province", parentId: "ao", administrativeSeat: "Mavinga", officialCode: "AOCDO21" },
];

export function getProvinceById(id: string): AdministrativeUnit | undefined {
  return angolaProvinces.find((province) => province.id === id);
}

export function getProvinceByName(name: string): AdministrativeUnit | undefined {
  const normalizedName = name.trim().toLocaleLowerCase("pt-AO");
  return angolaProvinces.find(
    (province) => province.name.toLocaleLowerCase("pt-AO") === normalizedName,
  );
}
