import Link from "next/link";
import { ArrowLeft, MapPinned, ShieldAlert, CheckCircle2, CircleDashed } from "lucide-react";
import { getAngolaGeographyCoverage } from "@/domain/geography/coverage";

export const metadata = {
  title: "Cobertura geográfica — Pambala",
  description:
    "Estado de cobertura do registo administrativo de Angola no Pambala.",
};

function CoverageCard({
  label,
  registered,
  expected,
  detail,
}: {
  label: string;
  registered: number;
  expected: number;
  detail: string;
}) {
  const percentage =
    expected > 0 ? Math.min(100, Math.round((registered / expected) * 100)) : 0;

  return (
    <article className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm shadow-black/[0.02]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
            {registered.toLocaleString("pt-PT")}
            <span className="ml-2 text-lg font-medium text-[var(--muted)]">
              / {expected.toLocaleString("pt-PT")}
            </span>
          </p>
        </div>
        <span className="rounded-2xl bg-[#e5edda] px-3 py-2 text-sm font-bold text-[var(--green)]">
          {percentage}%
        </span>
      </div>
      <div
        className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--background)]"
        role="progressbar"
        aria-label={`Cobertura de ${label.toLocaleLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="h-full rounded-full bg-[var(--green)] transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{detail}</p>
    </article>
  );
}

export default function GeographyPage() {
  const coverage = getAngolaGeographyCoverage();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="mx-auto max-w-7xl px-6 pb-10 pt-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--green)]"
        >
          <ArrowLeft size={16} /> Voltar ao Pambala
        </Link>

        <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e5edda] text-[var(--green)]">
              <MapPinned size={24} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--green)]">
                Registo territorial · Referência {coverage.referenceDate}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Cobertura geográfica de Angola
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
                Acompanhe o que já foi transcrito e validado no Pambala. As
                referências legais nacionais e os registos efectivamente
                importados são apresentados separadamente.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 lg:min-w-56">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Hierarquia detalhada
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {coverage.provincesWithDetailedHierarchy}
              <span className="text-lg text-[var(--muted)]">
                {" "}/ {coverage.expected.provinces}
              </span>
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              províncias com hierarquia nominal transcrita
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          <CoverageCard
            label="Províncias listadas"
            registered={coverage.registered.provinceList}
            expected={coverage.expected.provinces}
            detail="Nomes e códigos das 21 províncias de referência legal."
          />
          <CoverageCard
            label="Municípios"
            registered={coverage.registered.municipalities}
            expected={coverage.expected.municipalities}
            detail="Registos municipais transcritos a partir do anexo de codificação."
          />
          <CoverageCard
            label="Comunas"
            registered={coverage.registered.communes}
            expected={coverage.expected.communes}
            detail="Comunas explicitamente enumeradas. Marcadores sem comuna não são contados."
          />
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm shadow-black/[0.02] sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--green)]">
                Estado de importação
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Cobertura por província
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {coverage.provincesWithDetailedHierarchy} de{" "}
                {coverage.expected.provinces} províncias têm hierarquia municipal
                detalhada registada.
              </p>
            </div>
            <span className="w-fit rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
              {coverage.provincesWithoutDetailedHierarchy} por importar
            </span>
          </div>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {coverage.provinces.map((province) => (
              <li
                key={province.provinceId}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{province.provinceName}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {province.municipalityCount} municípios ·{" "}
                    {province.communeCount} comunas registadas
                  </p>
                </div>
                {province.hasDetailedHierarchy ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e5edda] px-3 py-1.5 text-xs font-semibold text-[var(--green)]">
                    <CheckCircle2 size={14} /> Transcrita
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
                    <CircleDashed size={14} /> Pendente
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <aside className="mt-6 rounded-3xl border border-[#eadfc7] bg-[#fffaf0] p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 shrink-0 text-[#98713b]" size={21} />
            <div>
              <h2 className="font-semibold text-[#624a27]">
                Transparência e limites dos dados
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#705c3c]">
                Esta página mede a cobertura do registo administrativo, não a
                cobertura cartográfica. Ainda não existem geometrias territoriais
                validadas para localizar automaticamente uma exploração.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#705c3c]">
                {coverage.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-[#624a27]">
                Geometrias validadas: não disponíveis · Atribuição automática por
                coordenadas: desactivada.
              </p>
            </div>
          </div>
        </aside>

        <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
          Os totais esperados são referências legais nacionais. As barras
          representam apenas a proporção de registos transcritos face a essas
          referências, não a qualidade nem a precisão dos dados.
        </p>
      </section>
    </main>
  );
}
