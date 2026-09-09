import TextPage from "@/components/TextPage";
import { PAGES } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.payment;
export const metadata = meta({ title: p.title, description: "Оплата туров картой через Яндекс Пэй или частями через Яндекс Сплит.", path: "/oplata/", noindex: true });
export default function Page() {
  return <TextPage crumbs={[{ name: "Оплата", href: "/oplata/" }]} h1={p.h1}><div className="prose-site">{p.text.map((t) => <p key={t}>{t}</p>)}</div></TextPage>;
}
