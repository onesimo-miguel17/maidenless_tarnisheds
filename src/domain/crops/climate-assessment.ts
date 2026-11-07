import type { ClimateDataset, DailyClimateRecord } from "@/lib/nasa-power";
import type { CropProfile, EvidenceLevel } from "./types";

export type ClimateFactorStatus = "within-reference" | "outside-reference" | "insufficient-data";

export interface ClimateFactorAssessment {
  factor: "period-temperature" | "annual-precipitation";
  status: ClimateFactorStatus;
  observedValue: number | null;
  expectedRange: { min: number; max: number } | null;
  unit: string;
  evidence: EvidenceLevel | null;
  validObservations: number;
  totalObservations: number;
  explanation: string;
}

export interface AnnualRainfallAssessment {
  year: string;
  precipitationMm: number | null;
  validDays: number;
  expectedDays: number;
  complete: boolean;
  status: ClimateFactorStatus;
}

export interface CropClimateAssessment {
  cropId: string;
  factors: ClimateFactorAssessment[];
  annualRainfall: AnnualRainfallAssessment[];
  limitations: string[];
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function expectedYearDates(year: number): string[] {
  const days = isLeapYear(year) ? 366 : 365;
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(Date.UTC(year, 0, index + 1));
    return date.toISOString().slice(0, 10);
  });
}

function getCompleteYearRecords(
  records: DailyClimateRecord[],
  year: string,
  selector: (record: DailyClimateRecord) => number | null,
): DailyClimateRecord[] | null {
  const yearRecords = records.filter((record) => record.date.startsWith(`${year}-`));
  const expectedDates = expectedYearDates(Number(year));
  const recordsByDate = new Map(yearRecords.map((record) => [record.date, record]));

  if (yearRecords.length !== expectedDates.length || recordsByDate.size !== expectedDates.length) {
    return null;
  }

  const orderedRecords = expectedDates.map((date) => recordsByDate.get(date));
  if (orderedRecords.some((record) => record === undefined || selector(record) === null || !Number.isFinite(selector(record)))) {
    return null;
  }

  return orderedRecords as DailyClimateRecord[];
}

/**
 * Compares complete calendar-year NASA POWER summaries with broad crop reference ranges.
 * This is a descriptive screening, not a local suitability or yield model.
 *
 * Temperature comparisons deliberately exclude partial years and years with any missing
 * daily temperature value. A short or incomplete sample must never receive a compatibility
 * status against a broad crop reference range.
 */
