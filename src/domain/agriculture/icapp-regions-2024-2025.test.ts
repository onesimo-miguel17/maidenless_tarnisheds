import { describe, expect, it } from "vitest";
import { icappNationalSummary } from "./icapp-2024-2025";
import { icappRegionalRecords } from "./icapp-regions-2024-2025";

describe("ICAPP 2024/2025 regional aggregates", () => {
  it("contains the four regions reported in the regional tables", () => {
    expect(icappRegionalRecords.map((record) => record.regionName)).toEqual([
      "Norte",
      "Centro",
      "Leste",
      "Sul",
    ]);
  });

  it("reconciles regional holdings to the published national total", () => {
    const total = icappRegionalRecords.reduce(
      (sum, record) => sum + record.agriculturalHoldings,
      0,
    );
    expect(total).toBe(icappNationalSummary.agriculturalHoldings);
  });

  it("reconciles regional harvested area to the published national total", () => {
    const total = icappRegionalRecords.reduce(
      (sum, record) => sum + record.harvestedAreaHa,
      0,
    );
    expect(total).toBe(icappNationalSummary.harvestedAreaHa);
  });

  it("keeps a distinct source table for each region", () => {
    expect(new Set(icappRegionalRecords.map((record) => record.sourceTable)).size).toBe(4);
  });
});
