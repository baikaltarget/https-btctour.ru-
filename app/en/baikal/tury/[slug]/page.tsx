import { notFound } from "next/navigation";
import EnShell from "@/components/EnShell";
import TourImage from "@/components/TourImage";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import { SITE, tourUrl, nextDeparture, type Departure } from "@/lib/content";
import { EN, enTours, enTour, fmtRub, fmtRangeEn, priceUnitEn, seatsLabelEn, seatsClassEn } from "@/lib/en";
import { meta } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() { return enTours().map((x) => ({ slug: x.t.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const x = enTour((await params).slug); if (!x) return {};
  return meta({ title: `${x.e.title} — Lake Baikal tour, ${x.t.days} days, from ${fmtRub(x.t.priceFrom)} | Baikal Travel Company`, description: x.e.summary.slice(0, 160), path: "/en" + tourUrl(x.t), alternates: { ru: SITE.domain + tourUrl(x.t), en: SITE.domain + "/en" + tourUrl(x.t) } });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const x = enTour((await params).slug); if (!x) notFound();
  const { t, e } = x; const next = nextDeparture(t); const today = new Date().toISOString().slice(0, 10); const up = (t.departures as Departure[]).filter((d) => d.from >= today);
  const url = SITE.domain + "/en" + tourUrl(t);
  const ld = { "@context": "https://schema.org", "@type": ["TouristTrip", "Product"], name: e.title, description: e.summary, url, provider: { "@id": SITE.domain + "/#org" }, offers: t.priceFrom ? { "@type": "Offer", priceCurrency: "RUB", price: t.priceFrom, availability: "https://schema.org/InStock", url } : undefined };
  return (
    <EnShell altHref={tourUrl(t)}>
      <JsonLd data={ld} />
      <article className="wrap pt-10">
        <p className="mb-2 text-sm text-ice-600">{t.days} {EN.labels.days} · {t.groupSize}</p><h1>{e.title}</h1><p className="mt-3 max-w-2xl text-xl text-ice-800">{e.tagline}</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xs"><TourImage src={t.image} alt={e.title} seed={t.title.length} sizes="800px" priority /></div>
            <p className="prose-site mt-8 text-[18px]">{e.summary}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">{e.highlights.map((h) => <li key={h} className="rounded-xs bg-ice-100/70 px-4 py-3 text-[15px]">{h}</li>)}</ul>
            {up.length > 0 && <section className="mt-12"><h2 className="mb-4">{EN.labels.dates}</h2><ul className="divide-y divide-ice-200 border-y border-ice-200">{up.map((d) => <li key={d.from} className="flex justify-between py-3"><span className="font-semibold">{fmtRangeEn(d)}</span><span className={`text-sm ${seatsClassEn(d)}`}>{seatsLabelEn(d).text}</span></li>)}</ul></section>}
            {e.program.length > 0 && <section className="mt-12"><h2 className="mb-6">{EN.labels.programme}</h2><ol className="border-l border-ice-200 pl-6">{e.program.map(([title, text], i) => <li key={i} className="relative mb-8"><span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ice-800 text-[11px] text-white">{i + 1}</span><h3 className="!text-lg">{title}</h3><p className="mt-1 text-ink/85">{text}</p></li>)}</ol></section>}
            <section className="mt-12 grid gap-8 md:grid-cols-2"><div><h2 className="mb-4 !text-2xl">{EN.labels.included}</h2><ul className="space-y-2 text-[15px]">{e.included.map((i) => <li key={i}>· {i}</li>)}</ul></div><div><h2 className="mb-4 !text-2xl">{EN.labels.excluded}</h2><ul className="space-y-2 text-[15px] text-ink/75">{e.excluded.map((i) => <li key={i}>· {i}</li>)}</ul></div></section>
            <section id="book" className="mt-12 rounded-xs border border-ice-200 bg-white p-6"><h2 className="mb-4">{EN.labels.book}</h2><LeadForm source={`en tour: ${t.title}`} tour={t.slug} dates={up.map(fmtRangeEn)} lang="en" /></section>
          </div>
          <aside className="lg:sticky lg:top-20 lg:self-start"><div className="rounded-xs border border-ice-200 bg-white p-5"><p className="font-display text-3xl font-semibold text-ice-800">{t.priceFrom ? EN.labels.from + " " : ""}{fmtRub(t.priceFrom)}</p><p className="text-sm text-ice-600">{priceUnitEn(t)}</p>{next ? <p className="mt-4 rounded-xs bg-ice-100 px-3 py-2 text-sm"><span className="text-ice-600">{EN.labels.next}</span><br /><b>{fmtRangeEn(next)}</b><br /><span className={seatsClassEn(next)}>{seatsLabelEn(next).text}</span></p> : <p className="mt-4 text-sm text-ice-600">{EN.labels.onRequest}</p>}<div className="mt-5 grid gap-2"><a href="#book" className="btn-dawn">{EN.labels.book}</a><a href={SITE.telegram} className="btn-ghost" target="_blank" rel="noopener">{EN.labels.ask}</a></div></div></aside>
        </div>
      </article>
    </EnShell>
  );
}
