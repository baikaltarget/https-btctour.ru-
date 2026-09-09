import TextPage from "@/components/TextPage";
import SearchBox from "@/components/SearchBox";
import { activeTours, tourUrl, TAG_LABELS } from "@/lib/content";
import { meta } from "@/lib/seo";
export const metadata = meta({ title: "Поиск по турам | BTCTOUR", description: "Все туры и экскурсии с фильтрами по сезону, длительности и формату.", path: "/tury/", noindex: true });
export default function Page() {
  const items = activeTours().map((t) => ({ title: t.title, tagline: t.tagline, summary: t.summary, url: tourUrl(t), days: t.days, price: t.priceFrom, season: t.season, tags: t.tags, type: t.type }));
  return <TextPage crumbs={[{ name: "Все туры", href: "/tury/" }]} h1="Найти тур" lead="Поиск по названию и словам из программы, фильтры по сезону, длительности и формату."><SearchBox items={items} tagLabels={TAG_LABELS} /></TextPage>;
}
