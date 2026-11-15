"use client";

import { Droplets, Info } from "lucide-react";
import type { ClimateDataset } from "@/lib/nasa-power";
import { analyzeWaterBalance } from "@/domain/climate/water-balance";

function formatMm(value: number | null): string {
  return value === null
    ? "Sem dados"
    : `${value.toLocaleString("pt-PT", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mm`;
}

export default function WaterIntelligence({ dataset }: { dataset: ClimateDataset }) {
  const analysis = analyzeWaterBalance(
    dataset.daily,
    dataset.coordinates.latitude,
    dataset.elevationMeters,
  );
  const recentDays = analysis.daily.slice(-10).reverse();

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[var(--green)]">
            <Droplets size={15} /> Inteligência hídrica
          </span>
          <h2 className="mt-2 text-xl font-semibold">Procura atmosférica de água</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Estimativa diária da evapotranspiração de referência (ET₀) pelo método FAO-56 Penman–Monteith, calculada com dados meteorológicos NASA POWER.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-semibold">
          {analysis.status === "available" ? "Cobertura completa" : analysis.status === "partial" ? "Cobertura parcial" : "Cálculo indisponível"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl bg-[var(--background)] p-4">
          <p className="text-xs text-[var(--muted)]">ET₀ média diária</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{formatMm(analysis.meanEt0Mm)}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">{analysis.validEt0Days}/{analysis.totalDays} dias calculáveis</p>
        </article>
        <article className="rounded-2xl bg-[var(--background)] p-4">
          <p className="text-xs text-[var(--muted)]">ET₀ acumulada no período</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{formatMm(analysis.totalEt0Mm)}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">Só apresentada com cobertura integral</p>
        </article>
        <article className="rounded-2xl bg-[var(--background)] p-4">
          <p className="text-xs text-[var(--muted)]">Precipitação − ET₀</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{formatMm(analysis.climateBalanceMm)}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">Balanço climático simplificado, não do solo</p>
        </article>
        <article className="rounded-2xl bg-[var(--background)] p-4">
          <p className="text-xs text-[var(--muted)]">Altitude da grelha</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{analysis.elevationMeters === null ? "Sem dados" : `${Math.round(analysis.elevationMeters).toLocaleString("pt-PT")} m`}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">Metadado geográfico NASA POWER</p>
        </article>
      </div>

      {analysis.status === "unavailable" ? (
        <div role="status" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {analysis.limitation}
          <p className="mt-1 text-xs">Confirme a cobertura dos parâmetros meteorológicos. Não será substituída por altitude ou valores presumidos.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead className="bg-[var(--background)]">
              <tr>
                <th className="px-3 py-3 font-semibold">Data</th>
                <th className="px-3 py-3 font-semibold">Precipitação</th>
                <th className="px-3 py-3 font-semibold">ET₀ de referência</th>
                <th className="px-3 py-3 font-semibold">P − ET₀</th>
              </tr>
            </thead>
            <tbody>
              {recentDays.map((day) => (
                <tr key={day.date} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2.5 font-medium">{day.date}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatMm(day.precipitationMm)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatMm(day.referenceEt0Mm)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatMm(day.climateBalanceMm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex gap-2 rounded-2xl border border-[var(--border)] p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-[var(--green)]" />
        <div className="text-xs leading-5 text-[var(--muted)]">
          <p>{analysis.limitation}</p>
          {analysis.status === "partial" && <p className="mt-1">A ET₀ é calculada apenas nos dias em que temperatura, humidade, vento, radiação solar e altitude estão disponíveis. A radiação solar NASA POWER pode ter atraso de disponibilização; os dias sem esse dado permanecem sem cálculo.</p>}
          <p className="mt-1">A ET₀ representa a procura evaporativa de uma superfície de referência (relva), não a água efectivamente consumida pela cultura. P − ET₀ não é um balanço de água no solo: não inclui rega, escoamento, infiltração, armazenamento, coeficiente cultural (Kc) nem fase de desenvolvimento. Não utilizar isoladamente para definir doses ou calendários de irrigação.</p>
          <p className="mt-1">Fonte: NASA POWER Daily API · método FAO-56 Penman–Monteith · radiação solar em MJ/m²/dia · vento a 2 m em m/s. {analysis.completePairedDays}/{analysis.totalDays} dias com precipitação e ET₀ simultaneamente válidas.</p>
        </div>
      </div>
    </section>
  );
}
