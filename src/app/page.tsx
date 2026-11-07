import { ArrowUpRight, Wheat, Droplets, ScanSearch, Sprout, Leaf, ShieldCheck } from "lucide-react";
import SiteNavigation from "@/components/site-navigation";

const capabilities = [
  { icon: ScanSearch, title: "Análise do terreno", description: "Organize as características do solo e identifique os dados que ainda precisam de confirmação." },
  { icon: Sprout, title: "Selecção de culturas", description: "Compare as necessidades agronómicas das culturas com as condições conhecidas do terreno." },
  { icon: Wheat, title: "Rotação agrícola", description: "Planeie sucessões de culturas considerando famílias botânicas e histórico do campo." },
  { icon: Droplets, title: "Gestão da água", description: "Considere a disponibilidade hídrica e os períodos de maior exigência das culturas." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteNavigation />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce7d7] bg-white px-4 py-2 text-xs font-semibold text-[var(--green)]"><span className="size-2 rounded-full bg-[#75a65b]" /> Decisões agrícolas com fundamento</div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl tracking-[-.055em] sm:text-6xl lg:text-7xl">Plante com <span className="text-[var(--green)]">conhecimento.</span> Colha com estratégia.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 sm:mt-7 sm:text-lg sm:leading-8 text-[var(--muted)]">O Pambala transforma informação sobre o solo, o clima e as culturas numa orientação agrícola clara — adaptada à realidade de quem produz.</p>
          <div className="mt-7 flex flex-col items-stretch gap-2 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"><a href="#capacidades" className="inline-flex items-center gap-3 rounded-full bg-[var(--green)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)]">Conhecer a plataforma <ArrowUpRight size={17} /></a><span className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-sm text-[var(--muted)]"><ShieldCheck size={17} /> Recomendações justificadas</span></div>
        </div>
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#e7eddc] blur-2xl" />
          <div className="relative rounded-[1.5rem] bg-[var(--green-dark)] p-5 text-white sm:rounded-[2rem] sm:p-7 shadow-2xl sm:p-9">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.2em] text-[#c6d7bd]">O ciclo da decisão</span><span className="rounded-full bg-white/10 px-3 py-1 text-[10px]">01 / 04</span></div>
            <div className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
              {[[ "01", "Conhecer o terreno", "Solo, água e localização" ], [ "02", "Avaliar as culturas", "Exigências e compatibilidade" ], [ "03", "Planear a sucessão", "Rotação e saúde do solo" ], [ "04", "Decidir com clareza", "Vantagens, riscos e limitações" ]].map(([n,t,d],i)=><div key={n} className={`flex items-center gap-4 rounded-2xl border p-4 ${i===0?"border-[#9fbd8e]/50 bg-white/10":"border-white/10 bg-white/[.035]"}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d8e7b5] text-sm font-bold text-[var(--green-dark)]">{n}</span><span className="min-w-0 flex-1"><strong className="block text-sm">{t}</strong><span className="mt-1 block text-xs text-[#c6d7bd]">{d}</span></span><ArrowUpRight size={16} className="text-[#c6d7bd]" /></div>)}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-[#c6d7bd]"><span>Conhecimento antes da recomendação</span><Leaf size={18} /></div>
          </div>
        </div>
      </section>

      <section id="capacidades" className="border-t border-[var(--border)] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10"><div className="max-w-2xl"><span className="text-xs font-bold uppercase tracking-[.2em] text-[var(--green)]">O que estamos a construir</span><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Da observação do campo à decisão agrícola.</h2><p className="mt-4 leading-7 text-[var(--muted)]">Uma plataforma de apoio à decisão, não uma promessa de produtividade. Cada análise deverá explicar os dados utilizados e as incertezas existentes.</p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(({icon:Icon,title,description})=><article key={title} className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6"><span className="grid size-12 place-items-center rounded-2xl bg-[#e5edda] text-[var(--green)]"><Icon size={22}/></span><h3 className="mt-6 font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p></article>)}</div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>© {new Date().getFullYear()} Pambala. Inteligência agrícola.</span><span>Construído para apoiar decisões fundamentadas.</span></footer>
    </main>
  );
}
