export interface IcappProvinceRecord {
  /** Internal key for the historical province name used in ICAPP 2024/2025. */
  provinceId: string;
  provinceName: string;
  agriculturalHoldings: number;
  temporaryCropsPlantedHa: number;
  permanentCropsPlantedHa: number;
  totalPlantedHa: number;
}

export interface IcappDatasetMetadata {
  datasetId: string;
  title: string;
  publisher: string;
  referencePeriod: string;
  publishedYear: number;
  geography: string;
  sourceTables: string[];
  sourceFiles: Array<{ label: string; url: string }>;
  methodology: string[];
  limitations: string[];
}

export const icappMetadata: IcappDatasetMetadata = {
  datasetId: "ao-ine-icapp-2024-2025",
  title: "Boletim dos Principais Resultados do ICAPP 2024/2025",
  publisher: "Instituto Nacional de Estatística de Angola (INE)",
  referencePeriod: "Campanha agrícola 2024/2025",
  publishedYear: 2026,
  geography: "18 províncias reportadas pelo INE para a campanha 2024/2025",
  sourceTables: ["Quadro 2", "Quadro 4", "Quadro 5"],
  sourceFiles: [
    {
      label: "Boletim PDF",
      url: "https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135904375282798.pdf",
    },
    {
      label: "Quadros estatísticos Excel",
      url: "https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135933953837199.xlsx",
    },
    {
      label: "Página da publicação no INE",
      url: "https://www.ine.gov.ao/publicacoes/detalhes/NTM0NzU=",
    },
  ],
  methodology: [
    "O ICAPP é um inquérito por amostragem; as províncias são domínios de estimação.",
    "A amostra familiar foi seleccionada a partir da base do RAPP 2019/2020.",
    "Parte dos dados de área e produção do sector familiar foi ajustada com medições GPS, quadrados de densidade e pesagem de produtos.",
    "Os valores apresentados são estatísticas de campanha e não medições de uma parcela individual.",
  ],
  limitations: [
    "A publicação apresenta 18 províncias. Não existe neste conjunto uma desagregação validada para as 21 províncias da divisão político-administrativa actual; não fazer repartições ou correspondências presumidas.",
    "No Quadro 4, a soma provincial das áreas temporárias e permanentes difere em 2 ha dos respectivos totais nacionais publicados, embora a soma das áreas totais provinciais coincida com o total nacional.",
    "Os valores de produtividade por cultura do Quadro 5 não são disponibilizados nesta primeira integração porque vários não coincidem com produção dividida pela área colhida. Os valores originais devem ser esclarecidos com o INE antes de serem usados.",
    "ND significa não disponível ou não declarado; nunca deve ser convertido em zero.",
    "A estatística provincial descreve actividade agrícola agregada e não determina a aptidão de uma parcela nem substitui observações locais.",
  ],
};

export const icappNationalSummary = {
  agriculturalHoldings: 2_628_507,
  plantedAreaHa: 5_597_471,
  harvestedAreaHa: 5_090_326,
  productionTons: 21_220_990,
  harvestedAreaCoveragePercent: 90.94,
  sourceTable: "Quadro 5",
} as const;

