import type { AdministrativeUnit, GeographicDatasetMetadata } from "./types";

/**
 * Administrative reference for Angola based on Law 14/24.
 *
 * Internal IDs are application identifiers, not official territorial codes.
 * Municipality and commune records are intentionally not fabricated here.
 */
export const angolaGeographyMetadata: GeographicDatasetMetadata = {
  countryCode: "AO",
  datasetId: "ao-administrative-division-2025",
  title: "Divisão político-administrativa de Angola",
  administrativeReferenceDate: "2025-01-01",
  publishedAt: "2024-09-05",
  accessedAt: "2026-11-04",
  sources: [
    {
      organization: "Assembleia Nacional da República de Angola",
      title: "Lei n.º 14/24, de 5 de Setembro — Lei da Divisão Político-Administrativa",
      url: "https://c2a.portais.gov.ao/uploads/LEI_14_24_5_de_SETEMBRO_LEI_DA_DPA_043a0de85f.pdf",
      notes:
        "Artigos 2.º e 3.º: estabelece 21 províncias, 326 municípios, 378 comunas e identifica as sedes provinciais.",
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
      url: "https://lex.ao/docs/assembleia-nacional/2025/lei-n-o-8-25-de-16-de-setembro/",
      notes:
        "Define a Codificação Nacional das Unidades Territoriais. Os códigos oficiais devem ser transcritos do anexo legal e verificados antes de serem adicionados.",
    },
  ],
  limitations: [
    "Este registo inicial contém apenas as 21 províncias e as respectivas sedes indicadas na Lei n.º 14/24.",
    "Os 326 municípios e 378 comunas são contagens nacionais de referência; os respectivos registos individuais ainda não estão incluídos.",
    "Os identificadores internos não substituem os códigos oficiais definidos pela Lei n.º 8/25.",
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
  { id: "ao-cabinda", name: "Cabinda", level: "province", parentId: "ao", administrativeSeat: "Cabinda", officialCode: null },
  { id: "ao-zaire", name: "Zaire", level: "province", parentId: "ao", administrativeSeat: "Mbanza Kongo", officialCode: null },
  { id: "ao-uige", name: "Uíge", level: "province", parentId: "ao", administrativeSeat: "Uíge", officialCode: null },
  { id: "ao-bengo", name: "Bengo", level: "province", parentId: "ao", administrativeSeat: "Dande", officialCode: null },
  { id: "ao-luanda", name: "Luanda", level: "province", parentId: "ao", administrativeSeat: "Ingombota", officialCode: null },
  { id: "ao-icolo-e-bengo", name: "Icolo e Bengo", level: "province", parentId: "ao", administrativeSeat: "Catete", officialCode: null },
  { id: "ao-cuanza-norte", name: "Cuanza-Norte", level: "province", parentId: "ao", administrativeSeat: "Cazengo", officialCode: null },
  { id: "ao-cuanza-sul", name: "Cuanza-Sul", level: "province", parentId: "ao", administrativeSeat: "Sumbe", officialCode: null },
  { id: "ao-malanje", name: "Malanje", level: "province", parentId: "ao", administrativeSeat: "Malanje", officialCode: null },
  { id: "ao-lunda-norte", name: "Lunda-Norte", level: "province", parentId: "ao", administrativeSeat: "Dundo", officialCode: null },
  { id: "ao-lunda-sul", name: "Lunda-Sul", level: "province", parentId: "ao", administrativeSeat: "Saurimo", officialCode: null },
  { id: "ao-moxico", name: "Moxico", level: "province", parentId: "ao", administrativeSeat: "Luena", officialCode: null },
  { id: "ao-moxico-leste", name: "Moxico Leste", level: "province", parentId: "ao", administrativeSeat: "Cazombo", officialCode: null },
  { id: "ao-bie", name: "Bié", level: "province", parentId: "ao", administrativeSeat: "Cuito", officialCode: null },
  { id: "ao-huambo", name: "Huambo", level: "province", parentId: "ao", administrativeSeat: "Huambo", officialCode: null },
  { id: "ao-benguela", name: "Benguela", level: "province", parentId: "ao", administrativeSeat: "Benguela", officialCode: null },
  { id: "ao-namibe", name: "Namibe", level: "province", parentId: "ao", administrativeSeat: "Moçâmedes", officialCode: null },
  { id: "ao-huila", name: "Huíla", level: "province", parentId: "ao", administrativeSeat: "Lubango", officialCode: null },
  { id: "ao-cunene", name: "Cunene", level: "province", parentId: "ao", administrativeSeat: "Cuanhama", officialCode: null },
  { id: "ao-cubango", name: "Cubango", level: "province", parentId: "ao", administrativeSeat: "Menongue", officialCode: null },
  { id: "ao-cuando", name: "Cuando", level: "province", parentId: "ao", administrativeSeat: "Mavinga", officialCode: null },
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
