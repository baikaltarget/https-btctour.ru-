import EnShell from "@/components/EnShell";
import EnTourRow from "@/components/EnTourRow";
import { SITE } from "@/lib/content";
import { EN, enTours } from "@/lib/en";
import { meta, orgJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
export const metadata = meta({ title: EN.baikal.title, description: EN.baikal.description, path: "/en/baikal/", alternates: { ru: SITE.domain + "/baikal/", en: SITE.domain + "/en/baikal/" } });
export default function Page() {
  return (<EnShell altHref="/baikal/"><><JsonLd data={orgJsonLd()} /><section className="wrap pt-10"><h1>{EN.baikal.h1}</h1><div className="mt-8 border-b border-ice-200">{enTours().map((x, i) => <EnTourRow key={x.t.slug} t={x.t} e={x.e} index={i} />)}</div></section></></EnShell>);
}
