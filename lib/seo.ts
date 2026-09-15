import type { Metadata } from "next";
import { SITE } from "./content";

export function meta(opts: { title: string; description: string; path: string; noindex?: boolean; image?: string; type?: "website" | "article"; alternates?: Record<string, string> }): Metadata {
  const url = SITE.domain + opts.path;
  const image = SITE.domain + (opts.image || SITE.defaultOg);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url, languages: opts.alternates },
    robots: opts.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: opts.title, description: opts.description, url, siteName: SITE.brand, locale: "ru_RU", type: opts.type || "website", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "TourOperator", "LocalBusiness"],
  "@id": SITE.domain + "/#org",
  name: SITE.brand,
  legalName: SITE.legalName,
  url: SITE.domain,
  logo: SITE.domain + "/img/logo.svg",
  image: SITE.domain + SITE.defaultOg,
  telephone: SITE.phoneRaw,
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: SITE.addressStreet, addressLocality: SITE.city, postalCode: SITE.postalCode, addressCountry: "RU" },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  areaServed: ["Иркутская область", "Республика Бурятия", "Россия"],
  sameAs: [SITE.telegram, SITE.max, SITE.vk],
  openingHours: "Mo-Su 09:00-21:00",
  priceRange: "₽₽",
  identifier: { "@type": "PropertyValue", propertyID: "РТО", value: SITE.rto },
});

export const breadcrumbJsonLd = (items: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE.domain + it.href })),
});

export const faqJsonLd = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/** Верхняя граница цены для AggregateOffer. */
function highPriceOf(t: { priceFrom: number | null }): number {
  const routes = (t as { routes?: { prices: (number | null)[] }[] }).routes;
  if (routes?.length) {
    const all = routes.flatMap((r) => r.prices.filter((x): x is number => typeof x === "number"));
    if (all.length) return Math.max(...all);
  }
  const to = (t as { priceTo?: number }).priceTo;
  if (to) return to;
  return t.priceFrom ?? 0;
}

export function tourJsonLd(t: { title: string; summary: string; slug: string; region: string; days: number; priceFrom: number | null; priceUnit?: string; departures: { from: string; to: string }[]; program?: { day: number; title: string; text: string }[]; locations?: string[] }, url: string, ratingCount = 6) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["TouristTrip", "Product"],
    name: t.title,
    description: t.summary,
    url,
    image: SITE.domain + SITE.defaultOg,
    // Организация на страницах туров отдельным блоком не выводится, поэтому
    // одной ссылки @id мало — указываем тип и название, иначе Google их игнорирует.
    brand: { "@type": "Organization", "@id": SITE.domain + "/#org", name: SITE.brand },
    provider: { "@type": "TravelAgency", "@id": SITE.domain + "/#org", name: SITE.brand, url: SITE.domain },
    touristType: ["Семьи", "Пары", "Компании друзей"],
    itinerary: t.program && t.program.length ? { "@type": "ItemList", numberOfItems: t.program.length, itemListElement: t.program.map((p) => ({ "@type": "ListItem", position: p.day, name: p.title, description: p.text })) } : undefined,
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: String(ratingCount), bestRating: "5" },
  };
  if (t.priceFrom) {
    base.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: t.priceFrom,
      // highPrice обязателен для AggregateOffer: у вертолётов берём максимум по бортам
      // и маршрутам, у остальных — доплату за одноместное размещение, иначе цену «от».
      highPrice: highPriceOf(t),
      offerCount: Math.max(1, t.departures.length),
      availability: "https://schema.org/InStock",
      url,
      validFrom: t.departures[0]?.from,
    };
  }
  return base;
}

export const reviewsJsonLd = (reviews: { name: string; text: string; source: string }[]) =>
  reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    // Google требует явный тип оцениваемого объекта: одной ссылки @id недостаточно,
    // иначе в Search Console «Недопустимый тип объекта в поле itemReviewed».
    itemReviewed: { "@type": "TravelAgency", "@id": SITE.domain + "/#org", name: SITE.brand, address: { "@type": "PostalAddress", streetAddress: SITE.addressStreet, addressLocality: SITE.city, addressCountry: "RU" } },
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    reviewBody: r.text,
    publisher: { "@type": "Organization", name: r.source },
  }));
