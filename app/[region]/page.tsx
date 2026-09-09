import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import DevFrame from "@/components/DevFrame";
import LeadForm from "@/components/LeadForm";
import { regions, getRegion, fmtPrice } from "@/lib/content";
import { meta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return regions.map((r) => ({ region: r.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const r = getRegion((await params).region);
  if (!r) return {};
  return meta({ title: r.title, description: r.description, path: `/${r.slug}/` });
}
type Group = { name: string; items: { title: string; days: number; priceFrom: number; season: string; text: string }[] };

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const r = getRegion((await params).region);
  if (!r) notFound();
  const groups = (r as { groups?: Group[] }).groups;
  const active = r.tours.filter((t) => t.status === "active");
  const drafts = r.tours.filter((t) => t.status === "draft");
  return (
    <Shell>
      <Breadcrumbs items={[{ name: "Другие направления", href: "/napravleniya/" }, { name: r.name, href: `/${r.slug}/` }]} />
      <section className="wrap pt-6 md:pt-10">
        <h1>{r.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{r.intro}</p>
      </section>
      <section className="wrap pt-10">
        <DevFrame note={r.todo}>
          {active.length > 0 && (
            <div className="divide-y divide-ice-200 border-y border-ice-200">
              {active.map((t) => {
                const x = t as typeof t & { tagline?: string; days?: number; priceFrom?: number; summary?: string };
                return (
                  <article key={t.slug} className="grid gap-3 py-6 md:grid-cols-[1fr_auto] md:gap-8">
                    <div><p className="text-sm text-ice-600">{x.days ? `${x.days} дн.` : ""}</p><h2 className="!text-2xl"><Link href={`/${r.slug}/tury/${t.slug}/`} className="no-underline hover:underline">{t.title}</Link></h2><p className="mt-1 max-w-2xl text-[15px] text-ink/80">{x.tagline}</p></div>
                    <div className="md:text-right"><p className="font-display text-2xl font-semibold text-ice-800">от {fmtPrice(x.priceFrom)}</p><Link href={`/${r.slug}/tury/${t.slug}/`} className="btn-ghost mt-2 hidden md:inline-flex">Программа</Link></div>
                  </article>
                );
              })}
            </div>
          )}
          {groups && (
            <div className="mt-10 space-y-10">
              {groups.filter((g) => g.items.length).map((g) => (
                <div key={g.name}>
                  <h2 className="mb-4">{g.name}</h2>
                  <div className="divide-y divide-ice-200 border-y border-ice-200">
                    {g.items.map((it) => (
                      <div key={it.title} className="grid gap-2 py-4 md:grid-cols-[1fr_200px] md:gap-8">
                        <div><h3 className="!text-lg">{it.title}</h3><p className="text-[15px] text-ink/80">{it.text}</p></div>
                        <p className="text-sm text-ice-800 md:text-right">{it.days} дн. · {it.season}<br /><span className="font-semibold">от {fmtPrice(it.priceFrom)}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <h2 className="mb-3">Другие форматы</h2>
                <ul className="flex flex-wrap gap-2">{groups.filter((g) => !g.items.length).map((g) => <li key={g.name} className="rounded-xs bg-ice-100 px-3 py-1.5 text-sm">{g.name}</li>)}</ul>
                <p className="mt-3 text-sm text-ice-600">Программы и даты по этим форматам присылаем по запросу.</p>
              </div>
            </div>
          )}
          {drafts.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3">Ещё программы</h2>
              <ul className="grid gap-1 sm:grid-cols-2">{drafts.map((t) => <li key={t.slug} className="text-[15px]">{t.title} <span className="text-sm text-ice-600">— по запросу</span></li>)}</ul>
            </div>
          )}
        </DevFrame>
      </section>
      <section className="wrap mt-14 grid gap-8 rounded-xs border border-ice-200 bg-white p-6 md:grid-cols-2 md:p-10">
        <div><h2>Подобрать программу</h2><p className="mt-3 text-ink/80">Скажите даты и состав — пришлём подходящие туры по направлению «{r.name}» с ценами.</p></div>
        <LeadForm source={`region: ${r.name}`} />
      </section>
      <p className="wrap mt-10 text-sm"><Link href="/baikal/">← Наш основной продукт — туры на Байкал</Link></p>
    </Shell>
  );
}
