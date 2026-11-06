import type { ClimateDataset } from "@/lib/nasa-power";
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

/**
 * Compares observed NASA POWER summaries with broad crop reference ranges.
 * This is a descriptive screening, not a local suitability or yield model.
 */
export function assessCropAgainstClimate(
  dataset: ClimateDataset,
  crop: CropProfile,
): CropClimateAssessment {
  const validTemperatures = dataset.daily
    .map((day) => day.meanTemperatureC)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  const meanTemperature = validTemperatures.length > 0
    ? validTemperatures.reduce((sum, value) => sum + value, 0) / validTemperatures.length
    : null;
  const temperatureRange = crop.temperatureC;
  const usableTemperatureRange = temperatureRange !== null && temperatureRange.evidence !== "pending-validation";
  const temperatureStatus: ClimateFactorStatus = meanTemperature === null || !usableTemperatureRange
    ? "insufficient-data"
    : meanTemperature >= temperatureRange.min && meanTemperature <= temperatureRange.max
      ? "within-reference"
      : "outside-reference";

  const temperatureFactor: ClimateFactorAssessment = {
    factor: "period-temperature",
    status: temperatureStatus,
    observedValue: meanTemperature,
    expectedRange: usableTemperatureRange
      ? { min: temperatureRange.min, max: temperatureRange.max }
      : null,
    unit: "°C",
    evidence: usableTemperatureRange ? temperatureRange.evidence : null,
    validObservations: validTemperatures.length,
    totalObservations: dataset.daily.length,
    explanation: meanTemperature === null
      ? "Não existem observações válidas de temperatura média para o período."
      : !usableTemperatureRange
        ? "Não existe uma faixa de temperatura com evidência utilizável para esta cultura."
        : `A média das ${validTemperatures.length} observações válidas do período foi ${meanTemperature.toFixed(1)} °C; a referência geral é ${temperatureRange.min}–${temperatureRange.max} °C.`,
  };

  const rainfallRange = crop.annualRainfallMm;
  const usableRainfallRange = rainfallRange !== null && rainfallRange.evidence !== "pending-validation";
  const years = [...new Set(dataset.daily.map((day) => day.date.slice(0, 4)))].sort();
  const annualRainfall: AnnualRainfallAssessment[] = years.map((year) => {
    const records = dataset.daily.filter((day) => day.date.startsWith(`${year}-`));
    const expectedDays = isLeapYear(Number(year)) ? 366 : 365;
    const valid = records
      .map((day) => day.precipitationMm)
      .filter((value): value is number => value !== null && Number.isFinite(value));
    const complete = records.length === expectedDays && valid.length === expectedDays;
    const total = complete
      ? valid.reduce((sum, value) => sum + value, 0)
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
      "A média de temperatura do período não representa temperaturas por fase fenológica nem extremos de curta duração.",
      "A precipitação só é comparada com a referência anual em anos civis completos com todos os dias observados.",
      "Dados NASA POWER são estimativas em grelha e não medições dentro da parcela agrícola.",
      "Esta triagem não estima produtividade, stress hídrico, risco de pragas nem adequação definitiva da cultura.",
    ],
  };
}
