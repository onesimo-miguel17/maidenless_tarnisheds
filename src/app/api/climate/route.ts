import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPowerDaily } from "@/lib/nasa-power";

const coordinateSchema = z.preprocess(
  (value: unknown) =>
    typeof value === "string" && value.trim() !== "" ? Number(value) : Number.NaN,
  z.number().finite(),
);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Data inválida.");

const querySchema = z.object({
  latitude: coordinateSchema.pipe(z.number().min(-90).max(90)),
  longitude: coordinateSchema.pipe(z.number().min(-180).max(180)),
  start: dateSchema,
  end: dateSchema,
}).superRefine((value, context) => {
  if (value.start > value.end) {
    context.addIssue({ code: "custom", path: ["start"], message: "A data inicial deve anteceder a data final." });
  }

  const startTime = new Date(`${value.start}T00:00:00.000Z`).getTime();
  const endTime = new Date(`${value.end}T00:00:00.000Z`).getTime();
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayDate = yesterday.toISOString().slice(0, 10);

  if (value.end > yesterdayDate) {
    context.addIssue({ code: "custom", path: ["end"], message: "Escolha uma data até ontem. Os dados diários podem ter atraso de publicação." });
  }
  if (endTime - startTime > 1827 * 86_400_000) {
    context.addIssue({ code: "custom", path: ["start"], message: "O período máximo por consulta é de cinco anos." });
  }
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    latitude: request.nextUrl.searchParams.get("latitude"),
    longitude: request.nextUrl.searchParams.get("longitude"),
    start: request.nextUrl.searchParams.get("start"),
    end: request.nextUrl.searchParams.get("end"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Parâmetros inválidos. Verifique as coordenadas e o intervalo de datas.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const dataset = await fetchPowerDaily(
      parsed.data.latitude,
      parsed.data.longitude,
      parsed.data.start,
      parsed.data.end,
    );
    return NextResponse.json(dataset);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao consultar a NASA POWER.";
    return NextResponse.json(
      { error: "Não foi possível obter dados climáticos para esta localização e período.", details: message },
      { status: 502 },
    );
  }
}
