import { NextRequest, NextResponse } from "next/server";
import { fetchWaporRasterTimeline } from "@/lib/fao-wapor-rasters";

export const revalidate = 21_600;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const layer = params.get("layer") ?? "L1-RSM-D";
  const rawLimit = Number(params.get("limit") ?? "24");

  if (!Number.isInteger(rawLimit) || rawLimit < 1 || rawLimit > 60) {
    return NextResponse.json({ error: "O limite deve ser um número inteiro entre 1 e 60." }, { status: 400 });
  }

  try {
    const timeline = await fetchWaporRasterTimeline(layer, rawLimit);
    return NextResponse.json(timeline);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({
      source: "FAO WaPOR v3",
      error: "Não foi possível consultar a disponibilidade temporal dos rasters.",
      details: message,
    }, { status: 502 });
  }
}
