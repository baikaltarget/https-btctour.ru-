import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import TourList from "@/components/TourList";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import DevFrame from "@/components/DevFrame";
import JsonLd from "@/components/JsonLd";
import { categories, getCategory, toursForCategory, tourUrl, SITE } from "@/lib/content";
import { meta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return categories.map((c) => ({ category: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const c = getCategory((await params).category);
  if (!c) return {};
  return meta({ title: c.title, description: c.description, path: `/baikal/${c.slug}/` });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const c = getCategory((await params).category);
  if (!c) notFound();
  const list = toursForCategory(c);
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: c.h1, itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.domain + tourUrl(t), name: t.title })) };
  return (
    <Shell>
      <JsonLd data={itemList} />
      <Breadcrumbs items={[{ name: "Туры на Байкал", href: "/baikal/" }, { name: c.name, href: `/baikal/${c.slug}/` }]} />
      <section className="wrap pt-6 md:pt-10">
        <h1>{c.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{c.intro}</p>
        {c.seasonNote && <p className="mt-3 max-w-2xl rounded-xs bg-ice-100 px-4 py-3 text-[15px] text-ice-900">{c.seasonNote}</p>}
      </section>

      {c.howToGet && (
        <section className="wrap pt-12">
          <DevFrame note={c.howToGet.todo}>
            <h2 className="mb-4">{c.howToGet.title}</h2>
            <dl className="grid max-w-3xl gap-y-3 border-y border-ice-200 py-4 sm:grid-cols-[180px_1fr] sm:gap-x-6">
              {c.howToGet.rows.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-ice-800">{k}</dt><dd className="mb-2 text-ink/85 sm:mb-0">{v}</dd></div>)}
            </dl>
          </DevFrame>
        </section>
      )}

      <section className="wrap pt-12">
        <DevFrame note={c.todo}>
          <h2 className="mb-6">{c.builder ? "Примеры индивидуальных программ" : `Программы: ${list.length}`}</h2>
          {c.builder && c.examples && (
            <div className="mb-10 grid gap-6 md:grid-cols-3">
              {c.examples.map((e) => <div key={e.title} className="rounded-xs border border-ice-200 bg-white p-5"><p className="font-display text-lg font-semibold text-ice-800">{e.title}</p><p className="mt-2 text-[15px] leading-relaxed text-ink/80">{e.text}</p></div>)}
            </div>
          )}
          {c.builder ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div><h3 className="mb-3">Расскажите о поездке</h3><p className="mb-4 text-ink/80">Даты, состав, что важно. Черновик программы с ценой пришлём в течение суток.</p><LeadForm source="individual" /></div>
              <div><h3 className="mb-3">Или возьмите за основу готовый тур</h3><TourList tours={list} /></div>
            </div>
          ) : <TourList tours={list} />}
        </DevFrame>
      </section>

      <section className="wrap pt-12">
        <div className="prose-site text-ink/85"><p>{c.text}</p></div>
        <p className="mt-6 flex flex-wrap gap-2 text-sm">
          {categories.filter((x) => x.slug !== c.slug).slice(0, 8).map((x) => <Link key={x.slug} href={`/baikal/${x.slug}/`} className="rounded-xs bg-ice-100 px-3 py-1.5 no-underline">{x.name}</Link>)}
        </p>
      </section>
      <Faq items={c.faq} />
    </Shell>
  );
}
