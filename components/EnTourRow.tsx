import Link from "next/link";
import TourImage from "./TourImage";
import { nextDeparture, type Tour } from "@/lib/content";
import { EN, fmtRub, fmtRangeEn, priceUnitEn, type EnTour } from "@/lib/en";
export default function EnTourRow({ t, e, index = 0 }: { t: Tour; e: EnTour; index?: number }) {
  const next = nextDeparture(t); const href = `/en/baikal/tury/${t.slug}/`;
  return (
    <article className="grid gap-5 border-t border-ice-200 py-6 md:grid-cols-[320px_1fr_auto] md:gap-8">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-xs md:aspect-[16/11]" tabIndex={-1} aria-hidden="true"><TourImage src={t.image} alt="" seed={index + 1} sizes="320px" /></Link>
      <div><p className="mb-1 text-sm text-ice-600">{t.type === "helicopter" ? "Helicopter" : t.type === "cruise" ? "Cruise" : `${t.days} ${EN.labels.days} / ${t.nights} ${EN.labels.nights}`}</p><h3 className="mb-2"><Link href={href} className="no-underline hover:underline">{e.title}</Link></h3><p className="max-w-2xl text-[15px] text-ink/80">{e.tagline}</p></div>
      <div className="md:text-right"><p className="font-display text-2xl font-semibold text-ice-800">{t.priceFrom ? EN.labels.from + " " : ""}{fmtRub(t.priceFrom)}</p><p className="text-xs text-ice-600">{priceUnitEn(t)}</p>{next && <p className="mt-2 text-sm"><span className="text-ice-600">{EN.labels.next}</span><br />{fmtRangeEn(next)} · <span className="font-semibold text-dawn-500">{next.seats} {EN.labels.seats}</span></p>}</div>
    </article>
  );
}
