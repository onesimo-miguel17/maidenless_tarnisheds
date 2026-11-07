import { NextResponse } from "next/server";
import {
  icappQualityFindings,
  icappQualityMetadata,
} from "@/domain/agriculture/icapp-data-quality";

export function GET() {
  return NextResponse.json({
    metadata: icappQualityMetadata,
    summary: {
      total: icappQualityFindings.length,
      inconsistent: icappQualityFindings.filter(
        (finding) => finding.status === "inconsistent",
      ).length,
      pendingClarification: icappQualityFindings.filter(
        (finding) => finding.status === "pending-clarification",
      ).length,
    },
    findings: icappQualityFindings,
  });
}
