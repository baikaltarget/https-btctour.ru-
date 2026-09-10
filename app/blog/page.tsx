import Link from "next/link";
import TextPage from "@/components/TextPage";
import { getPosts, fmtDate, readingTime } from "@/lib/content";
import { meta } from "@/lib/seo";
export const metadata = meta({ title: "Блог о Байкале — когда ехать, что смотреть, как готовиться | BTCTOUR", description: "Статьи туроператора из Иркутска: сезоны на Байкале, Ольхон, Иркутск и Листвянка за день, лёд по неделям, что надеть.", path: "/blog/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Блог", href: "/blog/" }]} h1="Блог о Байкале" lead="Пишем то, что рассказываем группам в дороге.">
      <div className="grid gap-8 sm:grid-cols-2">
        {getPosts().map((p) => (
          <article key={p.slug}>
            <Link href={`/blog/${p.slug}/`} className="block no-underline">
              {p.image && (
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt || p.title} className="h-full w-full object-cover" />
                </div>
              )}
              <p className="text-sm text-ice-600">{fmtDate(p.date, true)} · {readingTime(p.content)} мин чтения</p>
              <h2 className="!text-2xl hover:underline">{p.title}</h2>
              <p className="mt-2 max-w-2xl text-ink/80">{p.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </TextPage>
  );
}
