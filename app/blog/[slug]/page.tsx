import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import TourList from "@/components/TourList";
import Faq from "@/components/Faq";
import { getPosts, getPost, extractToc, readingTime, featuredTours, SITE } from "@/lib/content";
import { meta, faqJsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) return {};
  return meta({ title: `${p.title} | BTCTOUR`, description: p.description, path: `/blog/${p.slug}/`, type: "article", image: p.image });
}

/** Свой рендерер marked: у h2/h3 — якоря для оглавления, у картинок — рамка и подпись из title. */
function buildRenderer() {
  const m = new Marked();
  m.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = tokens.map((t) => ("raw" in t ? t.raw : "")).join("");
        if (depth === 2 || depth === 3) {
          const id = plain
            .toLowerCase()
            .split("")
            .map((ch: string) => ({ а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" }[ch] ?? ch))
            .join("")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return `<h${depth} id="${id}">${text}</h${depth}>`;
        }
        return `<h${depth}>${text}</h${depth}>`;
      },
      image({ href, title, text }) {
        return `<figure class="not-prose my-8 -mx-1"><img src="${href}" alt="${text || ""}" loading="lazy" class="w-full rounded-xs" />${title ? `<figcaption class="mt-2 text-sm text-ice-600">${title}</figcaption>` : ""}</figure>`;
      },
    },
  });
  return m;
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) notFound();
  const html = (await buildRenderer().parse(p.content))
    .replaceAll("<table>", '<div class="table-wrap"><table>')
    .replaceAll("</table>", "</table></div>");
  const toc = extractToc(p.content);
  const minutes = readingTime(p.content);
  const otherPosts = getPosts().filter((x) => x.slug !== p.slug).slice(0, 5);
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, author: { "@type": "Organization", "@id": SITE.domain + "/#org", name: SITE.brand, url: SITE.domain }, publisher: { "@type": "Organization", "@id": SITE.domain + "/#org", name: SITE.brand, logo: { "@type": "ImageObject", url: SITE.domain + "/img/logo.png" } }, mainEntityOfPage: `${SITE.domain}/blog/${p.slug}/`, image: SITE.domain + (p.image || SITE.defaultOg) };

  return (
    <Shell>
      <Breadcrumbs items={[{ name: "Блог", href: "/blog/" }, { name: p.title, href: `/blog/${p.slug}/` }]} />
      <section className="wrap pt-6 md:pt-10">
      <JsonLd data={ld} />
      {p.faq && p.faq.length > 0 && <JsonLd data={faqJsonLd(p.faq)} />}

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">

      <h1>{p.title}</h1>
      {p.description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{p.description}</p>}

      <p className="mt-5 mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ice-600">
        <span>БиТиСи — туроператор по Байкалу из Иркутска</span>
        <span aria-hidden="true">·</span>
        <span>{minutes} мин чтения</span>
      </p>

      {p.image && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.imageAlt || p.title} className="h-full w-full object-cover" />
        </div>
      )}

      {toc.length > 1 && (
        <nav aria-label="Содержание статьи" className="mb-10 rounded-xs border border-ice-200 bg-ice-100/50 p-5">
          <p className="mb-3 font-semibold text-ice-800">Содержание</p>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {toc.map((t, i) => (
              <li key={t.id}><a href={`#${t.id}`} className="text-[15px] text-ice-600 no-underline hover:text-ice-800 hover:underline">{i + 1}. {t.text}</a></li>
            ))}
          </ol>
        </nav>
      )}

      <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />

      {p.faq && p.faq.length > 0 && <div className="-mx-5 mt-4 md:-mx-8"><Faq items={p.faq} schema={false} /></div>}

      <div className="mt-14 rounded-xs bg-ice-100/70 p-5 text-[15px] text-ink/80">
        Статью подготовили гиды <Link href="/o-kompanii/">БиТиСи</Link> — туроператора из Иркутска (реестр РТО {SITE.rto}), который больше десяти лет сам водит группы по Байкалу.
      </div>

      <section className="mt-14 rounded-3xl bg-ice-900 p-6 text-ice-100 md:p-8" id="zayavka">
        <h2 className="!text-white">Поехать на Байкал</h2>
        <p className="mt-3 max-w-2xl text-ice-100/85">Расскажите, когда и с кем планируете — подберём тур под даты или соберём программу с нуля.</p>
        <div className="mt-6 max-w-3xl"><LeadForm source={`blog: ${p.slug}`} dark /></div>
      </section>

        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start lg:pt-2">
          <p className="mb-4 font-display text-lg font-semibold text-ice-900">Читайте также</p>
          <ul className="grid gap-4 border-t border-ice-200 pt-4">
            {otherPosts.map((op) => (
              <li key={op.slug}>
                <Link href={`/blog/${op.slug}/`} className="flex gap-3 no-underline">
                  {op.image && (
                    <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={op.image} alt={op.imageAlt || op.title} className="h-full w-full object-cover" />
                    </span>
                  )}
                  <span className="min-w-0 text-[15px] font-semibold leading-snug text-ice-900 hover:underline">{op.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xs border border-ice-200 bg-ice-100/50 p-5">
            <p className="font-semibold text-ice-900">Подобрать тур</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">Скажите даты — подскажем, какой лёд и какая программа подойдёт.</p>
            <p className="mt-3"><a href="#zayavka" className="text-sm font-semibold">Оставить заявку</a></p>
          </div>
        </aside>
      </div>

      <section className="mt-14"><h2 className="mb-2">Туры по теме</h2><TourList tours={featuredTours(3)} offset={70} /></section>
      </section>
    </Shell>
  );
}
