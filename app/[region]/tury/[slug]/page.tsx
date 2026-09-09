import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import TourGallery from "@/components/TourGallery";
import TourList from "@/components/TourList";
import LeadForm from "@/components/LeadForm";
import Faq from "@/components/Faq";
import DevFrame from "@/components/DevFrame";
import JsonLd from "@/components/JsonLd";
import IceLine from "@/components/IceLine";
import { tours, regions, getTour, getRegion, getRegionTour, tourUrl, fmtPrice, fmtRange, daysWord, nightsWord, nextDeparture, activeTours, seasonSort, SITE, type Tour, type RegionTour, type Departure } from "@/lib/content";
import { meta, tourJsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  const b = tours.map((t) => ({ region: t.region, slug: t.slug }));
  const r = regions.flatMap((rg) => rg.tours.map((t) => ({ region: rg.slug, slug: t.slug })));
  return [...b, ...r];
}

function normalize(region: string, slug: string): { t: Tour; draft: boolean; regionName: string } | null {
  if (region === "baikal") {
    const t = getTour(slug);
    return t ? { t, draft: false, regionName: "Туры на Байкал" } : null;
  }
  const rg = getRegion(region);
  const rt = getRegionTour(region, slug) as RegionTour | undefined;
  if (!rg || !rt) return null;
  const t: Tour = {
    slug: rt.slug, region, type: "tour", oldUrl: rt.oldUrl, title: rt.title, tagline: rt.tagline || rg.name, season: ["summer"], tags: [], locations: [],
    days: rt.days || 0, nights: rt.nights || 0, priceFrom: rt.priceFrom ?? null, priceUnit: rt.priceUnit || "чел", priceNote: "", difficulty: rt.difficulty || "", groupSize: rt.groupSize || "",
    departures: [], summary: rt.summary || `Программа тура «${rt.title}» по направлению ${rg.name}. Полное описание и даты — по запросу.`, forWhom: "", highlights: [], program: rt.program || [],
    included: rt.included || [], excluded: rt.excluded || [], status: rt.status, datesNote: rt.season, todo: rt.todo,
  } as unknown as Tour;
  return { t, draft: rt.status === "draft", regionName: rg.name };
}

export async function generateMetadata({ params }: { params: Promise<{ region: string; slug: string }> }) {
  const p = await params;
  const n = normalize(p.region, p.slug);
  if (!n) return {};
  const { t, draft } = n;
  const price = t.priceFrom ? `от ${fmtPrice(t.priceFrom)}` : "цена по запросу";
  const dur = t.type === "excursion" ? "экскурсия на 1 день" : t.type === "helicopter" ? "8 маршрутов" : `${t.days} ${t.days === 1 ? "день" : t.days < 5 ? "дня" : "дней"}`;
  const region = p.region === "baikal" ? "Байкал" : n.regionName;
  return meta({
    title: `${t.title} — тур ${region} ${dur}, ${price} | BTCTOUR`,
    description: t.summary.slice(0, 155).replace(/\s+\S*$/, "") + (t.priceFrom ? `. ${price}, даты и программа по дням.` : "."),
    path: tourUrl(t),
    noindex: draft,
    alternates: p.region === "baikal" ? { ru: SITE.domain + tourUrl(t), en: SITE.domain + "/en" + tourUrl(t) } : undefined,
  });
}