export function assessCropAgainstClimate(
  dataset: ClimateDataset,
  crop: CropProfile,
): CropClimateAssessment {
  const years = [...new Set(dataset.daily.map((day) => day.date.slice(0, 4)))].sort();
  const completeTemperatureYears = years.flatMap((year) =>
    getCompleteYearRecords(dataset.daily, year, (record) => record.meanTemperatureC) ?? [],
  );
  const meanTemperature = completeTemperatureYears.length > 0
    ? completeTemperatureYears.reduce((sum, day) => sum + (day.meanTemperatureC ?? 0), 0) / completeTemperatureYears.length
    : null;
  const temperatureRange = crop.temperatureC;
  const usableTemperatureRange = temperatureRange !== null && temperatureRange.evidence !== "pending-validation";
  // EcoCrop's global temperature range does not encode a clear temporal basis
  // (annual mean versus growing-season/phenological-stage temperature). Do not
  // classify an annual mean against it until that semantic gap is resolved.
  const temperatureStatus: ClimateFactorStatus = "insufficient-data";

  const temperatureFactor: ClimateFactorAssessment = {
    factor: "period-temperature",
    status: temperatureStatus,
    observedValue: meanTemperature,
    expectedRange: null,
    unit: "°C",
    evidence: null,
    validObservations: completeTemperatureYears.length,
    totalObservations: completeTemperatureYears.length > 0
      ? completeTemperatureYears.length
      : dataset.daily.length,
    explanation: !usableTemperatureRange
      ? "Não existe uma faixa de temperatura com evidência utilizável para esta cultura."
      : completeTemperatureYears.length === 0
        ? "Não existe nenhum ano civil completo com temperatura média válida em todos os dias. A amostra disponível é apresentada sem classificação de referência."
        : `A média diária de temperatura dos ${years.filter((year) => getCompleteYearRecords(dataset.daily, year, (record) => record.meanTemperatureC) !== null).length} ano(s) civil(is) completo(s) foi ${meanTemperature!.toFixed(1)} °C e é apresentada apenas como contexto. A faixa global da cultura não identifica claramente se representa média anual, época de crescimento ou fase fenológica; por isso, não é feita uma comparação.`,
  };

  const rainfallRange = crop.annualRainfallMm;
  const usableRainfallRange = rainfallRange !== null && rainfallRange.evidence !== "pending-validation";
  const annualRainfall: AnnualRainfallAssessment[] = years.map((year) => {
    const records = dataset.daily.filter((day) => day.date.startsWith(`${year}-`));
    const expectedDays = isLeapYear(Number(year)) ? 366 : 365;
    const completeRecords = getCompleteYearRecords(dataset.daily, year, (record) => record.precipitationMm);
    const valid = records
      .map((day) => day.precipitationMm)
      .filter((value): value is number => value !== null && Number.isFinite(value));
    const complete = completeRecords !== null;
    const total = complete && completeRecords
      ? completeRecords.reduce((sum, day) => sum + (day.precipitationMm ?? 0), 0)
      : null;
    const status: ClimateFactorStatus = total === null || !usableRainfallRange
      ? "insufficient-data"
      : total >= rainfallRange.min && total <= rainfallRange.max
        ? "within-reference"
        : "outside-reference";
    return {
      year,
      precipitationMm: total,
      validDays: valid.length,
      expectedDays,
      complete,
      status,
    };
  });

  const completeYears = annualRainfall.filter((year) => year.complete && year.precipitationMm !== null);
  const rainfallFactor: ClimateFactorAssessment = {
    factor: "annual-precipitation",
    status: !usableRainfallRange || completeYears.length === 0
      ? "insufficient-data"
      : completeYears.every((year) => year.status === "within-reference")
        ? "within-reference"
        : "outside-reference",
    observedValue: completeYears.length === 1 ? completeYears[0].precipitationMm : null,
    expectedRange: usableRainfallRange
      ? { min: rainfallRange.min, max: rainfallRange.max }
      : null,
    unit: "mm/ano",
    evidence: usableRainfallRange ? rainfallRange.evidence : null,
    validObservations: completeYears.length,
    totalObservations: annualRainfall.length,
    explanation: !usableRainfallRange
      ? "Não existe uma faixa anual de precipitação com evidência utilizável para esta cultura."
      : completeYears.length === 0
        ? "Não há nenhum ano civil completo com precipitação diária válida em todos os dias; não é feita uma comparação anual."
        : `${completeYears.length} ano(s) civil(is) completo(s) comparado(s) com a referência anual de ${rainfallRange.min}–${rainfallRange.max} mm.`,
  };

  return {
    cropId: crop.id,
    factors: [temperatureFactor, rainfallFactor],
    annualRainfall,
    limitations: [
      "As faixas da cultura são referências gerais globais e ainda não foram validadas localmente para Angola.",
      "A temperatura média anual é apenas contextual: as referências globais disponíveis não especificam uma base temporal comparável (média anual, ciclo da cultura ou fase fenológica), pelo que não é atribuída compatibilidade térmica.",
      "A precipitação só é comparada com a referência anual em anos civis completos com todos os dias observados.",
      "Dados NASA POWER são estimativas em grelha e não medições dentro da parcela agrícola.",
      "Esta triagem não estima produtividade, stress hídrico, risco de pragas nem adequação definitiva da cultura.",
    ],
  };
}
