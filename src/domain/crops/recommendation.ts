import type { CropProfile, EvidenceLevel } from "./types";
import type { SoilProfile } from "../soil/schema";

export type FactorStatus = "compatible" | "outside-range" | "unknown";

export interface FactorAssessment {
  factor: "soil-ph";
  status: FactorStatus;
  observedValue: number | null;
  expectedRange: { min: number; max: number } | null;
  evidence: EvidenceLevel | null;
  explanation: string;
}

export type RecommendationStatus =
  | "provisional-match"
  | "review-required"
  | "insufficient-data";

export interface CropAssessment {
  cropId: string;
  status: RecommendationStatus;
  assessedFactors: FactorAssessment[];
  unassessedFactors: string[];
  limitations: string[];
}

/**
 * Performs a deliberately conservative first-pass assessment.
 *
 * A matching pH is not proof that a crop is suitable: climate, water,
 * nutrients, management and locally validated agronomic data still matter.
 * Unknown values and pending-validation evidence never become scores.
 */
export function assessCropAgainstSoil(
  soil: SoilProfile,
  crop: CropProfile,
): CropAssessment {
  const range = crop.phRange;
  const hasUsableRange = range !== null && range.evidence !== "pending-validation";
  const hasMeasuredPh = soil.ph !== null;

  let phAssessment: FactorAssessment;

  if (!hasMeasuredPh) {
    phAssessment = {
      factor: "soil-ph",
      status: "unknown",
      observedValue: null,
      expectedRange: hasUsableRange ? { min: range.min, max: range.max } : null,
      evidence: hasUsableRange ? range.evidence : null,
      explanation: "Não existe uma medição de pH registada para este terreno.",
    };
  } else if (!hasUsableRange) {
    phAssessment = {
      factor: "soil-ph",
      status: "unknown",
      observedValue: soil.ph.value,
      expectedRange: null,
      evidence: null,
      explanation: "Não existe um intervalo de pH com evidência utilizável para esta cultura.",
    };
  } else {
    const compatible = soil.ph.value >= range.min && soil.ph.value <= range.max;
    phAssessment = {
      factor: "soil-ph",
      status: compatible ? "compatible" : "outside-range",
      observedValue: soil.ph.value,
      expectedRange: { min: range.min, max: range.max },
      evidence: range.evidence,
      explanation: compatible
        ? `O pH medido (${soil.ph.value}) está dentro do intervalo de referência (${range.min}–${range.max}).`
        : `O pH medido (${soil.ph.value}) está fora do intervalo de referência (${range.min}–${range.max}).`,
    };
  }

  const status: RecommendationStatus =
    phAssessment.status === "outside-range"
      ? "review-required"
      : phAssessment.status === "compatible"
        ? "provisional-match"
        : "insufficient-data";

  return {
    cropId: crop.id,
    status,
    assessedFactors: [phAssessment],
    unassessedFactors: [
      "textura do solo",
      "drenagem",
      "disponibilidade de água",
      "clima local e época de plantio",
      "fertilidade e necessidades nutricionais",
      "maneio e histórico fitossanitário",
    ],
    limitations: [
      "Esta avaliação considera apenas o pH do solo.",
      "Um resultado compatível não constitui uma recomendação agronómica definitiva.",
      "Intervalos de orientação geral não substituem validação para a região e as condições locais.",
    ],
  };
}
