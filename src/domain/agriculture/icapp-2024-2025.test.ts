import { describe, expect, it } from "vitest";
import {
  getIcappProvinceRecord,
  icappNationalSummary,
  icappProvinceRecords,
} from "./icapp-2024-2025";

describe("ICAPP 2024/2025 agricultural context", () => {
  it("contains the 18 provinces published in the campaign report", () => {
    expect(icappProvinceRecords).toHaveLength(18);
    expect(new Set(icappProvinceRecords.map((record) => record.provinceId)).size).toBe(18);
  });

  it("preserves the published national holding and planted-area totals", () => {
    expect(icappNationalSummary.agriculturalHoldings).toBe(2_628_507);
    expect(icappNationalSummary.plantedAreaHa).toBe(5_597_471);
    expect(icappNationalSummary.harvestedAreaHa).toBe(5_090_326);
    expect(icappNationalSummary.productionTons).toBe(21_220_990);
  });

  it("provincial total planted area reconciles to the published national total", () => {
    const provincialTotal = icappProvinceRecords.reduce(
      (sum, record) => sum + record.totalPlantedHa,
      0,
    );
    expect(provincialTotal).toBe(icappNationalSummary.plantedAreaHa);
  });

  it("keeps the published two-hectare category discrepancy visible", () => {
    const temporaryArea = icappProvinceRecords.reduce(
      (sum, record) => sum + record.temporaryCropsPlantedHa,
      0,
    );
    const permanentArea = icappProvinceRecords.reduce(
      (sum, record) => sum + record.permanentCropsPlantedHa,
      0,
    );
    expect(temporaryArea).toBe(5_484_877);
    expect(permanentArea).toBe(112_594);
    expect(temporaryArea + permanentArea).toBe(icappNationalSummary.plantedAreaHa);
  });

  it("finds a province by its displayed name or internal key", () => {
    expect(getIcappProvinceRecord("Huíla")?.totalPlantedHa).toBe(1_122_772);
    expect(getIcappProvinceRecord("cabinda")?.agriculturalHoldings).toBe(44_337);
  });

  it("does not invent a match for a province absent from the 2024/2025 table", () => {
    expect(getIcappProvinceRecord("Icolo e Bengo")).toBeUndefined();
    expect(getIcappProvinceRecord("Moxico Leste")).toBeUndefined();
  });
});
