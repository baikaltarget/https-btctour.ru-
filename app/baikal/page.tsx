import Link from "next/link";
import Shell from "@/components/Shell";
import Breadcrumbs from "@/components/Breadcrumbs";
import TourList from "@/components/TourList";
import Faq from "@/components/Faq";
import Reviews from "@/components/Reviews";
import { SectionHead } from "@/components/Section";
import { activeTours, seasonSort, categories, SITE, SEASON } from "@/lib/content";
import { meta } from "@/lib/seo";

export const metadata = meta({
  title: "Туры на Байкал 2026–2027 — все туры и экскурсии от иркутского туроператора | BTCTOUR",
  description: "Все туры на Байкал: зимние туры на лёд и Ольхон, Новый год, летние программы, круизы на теплоходе, вертолётные и однодневные экскурсии из Иркутска. Цены, даты, программы по дням.",
  path: "/baikal/",
  alternates: { ru: SITE.domain + "/baikal/", en: SITE.domain + "/en/baikal/" },
});

export default function BaikalHub() {
  const all = activeTours();
  const winter = all.filter((t) => t.season.includes("winter") && t.type !== "excursion").sort(seasonSort);
  const summer = all.filter((t) => t.season.includes("summer") && !t.season.includes("winter") && t.type !== "excursion").sort(seasonSort);
  const exc = all.filter((t) => t.type === "excursion");
  const cats = categories.filter((c) => !["zimnie", "letnie", "ekskursii"].includes(c.slug));
  const faq = [
    { q: "Когда лучше ехать на Байкал?", a: "За льдом — с середины февраля до середины марта. За купанием и Ольхоном — июль и август. За тишиной — июнь и сентябрь. На Новый год лёд уже стоит у Ольхона." },
    { q: "Откуда начинаются туры?", a: "Из Иркутска: встречаем в аэропорту или на вокзале. Тур «Восточный берег» начинается в Улан-Удэ." },
    { q: "Сколько стоит тур на Байкал?", a: "Экскурсия на день — от нескольких тысяч рублей на человека, трёхдневный экспресс — от 39 000 ₽ летом и 48 400 ₽ зимой, недельные программы — 80–150 тысяч, премиальные с полным питанием — от 165 тысяч. Перелёт всегда отдельно." },
    { q: "Можно ли приехать одному?", a: "Да, к сборной группе присоединяются и одиночные путешественники. Доплата за одноместное размещение указана в каждом туре." },
  ];
  return (
    <Shell altHref="/en/baikal/">
      <Breadcrumbs items={[{ name: "Туры на Байкал", href: "/baikal/" }]} />
      <section className="wrap pt-6 md:pt-10">
        <h1>Туры на Байкал</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">Все программы туроператора Байкал Трэвэл Компани: {winter.length} зимних и {summer.length} летних туров, круиз, вертолётные маршруты и {exc.length} однодневных экскурсий. Старт в Иркутске, группы до 8 человек.</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {[["Зима 2027", "#zima"], ["Лето", "#leto"], ["Экскурсии на 1 день", "#ekskursii"], ...cats.map((c) => [c.name, `/baikal/${c.slug}/`])].map(([l, h]) => (
            <li key={h}><Link href={h} className="inline-block rounded-xs border border-ice-200 bg-white px-3 py-1.5 text-sm font-medium text-ice-900 no-underline hover:border-ice-600">{l}</Link></li>
          ))}
        </ul>
      </section>
      {(SEASON === "winter" ? [["zima", "Зимние туры 2027", winter], ["leto", "Летние туры", summer]] as const : [["leto", "Летние туры", summer], ["zima", "Зимние туры 2027", winter]] as const).map(([id, title, list], i) => (
        <section key={id} className="wrap pt-14 md:pt-20">
          <SectionHead id={id} title={title} />
          <TourList tours={list as typeof winter} offset={i * 10} />
          <p className="mt-6"><Link href={id === "zima" ? "/baikal/zimnie/" : "/baikal/letnie/"} className="btn-ghost">Подробнее о сезоне и ответы на вопросы</Link></p>
        </section>
      ))}
      <section className="wrap pt-14 md:pt-20">
        <SectionHead id="ekskursii" title="Экскурсии на один день из Иркутска" lead="Для тех, кто уже в городе. Выезд от гостиницы утром, возвращение вечером." />
        <TourList tours={exc} offset={30} />
        <p className="mt-6"><Link href="/baikal/ekskursii/" className="btn-ghost">Все экскурсии</Link></p>
      </section>
      <Faq items={faq} />
      <Reviews />
    </Shell>
  );
}
