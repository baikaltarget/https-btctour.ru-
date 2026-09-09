"use client";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
type Item = { title: string; tagline: string; summary: string; url: string; days: number; price: number | null; season: string[]; tags: string[]; type: string };
export default function SearchBox({ items, tagLabels }: { items: Item[]; tagLabels: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [season, setSeason] = useState("");
  const [days, setDays] = useState("");
  const [tag, setTag] = useState("");
  const fuse = useMemo(() => new Fuse(items, { keys: ["title", "tagline", "summary", "tags"], threshold: 0.35, ignoreLocation: true }), [items]);
  const list = useMemo(() => {
    let l = q ? fuse.search(q).map((r) => r.item) : items;
    if (season) l = l.filter((t) => t.season.includes(season));
    if (tag) l = l.filter((t) => t.tags.includes(tag));
    if (days === "1") l = l.filter((t) => t.days === 1);
    if (days === "3") l = l.filter((t) => t.days >= 2 && t.days <= 4);
    if (days === "5") l = l.filter((t) => t.days >= 5 && t.days <= 7);
    if (days === "8") l = l.filter((t) => t.days >= 8);
    return l;
  }, [q, season, days, tag, fuse, items]);
  const sel = "rounded-xs border border-ice-200 bg-white px-3 py-2 text-sm";
  return (
    <div>
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ольхон, лёд, баня, КБЖД…" className="rounded-xs border border-ice-200 bg-white px-4 py-2.5 text-base" aria-label="Поиск по турам" />
        <select value={season} onChange={(e) => setSeason(e.target.value)} className={sel} aria-label="Сезон"><option value="">Любой сезон</option><option value="winter">Зима</option><option value="summer">Лето</option></select>
        <select value={days} onChange={(e) => setDays(e.target.value)} className={sel} aria-label="Длительность"><option value="">Любая длительность</option><option value="1">1 день</option><option value="3">2–4 дня</option><option value="5">5–7 дней</option><option value="8">8+ дней</option></select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} className={sel} aria-label="Формат"><option value="">Любой формат</option>{Object.entries(tagLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      </div>
      <p className="mb-4 text-sm text-ice-600">{list.length ? `Найдено: ${list.length}` : "Ничего не нашлось. Попробуйте другое слово или позвоните — подберём вручную."}</p>
      <ul className="divide-y divide-ice-200 border-y border-ice-200">
        {list.map((t) => (
          <li key={t.url} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
            <div><Link href={t.url} className="text-lg font-semibold no-underline hover:underline">{t.title}</Link><p className="text-sm text-ink/70">{t.tagline}</p></div>
            <p className="text-sm text-ice-800">{t.days === 1 ? "1 день" : `${t.days} дн.`} · {t.price ? `от ${t.price.toLocaleString("ru-RU")} ₽` : "цена по запросу"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
