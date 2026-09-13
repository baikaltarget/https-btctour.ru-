/**
 * Метки источника. Запоминаются при первом заходе на сайт и живут до закрытия вкладки,
 * чтобы дойти до формы даже если человек полистал несколько страниц.
 */
const KEY = "btctour-utm";
const FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid"];

export type Utm = Record<string, string>;

export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Utm = {};
    for (const f of FIELDS) {
      const v = q.get(f);
      if (v) found[f] = v.slice(0, 200);
    }
    const saved = getUtm();
    // первый источник не перетираем: важно, откуда человек пришёл изначально
    if (Object.keys(found).length && !Object.keys(saved).length) {
      found.landing = window.location.pathname;
      if (document.referrer) found.referrer = document.referrer.slice(0, 200);
      sessionStorage.setItem(KEY, JSON.stringify(found));
    } else if (!Object.keys(saved).length && document.referrer && !document.referrer.includes(window.location.host)) {
      sessionStorage.setItem(KEY, JSON.stringify({ referrer: document.referrer.slice(0, 200), landing: window.location.pathname }));
    }
  } catch {
    // приватный режим — просто живём без меток
  }
}

export function getUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
