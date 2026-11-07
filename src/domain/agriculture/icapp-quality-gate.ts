import { icappQualityFindings } from "./icapp-data-quality";

export type IcappMetricPurpose =
  | "descriptive-context"
  | "plot-assessment"
  | "ranking"
  | "recommendation"
  | "prediction";

export type IcappMetricGateStatus =
  | "reconciled-descriptive-only"
  | "blocked-inconsistent"
  | "blocked-pending-clarification"
  | "blocked-unknown";

export interface IcappMetricGate {
  metricId: string;
  status: IcappMetricGateStatus;
  allowedPurposes: readonly IcappMetricPurpose[];
  reason: string;
}

const reconciledDescriptiveMetrics = new Set([
  "national-agricultural-holdings",
  "national-harvested-area",
  "regional-agricultural-holdings",
  "regional-harvested-area",
]);

/**
 * Fail-closed policy for ICAPP metrics.
 *
 * Reconciled campaign aggregates may be shown as descriptive context only.
 * They are not plot measurements and cannot be used for crop suitability,
 * rankings, predictions, or agronomic recommendations.
 */
export function getIcappMetricGate(metricId: string): IcappMetricGate {
  if (reconciledDescriptiveMetrics.has(metricId)) {
    return {
      metricId,
      status: "reconciled-descriptive-only",
      allowedPurposes: ["descriptive-context"],
      reason:
        "O indicador reconcilia dentro da publicação, mas é agregado de campanha e só pode ser usado como contexto descritivo.",
    };
  }

  const finding = icappQualityFindings.find((item) => item.id === metricId);
  if (finding) {
    return {
      metricId,
      status: finding.status === "inconsistent"
        ? "blocked-inconsistent"
        : "blocked-pending-clarification",
      allowedPurposes: [],
      reason: finding.usageRule,
    };
  }

  return {
    metricId,
    status: "blocked-unknown",
    allowedPurposes: [],
    reason:
      "Indicador sem política de qualidade registada. Por segurança, não pode alimentar análises nem recomendações.",
  };
}

export function canUseIcappMetric(
  metricId: string,
  purpose: IcappMetricPurpose,
): boolean {
  return getIcappMetricGate(metricId).allowedPurposes.includes(purpose);
}

export function getBlockedIcappMetricIds(): string[] {
  return icappQualityFindings.map((finding) => finding.id);
}
