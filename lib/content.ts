import site from "@/content/site.json";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Departure = { from: string; to: string; seats: number; total: number };
export type ProgramDay = { day: number; title: string; text: string };
export type Faq = { q: string; a: string };
export type Tour = (typeof site.tours)[number] & {
  faq?: Faq[];
  routes?: { name: string; time: string; prices: number[]; text: string }[];
  routesNote?: string;
  datesNote?: string;
  priceTodo?: boolean;
  todo?: string;
  featured?: boolean;
  hit?: boolean;
  image?: string;
  images?: string[];
  accommodation?: string;
  meals?: string;
};
export type Category = (typeof site.categories)[number] & {
  howToGet?: { title: string; rows: string[][]; todo?: string };
  builder?: boolean;
  examples?: { title: string; text: string }[];
  seasonNote?: string;
  todo?: string;
  filter: { season?: string; tags?: string[]; locations?: string[]; type?: string; all?: boolean; excludeTypes?: string[] };
};
export type Region = (typeof site.regions)[number];
export type RegionTour = Region["tours"][number] & {
  tagline?: string; days?: number; nights?: number; priceFrom?: number; priceUnit?: string; season?: string;
  difficulty?: string; groupSize?: string; summary?: string; program?: ProgramDay[]; included?: string[]; excluded?: string[]; todo?: string;
};

export const SITE = site.site;
export const DEV = site.dev;
export const SEASON = site.season as "winter" | "summer";
export const HERO = site.hero[SEASON];
export const NAV = site.nav;
export const FOOTER_LINKS = site.footerLinks;
export const TRUST = site.trust;
export const REVIEWS = site.reviews;
export const FAQ_GENERAL = site.faqGeneral;
export const LOCATIONS = site.locations as Record<string, string>;
export const TAG_LABELS = site.tagLabels as Record<string, string>;
export const PAGES = site.pages;
export const REDIRECTS_EXTRA = site.redirectsExtra;

export const tours = site.tours as Tour[];
export const categories = site.categories as Category[];
export const regions = site.regions as Region[];

