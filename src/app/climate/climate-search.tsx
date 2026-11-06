"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  CloudRain,
  Droplets,
  LoaderCircle,
  MapPin,
  ThermometerSun,
} from "lucide-react";
import type { ClimateDataset } from "@/lib/nasa-power";

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDefaultPeriod(): { start: string; end: string } {
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 1);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 364);
  return { start: formatDateInput(startDate), end: formatDateInput(endDate) };
}

function formatMonth(month: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00.000Z`));
}

function formatNumber(value: number | null, digits: number = 1): string {
  return value === null ? "Sem dados" : value.toLocaleString("pt-PT", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export default function ClimateSearch() {
  const defaultPeriod = useMemo(getDefaultPeriod, []);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [start, setStart] = useState(defaultPeriod.start);
  const [end, setEnd] = useState(defaultPeriod.end);
  const [dataset, setDataset] = useState<ClimateDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setDataset(null);

    try {
      const query = new URLSearchParams({ latitude, longitude, start, end });
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

  const maximumMonthlyRain = dataset
    ? Math.max(1, ...dataset.monthly.map((month) => month.precipitationTotalMm ?? 0))
    : 1;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="grid gap-5 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm lg:grid-cols-2">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Configurar análise da exploração</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Cada consulta usa as coordenadas e o período indicados. Não há uma localização de demonstração pré-seleccionada.</p>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="latitude">Latitude decimal</label>
          <input id="latitude" type="number" step="any" min="-90" max="90" required value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="Ex.: -12.5763" className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="longitude">Longitude decimal</label>
          <input id="longitude" type="number" step="any" min="-180" max="180" required value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="Ex.: 13.4055" className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="start"><CalendarDays size={14} className="mr-1 inline" /> Data inicial</label>
          <input id="start" type="date" required value={start} max={end} onChange={(event) => setStart(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="end"><CalendarDays size={14} className="mr-1 inline" /> Data final</label>
          <input id="end" type="date" required value={end} min={start} max={formatDateInput(new Date(Date.now() - 86_400_000))} onChange={(event) => setEnd(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        </div>
        <div className="lg:col-span-2">
          <button type="submit" disabled={loading || !latitude.trim() || !longitude.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--green)] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <><LoaderCircle size={17} className="animate-spin" /> A consultar NASA POWER...</> : "Consultar dados reais"}
          </button>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </div>
      </form>

      {!dataset && !loading && (
        <section className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#e5edda] text-[var(--green)]"><MapPin size={25} /></span>
          <h2 className="mt-5 text-lg font-semibold">Aguardando localização e período</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Indique as coordenadas da parcela e o intervalo que pretende estudar. Os indicadores serão calculados a partir da resposta da NASA POWER.</p>
        </section>
      )}
      {loading && <div className="flex min-h-56 items-center justify-center gap-3 rounded-3xl border border-[var(--border)] bg-white text-sm text-[var(--muted)]"><LoaderCircle size={18} className="animate-spin" /> A obter e validar observações...</div>}

      {dataset && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Análise climática da localização</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{dataset.period.start} — {dataset.period.end} · {dataset.coordinates.latitude}, {dataset.coordinates.longitude}</p>
            </div>
            <span className="rounded-full bg-[#e5edda] px-3 py-1.5 text-xs font-semibold text-[var(--green)]">Fonte: {dataset.source} · {dataset.community}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={<CloudRain size={18} />} label="Precipitação acumulada" value={dataset.summary.precipitationTotalMm === null ? "Sem dados" : `${formatNumber(dataset.summary.precipitationTotalMm)} mm`} detail={`${dataset.summary.precipitationDays} dias com precipitação > 0 mm`} />
            <Metric icon={<ThermometerSun size={18} />} label="Temperatura média" value={dataset.summary.meanTemperatureC === null ? "Sem dados" : `${formatNumber(dataset.summary.meanTemperatureC)} °C`} detail={`${dataset.summary.validTemperatureDays} observações válidas`} />
            <Metric icon={<Droplets size={18} />} label="Humidade relativa média" value={dataset.summary.meanRelativeHumidityPct === null ? "Sem dados" : `${formatNumber(dataset.summary.meanRelativeHumidityPct)} %`} detail="Média das observações disponíveis" />
            <Metric icon={<Activity size={18} />} label="Maior sequência seca" value={dataset.summary.longestDrySpellDays === null ? "Sem dados" : `${dataset.summary.longestDrySpellDays} dias`} detail="Dias consecutivos com precipitação < 1 mm; lacunas interrompem a sequência." />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
            <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold">Precipitação mensal</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Soma dos valores diários disponíveis em cada mês. Meses sem observações são apresentados como indisponíveis.</p>
              <div className="mt-6 space-y-4">
                {dataset.monthly.map((month) => (
                  <div key={month.month} className="grid grid-cols-[3.5rem_1fr_4.5rem] items-center gap-3 text-xs">
                    <span className="text-[var(--muted)]">{formatMonth(month.month)}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-[var(--background)]">
                      <div className="h-full rounded-full bg-[var(--green)]" style={{ width: month.precipitationTotalMm === null ? "0%" : `${(month.precipitationTotalMm / maximumMonthlyRain) * 100}%` }} />
                    </div>
                    <span className="text-right font-medium tabular-nums">{month.precipitationTotalMm === null ? "N/D" : `${formatNumber(month.precipitationTotalMm)} mm`}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold">Qualidade e cobertura dos dados</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">A cobertura é calculada sobre os dias devolvidos pela fonte, não sobre uma garantia de observação local.</p>
              <div className="mt-6 space-y-5">
                <Coverage label="Precipitação" valid={dataset.summary.validPrecipitationDays} missing={dataset.summary.missingPrecipitationDays} />
                <Coverage label="Temperatura média" valid={dataset.summary.validTemperatureDays} missing={dataset.daily.length - dataset.summary.validTemperatureDays} />
                <div className="rounded-2xl bg-[var(--background)] p-4 text-xs leading-5 text-[var(--muted)]">
                  <strong className="text-[var(--foreground)]">Consulta:</strong> {new Date(dataset.retrievedAt).toLocaleString("pt-PT")} · Fuso de referência: {dataset.timeStandard}
                </div>
              </div>
            </section>
          </div>

          <div className="rounded-2xl border border-[#dce7d7] bg-[#f5f8f1] p-5 text-sm leading-6 text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Limites de interpretação:</strong> estes são indicadores descritivos derivados dos dados devolvidos pela NASA POWER. Uma sequência seca não é, isoladamente, prova de seca agrícola, stress hídrico ou perda de produção. A análise agronómica exige contexto do solo, cultura, fase de desenvolvimento e validação local.
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center gap-2 text-[var(--green)]">{icon}<span className="text-xs font-medium text-[var(--muted)]">{label}</span></div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{detail}</p>
    </article>
  );
}

function Coverage({ label, valid, missing }: { label: string; valid: number; missing: number }) {
  const total = valid + missing;
  const percentage = total > 0 ? (valid / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs"><strong>{label}</strong><span className="tabular-nums text-[var(--muted)]">{valid}/{total} dias válidos · {percentage.toFixed(1)}%</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background)]"><div className="h-full rounded-full bg-[var(--green)]" style={{ width: `${percentage}%` }} /></div>
      <p className="mt-1 text-[11px] text-[var(--muted)]">{missing} dias sem valor utilizável</p>
    </div>
  );
}
