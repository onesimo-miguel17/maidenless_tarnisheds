"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, MapPin, Plus, Sprout, Wheat } from "lucide-react";
import SiteNavigation from "@/components/site-navigation";
import { farmSchema, type Farm } from "@/domain/farms/schema";

export default function FarmerWorkspacePage() {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [commune, setCommune] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [coordinateSource, setCoordinateSource] = useState<"manual" | "device">("manual");
  const [accuracyMeters, setAccuracyMeters] = useState<number | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = farmSchema.safeParse({
      name,
      description: description || undefined,
      areaHa: areaHa.trim() ? Number(areaHa) : null,
      location: {
        provinceLabel: province || undefined,
        municipalityLabel: municipality || undefined,
        communeLabel: commune || undefined,
        latitude: latitude.trim() ? Number(latitude) : undefined,
        longitude: longitude.trim() ? Number(longitude) : undefined,
        source: latitude.trim() && longitude.trim() ? coordinateSource : undefined,
        accuracyMeters: coordinateSource === "device" && latitude.trim() && longitude.trim() ? accuracyMeters ?? undefined : undefined,
      },
    });

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      setFarm(null);
      return;
    }

    setErrors([]);
    setFarm(result.data);
  }

  function handleUseCurrentLocation() {
    setLocationMessage(null);
    setAccuracyMeters(null);

    if (!("geolocation" in navigator)) {
      setLocationMessage("Este navegador não disponibiliza geolocalização. Introduza as coordenadas manualmente.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setCoordinateSource("device");
        setAccuracyMeters(position.coords.accuracy);
        setLocationMessage("Localização obtida. Confirme que o ponto corresponde à parcela agrícola.");
      },
      (cause) => {
        const message = cause.code === cause.PERMISSION_DENIED
          ? "A permissão de localização foi recusada. Pode introduzir as coordenadas manualmente."
          : cause.code === cause.POSITION_UNAVAILABLE
            ? "A localização não está disponível. Introduza as coordenadas manualmente."
            : "A localização demorou demasiado tempo. Tente novamente ou introduza as coordenadas manualmente.";
        setLocationMessage(message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function resetForm() {
    setFarm(null);
    setName("");
    setDescription("");
    setAreaHa("");
    setProvince("");
    setMunicipality("");
    setCommune("");
    setLatitude("");
    setLongitude("");
    setCoordinateSource("manual");
    setAccuracyMeters(null);
    setLocationMessage(null);
    setErrors([]);
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteNavigation />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pt-10 lg:px-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--green)]"><Sprout size={15} /> ESPAÇO DO AGRICULTOR</span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">O seu campo começa aqui.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">Organize a informação da sua exploração para, passo a passo, acompanhar o clima, o solo e as culturas com dados e fontes identificáveis.</p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)]">
          <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-8">
            {farm ? (
              <div>
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e5edda] text-[var(--green)]"><CheckCircle2 size={22} /></span>
                  <div><h2 className="text-xl font-semibold">Exploração validada</h2><p className="mt-1 text-sm text-[var(--muted)]">Os dados passaram pela validação. Ainda não foram guardados numa conta.</p></div>
                </div>
                <div className="mt-7 rounded-2xl bg-[var(--background)] p-5">
                  <h3 className="text-lg font-semibold">{farm.name}</h3>
                  {farm.description && <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{farm.description}</p>}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[var(--border)] bg-white p-3"><span className="text-xs text-[var(--muted)]">Área declarada</span><p className="mt-1 font-semibold">{farm.areaHa === null ? "Não indicada" : `${farm.areaHa} ha`}</p></div>
                    <div className="rounded-xl border border-[var(--border)] bg-white p-3"><span className="text-xs text-[var(--muted)]">Localização indicada</span><p className="mt-1 font-semibold">{[farm.location.provinceLabel, farm.location.municipalityLabel, farm.location.communeLabel].filter(Boolean).join(", ") || "Não indicada"}</p></div>
                  </div>
                </div>
                {farm.location.latitude !== undefined && farm.location.longitude !== undefined && (
                  <Link
                    href={`/climate?latitude=${farm.location.latitude}&longitude=${farm.location.longitude}`}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)] sm:w-auto"
                  >
                    Analisar clima desta parcela <ArrowRight size={17} />
                  </Link>
                )}
                <button type="button" onClick={resetForm} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)]"><Plus size={16} /> Registar outra exploração</button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e5edda] text-[var(--green)]"><Wheat size={20} /></span><div><h2 className="font-semibold">Identifique a sua exploração</h2><p className="text-xs text-[var(--muted)]">Comece apenas com o que já sabe.</p></div></div>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div><label htmlFor="farm-name" className="mb-2 block text-sm font-semibold">Nome da exploração <span className="text-[var(--green)]">*</span></label><input id="farm-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={120} required placeholder="Ex.: Fazenda Boa Esperança" className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/10" /></div>
                  <div><label htmlFor="farm-description" className="mb-2 block text-sm font-semibold">Descrição <span className="font-normal text-[var(--muted)]">(opcional)</span></label><textarea id="farm-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={3} placeholder="Uma breve descrição da exploração..." className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/10" /></div>
                  <div><label htmlFor="farm-area" className="mb-2 block text-sm font-semibold">Área em hectares <span className="font-normal text-[var(--muted)]">(opcional)</span></label><input id="farm-area" type="number" min="0.01" step="any" inputMode="decimal" value={areaHa} onChange={(event) => setAreaHa(event.target.value)} placeholder="Ex.: 12.5" className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/10" /><p className="mt-2 text-xs text-[var(--muted)]">Introduza um valor positivo. Se não souber, deixe em branco.</p></div>
                  <div className="border-t border-[var(--border)] pt-5"><div className="mb-4 flex items-center gap-2"><MapPin size={17} className="text-[var(--green)]" /><h3 className="text-sm font-semibold">Localização administrativa</h3><span className="text-xs text-[var(--muted)]">Opcional</span></div><p className="mb-4 text-xs leading-5 text-[var(--muted)]">Indique os nomes que conhece. Nesta versão, são etiquetas informativas e não são confirmadas automaticamente por coordenadas.</p><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="province" className="mb-2 block text-xs font-semibold">Província</label><input id="province" value={province} onChange={(event) => setProvince(event.target.value)} maxLength={100} placeholder="Ex.: Huambo" className="min-h-11 w-full rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--green)]" /></div><div><label htmlFor="municipality" className="mb-2 block text-xs font-semibold">Município</label><input id="municipality" value={municipality} onChange={(event) => setMunicipality(event.target.value)} maxLength={100} placeholder="Nome do município" className="min-h-11 w-full rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--green)]" /></div><div className="sm:col-span-2"><label htmlFor="commune" className="mb-2 block text-xs font-semibold">Comuna</label><input id="commune" value={commune} onChange={(event) => setCommune(event.target.value)} maxLength={100} placeholder="Nome da comuna" className="min-h-11 w-full rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--green)]" /></div></div></div>
                  <div className="border-t border-[var(--border)] pt-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">Coordenadas da parcela</h3>
                        <p className="mt-1 text-xs text-[var(--muted)]">O ponto permite consultar estimativas climáticas da NASA POWER. Não representa uma medição feita no terreno.</p>
                      </div>
                      <button type="button" onClick={handleUseCurrentLocation} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--green)] transition hover:bg-[var(--background)]">
                        <MapPin size={15} /> Usar localização atual
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label htmlFor="farm-latitude" className="mb-2 block text-xs font-semibold">Latitude</label><input id="farm-latitude" type="number" min="-90" max="90" step="any" value={latitude} onChange={(event) => { setLatitude(event.target.value); setCoordinateSource("manual"); setAccuracyMeters(null); }} placeholder="Ex.: -8.8389" className="min-h-11 w-full rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--green)]" /></div>
                      <div><label htmlFor="farm-longitude" className="mb-2 block text-xs font-semibold">Longitude</label><input id="farm-longitude" type="number" min="-180" max="180" step="any" value={longitude} onChange={(event) => { setLongitude(event.target.value); setCoordinateSource("manual"); setAccuracyMeters(null); }} placeholder="Ex.: 13.2894" className="min-h-11 w-full rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--green)]" /></div>
                    </div>
                    {accuracyMeters !== null && <p className="mt-2 text-xs text-[var(--muted)]">Precisão indicada pelo dispositivo: aproximadamente {Math.round(accuracyMeters)} m. Isto não corresponde à resolução espacial dos dados NASA POWER.</p>}
                    {locationMessage && <p role="status" className="mt-3 text-xs leading-5 text-[var(--muted)]">{locationMessage}</p>}
                  </div>
                  {errors.length > 0 && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p className="font-semibold">Verifique os dados introduzidos:</p><ul className="mt-2 list-disc space-y-1 pl-5">{errors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul></div>}
                  <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--green)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)] sm:w-auto">Validar exploração <ArrowRight size={17} /></button>
                </form>
              </>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-[var(--green-dark)] p-6 text-white sm:p-7"><span className="text-xs font-semibold uppercase tracking-[.18em] text-[#c6d7bd]">O próximo passo</span><h2 className="mt-4 text-2xl font-semibold">Conhecer melhor o terreno.</h2><p className="mt-3 text-sm leading-6 text-[#d5e1ce]">Depois de organizar a exploração, poderemos associar observações do solo, dados climáticos da NASA e informação sobre culturas.</p><div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#d5e1ce]"><ClipboardList size={17} /> Informação antes da recomendação</div></div>
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6"><h3 className="font-semibold">O que esta versão já faz</h3><ul className="mt-4 space-y-3 text-sm text-[var(--muted)]"><li className="flex gap-2"><CheckCircle2 size={17} className="shrink-0 text-[var(--green)]" /> Valida os dados essenciais da exploração.</li><li className="flex gap-2"><CheckCircle2 size={17} className="shrink-0 text-[var(--green)]" /> Aceita área e localização administrativa opcionais.</li><li className="flex gap-2"><CheckCircle2 size={17} className="shrink-0 text-[var(--green)]" /> Mantém explícito o que ainda não foi verificado.</li></ul><p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-5 text-[var(--muted)]">Nota: este é um rascunho temporário no navegador. Não existe ainda autenticação nem armazenamento permanente.</p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
