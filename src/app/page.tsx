import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CloudSun,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import SiteNavigation from "@/components/site-navigation";

const capabilities = [
  {
    icon: MapPin,
    title: "Registo da exploração",
    description:
      "Organize a localização, a área declarada e as características conhecidas da sua parcela.",
    href: "/farmer",
    linkLabel: "Registar exploração",
  },
  {
    icon: CloudSun,
    title: "Inteligência climática NASA",
    description:
      "Consulte precipitação, temperatura e humidade estimadas pela NASA POWER para um ponto e período.",
    href: "/climate",
    linkLabel: "Consultar clima",
  },
  {
    icon: Sprout,
    title: "Solo e culturas",
    description:
      "Registe observações do solo, seleccione uma cultura e consulte referências gerais com as suas limitações.",
    href: "/climate",
    linkLabel: "Explorar análise",
  },
  {
    icon: BarChart3,
    title: "Contexto agrícola de Angola",
    description:
      "Explore estatísticas oficiais do INE e consulte as verificações de qualidade dos dados publicados.",
    href: "/agriculture",
    linkLabel: "Ver contexto agrícola",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteNavigation />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce7d7] bg-white px-4 py-2 text-xs font-semibold text-[var(--green)]">
            <span className="size-2 rounded-full bg-[#75a65b]" />
            Informação agrícola com fontes e limites claros
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-.055em] sm:text-5xl sm:text-6xl lg:text-7xl">
            Conheça o campo.{" "}
            <span className="text-[var(--green)]">Compreenda o clima.</span>{" "}
            Decida com evidência.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:mt-7 sm:text-lg sm:leading-8">
            O Pambala reúne dados climáticos da NASA, características observadas
            do solo e estatísticas agrícolas oficiais de Angola para ajudar a
            compreender melhor as condições de uma exploração.
          </p>
          <div className="mt-7 flex flex-col items-stretch gap-2 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/farmer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--green)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)]"
            >
              Registar exploração <ArrowRight size={17} />
            </Link>
            <a
              href="#capacidades"
              className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-sm text-[var(--muted)]"
            >
              Conhecer a plataforma <ArrowUpRight size={17} />
            </a>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--muted)]">
            <ShieldCheck size={15} />
            Estimativas, medições e dados desconhecidos são identificados separadamente.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#e7eddc] blur-2xl" />
          <div className="relative rounded-[1.5rem] bg-[var(--green-dark)] p-5 text-white shadow-2xl sm:rounded-[2rem] sm:p-9">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#c6d7bd]">
                O percurso no Pambala
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px]">
                01 / 04
              </span>
            </div>
            <div className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
              {[
                ["01", "Registar a exploração", "Localização e área declarada"],
                ["02", "Consultar o clima", "Estimativas diárias NASA POWER"],
                ["03", "Caracterizar o terreno", "Solo observado e cultura seleccionada"],
                ["04", "Consultar o contexto", "Estatísticas, fontes e limitações"],
              ].map(([number, title, description], index) => (
                <div
                  key={number}
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    index === 0
                      ? "border-[#9fbd8e]/50 bg-white/10"
                      : "border-white/10 bg-white/[.035]"
                  }`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d8e7b5] text-sm font-bold text-[var(--green-dark)]">
                    {number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm">{title}</strong>
                    <span className="mt-1 block text-xs text-[#c6d7bd]">
                      {description}
                    </span>
                  </span>
                  <ArrowUpRight size={16} className="text-[#c6d7bd]" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-[#c6d7bd]">
              <span>Conhecimento antes de qualquer conclusão</span>
              <Leaf size={18} />
            </div>
          </div>
        </div>
      </section>

      <section id="capacidades" className="border-t border-[var(--border)] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[.2em] text-[var(--green)]">
              O que já pode explorar
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Da informação do campo à compreensão das condições agrícolas.
            </h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              O Pambala é uma ferramenta de apoio à compreensão, não uma
              promessa de produtividade nem um substituto de aconselhamento
              agronómico local. Cada fonte tem contexto e limitações próprios.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, description, href, linkLabel }) => (
              <article
                key={title}
                className="flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-[#e5edda] text-[var(--green)]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 font-semibold">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                  {description}
                </p>
                <Link
                  href={href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)] hover:underline"
                >
                  {linkLabel} <ArrowUpRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>© {new Date().getFullYear()} Pambala. Inteligência agrícola.</span>
        <span>NASA POWER · INE Angola · Referências FAO EcoCrop</span>
      </footer>
    </main>
  );
}
