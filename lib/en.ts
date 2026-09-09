import en from "@/content/site.en.json";
import { activeTours, type Tour } from "./content";
export const EN = en;
export type EnTour = { title: string; tagline: string; summary: string; highlights: string[]; program: string[][]; included: string[]; excluded: string[] };
export const enTours = () => activeTours().filter((t) => (en.tours as Record<string, EnTour>)[t.slug]).map((t) => ({ t, e: (en.tours as Record<string, EnTour>)[t.slug] }));
export const enTour = (slug: string) => { const t = activeTours().find((x) => x.slug === slug); const e = (en.tours as Record<string, EnTour>)[slug]; return t && e ? { t, e } : null; };
export const fmtRub = (n: number | null) => (n ? n.toLocaleString("en-US") + " RUB" : "on request");
const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtRangeEn = (d: { from: string; to: string }) => { const [y1, m1, d1] = d.from.split("-").map(Number); const [, m2, d2] = d.to.split("-").map(Number); return `${d1}${m1 === m2 ? "" : " " + M[m1 - 1]}–${d2} ${M[m2 - 1]} ${y1}`; };
export const priceUnitEn = (t: Tour) => (t.priceUnit === "чел" ? en.labels.perPerson : t.priceUnit === "группа" ? en.labels.perGroup : en.labels.perDay);

/** Статус мест на английской версии — та же логика, что и в русской: числа только когда мест мало. */
export const seatsLabelEn = (d: { seats: number }) =>
  d.seats === 0
    ? { text: en.labels.seatsFull, urgent: false }
    : d.seats <= 3
      ? { text: `${en.labels.seatsFew}: ${d.seats}`, urgent: true }
      : d.seats <= 5
        ? { text: en.labels.seatsFew, urgent: true }
        : { text: en.labels.seatsOpen, urgent: false };
