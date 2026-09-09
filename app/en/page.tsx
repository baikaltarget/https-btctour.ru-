import Link from "next/link";
import Image from "next/image";
import EnShell from "@/components/EnShell";
import EnTourRow from "@/components/EnTourRow";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import { HERO, SITE } from "@/lib/content";
import { EN, enTours } from "@/lib/en";
import { meta, orgJsonLd } from "@/lib/seo";
export const metadata = meta({ title: EN.home.title, description: EN.home.description, path: "/en/", alternates: { ru: SITE.domain + "/", en: SITE.domain + "/en/" } });
export default function Page() {
  const all = enTours(); const winter = all.filter((x) => x.t.season.includes("winter")); const summer = all.filter((x) => !x.t.season.includes("winter"));
  return (
    <EnShell altHref="/">
      <JsonLd data={orgJsonLd()} />
      <section className="relative isolate min-h-[80svh] overflow-hidden bg-ice-800 text-white">
        <Image src={HERO.image} alt="Transparent ice of Lake Baikal at sunrise" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ice-900/78 via-ice-900/40 to-ice-900/20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-ice-900/55 via-ice-900/15 to-transparent" aria-hidden="true" />
        <div className="wrap relative flex min-h-[80svh] flex-col justify-end pb-12 pt-24">
          <p className="mb-4 text-sm text-ice-100/85">{EN.hero.eyebrow}</p><h1 className="max-w-3xl text-white">{EN.hero.title}</h1><p className="mt-5 max-w-xl text-lg text-ice-100/90">{EN.hero.subtitle}</p>
          <p className="mt-7"><Link href="/en/baikal/" className="btn-dawn">{EN.hero.cta}</Link></p>
        </div>
      </section>
      <section className="wrap pt-14"><h2 className="mb-6">{EN.home.h2winter}</h2><div className="border-b border-ice-200">{winter.map((x, i) => <EnTourRow key={x.t.slug} t={x.t} e={x.e} index={i} />)}</div></section>
      <section className="wrap py-14"><div className="grid gap-8 border-y border-ice-200 py-10 md:grid-cols-4">{EN.home.trust.map((t) => <div key={t.title}><p className="font-display text-xl font-semibold text-ice-800">{t.title}</p><p className="mt-2 text-[15px] text-ink/75">{t.text}</p></div>)}</div></section>
      <section className="wrap"><h2 className="mb-6">{EN.home.h2summer}</h2><div className="border-b border-ice-200">{summer.map((x, i) => <EnTourRow key={x.t.slug} t={x.t} e={x.e} index={i + 10} />)}</div></section>
      <section className="wrap mt-14 grid gap-8 rounded-xs border border-ice-200 bg-white p-6 md:grid-cols-2 md:p-10"><div><h2>Plan your trip</h2><p className="mt-3 text-ink/80">Tell us your dates and group size — we will send two or three suitable itineraries with prices within a day.</p></div><LeadForm source="en-home" lang="en" /></section>
      <Faq items={EN.home.faq} title="Questions" />
    </EnShell>
  );
}
