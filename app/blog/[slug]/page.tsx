import { notFound } from "next/navigation";
import { marked } from "marked";
import TextPage from "@/components/TextPage";
import JsonLd from "@/components/JsonLd";
import TourList from "@/components/TourList";
import { getPosts, getPost, featuredTours, SITE } from "@/lib/content";
import { meta } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) return {};
  return meta({ title: `${p.title} | BTCTOUR`, description: p.description, path: `/blog/${p.slug}/`, type: "article" });
}
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) notFound();
  const html = await marked.parse(p.content);
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, author: { "@id": SITE.domain + "/#org" }, publisher: { "@id": SITE.domain + "/#org" }, mainEntityOfPage: `${SITE.domain}/blog/${p.slug}/`, image: SITE.domain + SITE.defaultOg };
  return (
    <TextPage crumbs={[{ name: "Блог", href: "/blog/" }, { name: p.title, href: `/blog/${p.slug}/` }]} h1={p.title} lead={p.description}>
      <JsonLd data={ld} />
      <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />
      <section className="mt-14"><h2 className="mb-2">Туры по теме</h2><TourList tours={featuredTours(3)} offset={70} /></section>
    </TextPage>
  );
}
