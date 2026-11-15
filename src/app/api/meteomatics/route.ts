import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const coordinate = z.preprocess(
  (value: unknown) => typeof value === "string" && value.trim() ? Number(value) : Number.NaN,
  z.number().finite(),
);
const querySchema = z.object({
  latitude: coordinate.pipe(z.number().min(-90).max(90)),
  longitude: coordinate.pipe(z.number().min(-180).max(180)),
});

interface MeteomaticsDateValue { date: string; value: number | null }
interface MeteomaticsCoordinate { lat?: number; lon?: number; dates?: MeteomaticsDateValue[] }
interface MeteomaticsSeries { parameter?: string; coordinates?: MeteomaticsCoordinate[] }
interface MeteomaticsPayload { data?: MeteomaticsSeries[] }

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    latitude: request.nextUrl.searchParams.get("latitude"),
    longitude: request.nextUrl.searchParams.get("longitude"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Indique coordenadas válidas para consultar a previsão." }, { status: 400 });
  }

  const username = process.env.METEOMATICS_USER;
  const password = process.env.METEOMATICS_PASSWORD;
  if (!username || !password) {
    return NextResponse.json(
      { error: "A integração Meteomatics não está configurada neste ambiente. Verifique as variáveis de ambiente no servidor." },
      { status: 503 },
    );
  }

  const now = new Date();
  now.setUTCMinutes(0, 0, 0);
  const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const iso = (date: Date) => date.toISOString().replace(".000", "");
  const range = `${iso(now)}--${iso(end)}:PT1H`;
  const parameters = "t_2m:C,precip_1h:mm,wind_speed_10m:ms,relative_humidity_2m:p";
  const location = `${parsed.data.latitude},${parsed.data.longitude}`;
  const url = `https://api.meteomatics.com/${range}/${parameters}/${location}/json?model=mix`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({ error: "A Meteomatics recusou as credenciais ou o acesso aos parâmetros solicitados. Confirme a conta e a oferta." }, { status: 502 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: `A Meteomatics respondeu com HTTP ${response.status}. Tente novamente mais tarde.` }, { status: 502 });
    }

    const payload = await response.json() as MeteomaticsPayload;
    if (!Array.isArray(payload.data) || payload.data.length === 0) {
      return NextResponse.json({ error: "A Meteomatics não devolveu séries meteorológicas para esta localização." }, { status: 502 });
    }

    const forecast = payload.data.map((series) => ({
      parameter: series.parameter ?? "unknown",
      values: series.coordinates?.[0]?.dates?.map((item) => ({
        time: item.date,
        value: typeof item.value === "number" && Number.isFinite(item.value) && item.value > -900 ? item.value : null,
      })) ?? [],
    }));
    if (forecast.every((series) => series.values.length === 0)) {
      return NextResponse.json({ error: "A resposta da Meteomatics não contém valores utilizáveis." }, { status: 502 });
    }

    return NextResponse.json({
      source: "Meteomatics",
      model: "mix",
      retrievedAt: new Date().toISOString(),
      coordinates: parsed.data,
      period: { start: iso(now), end: iso(end), interval: "PT1H" },
      forecast,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "A consulta à Meteomatics excedeu o tempo limite."
      : "Não foi possível contactar a Meteomatics. Verifique a ligação e tente novamente.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
