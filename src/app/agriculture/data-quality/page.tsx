import Link from "next/link";
import { ArrowLeft, AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";
import {
  icappQualityFindings,
  icappQualityMetadata,
} from "@/domain/agriculture/icapp-data-quality";

const statusLabel = {
  inconsistent: "Inconsistência identificada",
  "pending-clarification": "Aguarda esclarecimento",
} as const;

const severityLabel = {
  high: "Prioridade alta",
  medium: "Prioridade média",
  low: "Prioridade baixa",
} as const;

export default function AgricultureDataQualityPage() {
  const inconsistentCount = icappQualityFindings.filter(
    (finding) => finding.status === "inconsistent",
  ).length;
  const pendingCount = icappQualityFindings.filter(
    (finding) => finding.status === "pending-clarification",
  ).length;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/agriculture" className="text-sm font-semibold text-[var(--green)]">
          <ArrowLeft size={16} className="mr-2 inline" /> Contexto agrícola
        </Link>
        <span className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)]">
          Auditoria documental · INE
        </span>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[var(--green)]">
            <ShieldCheck size={15} /> Qualidade estatística
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Antes de confiar nos números, verificamos os números.
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">
            Registo de verificações sobre o ficheiro estatístico ICAPP 2024/2025.
            Os valores originais são preservados; as contas de controlo aparecem
            separadas. Uma divergência não é uma correcção oficial.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-[var(--border)] bg-white p-6">
            <p className="text-sm text-[var(--muted)]">Verificações registadas</p>
            <p className="mt-3 text-3xl font-semibold">{icappQualityFindings.length}</p>
          </article>
          <article className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-800">Inconsistências identificadas</p>
            <p className="mt-3 text-3xl font-semibold text-red-950">{inconsistentCount}</p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm text-amber-800">Aguardam esclarecimento</p>
            <p className="mt-3 text-3xl font-semibold text-amber-950">{pendingCount}</p>
          </article>
        </div>

        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} className="text-amber-700" />
            Como interpretar este registo
          </div>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted)] md:grid-cols-2">
            {icappQualityMetadata.methodology.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>

        <section className="mt-10 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--green)]">Registo de ocorrências</p>
            <h2 className="mt-2 text-2xl font-semibold">O que precisa de validação</h2>
          </div>
          {icappQualityFindings.map((finding, index) => (
            <article key={finding.id} className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">
                  Verificação {index + 1} · {finding.sourceTables.join(", ")}
                </span>
                <span className={finding.severity === "high"
                  ? "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800"
                  : finding.severity === "medium"
                    ? "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                    : "rounded-full bg-[var(--background)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"}>
                  {severityLabel[finding.severity]}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{finding.title}</h3>
              <p className="mt-2 text-sm font-medium text-[var(--green)]">{finding.indicator}</p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">Valores publicados</h4>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {finding.publishedValues.map((value) => <li key={value}>• {value}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">Verificação</h4>
                  <p className="mt-3 text-sm leading-6">{finding.verification}</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-[var(--background)] p-4">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">{statusLabel[finding.status]}</p>
                <p className="mt-2 text-sm leading-6">{finding.interpretation}</p>
                <p className="mt-3 text-sm font-semibold leading-6">Regra de utilização: {finding.usageRule}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <h2 className="font-semibold">Limitações e fontes</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
            {icappQualityMetadata.limitations.map((item) => <li key={item}>• {item}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-5">
            <a href={icappQualityMetadata.sourceWorkbook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)] hover:underline">
              Ficheiro Excel oficial <ExternalLink size={15} />
            </a>
            <a href={icappQualityMetadata.sourcePublication} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)] hover:underline">
              Publicação no INE <ExternalLink size={15} />
            </a>
          </div>
          <p className="mt-5 text-xs text-[var(--muted)]">{icappQualityMetadata.publisher} · {icappQualityMetadata.referencePeriod}</p>
        </section>
      </section>
    </main>
  );
}
