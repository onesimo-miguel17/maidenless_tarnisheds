import { describe, expect, it } from "vitest";
import {
  getIcappQualityFinding,
  icappQualityFindings,
  icappQualityMetadata,
} from "./icapp-data-quality";

describe("ICAPP data quality register", () => {
  it("keeps every finding linked to at least one source table", () => {
    expect(icappQualityFindings.length).toBeGreaterThan(0);
    for (const finding of icappQualityFindings) {
      expect(finding.sourceTables.length).toBeGreaterThan(0);
      expect(finding.publishedValues.length).toBeGreaterThan(0);
      expect(finding.usageRule.length).toBeGreaterThan(0);
    }
  });

  it("preserves the maize productivity discrepancy without replacing the published value", () => {
    const finding = getIcappQualityFinding("maize-productivity");
    expect(finding?.publishedValues).toContain("Produtividade publicada: 6 306 kg/ha");
    expect(finding?.verification).toContain("1 606,84 kg/ha");
    expect(finding?.status).toBe("inconsistent");
  });

  it("records the regional maize reconciliation from the four published regions", () => {
    const finding = getIcappQualityFinding("regional-maize-area");
    expect(finding?.publishedValues).toContain("Soma regional: 483 514 ha");
    expect(finding?.verification).toContain("2 221 676 ha");
  });

  it("does not treat clarification-needed findings as validated data", () => {
    const pending = icappQualityFindings.filter(
      (finding) => finding.status === "pending-clarification",
    );
    expect(pending.length).toBeGreaterThan(0);
    expect(pending.every((finding) => finding.usageRule.length > 0)).toBe(true);
  });

  it("identifies the official source and reference period", () => {
    expect(icappQualityMetadata.publisher).toContain("INE");
    expect(icappQualityMetadata.referencePeriod).toBe("Campanha agrícola 2024/2025");
    expect(icappQualityMetadata.sourceWorkbook).toContain(".xlsx");
  });
});
