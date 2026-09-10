"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import site from "@/content/site.json";

export default function Header({ lang = "ru", altHref }: { lang?: "ru" | "en"; altHref?: string }) {
  const [open, setOpen] = useState(false);
  const nav = lang === "en"
    ? [{ label: "Baikal tours", href: "/en/baikal/" }, { label: "Contacts", href: "/en/contacts/" }]
    : site.nav;
  const s = site.site;
  return (
    <header className="sticky top-0 z-40 border-b border-ice-100 bg-ice-50/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href={lang === "en" ? "/en/" : "/"} aria-label={s.brand} className="no-underline"><Logo /></Link>
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Основное меню">
          {nav.map((n) => <Link key={n.href} href={n.href} className="whitespace-nowrap text-[15px] font-medium text-ice-900 no-underline hover:text-ice-600">{n.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <a href={s.telegram} target="_blank" rel="noopener" className="hidden items-center gap-1.5 text-sm font-medium text-ice-800 no-underline sm:inline-flex" aria-label="Telegram">
            <TgIcon /> Telegram
          </a>
          <a href={`tel:${s.phoneRaw}`} className="hidden text-[15px] font-semibold text-ice-900 no-underline md:inline">{s.phone}</a>
          {altHref && <Link href={altHref} className="text-sm font-medium text-ice-600 no-underline" hrefLang={lang === "en" ? "ru" : "en"}>{lang === "en" ? "RU" : "EN"}</Link>}
          <button className="xl:hidden rounded-xs border border-ice-200 px-3 py-1.5 text-sm" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? "Закрыть" : "Меню"}</button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="wrap border-t border-ice-100 pb-4 xl:hidden" aria-label="Мобильное меню">
          <ul className="flex flex-col divide-y divide-ice-100">
            {nav.map((n) => <li key={n.href}><Link href={n.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-ice-900 no-underline">{n.label}</Link></li>)}
            {lang === "ru" && site.footerLinks.slice(0, 6).map((n) => <li key={n.href}><Link href={n.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm text-ice-800 no-underline">{n.label}</Link></li>)}
          </ul>
        </nav>
      )}
    </header>
  );
}
export function TgIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.04 15.47 8.7 20.1c.48 0 .69-.21.94-.46l2.26-2.17 4.68 3.43c.86.47 1.47.22 1.7-.79l3.07-14.4c.28-1.26-.45-1.75-1.29-1.44L2.6 11.13c-1.23.48-1.21 1.17-.21 1.48l4.62 1.44 10.73-6.77c.5-.33.96-.15.58.18L9.04 15.47Z"/></svg>;
}
