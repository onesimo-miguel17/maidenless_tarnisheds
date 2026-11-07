import { describe, expect, it } from "vitest";
import { icappQualityFindings } from "./icapp-data-quality";
import {
  canUseIcappMetric,
  getBlockedIcappMetricIds,
  getIcappMetricGate,
} from "./icapp-quality-gate";

describe("ICAPP metric quality gate", () => {
  it("blocks every metric with an audit finding from decision use", () => {
    for (const finding of icappQualityFindings) {
      expect(canUseIcappMetric(finding.id, "descriptive-context")).toBe(false);
      expect(canUseIcappMetric(finding.id, "plot-assessment")).toBe(false);
      expect(canUseIcappMetric(finding.id, "ranking")).toBe(false);
      expect(canUseIcappMetric(finding.id, "recommendation")).toBe(false);
      expect(canUseIcappMetric(finding.id, "prediction")).toBe(false);
    }
  });

  it("allows reconciled national and regional aggregates only as descriptive context", () => {
    for (const metricId of [
      "national-agricultural-holdings",
      "national-harvested-area",
      "regional-agricultural-holdings",
      "regional-harvested-area",
    ]) {
      expect(canUseIcappMetric(metricId, "descriptive-context")).toBe(true);
      expect(canUseIcappMetric(metricId, "plot-assessment")).toBe(false);
      expect(canUseIcappMetric(metricId, "recommendation")).toBe(false);
    }
  });

  it("fails closed for unknown indicators", () => {
    const gate = getIcappMetricGate("unregistered-yield-indicator");
    expect(gate.status).toBe("blocked-unknown");
    expect(gate.allowedPurposes).toEqual([]);
    expect(canUseIcappMetric("unregistered-yield-indicator", "descriptive-context")).toBe(false);
  });

  it("keeps every audited finding in the blocked metric list", () => {
    expect(getBlockedIcappMetricIds().sort()).toEqual(
      icappQualityFindings.map((finding) => finding.id).sort(),
    );
  });
});
