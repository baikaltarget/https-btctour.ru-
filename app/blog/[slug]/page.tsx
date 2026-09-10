import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import TextPage from "@/components/TextPage";
import JsonLd from "@/components/JsonLd";
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
  const html = await buildRenderer().parse(p.content);
  const toc = extractToc(p.content);
  const minutes = readingTime(p.content);
  const otherPosts = getPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, author: { "@id": SITE.domain + "/#org" }, publisher: { "@id": SITE.domain + "/#org" }, mainEntityOfPage: `${SITE.domain}/blog/${p.slug}/`, image: SITE.domain + (p.image || SITE.defaultOg) };

  return (
    <TextPage crumbs={[{ name: "Блог", href: "/blog/" }, { name: p.title, href: `/blog/${p.slug}/` }]} h1={p.title} lead={p.description}>
      <JsonLd data={ld} />
      {p.faq && p.faq.length > 0 && <JsonLd data={faqJsonLd(p.faq)} />}

      <p className="-mt-2 mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ice-600">
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

      {otherPosts.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6">Читайте также</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {otherPosts.map((op) => (
              <Link key={op.slug} href={`/blog/${op.slug}/`} className="block no-underline">
                {op.image && <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xs"><img src={op.image} alt={op.imageAlt || op.title} className="h-full w-full object-cover" /></div>}
                <p className="font-semibold text-ice-900">{op.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14"><h2 className="mb-2">Туры по теме</h2><TourList tours={featuredTours(3)} offset={70} /></section>
    </TextPage>
  );
}
