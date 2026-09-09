import Link from "next/link";
import site from "@/content/site.json";
import LeadForm from "./LeadForm";
import DevFrame from "./DevFrame";
import IceLine from "./IceLine";

export default function Footer({ lang = "ru" }: { lang?: "ru" | "en" }) {
  const s = site.site;
  return (
    <footer className="mt-16 bg-ice-900 text-ice-100">
      {lang === "ru" && (
        <div className="wrap grid gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-white">Перезвоним за 15 минут</h2>
            <p className="mt-3 max-w-md text-ice-100/80">Оставьте номер — менеджер в Иркутске уточнит даты, состав и пришлёт программу с ценой. Без спама и рассылок.</p>
            <IceLine className="mt-6 !text-dawn-400 opacity-70" />
          </div>
          <LeadForm dark source="footer" />
        </div>
      )}
      <div className="border-t border-white/10">
        <div className="wrap grid gap-8 py-10 text-sm md:grid-cols-4">
          <div>
            <p className="font-display text-xl text-white">{s.brand}</p>
            <p className="mt-2 text-ice-100/70">Туроператор, реестр РТО<br />{s.rto}</p>
            <DevFrame inline note={s.addressTodo ? "адрес офиса" : undefined}><p className="mt-2 text-ice-100/70">{s.address}</p></DevFrame>
            <p className="mt-1 text-ice-100/70">{s.hours}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white">Связаться</p>
            <p><a href={`tel:${s.phoneRaw}`} className="text-white no-underline">{s.phone}</a></p>
            <p><a href={`tel:${s.phone2Raw}`} className="text-ice-100/90 no-underline">{s.phone2}</a> <span className="text-ice-100/60">({s.phone2Note})</span></p>
            <p><a href={`mailto:${s.email}`} className="text-ice-100/90">{s.email}</a></p>
            <p className="mt-2 flex gap-4"><a href={s.telegram} className="text-ice-100/90" rel="noopener" target="_blank">Telegram</a><a href={s.vk} className="text-ice-100/90" rel="noopener" target="_blank">ВКонтакте</a></p>
          </div>
          {lang === "ru" && (
            <div className="md:col-span-2">
              <p className="mb-2 font-semibold text-white">Разделы</p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {site.footerLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-ice-100/80 no-underline hover:text-white">{l.label}</Link></li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="wrap flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-ice-100/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {s.legalName}. ИНН {s.inn}, ОГРН {s.ogrn}</p>
          <p className="flex gap-4"><Link href="/politika/" className="text-ice-100/60 no-underline">Политика конфиденциальности</Link><Link href="/oplata/" className="text-ice-100/60 no-underline">Оплата</Link></p>
        </div>
      </div>
    </footer>
  );
}
