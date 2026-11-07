import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPinned } from "lucide-react";
import { icappNationalSummary } from "@/domain/agriculture/icapp-2024-2025";
import {
  icappRegionalMetadata,
  icappRegionalRecords,
} from "@/domain/agriculture/icapp-regions-2024-2025";

const numberFormat = new Intl.NumberFormat("pt-AO");
const percentFormat = new Intl.NumberFormat("pt-AO", {
  maximumFractionDigits: 1,
});

function formatNumber(value: number): string {
  return numberFormat.format(value);
}

function getShare(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

export default function AgricultureRegionsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <Link href="/agriculture" className="text-sm font-semibold text-[var(--green)]">
          <ArrowLeft size={16} className="mr-2 inline" /> Contexto agrícola
        </Link>
        <span className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)]">
          Fonte oficial · INE
        </span>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[var(--green)]">
            <MapPinned size={15} /> ICAPP 2024/2025 · Quadros 7–10
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            A actividade agrícola por região.
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">
            Comparação dos totais regionais publicados pelo INE: número de explorações
            agrícolas e área colhida. As percentagens são calculadas a partir dos
            totais nacionais do mesmo boletim.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6">
            <p className="text-sm text-[var(--muted)]">Explorações agrícolas · Angola</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--green-dark)] sm:text-3xl">
              {formatNumber(icappNationalSummary.agriculturalHoldings)}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Total nacional · Quadro 5</p>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6">
            <p className="text-sm text-[var(--muted)]">Área colhida · Angola</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--green-dark)] sm:text-3xl">
              {formatNumber(icappNationalSummary.harvestedAreaHa)} ha
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Total nacional · Quadro 5</p>
          </article>
        </div>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--green)]">
                Comparação regional
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Explorações e área colhida</h2>
            </div>
            <p className="text-xs text-[var(--muted)]">Campanha 2024/2025</p>
          </div>

          <div className="mt-8 space-y-8">
            {icappRegionalRecords.map((region) => {
              const holdingsShare = getShare(
                region.agriculturalHoldings,
                icappNationalSummary.agriculturalHoldings,
              );
              const areaShare = getShare(
                region.harvestedAreaHa,
                icappNationalSummary.harvestedAreaHa,
              );

              return (
                <article key={region.regionId} className="border-b border-[var(--border)] pb-7 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{region.regionName}</h3>
                    <span className="text-xs text-[var(--muted)]">{region.sourceTable} · INE</span>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-[var(--muted)]">Explorações</span>
                        <strong className="tabular-nums">{formatNumber(region.agriculturalHoldings)}</strong>
                      </div>
                      <div
                        className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--background)]"
                        role="img"
                        aria-label={`${percentFormat.format(holdingsShare)}% das explorações nacionais`}
                      >
                        <div className="h-full rounded-full bg-[var(--green)]" style={{ width: `${holdingsShare}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {percentFormat.format(holdingsShare)}% do total nacional
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-[var(--muted)]">Área colhida</span>
                        <strong className="tabular-nums">{formatNumber(region.harvestedAreaHa)} ha</strong>
                      </div>
                      <div
                        className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--background)]"
                        role="img"
                        aria-label={`${percentFormat.format(areaShare)}% da área colhida nacional`}
                      >
                        <div className="h-full rounded-full bg-[#9bb67b]" style={{ width: `${areaShare}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {percentFormat.format(areaShare)}% do total nacional
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <Link href="/agriculture/data-quality" className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--green)] transition hover:bg-[var(--background)]">Consultar auditoria de qualidade dos dados <ExternalLink size={16} /></Link>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-4 sm:p-6">
            <h2 className="font-semibold text-amber-950">Porque ainda não mostramos culturas por região</h2>
            <p className="mt-3 text-sm leading-6 text-amber-950/80">
              Os Quadros 7 a 10 incluem linhas por cultura, mas a validação encontrou
              valores que precisam de esclarecimento. Por exemplo, no Quadro 10,
              a linha de cereais apresenta 754 049 explorações, acima das 553 679
              explorações indicadas no total da região Sul. O boletim também alerta
              para não somar subtotais de culturas. Não vamos transformar estes
              registos em rankings ou recomendações até a inconsistência ser resolvida.
            </p>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6">
            <h2 className="font-semibold">Fonte e limitações</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
              {icappRegionalMetadata.limitations.map((limitation) => (
                <li key={limitation}>• {limitation}</li>
              ))}
            </ul>
            <div className="mt-5 space-y-3">
              <a href={icappRegionalMetadata.sourceWorkbook} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 text-sm font-semibold text-[var(--green)] hover:underline">
                Quadros estatísticos Excel <ExternalLink size={15} />
              </a>
              <a href={icappRegionalMetadata.sourcePublication} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 text-sm font-semibold text-[var(--green)] hover:underline">
                Publicação no INE <ExternalLink size={15} />
              </a>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