export default async function TourPage({ params }: { params: Promise<{ region: string; slug: string }> }) {
  const p = await params;
  const n = normalize(p.region, p.slug);
  if (!n) notFound();
  const { t, draft, regionName } = n;
  const url = SITE.domain + tourUrl(t);
  const next = nextDeparture(t);
  const upcoming = (t.departures as Departure[]).filter((d) => d.from >= new Date().toISOString().slice(0, 10));
  const related = p.region === "baikal" ? activeTours().filter((x) => x.slug !== t.slug && x.type === t.type && x.season.some((s) => t.season.includes(s))).sort(seasonSort).slice(0, 3) : [];
  const facts = [
    t.type === "excursion" ? ["Длительность", "1 день"] : t.type === "helicopter" ? ["Длительность", "1–3 часа"] : t.days ? ["Длительность", `${daysWord(t.days)} / ${nightsWord(t.nights)}`] : null,
    t.groupSize ? ["Группа", t.groupSize] : null,
    t.difficulty ? ["Сложность", t.difficulty] : null,
    t.accommodation ? ["Проживание", t.accommodation] : null,
    t.meals ? ["Питание", t.meals] : null,
    t.datesNote && !upcoming.length ? ["Даты", t.datesNote] : null,
  ].filter(Boolean) as string[][];
  const crumbs = p.region === "baikal"
    ? [{ name: "Туры на Байкал", href: "/baikal/" }, { name: t.type === "excursion" ? "Экскурсии" : t.season.includes("winter") ? "Зимние туры" : "Летние туры", href: t.type === "excursion" ? "/baikal/ekskursii/" : t.season.includes("winter") ? "/baikal/zimnie/" : "/baikal/letnie/" }, { name: t.title, href: tourUrl(t) }]
    : [{ name: "Другие направления", href: "/napravleniya/" }, { name: regionName, href: `/${p.region}/` }, { name: t.title, href: tourUrl(t) }];

  return (
    <Shell altHref={p.region === "baikal" ? "/en" + tourUrl(t) : undefined}>
      {!draft && <JsonLd data={tourJsonLd(t, url)} />}
      <Breadcrumbs items={crumbs} />
      <article>
        <header className="wrap pt-6 md:pt-10">
          <p className="mb-2 text-sm text-ice-600">{facts[0]?.[1]}{t.groupSize ? ` · ${t.groupSize}` : ""}</p>
          <h1>{t.title}</h1>
          <p className="mt-3 max-w-2xl text-xl leading-snug text-ice-800">{t.tagline}</p>
        </header>

        <div className="wrap mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            <DevFrame note={t.todo}>
              <TourGallery images={t.images && t.images.length ? t.images : [t.image ?? ""]} alt={t.title} seedBase={t.title.length} />
            </DevFrame>
            <p className="prose-site mt-8 text-[18px]">{t.summary}</p>
            {t.forWhom && <p className="prose-site text-ink/80"><span className="font-semibold text-ice-800">Кому подойдёт: </span>{t.forWhom}</p>}
            {t.highlights.length > 0 && (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {t.highlights.map((h) => <li key={h} className="flex gap-3 rounded-xs bg-ice-100/70 px-4 py-3 text-[15px] text-ice-900"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dawn-400" aria-hidden="true" />{h}</li>)}
              </ul>
            )}

            {upcoming.length > 0 && (
              <section className="mt-12" id="daty">
                <h2 className="mb-4">Даты заездов</h2>
                <ul className="divide-y divide-ice-200 border-y border-ice-200">
                  {upcoming.map((d) => (
                    <li key={d.from} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <span className="font-semibold text-ice-900">{fmtRange(d)}</span>
                      <span className={`text-sm ${d.seats === 0 ? "text-ink/50" : d.seats <= 3 ? "text-dawn-500 font-semibold" : "text-ice-600"}`}>{d.seats === 0 ? "мест нет" : `свободно ${d.seats} из ${d.total}`}</span>
                      <a href="#bron" className="text-sm font-semibold">Забронировать</a>
                    </li>
                  ))}
                </ul>
                {t.datesNote && <p className="mt-3 text-sm text-ice-600">{t.datesNote}</p>}
              </section>
            )}

            {t.program.length > 0 && (
              <section className="mt-12" id="programma">
                <h2 className="mb-6">{t.type === "excursion" ? "Маршрут экскурсии" : "Программа по дням"}</h2>
                <ol className="relative border-l border-ice-200 pl-6">
                  {t.program.map((d) => (
                    <li key={d.day} className="relative mb-8 last:mb-0">
                      <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ice-800 text-[11px] font-semibold text-white" aria-hidden="true">{d.day}</span>
                      <h3 className="!text-lg">{d.title}</h3>
                      <p className="mt-1 max-w-prose text-[16px] leading-relaxed text-ink/85">{d.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {t.routes && (
              <section className="mt-12" id="marshruty">
                <h2 className="mb-2">Маршруты и цены</h2>
                <p className="mb-6 text-sm text-ice-600">{t.routesNote}</p>
                <div className="divide-y divide-ice-200 border-y border-ice-200">
                  {t.routes.map((r, i) => (
                    <div key={r.name} className="grid gap-2 py-5 md:grid-cols-[1fr_260px] md:gap-8">
                      <div><p className="text-sm text-ice-600">Маршрут {i + 1} · {r.time}</p><h3 className="!text-lg">{r.name}</h3><p className="mt-1 text-[15px] leading-relaxed text-ink/80">{r.text}</p></div>
                      <dl className="grid grid-cols-3 gap-2 text-sm md:text-right">{["R-44", "Bell 206 B", "Bell 206 L"].map((m, k) => <div key={m}><dt className="text-ice-600">{m}</dt><dd className="font-semibold text-ice-900">{fmtPrice(r.prices[k])}</dd></div>)}</dl>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(t.included.length > 0 || t.excluded.length > 0) && (
              <section className="mt-12 grid gap-8 md:grid-cols-2">
                <div><h2 className="mb-4 !text-2xl">В стоимость входит</h2><ul className="space-y-2 text-[15px]">{t.included.map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ice-600" aria-hidden="true" />{x}</li>)}</ul></div>
                <div><h2 className="mb-4 !text-2xl">Оплачивается отдельно</h2><ul className="space-y-2 text-[15px] text-ink/75">{t.excluded.map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ice-200" aria-hidden="true" />{x}</li>)}</ul></div>
              </section>
            )}

            {facts.length > 1 && (
              <section className="mt-12">
                <dl className="grid gap-y-3 border-y border-ice-200 py-5 sm:grid-cols-[160px_1fr] sm:gap-x-6 text-[15px]">
                  {facts.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-ice-800">{k}</dt><dd className="mb-2 text-ink/85 sm:mb-0">{v}</dd></div>)}
                </dl>
              </section>
            )}

            <section className="mt-12 rounded-xs border border-ice-200 bg-white p-5 md:p-8" id="bron">
              <h2 className="mb-2">Забронировать{t.type === "excursion" ? " экскурсию" : t.type === "helicopter" ? " полёт" : " тур"}</h2>
              <p className="mb-5 max-w-prose text-ink/80">Оставьте контакт — перезвоним, уточним детали и пришлём договор. Предоплата фиксирует место, остаток можно разбить Яндекс Сплитом.</p>
              <LeadForm source={`tour: ${t.title}`} tour={t.slug} dates={upcoming.map(fmtRange)} />
            </section>
            {t.faq && <Faq items={t.faq} title="Вопросы по туру" />}
          </div>

          {/* Липкая панель цены */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xs border border-ice-200 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(10,39,51,.5)]">
              <DevFrame note={t.priceTodo ? "цена от заказчика" : undefined}>
                <p className="font-display text-3xl font-semibold text-ice-800">{t.priceFrom ? "от " : ""}{fmtPrice(t.priceFrom)}</p>
              </DevFrame>
              <p className="text-sm text-ice-600">{t.priceFrom ? (t.priceUnit === "чел" ? "за человека" : t.priceUnit === "группа" ? "за группу" : `за ${t.priceUnit}`) : "подскажем по телефону"}{t.priceNote ? `, ${t.priceNote}` : ""}</p>
              {next ? (
                <p className="mt-4 rounded-xs bg-ice-100 px-3 py-2 text-sm"><span className="text-ice-600">Ближайший заезд</span><br /><span className="font-semibold text-ice-900">{fmtRange(next)}</span><br /><span className="font-semibold text-dawn-500">{next.seats} мест из {next.total}</span></p>
              ) : t.datesNote ? <p className="mt-4 text-sm text-ice-600">{t.datesNote}</p> : null}
              <div className="mt-5 grid gap-2">
                <a href="#bron" className="btn-dawn">Забронировать</a>
                <a href={SITE.telegram} target="_blank" rel="noopener" className="btn-ghost">Спросить в Telegram</a>
                <a href={`tel:${SITE.phoneRaw}`} className="text-center text-sm font-semibold text-ice-800 no-underline">{SITE.phone}</a>
              </div>
              <IceLine className="mt-5" width={200} />
              <p className="mt-2 text-xs text-ice-600">Яндекс Пэй и Яндекс Сплит · Туроператор, РТО {SITE.rto}</p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="wrap mt-16">
            <h2 className="mb-2">Похожие туры</h2>
            <TourList tours={related} offset={50} />
            <p className="mt-6"><Link href={t.season.includes("winter") ? "/baikal/zimnie/" : "/baikal/letnie/"} className="btn-ghost">Все туры сезона</Link></p>
          </section>
        )}
      </article>
    </Shell>
  );
}
