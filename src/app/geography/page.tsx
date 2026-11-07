import Link from "next/link";
import { ArrowLeft, MapPinned, ShieldAlert } from "lucide-react";
import { getAngolaGeographyCoverage } from "@/domain/geography/coverage";

export const metadata = {
  title: "Cobertura geográfica — Pambala",
  description:
    "Estado de cobertura do registo administrativo de Angola no Pambala.",
};

export default function GeographyPage() {
  const coverage = getAngolaGeographyCoverage();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--green)]"
        >
          <ArrowLeft size={16} /> Voltar ao Pambala
        </Link>
        <div className="mt-10 flex items-start gap-4">
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
              Transparência sobre as divisões administrativas registadas no
              Pambala. Os totais nacionais são referências legais; os registos
              importados são apresentados separadamente.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Províncias",
              expected: coverage.expected.provinces,
              registered: coverage.registered.provinces,
              detail: "Lista provincial registada",
            },
            {
              label: "Municípios",
              expected: coverage.expected.municipalities,
              registered: coverage.registered.municipalities,
              detail: "Hierarquia municipal transcrita",
            },
            {
              label: "Comunas",
              expected: coverage.expected.communes,
              registered: coverage.registered.communes,
              detail: "Comunas explicitamente enumeradas",
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-[var(--border)] bg-white p-6"
            >
              <p className="text-sm font-medium text-[var(--muted)]">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">
                {item.registered}
                <span className="ml-2 text-lg font-medium text-[var(--muted)]">
                  / {item.expected}
                </span>
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Cobertura por província</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {coverage.provincesWithDetailedHierarchy} de{" "}
                {coverage.expected.provinces} províncias com hierarquia municipal
                detalhada.
              </p>
            </div>
            <span className="rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
              {coverage.provincesWithoutDetailedHierarchy} por importar
            </span>
          </div>

          <ul className="mt-6 divide-y divide-[var(--border)]">
            {coverage.provinces.map((province) => (
              <li
                key={province.provinceId}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{province.provinceName}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {province.municipalityCount} municípios ·{" "}
                    {province.communeCount} comunas registadas
                  </p>
                </div>
                <span
                  className={
                    province.hasDetailedHierarchy
                      ? "rounded-full bg-[#e5edda] px-3 py-1.5 text-xs font-semibold text-[var(--green)]"
                      : "rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
                  }
                >
                  {province.hasDetailedHierarchy
                    ? "Hierarquia parcial disponível"
                    : "Por importar"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-3xl border border-[#eadfc7] bg-[#fffaf0] p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 shrink-0 text-[#98713b]" size={21} />
            <div>
              <h2 className="font-semibold text-[#624a27]">
                Limites importantes
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#705c3c]">
                {coverage.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-[#624a27]">
                Geometrias validadas: não disponíveis. Atribuição automática por
                coordenadas: desactivada.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
