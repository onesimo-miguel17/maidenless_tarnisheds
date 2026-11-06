import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CloudSun } from "lucide-react";
import ClimateSearch from "./climate-search";

export const metadata: Metadata = {
  title: "Inteligência climática — Pambala",
  description: "Explore dados meteorológicos diários da NASA POWER para uma localização agrícola.",
};

export default function ClimatePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--green)]">
          <ArrowLeft size={17} /> Pambala
        </Link>
        <span className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--green)]">Módulo experimental</span>
      </header>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--green)]">
            <CloudSun size={15} /> NASA POWER · Agroclimatologia
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Conheça o clima da sua exploração.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Consulte um ano de observações meteorológicas diárias estimadas pela NASA POWER para as coordenadas da sua parcela. Estes dados descrevem condições ambientais; não são, por si só, uma previsão de colheita.
          </p>
        </div>
        <div className="mt-10">
          <ClimateSearch />
        </div>
        <p className="mt-10 max-w-3xl text-xs leading-6 text-[var(--muted)]">
          Fonte: NASA POWER, Daily API, comunidade Agroclimatology (AG). Os valores são dados de análise prontos para uso derivados de observações e modelos de satélite/meteorológicos. A resolução espacial e as limitações variam por parâmetro. A análise apresentada não substitui medições locais nem aconselhamento agronómico.
        </p>
      </section>
    </main>
  );
}