export const icappProvinceRecords: IcappProvinceRecord[] = [
  { provinceId: "bengo", provinceName: "Bengo", agriculturalHoldings: 71_148, temporaryCropsPlantedHa: 131_693, permanentCropsPlantedHa: 2_704, totalPlantedHa: 134_397 },
  { provinceId: "benguela", provinceName: "Benguela", agriculturalHoldings: 178_044, temporaryCropsPlantedHa: 315_788, permanentCropsPlantedHa: 6_483, totalPlantedHa: 322_271 },
  { provinceId: "bie", provinceName: "Bié", agriculturalHoldings: 306_875, temporaryCropsPlantedHa: 765_567, permanentCropsPlantedHa: 15_716, totalPlantedHa: 781_283 },
  { provinceId: "cabinda", provinceName: "Cabinda", agriculturalHoldings: 44_337, temporaryCropsPlantedHa: 35_752, permanentCropsPlantedHa: 734, totalPlantedHa: 36_486 },
  { provinceId: "cuando-cubango", provinceName: "Cuando Cubango", agriculturalHoldings: 56_744, temporaryCropsPlantedHa: 153_362, permanentCropsPlantedHa: 3_148, totalPlantedHa: 156_510 },
  { provinceId: "cuanza-norte", provinceName: "Cuanza Norte", agriculturalHoldings: 94_860, temporaryCropsPlantedHa: 171_202, permanentCropsPlantedHa: 3_515, totalPlantedHa: 174_717 },
  { provinceId: "cuanza-sul", provinceName: "Cuanza Sul", agriculturalHoldings: 304_595, temporaryCropsPlantedHa: 710_300, permanentCropsPlantedHa: 14_581, totalPlantedHa: 724_881 },
  { provinceId: "cun ene", provinceName: "Cunene", agriculturalHoldings: 117_763, temporaryCropsPlantedHa: 547_828, permanentCropsPlantedHa: 11_245, totalPlantedHa: 559_073 },
  { provinceId: "huambo", provinceName: "Huambo", agriculturalHoldings: 350_161, temporaryCropsPlantedHa: 519_063, permanentCropsPlantedHa: 10_655, totalPlantedHa: 529_718 },
  { provinceId: "huila", provinceName: "Huíla", agriculturalHoldings: 352_661, temporaryCropsPlantedHa: 1_100_188, permanentCropsPlantedHa: 22_584, totalPlantedHa: 1_122_772 },
  { provinceId: "luanda", provinceName: "Luanda", agriculturalHoldings: 68_557, temporaryCropsPlantedHa: 117_872, permanentCropsPlantedHa: 2_419, totalPlantedHa: 120_291 },
  { provinceId: "lunda-norte", provinceName: "Lunda Norte", agriculturalHoldings: 86_023, temporaryCropsPlantedHa: 93_911, permanentCropsPlantedHa: 1_928, totalPlantedHa: 95_839 },
  { provinceId: "lunda-sul", provinceName: "Lunda Sul", agriculturalHoldings: 49_277, temporaryCropsPlantedHa: 61_249, permanentCropsPlantedHa: 1_257, totalPlantedHa: 62_506 },
  { provinceId: "malanje", provinceName: "Malanje", agriculturalHoldings: 180_664, temporaryCropsPlantedHa: 305_715, permanentCropsPlantedHa: 6_275, totalPlantedHa: 311_990 },
  { provinceId: "moxico", provinceName: "Moxico", agriculturalHoldings: 88_768, temporaryCropsPlantedHa: 139_310, permanentCropsPlantedHa: 2_860, totalPlantedHa: 142_170 },
  { provinceId: "namibe", provinceName: "Namibe", agriculturalHoldings: 26_511, temporaryCropsPlantedHa: 69_764, permanentCropsPlantedHa: 1_432, totalPlantedHa: 71_196 },
  { provinceId: "uige", provinceName: "Uíge", agriculturalHoldings: 193_519, temporaryCropsPlantedHa: 194_191, permanentCropsPlantedHa: 3_986, totalPlantedHa: 198_177 },
  { provinceId: "zaire", provinceName: "Zaire", agriculturalHoldings: 58_000, temporaryCropsPlantedHa: 52_122, permanentCropsPlantedHa: 1_072, totalPlantedHa: 53_194 },
];

export function getIcappProvinceRecord(province: string): IcappProvinceRecord | undefined {
  const normalizedProvince = province.trim().toLocaleLowerCase("pt-AO");
  return icappProvinceRecords.find(
    (record) =>
      record.provinceId === normalizedProvince ||
      record.provinceName.toLocaleLowerCase("pt-AO") === normalizedProvince,
  );
}
