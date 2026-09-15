import Link from "next/link";
import { notFound } from "next/navigation";
import TextPage from "@/components/TextPage";
import { getPosts, fmtDate, readingTime } from "@/lib/content";
import { meta } from "@/lib/seo";

const PER_PAGE = 6;

/** Страницы пагинации блога отдельными адресами: статика и понятный URL вместо параметра. */
export function generateStaticParams() {
  const pages = Math.ceil(getPosts().length / PER_PAGE);
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  return meta({ title: `Блог о Байкале — страница ${n} | BTCTOUR`, description: `Статьи туроператора из Иркутска о Байкале, страница ${n}.`, path: `/blog/stranitsa/${n}/`, noindex: true });
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const posts = getPosts();
  const pages = Math.ceil(posts.length / PER_PAGE);
  const current = Number(n);
  if (!current || current < 2 || current > pages) notFound();
  const list = posts.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <TextPage crumbs={[{ name: "Блог", href: "/blog/" }, { name: `Страница ${current}`, href: `/blog/stranitsa/${current}/` }]} h1={`Блог о Байкале — страница ${current}`}>
      <div className="grid gap-8 sm:grid-cols-2">
        {list.map((p) => (
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
      <nav aria-label="Страницы блога" className="mt-12 flex flex-wrap items-center gap-2">
        <Link href={current === 2 ? "/blog/" : `/blog/stranitsa/${current - 1}/`} className="btn-ghost">Назад</Link>
        {current < pages && <Link href={`/blog/stranitsa/${current + 1}/`} className="btn-ghost">Дальше</Link>}
      </nav>
    </TextPage>
  );
}
