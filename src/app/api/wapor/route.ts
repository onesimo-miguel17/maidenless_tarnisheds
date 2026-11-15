import { NextResponse } from "next/server";
import { fetchWaporCatalog } from "@/lib/fao-wapor";

export const revalidate = 21_600;

export async function GET() {
  try {
    const catalog = await fetchWaporCatalog();
    const hasLayers = catalog.availableLayers > 0;
    return NextResponse.json(catalog, { status: hasLayers ? 200 : 503 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json(
      {
        source: "FAO WaPOR v3",
        error: "Não foi possível consultar o catálogo FAO WaPOR neste momento.",
        details: message,
      },
      { status: 502 },
    );
  }
}
