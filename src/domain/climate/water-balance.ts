import type { DailyClimateRecord } from "@/lib/nasa-power";

export interface WaterBalanceDay {
  date: string;
  referenceEt0Mm: number | null;
  precipitationMm: number | null;
  climateBalanceMm: number | null;
}

export interface WaterBalanceAnalysis {
  method: "FAO-56 Penman-Monteith";
  elevationMeters: number | null;
  totalDays: number;
  validEt0Days: number;
  completePairedDays: number;
  meanEt0Mm: number | null;
  totalEt0Mm: number | null;
  climateBalanceMm: number | null;
  daily: WaterBalanceDay[];
  status: "available" | "partial" | "unavailable";
  limitation: string | null;
}

const STEFAN_BOLTZMANN = 4.903e-9;
const SOLAR_CONSTANT = 0.0820;
const ALBEDO_REFERENCE_GRASS = 0.23;

function saturationVapourPressure(tempC: number): number {
  return 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

function extraterrestrialRadiation(latitudeDegrees: number, dayOfYear: number): number {
  const latitude = (Math.PI / 180) * latitudeDegrees;
  const inverseDistance = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
  const solarDeclination = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
  const sunsetAngle = Math.acos(
    Math.min(1, Math.max(-1, -Math.tan(latitude) * Math.tan(solarDeclination))),
  );
  return (24 * 60 / Math.PI) * SOLAR_CONSTANT * inverseDistance * (
    sunsetAngle * Math.sin(latitude) * Math.sin(solarDeclination)
    + Math.cos(latitude) * Math.cos(solarDeclination) * Math.sin(sunsetAngle)
  );
}

/**
 * Daily FAO-56 Penman-Monteith reference ET for clipped grass.
 * Actual vapour pressure is approximated from mean RH and mean temperature
 * because the current NASA POWER request does not retrieve RHmin/RHmax.
 */
export function calculateDailyReferenceEt0(
  record: DailyClimateRecord,
  latitude: number,
  elevationMeters: number,
): number | null {
  const tMax = record.maxTemperatureC;
  const tMin = record.minTemperatureC;
  const rhMean = record.relativeHumidityPct;
  const wind2m = record.windSpeed2mMs;
  const solarRadiation = record.solarRadiationMjM2Day;

  if (
    tMax === null || tMax === undefined ||
    tMin === null || tMin === undefined ||
    rhMean === null || rhMean === undefined ||
    wind2m === null || wind2m === undefined ||
    solarRadiation === null || solarRadiation === undefined ||
    ![latitude, elevationMeters, tMax, tMin, rhMean, wind2m, solarRadiation].every(Number.isFinite) ||
    latitude < -90 || latitude > 90 ||
    elevationMeters < -500 || elevationMeters > 9000 ||
    tMax < tMin || rhMean < 0 || rhMean > 100 ||
    wind2m < 0 || solarRadiation < 0
  ) {
    return null;
  }

  const tMean = (tMax + tMin) / 2;
  const esMax = saturationVapourPressure(tMax);
  const esMin = saturationVapourPressure(tMin);
  const es = (esMax + esMin) / 2;
  const ea = saturationVapourPressure(tMean) * (rhMean / 100);
  const delta = (4098 * saturationVapourPressure(tMean)) / Math.pow(tMean + 237.3, 2);
  const pressure = 101.3 * Math.pow((293 - 0.0065 * elevationMeters) / 293, 5.26);
  const psychrometricConstant = 0.000665 * pressure;

  const date = new Date(`${record.date}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return null;
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86_400_000);
  const ra = extraterrestrialRadiation(latitude, dayOfYear);
  const clearSkyRadiation = (0.75 + 2e-5 * elevationMeters) * ra;
  if (clearSkyRadiation <= 0) return null;

  const netShortwave = (1 - ALBEDO_REFERENCE_GRASS) * solarRadiation;
  const cloudiness = Math.min(1, Math.max(0.3, solarRadiation / clearSkyRadiation));
  const tMaxK = tMax + 273.16;
  const tMinK = tMin + 273.16;
  const netLongwave = STEFAN_BOLTZMANN
    * ((Math.pow(tMaxK, 4) + Math.pow(tMinK, 4)) / 2)
    * (0.34 - 0.14 * Math.sqrt(Math.max(0, ea)))
    * (1.35 * cloudiness - 0.35);
  const netRadiation = netShortwave - netLongwave;

  const numerator = 0.408 * delta * netRadiation
    + psychrometricConstant * (900 / (tMean + 273)) * wind2m * (es - ea);
  const denominator = delta + psychrometricConstant * (1 + 0.34 * wind2m);
  const et0 = numerator / denominator;

  return Number.isFinite(et0) ? Math.max(0, et0) : null;
}

export function analyzeWaterBalance(
  records: DailyClimateRecord[],
  latitude: number,
  elevationMeters: number | null | undefined,
): WaterBalanceAnalysis {
  const hasElevation = elevationMeters !== null
    && elevationMeters !== undefined
    && Number.isFinite(elevationMeters)
    && elevationMeters >= -500
    && elevationMeters <= 9000;

  const daily = records.map((record): WaterBalanceDay => {
    const referenceEt0Mm = hasElevation
      ? calculateDailyReferenceEt0(record, latitude, elevationMeters)
      : null;
    const precipitationMm = record.precipitationMm;
    return {
      date: record.date,
      referenceEt0Mm,
      precipitationMm,
      climateBalanceMm: referenceEt0Mm !== null && precipitationMm !== null
        ? precipitationMm - referenceEt0Mm
        : null,
    };
  });

  const validEt0 = daily
    .map((day) => day.referenceEt0Mm)
    .filter((value): value is number => value !== null);
  const paired = daily.filter((day) => day.climateBalanceMm !== null);
  const totalDays = daily.length;
  const validEt0Days = validEt0.length;
  const completePairedDays = paired.length;
  const meanEt0Mm = validEt0Days > 0
    ? validEt0.reduce((sum, value) => sum + value, 0) / validEt0Days
    : null;

  return {
    method: "FAO-56 Penman-Monteith",
    elevationMeters: hasElevation ? elevationMeters : null,
    totalDays,
    validEt0Days,
    completePairedDays,
    meanEt0Mm,
    totalEt0Mm: totalDays > 0 && validEt0Days === totalDays
      ? validEt0.reduce((sum, value) => sum + value, 0)
      : null,
    climateBalanceMm: totalDays > 0 && completePairedDays === totalDays
      ? paired.reduce((sum, day) => sum + (day.climateBalanceMm ?? 0), 0)
      : null,
    daily,
    status: validEt0Days === 0
      ? "unavailable"
      : validEt0Days === totalDays
        ? "available"
        : "partial",
    limitation: hasElevation
      ? "A pressão atmosférica é estimada pela altitude da grelha NASA POWER. A pressão real de vapor é aproximada a partir da humidade relativa média e da temperatura média; os resultados são estimativas de ET₀ de referência, não medições da evapotranspiração real da cultura."
      : "A resposta NASA POWER não disponibilizou altitude utilizável para este ponto. A ET₀ não é calculada sem esse dado.",
  };
}
