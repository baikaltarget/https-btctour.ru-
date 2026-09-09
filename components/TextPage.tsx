import Shell from "./Shell";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
export default function TextPage({ crumbs, h1, lead, children, altHref }: { crumbs: Crumb[]; h1: string; lead?: string; children: React.ReactNode; altHref?: string }) {
  return (
    <Shell altHref={altHref}>
      <Breadcrumbs items={crumbs} />
      <section className="wrap pt-6 md:pt-10">
        <h1>{h1}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{lead}</p>}
        <div className="mt-8">{children}</div>
      </section>
    </Shell>
  );
}