export const activeTours = () => tours.filter((t) => t.status === "active");
export const getTour = (slug: string) => tours.find((t) => t.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getRegion = (slug: string) => regions.find((r) => r.slug === slug);
export const getRegionTour = (region: string, slug: string) =>
  (getRegion(region)?.tours as RegionTour[] | undefined)?.find((t) => t.slug === slug);

export function tourUrl(t: Pick<Tour, "slug" | "region">) {
  return `/${t.region}/tury/${t.slug}/`;
}

export function toursForCategory(c: Category): Tour[] {
  const f = c.filter;
  let list = activeTours();
  if (f.season) list = list.filter((t) => t.season.includes(f.season!));
  if (f.tags) list = list.filter((t) => f.tags!.some((tag) => t.tags.includes(tag)));
  if (f.locations) list = list.filter((t) => f.locations!.some((l) => t.locations.includes(l)));
  if (f.type) list = list.filter((t) => t.type === f.type);
  if (f.excludeTypes) list = list.filter((t) => !f.excludeTypes!.includes(t.type));
  // Сезонный приоритет: в текущем сезоне туры этого сезона идут первыми
  return list.sort(seasonSort);
}

export function seasonSort(a: Tour, b: Tour) {
  const ha = a.hit ? 0 : 1;
  const hb = b.hit ? 0 : 1;
  if (ha !== hb) return ha - hb;
  const sa = a.season.includes(SEASON) ? 0 : 1;
  const sb = b.season.includes(SEASON) ? 0 : 1;
  if (sa !== sb) return sa - sb;
  const fa = a.featured ? 0 : 1;
  const fb = b.featured ? 0 : 1;
  if (fa !== fb) return fa - fb;
  return a.days - b.days;
}

export function featuredTours(limit = 6) {
  return activeTours()
    .filter((t) => t.type !== "excursion")
    .sort(seasonSort)
    .slice(0, limit);
}

/** Ближайшие заезды по всем турам, начиная с сегодняшнего дня */
export function upcomingDepartures(limit = 5, from: Date = new Date()) {
  const today = from.toISOString().slice(0, 10);
  // По одному (ближайшему) заезду на тур, чтобы панель не забивалась одним туром
  const all: (Departure & { tour: Tour })[] = [];
  for (const t of activeTours()) {
    const d = (t.departures as Departure[]).filter((x) => x.from >= today).sort((a, b) => a.from.localeCompare(b.from))[0];
    if (d) all.push({ ...d, tour: t });
  }
  return all.sort((a, b) => a.from.localeCompare(b.from)).slice(0, limit);
}

export function nextDeparture(t: Tour, from: Date = new Date()) {
  const today = from.toISOString().slice(0, 10);
  return (t.departures as Departure[]).filter((d) => d.from >= today).sort((a, b) => a.from.localeCompare(b.from))[0];
}

/**
 * Как показывать наличие мест.
 * Считаем места в ОДНОЙ группе (до 8 человек). Если группа набирается — открываем параллельную,
 * поэтому «свободно 8 из 8» писать нельзя: выглядит так, будто заезд пустой.
 * Правило: числа показываем только когда мест реально мало — это работает на решение.
 * seats в site.json правит заказчик: 8 = группа ещё открыта, 2 = осталось два места, 0 = группа закрыта.
 */
export function seatsLabel(d: Departure): { text: string; tone: "urgent" | "muted" | "calm" } {
  if (d.seats === 0) return { text: "Группа набрана", tone: "muted" };
  if (d.seats <= 3) return { text: `Осталось ${d.seats} ${d.seats === 1 ? "место" : "места"}`, tone: "urgent" };
  if (d.seats <= 5) return { text: "Мест немного", tone: "urgent" };
  return { text: "Идёт набор", tone: "calm" };
}

/** Единый цвет статуса мест: и «мало мест», и «идёт набор» — золотым (это призыв к действию), закрытая группа — приглушённо серым. */
export function seatsClass(d: Departure): string {
  const tone = seatsLabel(d).tone;
  if (tone === "muted") return "text-ink/50";
  if (tone === "urgent") return "text-dawn-600 font-semibold";
  return "text-dawn-500 font-medium";
}

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
export function fmtDate(iso: string, withYear = false) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}${withYear ? " " + y : ""}`;
}
export function fmtRange(d: Departure) {
  const [y1, m1, d1] = d.from.split("-").map(Number);
  const [y2, m2, d2] = d.to.split("-").map(Number);
  if (m1 === m2 && y1 === y2) return `${d1}–${d2} ${MONTHS[m1 - 1]} ${y1}`;
  return `${d1} ${MONTHS[m1 - 1]} – ${d2} ${MONTHS[m2 - 1]} ${y2}`;
}
export function fmtPrice(n: number | null | undefined) {
  if (!n) return "по запросу";
  return n.toLocaleString("ru-RU").replace(/\u00a0/g, " ") + " ₽";
}
export function daysWord(n: number) {
  const a = n % 10, b = n % 100;
  if (b >= 11 && b <= 14) return `${n} дней`;
  if (a === 1) return `${n} день`;
  if (a >= 2 && a <= 4) return `${n} дня`;
  return `${n} дней`;
}
export function nightsWord(n: number) {
  const a = n % 10, b = n % 100;
  if (b >= 11 && b <= 14) return `${n} ночей`;
  if (a === 1) return `${n} ночь`;
  if (a >= 2 && a <= 4) return `${n} ночи`;
  return `${n} ночей`;
}

/* ---------- Блог ---------- */
export type Post = { slug: string; title: string; description: string; date: string; content: string; cover?: string; image?: string; imageAlt?: string; faq?: Faq[] };
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export function getPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
      const { data, content } = matter(raw);
      return { slug: f.replace(/\.md$/, ""), title: data.title, description: data.description, date: data.date, cover: data.cover, image: data.image, imageAlt: data.imageAlt, faq: data.faq, content };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

/** Транслитерация для якорей оглавления: «Храмы и монастыри» → «hramy-i-monastyri» */
const TRANS: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" };
export function slugifyRu(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => TRANS[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Оглавление из заголовков второго уровня (## ...) в исходном markdown */
export function extractToc(markdown: string): { text: string; id: string }[] {
  const lines = markdown.split("\n").filter((l) => l.startsWith("## "));
  return lines.map((l) => { const text = l.replace(/^##\s+/, "").trim(); return { text, id: slugifyRu(text) }; });
}

/** Время чтения: ~190 слов/мин для русского текста, минимум 1 минута */
export function readingTime(markdown: string): number {
  const words = markdown.replace(/[#*`_>[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
}
