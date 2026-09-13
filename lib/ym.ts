import site from "@/content/site.json";

/** Цели Яндекс Метрики. Имя цели = идентификатор, который заводится в интерфейсе Метрики. */
export type Goal =
  | "lead_submit"        // отправлена любая форма заявки
  | "lead_tour"          // заявка со страницы конкретного тура
  | "quiz_start"         // начат подбор тура
  | "quiz_finish"        // квиз пройден до конца
  | "click_phone"        // клик по номеру телефона
  | "click_telegram"     // клик по Telegram
  | "click_max"          // клик по Max
  | "click_email"        // клик по почте
  | "click_booking"      // клик по кнопке «Забронировать» на странице тура
  | "open_gallery";      // открыт лайтбокс с фото тура

declare global {
  interface Window { ym?: (id: number, action: string, goal?: string, params?: Record<string, unknown>) => void }
}

/** Отправить цель. Работает только в браузере и только если счётчик загрузился. */
export function goal(name: Goal, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.ym) return;
  window.ym(Number(site.site.metrikaId), "reachGoal", name, params);
}
