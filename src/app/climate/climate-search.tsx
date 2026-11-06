"use client";

import { useState } from "react";
import { Activity, CloudRain, Droplets, LoaderCircle, ThermometerSun } from "lucide-react";
import type { ClimateDataset } from "@/lib/nasa-power";

export default function ClimateSearch() {
  const [latitude, setLatitude] = useState("-12.5763");
  const [longitude, setLongitude] = useState("13.4055");
  const [dataset, setDataset] = useState<ClimateDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setDataset(null);

    try {
      const query = new URLSearchParams({ latitude, longitude });
      const response = await fetch(`/api/climate?${query.toString()}`);
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof payload === "object" && payload !== null && "error" in payload
            ? String(payload.error)
            : "Não foi possível consultar os dados climáticos.";
        throw new Error(message);
      }
      setDataset(payload as ClimateDataset);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <form onSubmit={handleSearch} className="h-fit rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Localização da exploração</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Introduza as coordenadas da parcela. Os valores iniciais são apenas um ponto de demonstração em Benguela; altere-os para a localização real.</p>
        <label className="mt-6 block text-sm font-medium" htmlFor="latitude">Latitude</label>
        <input id="latitude" type="number" step="any" min="-90" max="90" required value={latitude} onChange={(event) => setLatitude(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        <label className="mt-4 block text-sm font-medium" htmlFor="longitude">Longitude</label>
        <input id="longitude" type="number" step="any" min="-180" max="180" required value={longitude} onChange={(event) => setLongitude(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--green)] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? <><LoaderCircle size={17} className="animate-spin" /> A consultar NASA POWER...</> : "Analisar condições climáticas"}
        </button>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </form>

      <section className="min-h-72 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
        {!dataset && !loading && (
          <div className="flex min-h-60 flex-col items-center justify-center text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#e5edda] text-[var(--green)]"><Activity size={25} /></span>
            <h2 className="mt-5 text-lg font-semibold">A análise climática aparecerá aqui</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">Consulte a NASA POWER para obter a série diária e um resumo estatístico do último ano disponível.</p>
          </div>
        )}
        {loading && <div className="flex min-h-60 items-center justify-center text-sm text-[var(--muted)]">A obter e organizar observações diárias...</div>}
        {dataset && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold">Resumo climático</h2><p className="mt-1 text-xs text-[var(--muted)]">{dataset.period.start} — {dataset.period.end} · {dataset.daily.length} dias</p></div>
              <span className="rounded-full bg-[#e5edda] px-3 py-1.5 text-xs font-semibold text-[var(--green)]">NASA POWER · AG</span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Metric icon={<CloudRain size={18} />} label="Precipitação acumulada" value={dataset.summary.precipitationTotalMm === null ? "Sem dados" : `${dataset.summary.precipitationTotalMm.toFixed(1)} mm`} detail={`${dataset.summary.precipitationDays} dias com precipitação registada`} />
              <Metric icon={<ThermometerSun size={18} />} label="Temperatura média" value={dataset.summary.meanTemperatureC === null ? "Sem dados" : `${dataset.summary.meanTemperatureC.toFixed(1)} °C`} detail="Média das observações diárias disponíveis" />
              <Metric icon={<Droplets size={18} />} label="Humidade relativa média" value={dataset.summary.meanRelativeHumidityPct === null ? "Sem dados" : `${dataset.summary.meanRelativeHumidityPct.toFixed(1)} %`} detail="Média das observações diárias disponíveis" />
              <Metric icon={<Activity size={18} />} label="Registos diários" value={String(dataset.daily.length)} detail={`${dataset.coordinates.latitude}, ${dataset.coordinates.longitude} · UTC`} />
            </div>
            <div className="mt-6 rounded-2xl bg-[var(--background)] p-4 text-xs leading-5 text-[var(--muted)]">
              <strong className="text-[var(--foreground)]">Como interpretar:</strong> a precipitação acumulada soma os valores diários disponíveis; as médias excluem registos ausentes. A série pode conter lacunas. Não interprete estes indicadores isoladamente como risco de perda de produção ou recomendação de plantio.
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] p-4">
      <div className="flex items-center gap-2 text-[var(--green)]">{icon}<span className="text-xs font-medium text-[var(--muted)]">{label}</span></div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}</p>
    </article>
  );
}
