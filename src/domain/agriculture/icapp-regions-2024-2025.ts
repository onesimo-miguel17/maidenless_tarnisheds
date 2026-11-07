export interface IcappRegionalRecord {
  regionId: "north" | "center" | "east" | "south";
  regionName: string;
  agriculturalHoldings: number;
  harvestedAreaHa: number;
  sourceTable: string;
}

export const icappRegionalMetadata = {
  datasetId: "ao-ine-icapp-2024-2025-regions",
  referencePeriod: "Campanha agrícola 2024/2025",
  publisher: "Instituto Nacional de Estatística de Angola (INE)",
  sourceTables: ["Quadro 7", "Quadro 8", "Quadro 9", "Quadro 10"],
  sourceWorkbook:
    "https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135933953837199.xlsx",
  sourcePublication:
    "https://www.ine.gov.ao/publicacoes/detalhes/NTM0NzU=",
  limitations: [
    "Os valores são agregados regionais da campanha 2024/2025 e não descrevem uma parcela individual.",
    "As regiões seguem a classificação usada nos quadros do ICAPP; não representam uma repartição pelas 21 províncias actuais.",
    "A desagregação por cultura dos Quadros 7 a 10 não é usada nesta integração: foram observadas inconsistências que exigem esclarecimento junto do INE.",
    "O número de explorações por cultura não deve ser somado para obter o total regional, pois uma exploração pode declarar várias culturas.",
    "ND significa não disponível ou não declarado e não deve ser convertido em zero.",
  ],
} as const;

export const icappRegionalRecords: IcappRegionalRecord[] = [
  {
    regionId: "north",
    regionName: "Norte",
    agriculturalHoldings: 711_085,
    harvestedAreaHa: 814_155,
    sourceTable: "Quadro 7",
  },
  {
    regionId: "center",
    regionName: "Centro",
    agriculturalHoldings: 1_139_675,
    harvestedAreaHa: 2_207_439,
    sourceTable: "Quadro 8",
  },
  {
    regionId: "east",
    regionName: "Leste",
    agriculturalHoldings: 224_068,
    harvestedAreaHa: 433_927,
    sourceTable: "Quadro 9",
  },
  {
    regionId: "south",
    regionName: "Sul",
    agriculturalHoldings: 553_679,
    harvestedAreaHa: 1_634_805,
    sourceTable: "Quadro 10",
  },
];
