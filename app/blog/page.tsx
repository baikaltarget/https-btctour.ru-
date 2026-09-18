import Link from "next/link";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";
import { getPosts, fmtDate, readingTime } from "@/lib/content";
import { meta } from "@/lib/seo";

export const metadata = meta({ title: "Блог о Байкале — когда ехать, что смотреть, как готовиться | BTCTOUR", description: "Статьи туроператора из Иркутска: сезоны на Байкале, Ольхон, Иркутск и Листвянка за день, лёд по неделям, что надеть.", path: "/blog/" });

const PER_PAGE = 6;

export default function Page() {
  const posts = getPosts();
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = 1;
  const list = posts.slice(0, PER_PAGE);
  const recent = posts.slice(0, 5);

  return (
    <Shell>
      <Breadcrumbs items={[{ name: "Блог", href: "/blog/" }]} />
      <section className="wrap pt-6 md:pt-10">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <h1>Блог о Байкале</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">Пишем то, что рассказываем группам в дороге.</p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
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

          {pages > 1 && (
            <nav aria-label="Страницы блога" className="mt-12 flex flex-wrap items-center gap-2">
              {current > 1 && <Link href="/blog/" className="btn-ghost">Назад</Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? "/blog/" : `/blog/stranitsa/${n}/`}
                  aria-current={n === current ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xs px-3 text-[15px] no-underline ${n === current ? "bg-ice-800 font-semibold text-white" : "border border-ice-200 text-ice-900 hover:bg-ice-100"}`}
                >
                  {n}
                </Link>
              ))}
              {current < pages && <Link href={`/blog/stranitsa/${current + 1}/`} className="btn-ghost">Дальше</Link>}
            </nav>
          )}

          <section className="mt-14 rounded-3xl bg-ice-900 p-6 text-ice-100 md:p-8" id="zayavka">
            <h2 className="!text-white">Собрать поездку под вас</h2>
            <p className="mt-3 max-w-2xl text-ice-100/85">Скажите даты и с кем едете — подберём тур из наших программ или соберём маршрут с нуля. Ответим в течение дня.</p>
            <div className="mt-6 max-w-3xl"><LeadForm source="blog" dark /></div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start lg:pt-2">
          <p className="mb-4 font-display text-lg font-semibold text-ice-900">Свежие статьи</p>
          <ul className="grid gap-4 border-t border-ice-200 pt-4">
            {recent.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}/`} className="flex gap-3 no-underline">
                  {p.image && (
                    <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.imageAlt || p.title} className="h-full w-full object-cover" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-snug text-ice-900 hover:underline">{p.title}</span>
                    <span className="mt-1 block text-xs text-ice-600">{fmtDate(p.date, true)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xs border border-ice-200 bg-ice-100/50 p-5">
            <p className="font-semibold text-ice-900">Нужен совет по датам?</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">Позвоните — расскажем, какой лёд в феврале и марте и куда успеть за три дня.</p>
            <p className="mt-3"><a href="#zayavka" className="text-sm font-semibold">Оставить заявку</a></p>
          </div>
        </aside>
      </div>
      </section>
    </Shell>
  );
}
