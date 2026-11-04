import type { AgronomicSource, CropProfile, NumericRange } from "./types";

const FAO_ECOCROP = "FAO EcoCrop";

function source(id: number, accessedAt = "2026-11-04"): AgronomicSource {
  return {
    organization: FAO_ECOCROP,
    title: "EcoCrop data sheet",
    url: `https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=${id}`,
    accessedAt,
    notes: "Intervalos óptimos de referência global; não constituem validação agronómica específica para Angola.",
  };
}

function range(
  min: number,
  max: number,
  unit: string,
  notes: AgronomicSource[],
): NumericRange {
  return {
    min,
    max,
    unit,
    context: "Intervalo óptimo geral indicado pela FAO EcoCrop; não usar como limite absoluto nem como garantia de produtividade.",
    evidence: "general-guidance",
    sources: notes,
  };
}

function profile(
  data: Omit<CropProfile, "sources" | "soilTextures" | "drainage" | "droughtTolerance" | "waterDemand" | "nutrientDemand" | "soilContribution" | "benefits" | "limitations" | "rotationNotes" | "plantingSeasons" | "validationStatus">,
): CropProfile {
  return {
    ...data,
    soilTextures: [],
    drainage: [],
    droughtTolerance: "unknown",
    waterDemand: "unknown",
    nutrientDemand: "unknown",
    soilContribution: "",
    benefits: [],
    limitations: [
      "Os intervalos apresentados são referências gerais da FAO EcoCrop, não recomendações específicas para Angola.",
      "A adequação depende também da variedade, época de plantio, água disponível, maneio, pragas e condições locais.",
    ],
    rotationNotes: [],
    plantingSeasons: [],
    sources: [
      ...new Set([
        ...(data.temperatureC?.sources ?? []),
        ...(data.annualRainfallMm?.sources ?? []),
        ...(data.phRange?.sources ?? []),
        ...(data.cycleDays?.sources ?? []),
      ]),
    ],
    validationStatus: "draft",
  };
}

function ranges(
  id: number,
  values: {
    temperature: [number, number];
    rainfall: [number, number];
    ph: [number, number];
    cycle: [number, number];
  },
) {
  const ref = [source(id)];
  return {
    temperatureC: range(...values.temperature, "°C", ref),
    annualRainfallMm: range(...values.rainfall, "mm/ano", ref),
    phRange: range(...values.ph, "pH", ref),
    cycleDays: range(...values.cycle, "dias", ref),
  };
}

/**
 * Global reference profiles. No profile is locally validated for Angola yet.
 * Missing attributes remain explicitly unknown instead of being inferred.
 */
export const cropCatalog: CropProfile[] = [
  profile({
    id: "milho",
    commonName: "Milho",
    scientificName: "Zea mays",
    description: "Cereal anual cultivado para produção de grão e outros usos alimentares.",
    botanicalFamily: "Poaceae",
    ...ranges(2175, {
      temperature: [18, 33],
      rainfall: [600, 1200],
      ph: [5, 7],
      cycle: [65, 365],
    }),
  }),
  profile({
    id: "feijao-comum",
    commonName: "Feijão comum",
    scientificName: "Phaseolus vulgaris",
    description: "Leguminosa anual cultivada principalmente pelas suas sementes comestíveis.",
    botanicalFamily: "Fabaceae",
    ...ranges(1668, {
      temperature: [16, 25],
      rainfall: [500, 2000],
      ph: [5.5, 7.5],
      cycle: [50, 270],
    }),
  }),
  profile({
    id: "mandioca",
    commonName: "Mandioca",
    scientificName: "Manihot esculenta",
    description: "Cultura de raízes tuberosas, perene de curta duração, importante fonte de amido.",
    botanicalFamily: "Euphorbiaceae",
    ...ranges(1420, {
      temperature: [20, 29],
      rainfall: [1000, 1500],
      ph: [5.5, 8],
      cycle: [180, 365],
    }),
  }),
  profile({
    id: "amendoim",
    commonName: "Amendoim",
    scientificName: "Arachis hypogaea",
    description: "Leguminosa anual cujas vagens se desenvolvem no solo após a floração.",
    botanicalFamily: "Fabaceae",
    ...ranges(2199, {
      temperature: [22, 32],
      rainfall: [600, 1500],
      ph: [5.5, 6.5],
      cycle: [90, 150],
    }),
  }),
  profile({
    id: "sorgo",
    commonName: "Sorgo",
    scientificName: "Sorghum bicolor",
    description: "Cereal anual de utilização alimentar e forrageira.",
    botanicalFamily: "Poaceae",
    ...ranges(48747, {
      temperature: [22, 35],
      rainfall: [400, 600],
      ph: [5.5, 7.5],
      cycle: [90, 300],
    }),
  }),
  profile({
    id: "batata-doce",
    commonName: "Batata-doce",
    scientificName: "Ipomoea batatas",
    description: "Cultura de raízes tuberosas utilizada na alimentação humana e animal.",
    botanicalFamily: "Convolvulaceae",
    ...ranges(1265, {
      temperature: [18, 28],
      rainfall: [750, 2000],
      ph: [5, 7],
      cycle: [80, 170],
    }),
  }),
];

export function getCropById(id: string): CropProfile | undefined {
  return cropCatalog.find((crop) => crop.id === id);
}
