import { REVIEWS } from "@/lib/content";
import JsonLd from "./JsonLd";
import { reviewsJsonLd } from "@/lib/seo";
export default function Reviews({ limit = 3 }: { limit?: number }) {
  const list = REVIEWS.slice(0, limit);
  return (
    <section className="bg-ice-100/60 py-14 md:py-20">
      <div className="wrap">
        <JsonLd data={reviewsJsonLd(list)} />
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2>Что говорят после поездки</h2>
          <p className="hidden text-sm text-ice-600 md:block">Отзывы с Яндекс Карт и из писем клиентов</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {list.map((r) => (
            <figure key={r.name} className="flex flex-col">
              <blockquote className="font-display text-lg leading-relaxed text-ice-900">«{r.text}»</blockquote>
              <figcaption className="mt-4 text-sm text-ice-600">{r.name}, {r.source}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
