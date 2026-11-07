"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, Sprout, X } from "lucide-react";

const links = [
  { href: "/farmer", label: "Meu espaço" },
  { href: "/geography", label: "Cobertura geográfica" },
  { href: "/agriculture", label: "Dados agrícolas INE" },
  { href: "/climate", label: "Explorar clima NASA", primary: true },
];

export default function SiteNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Pambala início" onClick={() => setOpen(false)}>
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--green)] text-white sm:size-11"><Sprout size={23} /></span>
        <span className="min-w-0"><strong className="block text-xl tracking-tight">pambala</strong><span className="block text-[9px] font-semibold uppercase tracking-[.18em] text-[var(--muted)] sm:text-[10px] sm:tracking-[.22em]">Inteligência agrícola</span></span>
      </Link>

      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--green)] sm:hidden"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>

      <nav id="primary-navigation" className={`${open ? "flex" : "hidden"} w-full flex-col gap-2 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={link.primary
              ? "inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--green)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--green-dark)] sm:min-h-10 sm:py-2.5 sm:text-xs"
              : "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--green)] transition hover:bg-[var(--background)] sm:min-h-10 sm:py-2.5 sm:text-xs"}
          >
            {link.label}
            {link.primary && <ArrowUpRight size={15} className="ml-1" />}
          </Link>
        ))}
        <span className="hidden rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--green)] lg:inline-flex">Angola · Versão inicial</span>
      </nav>
    </header>
  );
}
