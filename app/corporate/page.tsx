import TextPage from "@/components/TextPage";
import LeadForm from "@/components/LeadForm";
import Faq from "@/components/Faq";
import { PAGES } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.corporate;
export const metadata = meta({ title: p.title, description: p.description, path: "/corporate/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Корпоративные туры", href: "/corporate/" }]} h1={p.h1} lead={p.intro}>
      <div className="grid gap-8 md:grid-cols-2">{p.blocks.map((b) => <div key={b.title} className="border-t border-ice-200 pt-4"><h2 className="!text-2xl">{b.title}</h2><p className="mt-2 text-ink/80">{b.text}</p></div>)}</div>
      <div className="mt-12 grid gap-8 rounded-xs border border-ice-200 bg-white p-6 md:grid-cols-2 md:p-10"><div><h2>Получить смету</h2><p className="mt-3 text-ink/80">Опишите цель, даты и размер команды — пришлём 2–3 варианта программы с расчётом.</p></div><LeadForm source="corporate" /></div>
      <div className="-mx-5 md:-mx-8"><Faq items={p.faq} /></div>
    </TextPage>
  );
}
