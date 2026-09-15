import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import TourList from "@/components/TourList";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import DevFrame from "@/components/DevFrame";
import JsonLd from "@/components/JsonLd";
import TourImage from "@/components/TourImage";
import { categories, getCategory, toursForCategory, tourUrl, fmtPrice, SITE, activeTours } from "@/lib/content";
import { meta } from "@/lib/seo";

/** Иконки-бейджи для категорий, где мотив однозначно совпадает по смыслу (маршрут / вода / природа). Остальным ничего не навязываем. */
const CATEGORY_ICONS: Record<string, string> = {
  individualnye: "/img/icons/icon-route.webp",
  "iz-moskvy": "/img/icons/icon-route.webp",
  "iz-spb": "/img/icons/icon-route.webp",
  kruizy: "/img/icons/icon-water.webp",
  ekskursii: "/img/icons/icon-nature.webp",
};

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
  // Вертолётный раздел — единственная посадочная по теме: маршруты с ценами показываем прямо здесь,
  // отдельная карточка тура закрыта редиректом, иначе две страницы конкурировали за одни и те же запросы.
  const heli = c.filter.type === "helicopter" ? activeTours().find((t) => t.type === "helicopter") : undefined;
  const icon = CATEGORY_ICONS[c.slug];
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: c.h1, itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.domain + tourUrl(t), name: t.title })) };
  return (
    <Shell>
      <JsonLd data={itemList} />
      <Breadcrumbs items={[{ name: "Туры на Байкал", href: "/baikal/" }, { name: c.name, href: `/baikal/${c.slug}/` }]} />
      {heli ? (
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <TourImage src={heli.image} alt="Вертолёт на берегу Байкала" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-ice-900/70 via-ice-900/45 to-ice-900/75" aria-hidden="true" />
          </div>
          <div className="wrap py-16 md:py-24">
            <h1 className="max-w-3xl text-white">{c.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ice-100/95">{c.intro}</p>
            <p className="mt-7 flex flex-wrap gap-3">
              <a href="#marshruty" className="btn-dawn">Маршруты и цены</a>
              <a href="#zayavka" className="btn-frost">Рассчитать полёт</a>
            </p>
            <p className="mt-6 text-sm text-ice-100/80">От {fmtPrice(heli.priceFrom)} за борт · {heli.datesNote}</p>
          </div>
        </section>
      ) : (
      <section className="wrap pt-6 md:pt-10">
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt="" aria-hidden="true" className="mb-3 h-14 w-14 opacity-90" />
        )}
        <h1>{c.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{c.intro}</p>
        {c.seasonNote && <p className="mt-3 max-w-2xl rounded-xs bg-ice-100 px-4 py-3 text-[15px] text-ice-900">{c.seasonNote}</p>}
      </section>
      )}

      {c.howToGet && (
        <section className="wrap pt-12">
          <>
            <h2 className="mb-4">{c.howToGet.title}</h2>
            <dl className="grid max-w-3xl gap-y-3 border-y border-ice-200 py-4 sm:grid-cols-[180px_1fr] sm:gap-x-6">
              {c.howToGet.rows.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-ice-800">{k}</dt><dd className="mb-2 text-ink/85 sm:mb-0">{v}</dd></div>)}
            </dl>
            {"note" in c.howToGet && (c.howToGet as { note?: string }).note && (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ice-600">{(c.howToGet as { note?: string }).note}</p>
            )}
          </>
        </section>
      )}

      {!heli && (
      <section className="wrap pt-12">
        <DevFrame note={c.todo}>
          <h2 className="mb-6">{c.builder ? "Примеры индивидуальных программ" : `Программы: ${list.length}`}</h2>
          {c.builder && c.examples && (
            <div className="mb-10 grid gap-6 md:grid-cols-3">
              {c.examples.map((e) => <div key={e.title} className="rounded-xs border border-ice-200 bg-white p-5"><p className="font-display text-lg font-semibold text-ice-800">{e.title}</p><p className="mt-2 text-[15px] leading-relaxed text-ink/80">{e.text}</p></div>)}
            </div>
          )}
          {c.builder ? (
            <div className="grid gap-10 md:grid-cols-2">
              <div><h3 className="mb-3">Расскажите о поездке</h3><p className="mb-4 text-ink/80">Даты, состав, что важно. Черновик программы с ценой пришлём в течение суток.</p><LeadForm source="individual" /></div>
              <div>
                <h3 className="mb-3">Или возьмите за основу готовый тур</h3>
                <div className="grid gap-4">
                  {list.slice(0, 4).map((t) => (
                    <Link key={t.slug} href={tourUrl(t)} className="group flex gap-4 rounded-xs border border-ice-200 bg-white p-3 no-underline hover:border-ice-600">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xs"><TourImage src={t.image} alt="" seed={t.title.length} sizes="112px" /></div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ice-900">{t.title}</p>
                        <p className="whitespace-nowrap text-sm text-ice-600">{t.priceFrom ? `от\u00a0${fmtPrice(t.priceFrom)}` : "цена по запросу"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : <TourList tours={list} />}
        </DevFrame>
      </section>
      )}

      <section className="wrap pt-12">
        <div className="prose-site text-ink/85"><p>{c.text}</p></div>
        <p className="mt-6 flex flex-wrap gap-2 text-sm">
          {categories.filter((x) => x.slug !== c.slug).slice(0, 8).map((x) => <Link key={x.slug} href={`/baikal/${x.slug}/`} className="rounded-xs bg-ice-100 px-3 py-1.5 no-underline">{x.name}</Link>)}
        </p>
      </section>
      {heli && heli.routes && (
        <section className="wrap pt-14 md:pt-20" id="marshruty">
          <h2 className="mb-2">Маршруты и цены</h2>
          <p className="mb-6 max-w-3xl text-sm text-ice-600">{heli.routesNote}</p>
          <div className="divide-y divide-ice-200 border-y border-ice-200">
            {heli.routes.map((r, i) => (
              <div key={r.name} className="py-6">
                <p className="text-sm text-ice-600">Маршрут {i + 1} · {r.time}</p>
                <h3 className="!text-lg">{r.name}</h3>
                <p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-ink/80">{r.text}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-4">
                  {["R-44", "Bell 206 B", "Bell 206 Long", "SA-316"].map((m, k) => (
                    <div key={m} className="min-w-0 rounded-xs bg-ice-100/60 px-3 py-2">
                      <dt className="truncate text-xs text-ice-600">{m}</dt>
                      <dd className="whitespace-nowrap font-semibold text-ice-900">{r.prices[k] ? fmtPrice(r.prices[k]) : "по запросу"}</dd>
                      {(r as { weights?: (number | null)[] }).weights?.[k] && (
                        <dd className="mt-0.5 text-xs leading-snug text-ice-600">
                          до {(r as { weights: (number | null)[] }).weights[k]} кг
                          {(r as { weightsRefuel?: (number | null)[] }).weightsRefuel?.[k] ? <><br />{(r as { weightsRefuel: (number | null)[] }).weightsRefuel[k]} кг с дозаправкой</> : ""}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          {heli.images && heli.images.length > 1 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heli.images.slice(1, 4).map((src, k) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xs">
                  <TourImage src={src} alt={`Вертолётная экскурсия над Байкалом, кадр ${k + 1}`} sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          )}
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div><h2 className="mb-4 !text-2xl">В стоимость входит</h2><ul className="space-y-2 text-[15px]">{heli.included.map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ice-600" aria-hidden="true" />{x}</li>)}</ul></div>
            <div><h2 className="mb-4 !text-2xl">Оплачивается отдельно</h2><ul className="space-y-2 text-[15px] text-ink/75">{heli.excluded.map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ice-200" aria-hidden="true" />{x}</li>)}</ul></div>
          </div>
        </section>
      )}
      {heli && (
        <section className="wrap pt-14 md:pt-20" id="zayavka">
          <div className="rounded-3xl bg-ice-900 p-6 text-ice-100 md:p-10">
            <h2 className="!text-white">Рассчитать полёт</h2>
            <p className="mt-3 max-w-2xl text-ice-100/85">Скажите маршрут, дату и сколько человек полетит — подберём борт под вес группы, проверим свободные окна у авиакомпании и назовём точную стоимость.</p>
            <div className="mt-6 max-w-3xl"><LeadForm source="helicopter" dark /></div>
          </div>
        </section>
      )}
      <Faq items={c.faq} />
    </Shell>
  );
}
