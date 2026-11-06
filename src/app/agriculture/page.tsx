import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPinned } from "lucide-react";
import {
  icappMetadata,
  icappNationalSummary,
  icappProvinceRecords,
} from "@/domain/agriculture/icapp-2024-2025";

const numberFormat = new Intl.NumberFormat("pt-AO");

function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export default function AgriculturePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-sm font-semibold text-[var(--green)]"><ArrowLeft size={16} className="mr-2 inline" /> Pambala</Link>
        <span className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)]">Fonte oficial · INE</span>
      </header>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[var(--green)]"><MapPinned size={15} /> Contexto agrícola de Angola</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">O retrato agrícola nacional.</h1>
          <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">Estatísticas oficiais da campanha {icappMetadata.referencePeriod}, publicadas pelo Instituto Nacional de Estatística. São dados agregados de contexto, não medições de uma exploração individual.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Explorações agrícolas", value: formatNumber(icappNationalSummary.agriculturalHoldings), unit: "explorações" },
            { label: "Área plantada", value: formatNumber(icappNationalSummary.plantedAreaHa), unit: "hectares" },
            { label: "Área colhida", value: formatNumber(icappNationalSummary.harvestedAreaHa), unit: "hectares" },
            { label: "Produção declarada", value: formatNumber(icappNationalSummary.productionTons), unit: "toneladas" },
          ].map((metric) => (
            <article key={metric.label} className="rounded-3xl border border-[var(--border)] bg-white p-6">
              <p className="text-sm text-[var(--muted)]">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--green-dark)]">{metric.value}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{metric.unit}</p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--green)]">Quadro 4 · INE</p><h2 className="mt-2 text-2xl font-semibold">Área plantada por província</h2></div>
            <p className="text-xs text-[var(--muted)]">18 províncias · hectares</p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead><tr className="border-b border-[var(--border)] text-xs text-[var(--muted)]"><th className="pb-3 pr-4 font-medium">Província (designação do INE)</th><th className="pb-3 px-3 text-right font-medium">Explorações</th><th className="pb-3 px-3 text-right font-medium">Temporárias (ha)</th><th className="pb-3 px-3 text-right font-medium">Permanentes (ha)</th><th className="pb-3 pl-3 text-right font-medium">Total (ha)</th></tr></thead>
              <tbody>{icappProvinceRecords.map((province) => (
                <tr key={province.provinceId} className="border-b border-[var(--border)] last:border-0">
                  <th scope="row" className="py-3 pr-4 font-semibold">{province.provinceName}</th>
                  <td className="px-3 py-3 text-right tabular-nums">{formatNumber(province.agriculturalHoldings)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatNumber(province.temporaryCropsPlantedHa)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatNumber(province.permanentCropsPlantedHa)}</td>
                  <td className="pl-3 py-3 text-right font-semibold tabular-nums">{formatNumber(province.totalPlantedHa)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-semibold text-amber-950">Limites que importam</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-950/80">
              <li>• A publicação usa 18 províncias. Não distribuímos os valores pelas 21 províncias actuais.</li>
              <li>• A soma provincial das categorias de área apresenta uma diferença de 2 ha face aos totais nacionais publicados.</li>
              <li>• A produtividade por cultura foi excluída desta primeira integração devido a divergências aritméticas em vários registos do Quadro 5.</li>
              <li>• Estes indicadores não determinam a aptidão agrícola nem descrevem uma parcela específica.</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-white p-6">
            <h2 className="font-semibold">Fonte e metodologia</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{icappMetadata.methodology.join(" ")}</p>
            <div className="mt-5 space-y-3">{icappMetadata.sourceFiles.map((source) => (
              <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 text-sm font-semibold text-[var(--green)] hover:underline">
                {source.label}<ExternalLink size={15} />
              </a>
            ))}</div>
          </article>
        </section>
        <p className="mt-8 text-xs leading-5 text-[var(--muted)]">Período de referência: {icappMetadata.referencePeriod}. Publicação: {icappMetadata.publishedYear}. Editor: {icappMetadata.publisher}.</p>
      </section>
    </main>
  );
}
