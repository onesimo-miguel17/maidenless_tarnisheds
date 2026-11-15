import { describe, expect, it } from "vitest";
import { parseWaporRasterPeriod, resolvePublicWaporCogUrl } from "./fao-wapor-rasters";

describe("parseWaporRasterPeriod", () => {
  it("parses the first dekad", () => {
    expect(parseWaporRasterPeriod("WAPOR-3.L1-RSM-D.2026-02-D1", "dekadal")).toMatchObject({
      periodStart: "2026-02-01",
      periodEnd: "2026-02-10",
      cadence: "dekadal",
    });
  });

  it("parses the second dekad", () => {
    expect(parseWaporRasterPeriod("WAPOR-3.L1-RSM-D.2026-02-D2", "dekadal")).toMatchObject({
      periodStart: "2026-02-11",
      periodEnd: "2026-02-20",
    });
  });

  it("uses the actual last day of the month for the third dekad", () => {
    expect(parseWaporRasterPeriod("WAPOR-3.L1-RSM-D.2024-02-D3", "dekadal")).toMatchObject({
      periodStart: "2024-02-21",
      periodEnd: "2024-02-29",
    });
  });

  it("parses daily periods", () => {
    expect(parseWaporRasterPeriod("WAPOR-3.L1-RET-E.2026-02-17", "daily")).toMatchObject({
      periodStart: "2026-02-17",
      periodEnd: "2026-02-17",
      cadence: "daily",
    });
  });

  it("rejects invalid dates and unknown suffixes", () => {
    expect(parseWaporRasterPeriod("WAPOR-3.L1-RSM-D.2026-02-30", "daily")).toBeNull();
    expect(parseWaporRasterPeriod("WAPOR-3.L1-RSM-D.2026-02-D4", "dekadal")).toBeNull();
  });
});

describe("resolvePublicWaporCogUrl", () => {
  it("accepts public FAO WaPOR COGs", () => {
    expect(resolvePublicWaporCogUrl(
      "https://storage.googleapis.com/fao-gismgr-wapor-3-data/DATA/WAPOR-3/MAPSET/L1-RSM-D/sample.tif",
    )).toContain("storage.googleapis.com/fao-gismgr-wapor-3-data/");
  });

  it("rejects non-FAO and non-HTTPS URLs", () => {
    expect(resolvePublicWaporCogUrl("https://example.com/file.tif")).toBeNull();
    expect(resolvePublicWaporCogUrl("http://storage.googleapis.com/fao-gismgr-wapor-3-data/DATA/WAPOR-3/MAPSET/L1-RSM-D/sample.tif")).toBeNull();
    expect(resolvePublicWaporCogUrl("https://storage.googleapis.com/other-bucket/file.tif")).toBeNull();
  });
});
