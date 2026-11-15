import { z } from "zod";
import { WAPOR_API_BASE_URL, WAPOR_LAYERS } from "./fao-wapor";

const rasterPageSchema = z.object({
  response: z.object({
    items: z.array(z.unknown()),
    links: z.array(z.object({
      rel: z.string(),
      href: z.string().url(),
    })).default([]),
  }),
});

const rasterSchema = z.object({
  code: z.string(),
  downloadUrl: z.string().url().optional(),
  scale: z.number().optional(),
  offset: z.number().optional(),
  measureUnit: z.string().optional(),
  noDataValue: z.union([z.number(), z.string()]).optional(),
  dataType: z.string().optional(),
  extent: z.object({
    wgs84: z.array(z.number()).length(4).optional(),
  }).optional(),
  dimensions: z.array(z.object({
    type: z.string(),
    member: z.unknown().optional(),
  })).optional(),
});

const timeMemberSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  numberOfDays: z.number().optional(),
});

export type WaporRasterPeriod = {
  code: string;
  periodStart: string;
  periodEnd: string;
  cadence: "daily" | "dekadal";
};

export type WaporRasterSourceMetadata = {
  downloadUrl: string | null;
  scale: number | null;
  offset: number | null;
  measureUnit: string | null;
  noDataValue: number | string | null;
  dataType: string | null;
  extentWgs84: [number, number, number, number] | null;
  time: {
    startDate: string | null;
    endDate: string | null;
    numberOfDays: number | null;
  } | null;
};

/**
 * Only expose the public FAO WaPOR v3 COG bucket. This prevents catalog
 * metadata from turning the endpoint into an arbitrary URL proxy.
 */
export function resolvePublicWaporCogUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "storage.googleapis.com" ||
      !url.pathname.startsWith("/fao-gismgr-wapor-3-data/DATA/WAPOR-3/MAPSET/")
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function parseWaporRasterPeriod(
  code: string,
  cadence: "daily" | "dekadal",
): WaporRasterPeriod | null {
  if (cadence === "daily") {
    const daily = code.match(/(\d{4})-(\d{2})-(\d{2})$/);
    if (!daily) return null;
    const [, year, month, day] = daily;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() + 1 !== Number(month) || date.getUTCDate() !== Number(day)) return null;
    const iso = year + "-" + month + "-" + day;
    return { code, periodStart: iso, periodEnd: iso, cadence: "daily" };
  }

  const dekadalMatch = code.match(/(\d{4})-(\d{2})-D([123])$/);
  if (!dekadalMatch) return null;
  const [, year, month, dekad] = dekadalMatch;
  const monthNumber = Number(month);
  const dekadNumber = Number(dekad);
  if (monthNumber < 1 || monthNumber > 12) return null;
  const startDay = dekadNumber === 1 ? 1 : dekadNumber === 2 ? 11 : 21;
  const endDay = dekadNumber === 1 ? 10 : dekadNumber === 2 ? 20 : new Date(Date.UTC(Number(year), monthNumber, 0)).getUTCDate();
  const isoDate = (day: number) => year + "-" + month + "-" + String(day).padStart(2, "0");
  return {
    code,
    periodStart: isoDate(startDay),
    periodEnd: isoDate(endDay),
    cadence: "dekadal",
  };
}

function readRasterMetadata(
  raster: z.infer<typeof rasterSchema>,
): WaporRasterSourceMetadata {
  const timeDimension = raster.dimensions?.find((dimension) => dimension.type.toUpperCase() === "TIME");
  const time = timeMemberSchema.safeParse(timeDimension?.member);
  const extent = raster.extent?.wgs84;

  return {
    downloadUrl: resolvePublicWaporCogUrl(raster.downloadUrl),
    scale: raster.scale ?? null,
    offset: raster.offset ?? null,
    measureUnit: raster.measureUnit ?? null,
    noDataValue: raster.noDataValue ?? null,
    dataType: raster.dataType ?? null,
    extentWgs84: extent ? [extent[0], extent[1], extent[2], extent[3]] : null,
    time: time.success ? {
      startDate: time.data.startDate ?? null,
      endDate: time.data.endDate ?? null,
      numberOfDays: time.data.numberOfDays ?? null,
    } : null,
  };
}

export async function fetchWaporRasterTimeline(layerCode: string, limit = 24) {
  const layer = WAPOR_LAYERS.find((candidate) => candidate.code === layerCode);
  if (!layer) throw new Error("Camada WaPOR não reconhecida.");

  const baseUrl = WAPOR_API_BASE_URL + "/catalog/workspaces/WAPOR-3/mapsets/" + layer.code + "/rasters?view=details";
  let nextUrl: string | null = baseUrl;
  const periods: Array<WaporRasterPeriod & { metadata: WaporRasterSourceMetadata }> = [];
  let pagesRead = 0;
  const maxPages = 40;

  while (nextUrl && pagesRead < maxPages) {
    const parsedUrl = new URL(nextUrl);
    if (parsedUrl.hostname !== "data.apps.fao.org" || parsedUrl.protocol !== "https:") {
      throw new Error("A API WaPOR devolveu um endereço de paginação não permitido.");
    }

    const response = await fetch(parsedUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 21_600 },
    });
    if (!response.ok) {
      throw new Error("A FAO WaPOR respondeu com HTTP " + response.status + " ao consultar os rasters.");
    }

    const raw: unknown = await response.json();
    const page = rasterPageSchema.safeParse(raw);
    if (!page.success) throw new Error("Formato inesperado na resposta de rasters da FAO WaPOR.");

    for (const item of page.data.response.items) {
      const parsed = rasterSchema.safeParse(item);
      if (!parsed.success) continue;
      const period = parseWaporRasterPeriod(parsed.data.code, layer.cadence);
      if (period) periods.push({ ...period, metadata: readRasterMetadata(parsed.data) });
    }

    const next = page.data.response.links.find((link) => link.rel.toLowerCase() === "next");
    nextUrl = next?.href ?? null;
    pagesRead += 1;
  }

  const uniquePeriods = Array.from(new Map(periods.map((period) => [period.code, period])).values())
    .sort((a, b) => b.periodStart.localeCompare(a.periodStart));

  return {
    source: "FAO WaPOR v3",
    workspace: "WAPOR-3",
    layer: { code: layer.code, variable: layer.variable, cadence: layer.cadence },
    retrievedAt: new Date().toISOString(),
    periods: uniquePeriods.slice(0, limit),
    totalDiscovered: uniquePeriods.length,
    truncated: nextUrl !== null,
    pagesRead,
    note: "Este endpoint devolve disponibilidade temporal e metadados publicados do COG. Ainda não extrai valores de pixel nas coordenadas da exploração.",
  };
}
