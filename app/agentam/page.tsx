import TextPage from "@/components/TextPage";
import DevFrame from "@/components/DevFrame";
import LeadForm from "@/components/LeadForm";
import { PAGES } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.agents;
export const metadata = meta({ title: p.title, description: p.description, path: "/agentam/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Турагентам", href: "/agentam/" }]} h1={p.h1} lead="Продавайте Байкал от оператора, который сам возит группы.">
      <div className="grid gap-12 md:grid-cols-2">
        <DevFrame note={p.todo}><div className="prose-site">{p.text.map((t) => <p key={t}>{t}</p>)}</div></DevFrame>
        <div className="rounded-xs border border-ice-200 bg-white p-6"><h2 className="mb-2 !text-2xl">Запросить условия</h2><p className="mb-4 text-ink/80">Пришлём агентский договор, прайс и материалы.</p><LeadForm source="agents" compact /></div>
      </div>
    </TextPage>
  );
}
