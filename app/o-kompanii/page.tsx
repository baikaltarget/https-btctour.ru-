import TextPage from "@/components/TextPage";
import DevFrame from "@/components/DevFrame";
import Reviews from "@/components/Reviews";
import { PAGES, SITE, TRUST } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.about;
export const metadata = meta({ title: p.title, description: p.description, path: "/o-kompanii/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "О компании", href: "/o-kompanii/" }]} h1={p.h1} lead="Туроператор из Иркутска. Байкал — наш дом и наш главный продукт.">
      <div className="grid gap-12 md:grid-cols-[1fr_320px]">
        <div className="prose-site">{p.text.map((t) => <p key={t}>{t}</p>)}
          <DevFrame note={p.teamTodo}><div className="mt-8 rounded-xs bg-ice-100 p-6 text-ice-800">Здесь будут фото команды и гидов.</div></DevFrame>
        </div>
        <aside className="text-[15px]">
          <dl className="grid gap-3 border-y border-ice-200 py-5">
            {[["Реестр туроператоров", SITE.rto], ["Юрлицо", SITE.legalName], ["ИНН", SITE.inn], ["ОГРН", SITE.ogrn], ["Город", SITE.city]].map(([k, v]) => <div key={k}><dt className="text-ice-600">{k}</dt><dd className="font-semibold text-ice-900">{v}</dd></div>)}
          </dl>
          <ul className="mt-6 space-y-4">{TRUST.map((t) => <li key={t.title}><p className="font-semibold text-ice-800">{t.title}</p><p className="text-ink/75">{t.text}</p></li>)}</ul>
        </aside>
      </div>
      <div className="-mx-5 mt-14 md:-mx-8"><Reviews limit={6} /></div>
    </TextPage>
  );
}
