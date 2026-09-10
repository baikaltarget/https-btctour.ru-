import TextPage from "@/components/TextPage";
import LeadForm from "@/components/LeadForm";
import Faq from "@/components/Faq";
import { PAGES, SITE } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.agents;
export const metadata = meta({ title: p.title, description: p.description, path: "/agentam/" });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Турагентам", href: "/agentam/" }]} h1={p.h1} lead={p.intro}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {p.blocks.map((b) => (
          <div key={b.title} className="rounded-xs border border-ice-200 bg-white p-5">
            <p className="font-display text-lg font-semibold text-ice-800">{b.title}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{b.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="mb-2">{p.commission.title}</h2>
        <p className="mb-6 max-w-2xl text-ink/80">{p.commission.note}</p>
        <div className="overflow-x-auto rounded-xs border border-ice-200">
          <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="bg-ice-100">
                {p.commission.cols.map((c) => <th key={c} className="px-4 py-3 font-semibold text-ice-800">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {p.commission.rows.map((r) => (
                <tr key={r[0]} className="border-t border-ice-200">
                  {r.map((cell, i) => <td key={i} className={`px-4 py-3 ${i === 0 ? "text-ink/85" : "font-semibold text-ice-800"}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="mb-6">Как начать сотрудничество</h2>
          <ol className="relative border-l border-ice-200 pl-6">
            {p.steps.map((s, i) => (
              <li key={s} className="relative mb-6 last:mb-0">
                <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ice-800 text-[11px] font-semibold text-white" aria-hidden="true">{i + 1}</span>
                <p className="text-[16px] leading-relaxed text-ink/85">{s}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xs border border-ice-200 bg-white p-6">
          <h2 className="mb-2 !text-2xl">Запросить условия</h2>
          <p className="mb-4 text-ink/80">Оставьте контакт — пришлём проект агентского договора, прайс и материалы для продвижения.</p>
          <LeadForm source="agents" />
        </div>
      </section>

      <div className="-mx-5 md:-mx-8"><Faq items={p.faq} /></div>

      <p className="mt-4 text-sm text-ice-600">Туроператор БиТиСи, реестр РТО {SITE.rto}.</p>
    </TextPage>
  );
}
