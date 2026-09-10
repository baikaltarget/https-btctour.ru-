import Image from "next/image";
import TextPage from "@/components/TextPage";
import Reviews from "@/components/Reviews";
import { PAGES, SITE, TRUST } from "@/lib/content";
import { meta } from "@/lib/seo";
const p = PAGES.about;
export const metadata = meta({ title: p.title, description: p.description, path: "/o-kompanii/" });
const TEAM_PHOTOS = [
  { src: "/img/about/team-1.webp", alt: "Гид БиТиСи на льду Байкала" },
  { src: "/img/about/team-2.webp", alt: "Гид БиТиСи на хивусе на льду Байкала" },
  { src: "/img/about/team-3.webp", alt: "Гид БиТиСи на снегоходе на фоне гор Байкала" },
];
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "О компании", href: "/o-kompanii/" }]} h1={p.h1} lead="Туроператор из Иркутска. Байкал — наш дом и наш главный продукт.">
      <div className="grid gap-12 md:grid-cols-[1fr_320px]">
        <div className="prose-site">{p.text.map((t) => <p key={t}>{t}</p>)}
          <div className="mt-8 grid grid-cols-3 gap-3 not-prose">
            {TEAM_PHOTOS.map((ph) => (
              <div key={ph.src} className="relative aspect-[3/4] overflow-hidden rounded-xs">
                <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 768px) 33vw, 220px" className="object-cover" />
              </div>
            ))}
          </div>
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
