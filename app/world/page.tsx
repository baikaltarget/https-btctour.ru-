import TextPage from "@/components/TextPage";
import DevFrame from "@/components/DevFrame";
import LeadForm from "@/components/LeadForm";
import { PAGES } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.world;
export const metadata = meta({ title: p.title, description: p.description, path: "/world/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Туры за границу", href: "/world/" }]} h1={p.h1}>
      <div className="grid gap-12 md:grid-cols-2">
        <DevFrame note={p.todo}><div className="prose-site">{p.text.map((t) => <p key={t}>{t}</p>)}</div></DevFrame>
        <div className="rounded-xs border border-ice-200 bg-white p-6"><h2 className="mb-2 !text-2xl">Подобрать тур</h2><LeadForm source="world" /></div>
      </div>
    </TextPage>
  );
}
