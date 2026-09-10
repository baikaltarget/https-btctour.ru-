import Link from "next/link";
import { upcomingDepartures, tourUrl, fmtRange, fmtPrice, seatsLabel, seatsClass, type Tour } from "@/lib/content";

/** Небольшая иконка-маркер под тип тура: лёд / хивус-лодка / общий снежинка по умолчанию. */
function RowIcon({ tour }: { tour: Tour }) {
  const common = "h-4 w-4 shrink-0 text-ice-500";
  if (tour.tags.includes("ice")) return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M8 3l4 3 4-3M8 21l4-3 4 3M3 8l3 4-3 4M21 8l-3 4 3 4" strokeLinecap="round" />
    </svg>
  );
  if (tour.type === "cruise" || tour.tags.includes("buryatia")) return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 17h18M4 17l1-6h14l1 6M8 11V6h5l3 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3v18M5 8l14 8M19 8L5 16" strokeLinecap="round" />
    </svg>
  );
}

/** Панель ближайших заездов — правая часть первого экрана. Данные из departures в site.json. */
export default function DepartureStrip({ limit = 4 }: { limit?: number }) {
  const list = upcomingDepartures(limit);
  if (!list.length) return null;
  return (
    <aside className="rounded-3xl bg-white/95 p-5 shadow-[0_20px_60px_-20px_rgba(10,39,51,.45)] backdrop-blur md:p-6" aria-label="Ближайшие заезды">
      <p className="mb-3 font-semibold text-ice-800">Ближайшие заезды</p>
      <ul className="divide-y divide-ice-100">
        {list.map((d, i) => (
          <li key={i} className="py-2.5">
            <Link href={tourUrl(d.tour)} className="group flex items-start justify-between gap-3 no-underline">
              <span className="flex min-w-0 items-start gap-2">
                <RowIcon tour={d.tour} />
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-dawn-500 group-hover:text-dawn-600 group-hover:underline">{d.tour.title}</span>
                  <span className="block text-sm text-ice-600">{fmtRange(d)} · <span className={seatsClass(d)}>{seatsLabel(d).text}</span></span>
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold text-ice-800">от {fmtPrice(d.tour.priceFrom).replace(" ₽", "")} ₽</span>
                <span className="block text-xs text-ice-500">за человека</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/baikal/zimnie/" className="mt-3 inline-block text-sm font-semibold">Все зимние заезды →</Link>
    </aside>
  );
}
