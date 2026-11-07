import type { ClimateRiskInsights } from "@/domain/climate/risk-insights";
import type { SoilProfile } from "@/domain/soil/schema";

interface FieldContextCrosscheckProps {
  insights: ClimateRiskInsights;
  soilProfile: SoilProfile | null;
  cropName: string | null;
}

const soilLabels = {
  texture: {
    sandy: "Arenoso",
    clayey: "Argiloso",
    loamy: "Franco",
    unknown: "Não registada",
  },
  moisture: {
    dry: "Seco",
    normal: "Húmido / normal",
    wet: "Encharcado / muito húmido",
    unknown: "Não registada",
  },
  drainage: {
    poor: "Má",
    moderate: "Moderada",
    good: "Boa",
    unknown: "Não registada",
  },
  fertility: {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    unknown: "Não avaliada",
  },
  organicMatter: {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    unknown: "Não avaliada",
  },
} as const;

function ContextFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3">
      <dt className="text-[11px] text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

/**
 * Places farmer-reported plot context beside NASA POWER signals.
 * It intentionally does not infer drought, crop stress, or recommendations.
 */
export function FieldContextCrosscheck({
  insights,
  soilProfile,
  cropName,
}: FieldContextCrosscheckProps) {
  const coverage = insights.precipitationCoverage;

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Contexto da parcela: clima + observações</h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--muted)]">
            Coloca os sinais climáticos e o contexto registado lado a lado. Não calcula uma pontuação nem produz um diagnóstico automático.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-semibold">
          Leitura comparativa
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-[var(--background)] p-4">
          <h4 className="text-sm font-semibold">Estimativa climática · NASA POWER</h4>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            <ContextFact
              label="Maior sequência abaixo de 1 mm/dia"
              value={insights.drySpell ? `${insights.drySpell.durationDays} dias` : "Não identificável"}
            />
            <ContextFact
              label="Cobertura da precipitação"
              value={coverage.percentage === null ? "Sem dados" : `${coverage.percentage.toFixed(1)}%`}
            />
            <ContextFact
              label="Dias válidos"
              value={`${coverage.validDays} / ${coverage.totalDays}`}
            />
            <ContextFact
              label="Cultura seleccionada"
              value={cropName ?? "Não seleccionada"}
            />
          </dl>
          {insights.drySpell && (
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              Sequência identificada entre {insights.drySpell.startDate} e {insights.drySpell.endDate}.
            </p>
          )}
        </article>

        <article className="rounded-2xl bg-[var(--background)] p-4">
          <h4 className="text-sm font-semibold">Solo · observações introduzidas</h4>
          {soilProfile ? (
            <dl className="mt-3 grid grid-cols-2 gap-2">
              <ContextFact label="Textura" value={soilLabels.texture[soilProfile.texture]} />
              <ContextFact label="Humidade observada" value={soilLabels.moisture[soilProfile.moisture]} />
              <ContextFact label="Drenagem" value={soilLabels.drainage[soilProfile.drainage]} />
              <ContextFact label="pH medido" value={soilProfile.ph ? soilProfile.ph.value.toFixed(1) : "Não medido"} />
              <ContextFact label="Fertilidade percebida" value={soilLabels.fertility[soilProfile.fertility]} />
              <ContextFact label="Matéria orgânica percebida" value={soilLabels.organicMatter[soilProfile.organicMatter]} />
            </dl>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">
              O perfil do solo não está disponível. Verifique o pH introduzido ou registe as observações do terreno.
            </p>
          )}
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--border)] p-4">
        <h4 className="text-sm font-semibold">Como cruzar estas informações no terreno</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-[var(--muted)]">
          <li>Confirme a data e o local das observações do solo antes de as comparar com o período climático.</li>
          <li>Se possível, observe a humidade e a drenagem em mais de um ponto da parcela e registe o que encontrou.</li>
          <li>Se a realidade observada diferir da estimativa NASA POWER, preserve ambas as informações e investigue a diferença; a estimativa em grelha não substitui a observação local.</li>
        </ul>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">
        Limitações: as observações do solo são declaradas pelo utilizador e não foram verificadas por laboratório. A NASA POWER representa estimativas numa grelha, não medições dentro da parcela. Esta leitura não confirma seca agrícola, défice de água no solo, stress da cultura ou perda de produção. A fase de desenvolvimento da cultura também não é avaliada nesta versão.
      </p>
    </section>
  );
}
