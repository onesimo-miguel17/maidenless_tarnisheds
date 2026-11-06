import { NextRequest, NextResponse } from "next/server";
import { getIcappProvinceRecord, icappMetadata, icappNationalSummary, icappProvinceRecords } from "@/domain/agriculture/icapp-2024-2025";

export function GET(request: NextRequest) {
  const province = request.nextUrl.searchParams.get("province");

  if (province) {
    const record = getIcappProvinceRecord(province);
    if (!record) {
      return NextResponse.json(
        {
          error: "Não existe um registo ICAPP 2024/2025 para a província indicada.",
          availableProvinces: icappProvinceRecords.map((item) => item.provinceName),
          geographyNote: "O ICAPP 2024/2025 apresenta 18 províncias; não são inferidos valores para as províncias criadas posteriormente.",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({ metadata: icappMetadata, province: record });
  }

  return NextResponse.json({
    metadata: icappMetadata,
    national: icappNationalSummary,
    provinces: icappProvinceRecords,
  });
}
