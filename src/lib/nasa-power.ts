export const NASA_POWER_BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point";

export const NASA_POWER_PARAMETERS = [
  "PRECTOTCORR",
  "T2M",
  "T2M_MAX",
  "T2M_MIN",
  "RH2M",
] as const;

export type ClimateParameter = (typeof NASA_POWER_PARAMETERS)[number];

export interface DailyClimateRecord {
  date: string;
  precipitationMm: number | null;
  meanTemperatureC: number | null;
  maxTemperatureC: number | null;
  minTemperatureC: number | null;
  relativeHumidityPct: number | null;
}

export interface ClimateSummary {
  precipitationTotalMm: number | null;
  precipitationDays: number;
  meanTemperatureC: number | null;
  meanRelativeHumidityPct: number | null;
}

export interface ClimateDataset {
  source: "NASA POWER";
  community: "AG";
  timeStandard: "UTC";
  coordinates: { latitude: number; longitude: number };
  period: { start: string; end: string };
  units: {
    precipitation: "mm/day";
    temperature: "°C";
    relativeHumidity: "%";
  };
  daily: DailyClimateRecord[];
  summary: ClimateSummary;
}

interface PowerApiResponse {
  properties?: {
    parameter?: Partial<Record<ClimateParameter, Record<string, number>>>;
  };
}

function numericValue(value: number | undefined): number | null {
  if (value === undefined || !Number.isFinite(value) || value <= -900) {
    return null;
  }
  return value;
}

function average(values: Array<number | null>): number | null {
  const valid = values.filter((value): value is number => value !== null);
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function normalizePowerResponse(
  payload: PowerApiResponse,
  latitude: number,
  longitude: number,
  start: string,
  end: string,
): ClimateDataset {
  const parameters = payload.properties?.parameter;
  if (!parameters) {
    throw new Error("A resposta da NASA POWER não contém dados de parâmetros.");
  }

  const dateKeys = Object.keys(parameters.T2M ?? parameters.PRECTOTCORR ?? {}).sort();
  if (dateKeys.length === 0) {
    throw new Error("A NASA POWER não devolveu observações para este período.");
  }

  const daily = dateKeys.map((key): DailyClimateRecord => ({
    date: `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`,
    precipitationMm: numericValue(parameters.PRECTOTCORR?.[key]),
    meanTemperatureC: numericValue(parameters.T2M?.[key]),
    maxTemperatureC: numericValue(parameters.T2M_MAX?.[key]),
    minTemperatureC: numericValue(parameters.T2M_MIN?.[key]),
    relativeHumidityPct: numericValue(parameters.RH2M?.[key]),
  }));

  const precipitation = daily
    .map((record) => record.precipitationMm)
    .filter((value): value is number => value !== null);

  return {
    source: "NASA POWER",
    community: "AG",
    timeStandard: "UTC",
    coordinates: { latitude, longitude },
    period: { start, end },
    units: {
      precipitation: "mm/day",
      temperature: "°C",
      relativeHumidity: "%",
    },
    daily,
    summary: {
      precipitationTotalMm:
        precipitation.length > 0
          ? precipitation.reduce((sum, value) => sum + value, 0)
          : null,
      precipitationDays: precipitation.filter((value) => value > 0).length,
      meanTemperatureC: average(daily.map((record) => record.meanTemperatureC)),
      meanRelativeHumidityPct: average(
        daily.map((record) => record.relativeHumidityPct),
      ),
    },
  };
}

export async function fetchPowerDaily(
  latitude: number,
  longitude: number,
  start: string,
  end: string,
): Promise<ClimateDataset> {
  const url = new URL(NASA_POWER_BASE_URL);
  url.searchParams.set("parameters", NASA_POWER_PARAMETERS.join(","));
  url.searchParams.set("community", "AG");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("start", start.replaceAll("-", ""));
  url.searchParams.set("end", end.replaceAll("-", ""));
  url.searchParams.set("format", "JSON");
  url.searchParams.set("time-standard", "UTC");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
    next: { revalidate: 86_400 },
  });

  if (!response.ok) {
    throw new Error(`NASA POWER respondeu com HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();
  return normalizePowerResponse(
    payload as PowerApiResponse,
    latitude,
    longitude,
    start,
    end,
  );
}
