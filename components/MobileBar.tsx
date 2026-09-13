import site from "@/content/site.json";
import { TgIcon, MaxIcon } from "./Header";
/** Нижняя панель на мобильных: три действия, которые приносят заявки. */
export default function MobileBar() {
  const s = site.site;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 whitespace-nowrap border-t border-ice-200 bg-white/95 text-center text-[11px] font-semibold text-ice-900 backdrop-blur sm:text-xs md:hidden" role="navigation" aria-label="Быстрые действия">
      <a href={`tel:${s.phoneRaw}`} className="py-3 no-underline">Позвонить</a>
      <a href={s.telegram} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1 border-x border-ice-100 py-3 no-underline"><TgIcon className="h-3.5 w-3.5" />Telegram</a>
      <a href={s.max} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1 bg-dawn-400 py-3 text-ice-900 no-underline"><MaxIcon className="h-3.5 w-3.5" />Написать в Max</a>
    </div>
  );
}
