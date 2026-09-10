import Link from "next/link";
import { type Tour, tourUrl, fmtPrice, daysWord, nightsWord, nextDeparture, fmtRange, seatsLabel, TAG_LABELS } from "@/lib/content";
import TourImage from "./TourImage";
import DevFrame from "./DevFrame";

/** Тур как строка, а не одинаковая карточка: крупная обложка слева, суть в середине, цена и ближайший заезд справа. */
export default function TourRow({ t, index = 0 }: { t: Tour; index?: number }) {
  const next = nextDeparture(t);
  const href = tourUrl(t);
  const tags = t.tags.filter((x) => ["ice", "newyear", "family", "couples", "active", "spa", "gastro", "short", "premium"].includes(x)).slice(0, 3);
  return (
    <article className="group grid gap-5 border-t border-ice-200 py-6 md:grid-cols-[320px_1fr_auto] md:gap-8 md:py-8">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-xs md:aspect-[16/11]" aria-hidden="true" tabIndex={-1}>
        <TourImage src={t.image} alt="" seed={index + 1} className="transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 320px" />
        {t.hit && <span className="absolute left-3 top-3 rounded-xs bg-dawn-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ice-900 shadow-sm">Хит</span>}
      </Link>
      <div className="min-w-0">
        <p className="mb-1 text-sm text-ice-600">
          {t.type === "helicopter" ? "Вертолётные экскурсии" : t.type === "cruise" ? "Круиз" : t.type === "excursion" ? "Экскурсия на 1 день" : `${daysWord(t.days)} / ${nightsWord(t.nights)}`}
          {t.groupSize ? ` · ${t.groupSize}` : ""}
        </p>
        <h3 className="mb-2"><Link href={href} className="no-underline hover:underline">{t.title}</Link></h3>
        <p className="mb-3 max-w-2xl text-[15px] leading-relaxed text-ink/80">{t.tagline}. {t.summary.split(". ").slice(0, 1).join(". ")}.</p>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-xs text-ice-800">
            {tags.map((x) => <li key={x} className="rounded-xs bg-ice-100 px-2 py-1">{TAG_LABELS[x]}</li>)}
          </ul>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 md:flex-col md:items-end md:text-right">
        <div>
          <DevFrame inline note={t.priceTodo ? "цена" : undefined}>
            <p className="font-display text-2xl font-semibold text-ice-800">{t.priceFrom ? "от " : ""}{fmtPrice(t.priceFrom)}</p>
          </DevFrame>
          <p className="text-xs text-ice-600">{t.priceFrom ? (t.priceUnit === "чел" ? "за человека" : t.priceUnit === "группа" ? "за группу" : `за ${t.priceUnit}`) : "уточняйте"}</p>
        </div>
        {next ? (
          <p className="text-sm text-ink/80"><span className="text-ice-600">Ближайший заезд</span><br />{fmtRange(next)}<br /><span className={seatsLabel(next).tone === "urgent" ? "text-dawn-600 font-semibold" : "text-ice-600"}>{seatsLabel(next).text}</span></p>
        ) : (
          <p className="text-sm text-ice-600">{t.datesNote || "Даты под запрос"}</p>
        )}
        <Link href={href} className="btn-ghost hidden md:inline-flex">Программа и даты</Link>
      </div>
    </article>
  );
}
