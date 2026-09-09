import Link from "next/link";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import { regions } from "@/lib/content";
import { meta } from "@/lib/seo";
export const metadata = meta({ title: "Другие направления — Камчатка, Алтай, Владивосток, Краснодарский край | BTCTOUR", description: "Кроме Байкала организуем туры на Камчатку, Алтай, во Владивосток и Краснодарский край: многодневные программы, подбор под даты и бюджет.", path: "/napravleniya/" });
export default function Page() {
  return (
    <Shell>
      <Breadcrumbs items={[{ name: "Другие направления", href: "/napravleniya/" }]} />
      <section className="wrap pt-6 md:pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/icons/icon-nature.webp" alt="" aria-hidden="true" className="mb-3 h-14 w-14 opacity-90" />
        <h1>Другие направления</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">Наш главный продукт — Байкал. Но раз уж наши земляки чаще всего летят на Камчатку, Алтай, во Владивосток и к морю, мы организуем и эти поездки.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {regions.map((r) => (
            <article key={r.slug} className="border-t border-ice-200 pt-5">
              <h2 className="!text-2xl"><Link href={`/${r.slug}/`} className="no-underline hover:underline">{r.name}</Link></h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{r.intro}</p>
              <p className="mt-3"><Link href={`/${r.slug}/`} className="text-sm font-semibold">Программы и цены</Link></p>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
