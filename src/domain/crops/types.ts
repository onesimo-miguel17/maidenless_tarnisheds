export type EvidenceLevel = "verified" | "general-guidance" | "pending-validation";

export interface AgronomicSource {
  organization: string;
  title: string;
  url: string;
  accessedAt: string;
  notes?: string;
}

export interface NumericRange {
  min: number;
  max: number;
  unit: string;
  context?: string;
  evidence: EvidenceLevel;
  sources: AgronomicSource[];
}

export interface CropProfile {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  botanicalFamily: string;
  temperatureC: NumericRange | null;
  rainfallMmPerCycle: NumericRange | null;
  soilTextures: Array<"sandy" | "clayey" | "loamy">;
  phRange: NumericRange | null;
  cycleDays: NumericRange | null;
  plantingSeasons: string[];
  drainage: Array<"poor" | "moderate" | "good">;
  droughtTolerance: "low" | "medium" | "high" | "unknown";
  waterDemand: "low" | "medium" | "high" | "unknown";
  nutrientDemand: "low" | "medium" | "high" | "unknown";
  soilContribution: string;
  benefits: string[];
  limitations: string[];
  rotationNotes: string[];
  sources: AgronomicSource[];
  validationStatus: "draft" | "reviewed" | "validated";
}
