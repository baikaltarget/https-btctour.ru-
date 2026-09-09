import EnShell from "@/components/EnShell";
import LeadForm from "@/components/LeadForm";
import { SITE } from "@/lib/content";
import { EN } from "@/lib/en";
import { meta, orgJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
export const metadata = meta({ title: EN.contacts.title, description: EN.contacts.description, path: "/en/contacts/", alternates: { ru: SITE.domain + "/kontakty/", en: SITE.domain + "/en/contacts/" } });
export default function Page() {
  return (<EnShell altHref="/kontakty/"><><JsonLd data={orgJsonLd()} /><section className="wrap pt-10"><h1>{EN.contacts.h1}</h1><p className="mt-4 max-w-2xl text-lg text-ink/80">{EN.contacts.lead}</p>
    <div className="mt-8 grid gap-12 md:grid-cols-2"><dl className="grid gap-4 text-[17px]"><div><dt className="text-sm text-ice-600">Phone / WhatsApp / Telegram</dt><dd><a href={`tel:${SITE.phone2Raw}`} className="text-xl font-semibold no-underline">{SITE.phone2Raw}</a></dd></div><div><dt className="text-sm text-ice-600">Email</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div><div><dt className="text-sm text-ice-600">Telegram</dt><dd><a href={SITE.telegram} target="_blank" rel="noopener">t.me/baikaltravelcompany</a></dd></div><div className="text-sm text-ink/70"><dt className="text-ice-600">Company</dt><dd>{SITE.legalName}, Irkutsk, Russia. Federal tour operator registry no. {SITE.rto}.</dd></div></dl>
    <div className="rounded-xs border border-ice-200 bg-white p-6"><h2 className="mb-4 !text-2xl">Write to us</h2><LeadForm source="en-contacts" lang="en" /></div></div></section></></EnShell>);
}
