"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  CloudRain,
  Droplets,
  LoaderCircle,
  LocateFixed,
  MapPin,
  ThermometerSun,
} from "lucide-react";
import type { ClimateDataset } from "@/lib/nasa-power";
import { cropCatalog } from "@/domain/crops/catalog";
import { assessCropAgainstSoil } from "@/domain/crops/recommendation";
import { assessCropAgainstClimate } from "@/domain/crops/climate-assessment";
import { assessCropAtPlot } from "@/domain/crops/integrated-assessment";
import { analyzeRainfallSeasonality } from "@/domain/climate/rainfall-seasonality";
import { soilProfileSchema } from "@/domain/soil/schema";

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
  const [cropId, setCropId] = useState("");
  const [soilPh, setSoilPh] = useState("");
  const [soilTexture, setSoilTexture] = useState<"unknown" | "sandy" | "clayey" | "loamy">("unknown");
  const [soilMoisture, setSoilMoisture] = useState<"unknown" | "dry" | "normal" | "wet">("unknown");
  const [soilDrainage, setSoilDrainage] = useState<"unknown" | "poor" | "moderate" | "good">("unknown");
  const [soilFertility, setSoilFertility] = useState<"unknown" | "low" | "medium" | "high">("unknown");
  const [soilOrganicMatter, setSoilOrganicMatter] = useState<"unknown" | "low" | "medium" | "high">("unknown");
  const [start, setStart] = useState(defaultPeriod.start);
  const [end, setEnd] = useState(defaultPeriod.end);
  const [dataset, setDataset] = useState<ClimateDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  function handleUseCurrentLocation() {
    setLocationMessage(null);
    setLocationAccuracy(null);

    if (!("geolocation" in navigator)) {
      setLocationMessage("Este navegador não disponibiliza geolocalização. Introduza as coordenadas manualmente.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationAccuracy(position.coords.accuracy);
        setLocationMessage("Coordenadas obtidas pelo dispositivo. Confirme que o ponto corresponde à parcela agrícola.");
        setLocating(false);
      },
      (cause) => {
        const message = cause.code === cause.PERMISSION_DENIED
          ? "A permissão de localização foi recusada. Autorize o acesso no navegador ou introduza as coordenadas manualmente."
          : cause.code === cause.POSITION_UNAVAILABLE
            ? "A localização não está disponível neste momento. Tente novamente ou introduza as coordenadas manualmente."
            : "A localização demorou demasiado tempo. Tente novamente ou introduza as coordenadas manualmente.";
        setLocationMessage(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

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

  const selectedCrop = cropCatalog.find((crop) => crop.id === cropId);
  const soilProfile = soilProfileSchema.parse({
    texture: soilTexture,
    moisture: soilMoisture,
    drainage: soilDrainage,
    fertility: soilFertility,
    organicMatter: soilOrganicMatter,
    ph: soilPh.trim() === "" ? null : { value: Number(soilPh) },
  });
  const cropAssessment = selectedCrop
    ? assessCropAgainstSoil(soilProfile, selectedCrop)
    : null;
  const climateCropAssessment = dataset && selectedCrop
    ? assessCropAgainstClimate(dataset, selectedCrop)
    : null;
  const integratedAssessment = dataset && selectedCrop
    ? assessCropAtPlot(soilProfile, dataset, selectedCrop)
    : null;

  const maximumMonthlyRain = dataset
    ? Math.max(1, ...dataset.monthly.map((month) => month.precipitationTotalMm ?? 0))
    : 1;
  const rainfallSeasonality = dataset ? analyzeRainfallSeasonality(dataset.daily) : null;
  const maximumSeasonalRain = Math.max(
    1,
    ...(rainfallSeasonality?.months.map((month) => month.meanPrecipitationMm ?? 0) ?? []),
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="grid gap-5 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm lg:grid-cols-2">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Configurar análise da exploração</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Cada consulta usa as coordenadas e o período indicados. Não há uma localização de demonstração pré-seleccionada.</p>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="latitude">Latitude decimal</label>
          <input id="latitude" type="number" step="any" min="-90" max="90" required value={latitude} onChange={(event) => { setLatitude(event.target.value); setLocationAccuracy(null); setLocationMessage(null); }} placeholder="Ex.: -12.5763" className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="longitude">Longitude decimal</label>
          <input id="longitude" type="number" step="any" min="-180" max="180" required value={longitude} onChange={(event) => { setLongitude(event.target.value); setLocationAccuracy(null); setLocationMessage(null); }} placeholder="Ex.: 13.4055" className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
        </div>
        <div className="lg:col-span-2">
          <button type="button" onClick={handleUseCurrentLocation} disabled={locating || loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--green)] px-4 py-2.5 text-sm font-semibold text-[var(--green)] transition hover:bg-[#f5f8f1] disabled:cursor-not-allowed disabled:opacity-60">
            {locating ? <><LoaderCircle size={16} className="animate-spin" /> A obter localização...</> : <><LocateFixed size={16} /> Usar localização do dispositivo</>}
          </button>
          {locationAccuracy !== null && <p className="mt-2 text-xs text-[var(--muted)]">Precisão indicada pelo dispositivo: ±{Math.round(locationAccuracy)} m. Isto não representa a resolução espacial dos dados NASA POWER.</p>}
          {locationMessage && <p role="status" className="mt-2 text-xs leading-5 text-[var(--muted)]">{locationMessage}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="crop">Cultura a avaliar</label>
          <select id="crop" value={cropId} onChange={(event) => setCropId(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]">
            <option value="">Seleccionar cultura (opcional)</option>
            {cropCatalog.map((crop) => <option key={crop.id} value={crop.id}>{crop.commonName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="soil-ph">pH medido do solo (opcional)</label>
          <input id="soil-ph" type="number" min="0" max="14" step="0.1" value={soilPh} onChange={(event) => setSoilPh(event.target.value)} placeholder="Ex.: 6.2" className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--green)]" />
          <p className="mt-1 text-xs text-[var(--muted)]">Introduza apenas um valor obtido por medição do solo.</p>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Caracterização observada do solo</h3>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Registe apenas características que conhece por observação ou análise. Estes campos descrevem o terreno; ainda não são convertidos em pontuações de adequação da cultura.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SoilSelect id="soil-texture" label="Textura" value={soilTexture} onChange={setSoilTexture} options={[["unknown", "Não sei"], ["sandy", "Arenoso"], ["clayey", "Argiloso"], ["loamy", "Franco"]]} />
            <SoilSelect id="soil-moisture" label="Humidade observada" value={soilMoisture} onChange={setSoilMoisture} options={[["unknown", "Não sei"], ["dry", "Seco"], ["normal", "Húmido / normal"], ["wet", "Encharcado / muito húmido"]]} />
            <SoilSelect id="soil-drainage" label="Drenagem observada" value={soilDrainage} onChange={setSoilDrainage} options={[["unknown", "Não sei"], ["poor", "Má"], ["moderate", "Moderada"], ["good", "Boa"]]} />
            <SoilSelect id="soil-fertility" label="Fertilidade percebida" value={soilFertility} onChange={setSoilFertility} options={[["unknown", "Não avaliada"], ["low", "Baixa"], ["medium", "Média"], ["high", "Alta"]]} />
            <SoilSelect id="soil-organic-matter" label="Matéria orgânica percebida" value={soilOrganicMatter} onChange={setSoilOrganicMatter} options={[["unknown", "Não avaliada"], ["low", "Baixa"], ["medium", "Média"], ["high", "Alta"]]} />
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">Fertilidade e matéria orgânica percebidas não substituem análises laboratoriais. A interpretação destes atributos exige medições e referências locais validadas.</p>
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

      {integratedAssessment && (
        <section className="rounded-3xl border-2 border-[var(--green)] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--green)]">Avaliação agrícola integrada</span>
              <h2 className="mt-2 text-xl font-semibold">{integratedAssessment.cropName}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Solo registado + clima NASA POWER · {integratedAssessment.climatePeriod.start} a {integratedAssessment.climatePeriod.end}</p>
            </div>
            <span className="rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold">Triagem explicável · sem pontuação</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <p className="text-xs text-[var(--muted)]">Dentro da referência</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{integratedAssessment.interpretation.factorsWithinReference}</p>
            </div>
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <p className="text-xs text-[var(--muted)]">Fora da referência</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{integratedAssessment.interpretation.factorsOutsideReference}</p>
            </div>
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <p className="text-xs text-[var(--muted)]">Sem dados suficientes</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{integratedAssessment.interpretation.factorsInsufficientData}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {integratedAssessment.soil.assessedFactors.map((factor) => (
              <div key={`soil-${factor.factor}`} className="rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">Solo · pH</p>
                <p className="mt-1 text-sm">{factor.explanation}</p>
              </div>
            ))}
            {integratedAssessment.climate.factors.map((factor) => (
              <div key={factor.factor} className="rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">{factor.factor === "period-temperature" ? "Clima · temperatura" : "Clima · precipitação anual"}</p>
                <p className="mt-1 text-sm">{factor.explanation}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">Observações válidas: {factor.validObservations}/{factor.totalObservations}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-950">Protecção da qualidade dos dados agrícolas</p>
            <p className="mt-1 text-xs leading-5 text-amber-900">
              Esta avaliação usa o perfil de solo registado e os dados NASA POWER. Os agregados ICAPP regionais não são aplicados à parcela: ainda não existe uma correspondência geográfica validada entre a localização e as regiões estatísticas. Indicadores inconsistentes ou pendentes estão bloqueados para rankings, previsões e recomendações.
            </p>
            <a href="/agriculture/data-quality" className="mt-2 inline-flex text-xs font-semibold text-amber-950 underline underline-offset-2">
              Consultar {integratedAssessment.dataQuality.blockedMetricIds.length} indicadores bloqueados pela auditoria
            </a>
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{integratedAssessment.interpretation.statement}</p>
          <p className="mt-2 text-[11px] text-[var(--muted)]">NASA POWER · {integratedAssessment.location.latitude}, {integratedAssessment.location.longitude} · Consulta: {new Date(integratedAssessment.evidence.climateRetrievedAt).toLocaleString("pt-PT")} · Estado de validação da cultura: {integratedAssessment.evidence.cropValidationStatus}</p>
        </section>
      )}

      {cropAssessment && selectedCrop && (
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--green)]">Avaliação do solo</span>
              <h2 className="mt-2 text-xl font-semibold">{selectedCrop.commonName}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Comparação do pH medido com a referência geral disponível para esta cultura.</p>
            </div>
            <span className="rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold">{cropAssessment.status === "provisional-match" ? "pH dentro da referência" : cropAssessment.status === "review-required" ? "Requer revisão" : "Dados insuficientes"}</span>
          </div>
          {cropAssessment.assessedFactors.map((factor) => (
            <div key={factor.factor} className="mt-5 rounded-2xl bg-[var(--background)] p-4">
              <p className="text-sm font-medium">{factor.explanation}</p>
              {factor.expectedRange && <p className="mt-2 text-xs text-[var(--muted)]">Intervalo de referência: {factor.expectedRange.min}–{factor.expectedRange.max} pH · Evidência: {factor.evidence}</p>}
            </div>
          ))}
          <div className="mt-5 rounded-2xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold">Perfil registado nesta análise</h3>
            <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
              <SoilFact label="Textura" value={{ sandy: "Arenoso", clayey: "Argiloso", loamy: "Franco", unknown: "Não registada" }[soilProfile.texture]} />
              <SoilFact label="Humidade observada" value={{ dry: "Seco", normal: "Normal", wet: "Muito húmido", unknown: "Não registada" }[soilProfile.moisture]} />
              <SoilFact label="Drenagem" value={{ poor: "Má", moderate: "Moderada", good: "Boa", unknown: "Não registada" }[soilProfile.drainage]} />
              <SoilFact label="Fertilidade percebida" value={{ low: "Baixa", medium: "Média", high: "Alta", unknown: "Não avaliada" }[soilProfile.fertility]} />
              <SoilFact label="Matéria orgânica percebida" value={{ low: "Baixa", medium: "Média", high: "Alta", unknown: "Não avaliada" }[soilProfile.organicMatter]} />
            </dl>
            <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">Apenas o pH é comparado com uma referência de cultura nesta versão. Os restantes atributos ficam registados como contexto, sem pontuação nem inferência de adequação.</p>
          </div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-xs leading-5 text-[var(--muted)]">
            {cropAssessment.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
          </ul>
          {selectedCrop.phRange?.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-semibold text-[var(--green)] underline">Consultar fonte: {source.organization}</a>)}
        </section>
      )}

      {climateCropAssessment && selectedCrop && (
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--green)]">Inteligência climática por cultura</span>
              <h2 className="mt-2 text-xl font-semibold">{selectedCrop.commonName}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Comparação descritiva entre observações NASA POWER deste período e referências gerais da cultura.</p>
            </div>
            <span className="rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold">Triagem, não recomendação final</span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {climateCropAssessment.factors.map((factor) => {
              const label = factor.factor === "period-temperature" ? "Temperatura média do período" : "Precipitação anual";
              const statusLabel = factor.status === "within-reference"
                ? "Dentro da referência"
                : factor.status === "outside-reference"
                  ? "Fora da referência"
                  : "Dados insuficientes";
              return (
                <article key={factor.factor} className="rounded-2xl bg-[var(--background)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{label}</h3>
                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold">{statusLabel}</span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold tabular-nums">
                    {factor.observedValue === null
                      ? "Sem comparação"
                      : `${formatNumber(factor.observedValue)} ${factor.unit}`}
                  </p>
                  {factor.expectedRange && <p className="mt-1 text-xs text-[var(--muted)]">Referência: {factor.expectedRange.min}–{factor.expectedRange.max} {factor.unit} · Evidência: {factor.evidence}</p>}
                  <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{factor.explanation}</p>
                  <p className="mt-2 text-[11px] text-[var(--muted)]">Observações válidas: {factor.validObservations}/{factor.totalObservations}</p>
                </article>
              );
            })}
          </div>

          {climateCropAssessment.annualRainfall.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">Verificação da precipitação por ano civil</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Só são comparados anos completos com precipitação válida em todos os dias.</p>
              <div className="mt-3 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
                {climateCropAssessment.annualRainfall.map((year) => (
                  <div key={year.year} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                    <span className="font-medium">{year.year}</span>
                    <span className="text-xs text-[var(--muted)]">{year.validDays}/{year.expectedDays} dias válidos</span>
                    <span className="font-semibold tabular-nums">{year.precipitationMm === null ? "Ano incompleto — sem comparação" : `${formatNumber(year.precipitationMm)} mm`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ul className="mt-5 list-disc space-y-1 pl-5 text-xs leading-5 text-[var(--muted)]">
            {climateCropAssessment.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {[...(selectedCrop.temperatureC?.sources ?? []), ...(selectedCrop.annualRainfallMm?.sources ?? [])].map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[var(--green)] underline">
                {source.organization}: {source.title}
              </a>
            ))}
          </div>
        </section>
      )}

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

          {rainfallSeasonality && (
            <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Sazonalidade da precipitação</h3>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--muted)]">
                    Média da precipitação total de cada mês do calendário, calculada apenas com meses completos e com todos os dias válidos.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium">
                  {rainfallSeasonality.completeMonthCount} meses completos incluídos
                </span>
              </div>

              <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                {rainfallSeasonality.months.map((month) => (
                  <div key={month.monthNumber} className="grid grid-cols-[5rem_1fr_5.5rem] items-center gap-3 text-xs">
                    <span className="capitalize text-[var(--muted)]">{month.label}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-[var(--background)]">
                      <div
                        className="h-full rounded-full bg-[var(--green)]"
                        style={{ width: month.meanPrecipitationMm === null ? "0%" : `${(month.meanPrecipitationMm / maximumSeasonalRain) * 100}%` }}
                      />
                    </div>
                    <span className="text-right font-medium tabular-nums">
                      {month.meanPrecipitationMm === null ? "Sem dados" : `${formatNumber(month.meanPrecipitationMm)} mm`}
                    </span>
                    <span className="col-start-2 col-span-2 -mt-2 text-[10px] text-[var(--muted)]">
                      {month.completeMonths} mês(es) completo(s){month.years.length > 0 ? ` · ${month.years.join(", ")}` : ""}
                    </span>
                  </div>
                ))}
              </div>

              {rainfallSeasonality.excludedIncompleteMonthCount > 0 && (
                <div className="mt-6 rounded-2xl bg-[var(--background)] p-4">
                  <h4 className="text-sm font-semibold">Meses excluídos por cobertura incompleta</h4>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                    Estes períodos não entram na média sazonal. Os valores em falta não são considerados como zero.
                  </p>
                  <div className="mt-3 space-y-2">
                    {rainfallSeasonality.monthlyCoverage.filter((month) => !month.complete).map((month) => (
                      <div key={month.month} className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span>{formatMonth(month.month)}</span>
                        <span className="text-[var(--muted)]">{month.validDays}/{month.expectedDays} dias válidos</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
                Esta visualização descreve a distribuição histórica dentro do período consultado; não identifica automaticamente o início da época das chuvas nem recomenda datas de sementeira. A robustez depende do número de meses completos disponíveis em cada ano.
              </p>
            </section>
          )}

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

type SoilOption<T extends string> = readonly [T, string];

function SoilSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SoilOption<T>[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium" htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--green)]"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </div>
  );
}

function SoilFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
