export type IcappQualityStatus = "inconsistent" | "pending-clarification";

export interface IcappQualityFinding {
  id: string;
  title: string;
  status: IcappQualityStatus;
  severity: "high" | "medium" | "low";
  sourceTables: string[];
  indicator: string;
  publishedValues: string[];
  verification: string;
  interpretation: string;
  usageRule: string;
}

export const icappQualityMetadata = {
  datasetId: "ao-ine-icapp-2024-2025-quality",
  title: "Registo de qualidade dos dados ICAPP 2024/2025",
  publisher: "Instituto Nacional de Estatística de Angola (INE)",
  referencePeriod: "Campanha agrícola 2024/2025",
  sourceWorkbook:
    "https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135933953837199.xlsx",
  sourcePublication:
    "https://www.ine.gov.ao/publicacoes/detalhes/NTM0NzU=",
  methodology: [
    "Os valores publicados são preservados tal como aparecem nos quadros; as verificações aritméticas são apresentadas separadamente.",
    "Uma divergência é um sinal para validação, não uma autorização para corrigir ou substituir o valor oficial.",
    "ND e outros marcadores não numéricos permanecem indisponíveis e nunca são convertidos em zero.",
    "Os subtotais de explorações por cultura não são somados para reconstruir totais, respeitando a nota metodológica do INE.",
  ],
  limitations: [
    "Este registo é uma auditoria documental inicial do ficheiro Excel oficial, não uma errata emitida pelo INE.",
    "As diferenças podem resultar de definições, universos, transcrição, formatação ou erros de publicação; não se presume a causa.",
    "Nenhum indicador classificado como inconsistente ou pendente deve alimentar rankings, previsões ou recomendações agrícolas.",
  ],
} as const;

export const icappQualityFindings: IcappQualityFinding[] = [
  {
    id: "maize-productivity",
    title: "Produtividade do milho não reconcilia com produção e área colhida",
    status: "inconsistent",
    severity: "high",
    sourceTables: ["Quadro 5"],
    indicator: "Milho — produção, área colhida e produtividade",
    publishedValues: [
      "Produção: 4 346 797 toneladas",
      "Área colhida: 2 705 190 ha",
      "Produtividade publicada: 6 306 kg/ha",
    ],
    verification:
      "Produção ÷ área colhida × 1 000 = aproximadamente 1 606,84 kg/ha, diferente dos 6 306 kg/ha publicados.",
    interpretation:
      "A produtividade publicada não corresponde ao cálculo directo a partir dos outros dois valores apresentados no mesmo quadro. A origem da diferença não está esclarecida.",
    usageRule:
      "Não utilizar a produtividade do milho nem substituir pelo cálculo derivado até esclarecimento oficial.",
  },
  {
    id: "regional-maize-area",
    title: "Área de milho regional não reconcilia com o total nacional",
    status: "inconsistent",
    severity: "high",
    sourceTables: ["Quadros 5, 7, 8, 9 e 10"],
    indicator: "Milho — área colhida",
    publishedValues: [
      "Total nacional (Quadro 5): 2 705 190 ha",
      "Norte: 199 442 ha",
      "Centro: 72 601 ha",
      "Leste: 14 272 ha",
      "Sul: 197 199 ha",
      "Soma regional: 483 514 ha",
    ],
    verification:
      "A soma das quatro áreas regionais publicadas é 483 514 ha, uma diferença de 2 221 676 ha face ao total nacional publicado.",
    interpretation:
      "Os valores não reconciliam entre os quadros consultados. A publicação disponível não explica esta diferença.",
    usageRule:
      "Não apresentar distribuição regional do milho nem comparar regiões com base nestes valores.",
  },
  {
    id: "regional-cereal-holdings-south",
    title: "Explorações de cereais no Sul excedem o total regional",
    status: "inconsistent",
    severity: "high",
    sourceTables: ["Quadro 10"],
    indicator: "Região Sul — número de explorações",
    publishedValues: [
      "Total regional: 553 679 explorações",
      "Cereais: 754 049 explorações",
    ],
    verification:
      "A linha de cereais excede o total regional em 200 370 explorações.",
    interpretation:
      "A relação entre o universo do total regional e o valor da linha de cereais precisa de esclarecimento. A nota sobre não somar culturas não explica, por si só, uma linha individual superior ao total.",
    usageRule:
      "Não utilizar o número de explorações de cereais do Sul.",
  },
  {
    id: "legumes-holdings-cross-table",
    title: "Explorações de leguminosas diferem entre quadros",
    status: "pending-clarification",
    severity: "medium",
    sourceTables: ["Quadros 3, 5 e 11"],
    indicator: "Leguminosas e oleaginosas — número de explorações",
    publishedValues: [
      "Quadro 3: 653 015",
      "Quadro 5: 651 364",
      "Quadro 11: 651 364",
    ],
    verification:
      "O Quadro 3 difere dos Quadros 5 e 11 em 1 651 explorações.",
    interpretation:
      "Os quadros podem aplicar universos ou definições diferentes; a publicação consultada não permite confirmar a razão.",
    usageRule:
      "Não combinar estes valores nem escolher um como correcto sem confirmação metodológica.",
  },
  {
    id: "family-holdings-denominator",
    title: "Total do Quadro 11 não coincide com o total de explorações familiares",
    status: "pending-clarification",
    severity: "medium",
    sourceTables: ["Quadros 2 e 11"],
    indicator: "Explorações familiares — total",
    publishedValues: [
      "Quadro 2: 2 621 997 explorações familiares (EAF)",
      "Quadro 11: 2 628 507 explorações na linha Total",
    ],
    verification:
      "O total do Quadro 11 excede o total EAF do Quadro 2 em 6 510, exactamente o número de explorações empresariais (EAE) indicado no Quadro 2.",
    interpretation:
      "O título do Quadro 11 refere explorações familiares, mas a linha Total coincide com o total geral de explorações. É necessário esclarecer o universo usado nas linhas e colunas.",
    usageRule:
      "Não usar o total do Quadro 11 como denominador de explorações familiares.",
  },
  {
    id: "eggs-provincial-reconciliation",
    title: "Pequenas diferenças entre totais provinciais e nacionais de ovos",
    status: "pending-clarification",
    severity: "low",
    sourceTables: ["Quadro 15"],
    indicator: "Produção e venda de ovos — soma provincial",
    publishedValues: [
      "Explorações produtoras: nacional 144 254; soma provincial 144 252",
      "Quantidade produzida: nacional 3 916 882 dúzias; soma provincial 3 916 886",
      "Explorações vendedoras: nacional 78 368; soma provincial 78 368",
      "Quantidade vendida: nacional 2 247 123 dúzias; soma provincial 2 247 122",
    ],
    verification:
      "As somas provinciais diferem dos totais nacionais em -2 explorações produtoras, +4 dúzias produzidas, 0 explorações vendedoras e -1 dúzia vendida.",
    interpretation:
      "As diferenças são pequenas, mas a publicação consultada não indica se resultam de arredondamento, ponderação ou transcrição.",
    usageRule:
      "Preservar os totais nacionais e provinciais como publicados; não substituir um pelo outro.",
  },
];

export function getIcappQualityFinding(
  id: string,
): IcappQualityFinding | undefined {
  return icappQualityFindings.find((finding) => finding.id === id);
}
