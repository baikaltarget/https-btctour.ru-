import Link from "next/link";
import TextPage from "@/components/TextPage";
import { getPosts, fmtDate } from "@/lib/content";
import { meta } from "@/lib/seo";
export const metadata = meta({ title: "Блог о Байкале — когда ехать, что смотреть, как готовиться | BTCTOUR", description: "Статьи туроператора из Иркутска: сезоны на Байкале, Ольхон, Иркутск за день, лёд по неделям, что надеть.", path: "/blog/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Блог", href: "/blog/" }]} h1="Блог о Байкале" lead="Пишем то, что рассказываем группам в дороге.">
      <div className="divide-y divide-ice-200 border-y border-ice-200">
        {getPosts().map((p) => (
          <article key={p.slug} className="py-6"><p className="text-sm text-ice-600">{fmtDate(p.date, true)}</p><h2 className="!text-2xl"><Link href={`/blog/${p.slug}/`} className="no-underline hover:underline">{p.title}</Link></h2><p className="mt-2 max-w-2xl text-ink/80">{p.description}</p></article>
        ))}
      </div>
    </TextPage>
  );
}
