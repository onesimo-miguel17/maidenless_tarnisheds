import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPowerDaily } from "@/lib/nasa-power";

const querySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    latitude: request.nextUrl.searchParams.get("latitude"),
    longitude: request.nextUrl.searchParams.get("longitude"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Coordenadas inválidas. Indique latitude e longitude válidas.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 364);
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  try {
    const dataset = await fetchPowerDaily(
      parsed.data.latitude,
      parsed.data.longitude,
      start,
      end,
    );
    return NextResponse.json(dataset);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao consultar a NASA POWER.";
    return NextResponse.json(
      { error: "Não foi possível obter os dados climáticos neste momento.", details: message },
      { status: 502 },
    );
  }
}
