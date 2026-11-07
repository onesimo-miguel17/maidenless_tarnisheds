import type { ClimateDataset } from "@/lib/nasa-power";
import type { SoilProfile } from "../soil/schema";
import { assessCropAgainstClimate, type CropClimateAssessment } from "./climate-assessment";
import { assessCropAgainstSoil, type CropAssessment } from "./recommendation";
import type { CropProfile } from "./types";
import { getBlockedIcappMetricIds } from "../agriculture/icapp-quality-gate";

export interface SoilContext {
  texture: SoilProfile["texture"];
  observedMoisture: SoilProfile["moisture"];
  observedDrainage: SoilProfile["drainage"];
  perceivedFertility: SoilProfile["fertility"];
  perceivedOrganicMatter: SoilProfile["organicMatter"];
  previousCropId: string | null;
  observedProblems: string[];
}

export interface IntegratedCropAssessment {
  cropId: string;
  cropName: string;
  assessedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
  climatePeriod: {
    start: string;
    end: string;
  };
  soil: CropAssessment;
  climate: CropClimateAssessment;
  soilContext: SoilContext;
  evidence: {
    cropValidationStatus: CropProfile["validationStatus"];
    cropSources: CropProfile["sources"];
    climateSource: ClimateDataset["source"];
    climateRetrievedAt: string;
  };
  dataQuality: {
    icappRegionalContextApplied: false;
    reason: string;
    blockedMetricIds: string[];
  };
  interpretation: {
    assessedFactors: number;
    factorsWithinReference: number;
    factorsOutsideReference: number;
    factorsInsufficientData: number;
    statement: string;
  };
}

/**
 * Combines the existing soil and NASA POWER climate screenings for one crop.
 *
 * This intentionally does not calculate a composite suitability score,
 * rank crops, predict yield, or infer missing soil/climate observations.
 * A "within reference" result is a screening signal, not a local recommendation.
 */
export function assessCropAtPlot(
  soil: SoilProfile,
  climate: ClimateDataset,
  crop: CropProfile,
): IntegratedCropAssessment {
  const soilAssessment = assessCropAgainstSoil(soil, crop);
  const climateAssessment = assessCropAgainstClimate(climate, crop);
  const assessedFactors = [
    ...soilAssessment.assessedFactors.map((factor) => factor.status),
    ...climateAssessment.factors.map((factor) =>
      factor.status === "within-reference"
        ? "compatible"
        : factor.status === "outside-reference"
          ? "outside-range"
          : "unknown",
    ),
  ];

  const factorsWithinReference = assessedFactors.filter(
    (status) => status === "compatible",
  ).length;
  const factorsOutsideReference = assessedFactors.filter(
    (status) => status === "outside-range",
  ).length;
  const factorsInsufficientData = assessedFactors.filter(
    (status) => status === "unknown",
  ).length;

  return {
    cropId: crop.id,
    cropName: crop.commonName,
    assessedAt: new Date().toISOString(),
    location: climate.coordinates,
    climatePeriod: climate.period,
    soil: soilAssessment,
    climate: climateAssessment,
    soilContext: {
      texture: soil.texture,
      observedMoisture: soil.moisture,
      observedDrainage: soil.drainage,
      perceivedFertility: soil.fertility,
      perceivedOrganicMatter: soil.organicMatter,
      previousCropId: soil.previousCropId,
      observedProblems: soil.observedProblems,
    },
    dataQuality: {
      icappRegionalContextApplied: false,
      reason:
        "Os agregados ICAPP são contexto de campanha, não medições da parcela. A região da parcela ainda não é determinada por limites geográficos validados; por isso, nenhum agregado regional entra nesta avaliação.",
      blockedMetricIds: getBlockedIcappMetricIds(),
    },
    evidence: {
      cropValidationStatus: crop.validationStatus,
      cropSources: crop.sources,
      climateSource: climate.source,
      climateRetrievedAt: climate.retrievedAt,
    },
    interpretation: {
      assessedFactors: assessedFactors.length - factorsInsufficientData,
      factorsWithinReference,
      factorsOutsideReference,
      factorsInsufficientData,
      statement:
        "Triagem descritiva, não recomendação agronómica. Consulte cada factor, a cobertura dos dados e as fontes; os factores desconhecidos não foram estimados.",
    },
  };
}
