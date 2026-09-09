import Link from "next/link";
import { upcomingDepartures, tourUrl, fmtRange, fmtPrice } from "@/lib/content";
/** Панель ближайших заездов — правая часть первого экрана. Данные из departures в site.json. */
export default function DepartureStrip({ limit = 4 }: { limit?: number }) {
  const list = upcomingDepartures(limit);
  if (!list.length) return null;
  return (
    <aside className="rounded-xs bg-white/95 p-5 shadow-[0_20px_60px_-20px_rgba(10,39,51,.45)] backdrop-blur md:p-6" aria-label="Ближайшие заезды">
      <p className="mb-3 font-semibold text-ice-800">Ближайшие заезды</p>
      <ul className="divide-y divide-ice-100">
        {list.map((d, i) => (
          <li key={i} className="py-2.5">
            <Link href={tourUrl(d.tour)} className="flex items-baseline justify-between gap-3 no-underline">
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold text-ice-900">{d.tour.title}</span>
                <span className="block text-sm text-ice-600">{fmtRange(d)} · {d.seats} мест</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-ice-800">от {fmtPrice(d.tour.priceFrom).replace(" ₽", "")} ₽</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/baikal/zimnie/" className="mt-3 inline-block text-sm font-semibold">Все зимние заезды</Link>
    </aside>
  );
}
