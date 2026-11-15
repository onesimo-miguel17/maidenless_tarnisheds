"use client";

import { useState } from "react";
import { CloudSun, LoaderCircle, RefreshCw } from "lucide-react";

interface ForecastValue { time: string; value: number | null }
interface ForecastSeries { parameter: string; values: ForecastValue[] }
interface ForecastPayload {
  source: string;
  model: string;
  retrievedAt: string;
  period: { start: string; end: string; interval: string };
  forecast: ForecastSeries[];
}
const labels: Record<string, { label: string; unit: string }> = {
  "t_2m:C": { label: "Temperatura a 2 m", unit: "°C" },
  "precip_1h:mm": { label: "Precipitação por hora", unit: "mm" },
  "wind_speed_10m:ms": { label: "Velocidade do vento", unit: "m/s" },
  "relative_humidity_2m:p": { label: "Humidade relativa", unit: "%" },
};
function display(value: number | null, unit: string) {
  return value === null ? "Sem dados" : `${value.toLocaleString("pt-PT", { maximumFractionDigits: 1 })} ${unit}`;
}
export default function MeteomaticsForecast({ latitude, longitude }: { latitude: string; longitude: string }) {
  const [data, setData] = useState<ForecastPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadForecast() {
    setLoading(true); setError(null); setData(null);
    try {
      const params = new URLSearchParams({ latitude, longitude });
      const response = await fetch(`/api/meteomatics?${params.toString()}`, { cache: "no-store" });
      const payload = await response.json() as ForecastPayload | { error?: string };
      if (!response.ok) throw new Error("error" in payload && payload.error ? payload.error : "Não foi possível consultar a previsão.");
      setData(payload as ForecastPayload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ocorreu um erro inesperado.");
    } finally { setLoading(false); }
  }

  const rainfall = data?.forecast.find((series) => series.parameter === "precip_1h:mm");
  const wind = data?.forecast.find((series) => series.parameter === "wind_speed_10m:ms");
  const validRainfall = rainfall?.values
    .map((item) => item.value)
    .filter((value): value is number => value !== null && Number.isFinite(value)) ?? [];
  const validWind = wind?.values
    .map((item) => item.value)
    .filter((value): value is number => value !== null && Number.isFinite(value)) ?? [];
  const maximumHourlyRain = validRainfall.length ? Math.max(...validRainfall) : null;
  const rainySamples = validRainfall.filter((value) => value > 0).length;
  const maximumWind = validWind.length ? Math.max(...validWind) : null;

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[var(--green)]"><CloudSun size={15} /> Previsão meteorológica</span>
          <h2 className="mt-2 text-xl font-semibold">Próximas 24 horas</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">Previsão horária Meteomatics para as coordenadas indicadas acima. Modelo mix; não substitui observações locais.</p>
        </div>
        <button type="button" onClick={loadForecast} disabled={loading || !latitude.trim() || !longitude.trim()} className="inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {loading ? "A consultar..." : data ? "Actualizar previsão" : "Consultar Meteomatics"}
        </button>
      </div>
      {!latitude.trim() || !longitude.trim() ? <p className="mt-4 rounded-xl bg-[var(--background)] p-3 text-xs text-[var(--muted)]">Introduza primeiro a latitude e longitude no formulário acima.</p> : null}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {data && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.forecast.map((series) => {
              const meta = labels[series.parameter] ?? { label: series.parameter, unit: "" };
              const values = series.values.map((item) => item.value).filter((value): value is number => value !== null);
              const current = values[0] ?? null;
              const min = values.length ? Math.min(...values) : null;
              const max = values.length ? Math.max(...values) : null;
              return <article key={series.parameter} className="rounded-2xl bg-[var(--background)] p-4">
                <p className="text-xs text-[var(--muted)]">{meta.label}</p>
                <p className="mt-2 text-2xl font-semibold">{display(current, meta.unit)}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">Mín. {display(min, meta.unit)} · Máx. {display(max, meta.unit)}</p>
                <p className="mt-2 text-[11px] text-[var(--muted)]">{values.length}/{series.values.length} horas com dados</p>
              </article>;
            })}
          </div>

          <section className="rounded-2xl border border-[var(--border)] p-4">
            <div>
              <h3 className="text-sm font-semibold">Resumo da previsão</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Indicadores descritivos calculados directamente das séries horárias recebidas; não representam, por si só, alertas ou recomendações agronómicas.</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl bg-[var(--background)] p-3">
                <p className="text-xs text-[var(--muted)]">Maior precipitação por registo</p>
                <p className="mt-2 text-xl font-semibold">{display(maximumHourlyRain, "mm")}</p>
              </article>
              <article className="rounded-xl bg-[var(--background)] p-3">
                <p className="text-xs text-[var(--muted)]">Registos com precipitação acima de 0 mm</p>
                <p className="mt-2 text-xl font-semibold">{rainfall ? `${rainySamples}/${validRainfall.length}` : "Sem dados"}</p>
              </article>
              <article className="rounded-xl bg-[var(--background)] p-3">
                <p className="text-xs text-[var(--muted)]">Vento máximo previsto</p>
                <p className="mt-2 text-xl font-semibold">{display(maximumWind, "m/s")}</p>
              </article>
            </div>
          </section>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="bg-[var(--background)]"><tr><th className="px-3 py-3 font-semibold">Hora UTC</th>{data.forecast.map((series) => <th key={series.parameter} className="px-3 py-3 font-semibold">{labels[series.parameter]?.label ?? series.parameter}</th>)}</tr></thead>
              <tbody>{(data.forecast[0]?.values ?? []).map((item, index) => <tr key={item.time} className="border-t border-[var(--border)]"><td className="px-3 py-2 whitespace-nowrap">{new Date(item.time).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}</td>{data.forecast.map((series) => <td key={series.parameter} className="px-3 py-2 tabular-nums">{display(series.values[index]?.value ?? null, labels[series.parameter]?.unit ?? "")}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="text-[11px] leading-5 text-[var(--muted)]">Fonte: Meteomatics Weather API · modelo mix · intervalo horário UTC. Consultado em {new Date(data.retrievedAt).toLocaleString("pt-PT", { timeZone: "UTC" })} UTC. A disponibilidade de parâmetros e a resolução variam por localização e plano de acesso.</p>
        </div>
      )}
    </section>
  );
}
