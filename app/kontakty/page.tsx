import TextPage from "@/components/TextPage";
import DevFrame from "@/components/DevFrame";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import { PAGES, SITE } from "@/lib/content";
import { meta, orgJsonLd } from "@/lib/seo";
const p = PAGES.contacts;
export const metadata = meta({ title: p.title, description: p.description, path: "/kontakty/", alternates: { ru: SITE.domain + "/kontakty/", en: SITE.domain + "/en/contacts/" } });
export default function Page() {
  return (
    <TextPage crumbs={[{ name: "Контакты", href: "/kontakty/" }]} h1={p.h1} altHref="/en/contacts/">
      <JsonLd data={orgJsonLd()} />
      <div className="grid gap-12 md:grid-cols-2">
        <dl className="grid gap-5 text-[17px]">
          <div><dt className="text-sm text-ice-600">Телефон (бесплатно по России)</dt><dd><a href={`tel:${SITE.phoneRaw}`} className="font-display text-2xl font-semibold no-underline">{SITE.phone}</a></dd></div>
          <div><dt className="text-sm text-ice-600">Мобильный, {SITE.phone2Note}</dt><dd><a href={`tel:${SITE.phone2Raw}`} className="text-xl font-semibold no-underline">{SITE.phone2}</a></dd></div>
          <div><dt className="text-sm text-ice-600">Почта</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
          <div><dt className="text-sm text-ice-600">Мессенджеры и соцсети</dt><dd className="flex flex-wrap gap-x-4 gap-y-1"><a href={SITE.telegram} target="_blank" rel="noopener">Telegram</a><a href={SITE.max} target="_blank" rel="noopener">Max</a><a href={SITE.vk} target="_blank" rel="noopener">ВКонтакте</a></dd></div>
          <div><dt className="text-sm text-ice-600">Часы работы</dt><dd>{SITE.hours}</dd></div>
          <div>
            <dt className="text-sm text-ice-600">Офис</dt>
            <dd>{SITE.address}</dd>
            <div className="mt-3 aspect-[16/9] overflow-hidden rounded-xs bg-ice-100">
              <iframe
                src={`https://yandex.ru/map-widget/v1/?ll=${SITE.geo.lng}%2C${SITE.geo.lat}&z=16&pt=${SITE.geo.lng},${SITE.geo.lat},pm2dol`}
                title={`Офис BTCTOUR на карте: ${SITE.address}`}
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          </div>
          <div className="text-sm text-ink/70"><dt className="text-ice-600">Реквизиты</dt><dd>{SITE.legalName}, ИНН {SITE.inn}, ОГРН {SITE.ogrn}. Единый федеральный реестр туроператоров: {SITE.rto}.</dd></div>
        </dl>
        <div className="rounded-xs border border-ice-200 bg-white p-6"><h2 className="mb-2 !text-2xl">Напишите нам</h2><p className="mb-4 text-ink/80">Ответим в течение 15 минут в рабочее время.</p><LeadForm source="contacts" /></div>
      </div>
    </TextPage>
  );
}
