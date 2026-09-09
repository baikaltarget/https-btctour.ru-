import JsonLd from "./JsonLd";
import { faqJsonLd } from "@/lib/seo";
export default function Faq({ items, title = "Частые вопросы", schema = true }: { items: { q: string; a: string }[]; title?: string; schema?: boolean }) {
  if (!items?.length) return null;
  return (
    <section className="wrap py-12 md:py-16">
      {schema && <JsonLd data={faqJsonLd(items)} />}
      <h2 className="mb-6">{title}</h2>
      <div className="max-w-3xl divide-y divide-ice-200 border-y border-ice-200">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold text-ice-800 marker:content-none">
              {f.q}
              <span className="mt-1 shrink-0 text-ice-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 max-w-prose text-[17px] leading-relaxed text-ink/85">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
