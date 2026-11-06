import { z } from "zod";

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

export interface MonthlyClimateRecord {
  month: string;
  precipitationTotalMm: number | null;
  meanTemperatureC: number | null;
  meanRelativeHumidityPct: number | null;
  validPrecipitationDays: number;
  validTemperatureDays: number;
}

export interface ClimateSummary {
  precipitationTotalMm: number | null;
  precipitationDays: number;
  meanTemperatureC: number | null;
  meanRelativeHumidityPct: number | null;
  validPrecipitationDays: number;
  validTemperatureDays: number;
  missingPrecipitationDays: number;
  longestDrySpellDays: number | null;
}

export interface ClimateDataset {
  source: "NASA POWER";
  community: "AG";
  timeStandard: "UTC";
  retrievedAt: string;
  coordinates: { latitude: number; longitude: number };
  period: { start: string; end: string };
  units: {
    precipitation: "mm/day";
    temperature: "°C";
    relativeHumidity: "%";
  };
  daily: DailyClimateRecord[];
  monthly: MonthlyClimateRecord[];
  summary: ClimateSummary;
}

const parameterRecordSchema = z.record(z.string(), z.number());
const powerResponseSchema = z.object({
  properties: z.object({
    parameter: z.object({
      PRECTOTCORR: parameterRecordSchema.optional(),
      T2M: parameterRecordSchema.optional(),
      T2M_MAX: parameterRecordSchema.optional(),
      T2M_MIN: parameterRecordSchema.optional(),
      RH2M: parameterRecordSchema.optional(),
    }),
  }),
});

type PowerApiResponse = z.infer<typeof powerResponseSchema>;

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

function longestDrySpell(records: DailyClimateRecord[]): number | null {
  let current = 0;
  let longest = 0;
  let observedDays = 0;

  for (const record of records) {
    if (record.precipitationMm === null) {
      current = 0;
      continue;
    }
    observedDays += 1;
    current = record.precipitationMm < 1 ? current + 1 : 0;
    longest = Math.max(longest, current);
  }

  return observedDays > 0 ? longest : null;
}

function buildMonthly(records: DailyClimateRecord[]): MonthlyClimateRecord[] {
  const grouped = new Map<string, DailyClimateRecord[]>();

  for (const record of records) {
    const month = record.date.slice(0, 7);
    const bucket = grouped.get(month) ?? [];
    bucket.push(record);
    grouped.set(month, bucket);
  }

  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(
    ([month, bucket]): MonthlyClimateRecord => {
      const precipitation = bucket.map((record) => record.precipitationMm);
      const validPrecipitation = precipitation.filter(
        (value): value is number => value !== null,
      );
      return {
        month,
        precipitationTotalMm:
          validPrecipitation.length > 0
            ? validPrecipitation.reduce((sum, value) => sum + value, 0)
            : null,
        meanTemperatureC: average(bucket.map((record) => record.meanTemperatureC)),
        meanRelativeHumidityPct: average(
          bucket.map((record) => record.relativeHumidityPct),
        ),
        validPrecipitationDays: validPrecipitation.length,
        validTemperatureDays: bucket.filter(
          (record) => record.meanTemperatureC !== null,
        ).length,
      };
    },
  );
}

export function normalizePowerResponse(
  rawPayload: unknown,
  latitude: number,
  longitude: number,
  start: string,
  end: string,
  retrievedAt: string = new Date().toISOString(),
): ClimateDataset {
  const parsed = powerResponseSchema.safeParse(rawPayload);
  if (!parsed.success) {
    throw new Error("A resposta da NASA POWER tem uma estrutura inesperada ou não contém parâmetros.");
  }

  const parameters = parsed.data.properties.parameter;
  const dateKeys = [
    ...new Set(
      NASA_POWER_PARAMETERS.flatMap((parameter) =>
        Object.keys(parameters[parameter] ?? {}),
      ),
    ),
  ].sort();

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
    retrievedAt,
    coordinates: { latitude, longitude },
    period: { start, end },
    units: {
      precipitation: "mm/day",
      temperature: "°C",
      relativeHumidity: "%",
    },
    daily,
    monthly: buildMonthly(daily),
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
      validPrecipitationDays: precipitation.length,
      validTemperatureDays: daily.filter(
        (record) => record.meanTemperatureC !== null,
      ).length,
      missingPrecipitationDays: daily.length - precipitation.length,
      longestDrySpellDays: longestDrySpell(daily),
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
    next: { revalidate: 21_600 },
  });

  if (!response.ok) {
    throw new Error(`NASA POWER respondeu com HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();
  return normalizePowerResponse(
    payload,
    latitude,
    longitude,
    start,
    end,
  );
}
