import { z } from "zod";

export const WAPOR_API_BASE_URL = "https://data.apps.fao.org/gismgr/api/v2";
export const WAPOR_WORKSPACE = "WAPOR-3";

export const WAPOR_LAYERS = [
  { code: "L1-AETI-D", label: "Evapotranspiração real e intercepção", variable: "AETI", level: 1, cadence: "dekadal" },
  { code: "L1-RET-E", label: "Evapotranspiração de referência", variable: "RET", level: 1, cadence: "daily" },
  { code: "L1-NPP-D", label: "Produtividade primária líquida", variable: "NPP", level: 1, cadence: "dekadal" },
  { code: "L1-RSM-D", label: "Humidade relativa do solo", variable: "RSM", level: 1, cadence: "dekadal" },
] as const;

const envelopeSchema = z.object({
  message: z.string().optional(),
  response: z.record(z.string(), z.unknown()).or(z.array(z.unknown())).optional(),
});

export interface WaporLayerMetadata {
  code: string;
  label: string;
  variable: string;
  level: number;
  cadence: "daily" | "dekadal";
  available: boolean;
  caption: string | null;
  measureUnit: string | null;
  description: string | null;
  dimensions: unknown[];
}

async function fetchLayerMetadata(
  layer: (typeof WAPOR_LAYERS)[number],
): Promise<WaporLayerMetadata> {
  const url = `${WAPOR_API_BASE_URL}/catalog/workspaces/${WAPOR_WORKSPACE}/mapsets/${layer.code}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
    next: { revalidate: 21_600 },
  });

  if (!response.ok) {
    return {
      ...layer, available: false, caption: null, measureUnit: null,
      description: null, dimensions: [],
    };
  }

  const raw: unknown = await response.json();
  const parsed = envelopeSchema.safeParse(raw);
  if (!parsed.success || !parsed.data.response || Array.isArray(parsed.data.response)) {
    return {
      ...layer, available: false, caption: null, measureUnit: null,
      description: null, dimensions: [],
    };
  }

  const metadata = parsed.data.response;
  return {
    ...layer,
    available: parsed.data.message === "OK" || Object.keys(metadata).length > 0,
    caption: typeof metadata.caption === "string" ? metadata.caption : null,
    measureUnit: typeof metadata.measureUnit === "string" ? metadata.measureUnit : null,
    description: typeof metadata.description === "string" ? metadata.description : null,
    dimensions: Array.isArray(metadata.dimensions) ? metadata.dimensions : [],
  };
}

export async function fetchWaporCatalog() {
  const results = await Promise.allSettled(WAPOR_LAYERS.map(fetchLayerMetadata));
  const layers = results.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ...WAPOR_LAYERS[index],
          available: false,
          caption: null,
          measureUnit: null,
          description: null,
          dimensions: [],
        },
  );

  return {
    source: "FAO WaPOR v3",
    workspace: WAPOR_WORKSPACE,
    retrievedAt: new Date().toISOString(),
    authentication: "none",
    coverage: "Africa and Near East — Level 1 continental products",
    layers,
    availableLayers: layers.filter((layer) => layer.available).length,
    totalLayers: layers.length,
    note: "Esta resposta confirma metadados de catálogo, não valores observados no ponto agrícola. A série temporal e a amostragem espacial serão disponibilizadas numa etapa separada, após validar os contratos de consulta raster.",
  };
}
