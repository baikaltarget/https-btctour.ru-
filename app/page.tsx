import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import DepartureStrip from "@/components/DepartureStrip";
import TourList from "@/components/TourList";
import Quiz from "@/components/Quiz";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import DevFrame from "@/components/DevFrame";
import IceLine from "@/components/IceLine";
import { SectionHead } from "@/components/Section";
import { HERO, SEASON, SITE, TRUST, FAQ_GENERAL, activeTours, seasonSort, regions } from "@/lib/content";
import { meta, orgJsonLd } from "@/lib/seo";

export const metadata = meta({
  title: "Туры на Байкал 2027 от туроператора из Иркутска — зима, лёд, Ольхон, лето | BTCTOUR",
  description: "Авторские туры на Байкал от иркутского туроператора: зимние туры на лёд и Ольхон от 48 400 ₽, Новый год, летние туры, круизы, экскурсии. Группы до 8 человек, встреча в аэропорту.",
  path: "/",
  alternates: { ru: SITE.domain + "/", en: SITE.domain + "/en/" },
});

export default function Home() {
  const winter = activeTours().filter((t) => t.season.includes("winter") && t.type !== "excursion").sort(seasonSort);
  const summer = activeTours().filter((t) => t.season.includes("summer") && !t.season.includes("winter") && t.type !== "excursion").sort(seasonSort).slice(0, 4);
  const first = SEASON === "winter" ? winter : summer;
  const second = SEASON === "winter" ? summer : winter;
  const quick = [
    ["Ольхон", "/baikal/olkhon/"], ["Байкальский лёд", "/baikal/led/"], ["Новый год", "/baikal/novyy-god/"], ["КБЖД", "/baikal/kbzhd/"],
    ["Листвянка", "/baikal/listvyanka/"], ["Круизы", "/baikal/kruizy/"], ["Вертолёт", "/baikal/vertoletnye/"], ["Экскурсии на 1 день", "/baikal/ekskursii/"],
    ["Из Москвы", "/baikal/iz-moskvy/"], ["Из Санкт-Петербурга", "/baikal/iz-spb/"], ["Индивидуально", "/baikal/individualnye/"], ["Корпоративам", "/corporate/"],
  ];
  return (
    <>
      <JsonLd data={orgJsonLd()} />
      <Header altHref="/en/" />
      <main>
        {/* Первый экран: фото на весь экран, заголовок внизу слева, справа ближайшие заезды */}
        <section className="relative isolate min-h-[88svh] overflow-hidden bg-ice-800 text-white">
          <Image src={HERO.image} alt={HERO.imageAlt} fill priority sizes="100vw" className="object-cover" quality={80} />
          <div className="absolute inset-0 bg-gradient-to-t from-ice-900/90 via-ice-900/55 to-ice-900/35" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-ice-900/70 via-ice-900/25 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-ice-900/15" aria-hidden="true" />
          <div className="wrap relative flex min-h-[88svh] flex-col justify-end pb-10 pt-24 md:pb-16">
            <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
              <div>
                <p className="mb-4 text-sm text-ice-100/85">{HERO.eyebrow}</p>
                <h1 className="max-w-3xl text-white">{HERO.title}</h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ice-100/90">{HERO.subtitle}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={SEASON === "winter" ? "/baikal/zimnie/" : "/baikal/letnie/"} className="btn-dawn">{SEASON === "winter" ? "Зимние туры 2027" : "Летние туры"}</Link>
                  <Link href="/#podbor" className="btn-frost">Подобрать тур</Link>
                </div>
              </div>
              <DevFrame note={"imageTodo" in HERO ? (HERO as { imageTodo?: string }).imageTodo : undefined}><DepartureStrip /></DevFrame>
            </div>
          </div>
        </section>

        {/* Туры текущего сезона */}
        <section className="wrap pt-14 md:pt-20">
          <SectionHead title={SEASON === "winter" ? "Зимние туры на Байкал 2027" : "Летние туры на Байкал"} lead={SEASON === "winter" ? "Лёд встаёт в январе, самый прозрачный — с середины февраля до середины марта. Все заезды стартуют в Иркутске, по льду только на хивусах и УАЗ." : "Навигация с мая по сентябрь: Ольхон, КБЖД, круизы, баня на берегу."} />
          <TourList tours={first} />
          <p className="mt-6"><Link href={SEASON === "winter" ? "/baikal/zimnie/" : "/baikal/letnie/"} className="btn-primary">Все {SEASON === "winter" ? "зимние" : "летние"} туры и даты</Link></p>
        </section>

        {/* Доверие — тихо, без иконок */}
        <section className="wrap py-14 md:py-20">
          <div className="grid gap-8 border-y border-ice-200 py-10 md:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.title}><p className="font-display text-xl font-semibold text-ice-800">{t.title}</p><p className="mt-2 text-[15px] leading-relaxed text-ink/75">{t.text}</p></div>
            ))}
          </div>
        </section>

        {/* Второй сезон */}
        <section className="wrap">
          <SectionHead title={SEASON === "winter" ? "Летом: Ольхон, КБЖД, круизы" : "Зимой: лёд, Ольхон, Новый год"} lead={SEASON === "winter" ? "Даты на лето 2027 открываем зимой. Можно забронировать заранее по текущим ценам." : "Заезды на лёд с января по март."} />
          <TourList tours={second} offset={first.length} />
          <p className="mt-6"><Link href={SEASON === "winter" ? "/baikal/letnie/" : "/baikal/zimnie/"} className="btn-ghost">Все {SEASON === "winter" ? "летние" : "зимние"} туры</Link></p>
        </section>

        {/* Быстрые ссылки по запросам */}
        <section className="wrap py-14 md:py-20">
          <h2 className="mb-6">Куда и как</h2>
          <ul className="flex flex-wrap gap-2">
            {quick.map(([l, h]) => <li key={h}><Link href={h} className="inline-block rounded-xs border border-ice-200 bg-white px-4 py-2 text-[15px] font-medium text-ice-900 no-underline hover:border-ice-600">{l}</Link></li>)}
          </ul>
        </section>

        <Quiz />
        <Reviews />

        {/* Другие направления — вне фокуса, одной строкой */}
        <section className="wrap py-14 md:py-20">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-baseline">
            <h2>Не только Байкал</h2>
            <p className="text-[17px] leading-relaxed text-ink/80">
              Кроме Байкала организуем поездки туда, куда чаще всего едут наши земляки:{" "}
              {regions.map((r, i) => <span key={r.slug}><Link href={`/${r.slug}/`}>{r.name}</Link>{i < regions.length - 1 ? ", " : ""}</span>)}. Программы и цены — на странице <Link href="/napravleniya/">других направлений</Link>.
            </p>
          </div>
        </section>

        <Faq items={FAQ_GENERAL} />

        {/* SEO-текст — коротко и по делу */}
        <section className="wrap pb-6">
          <IceLine className="mb-6" />
          <div className="prose-site text-ink/85">
            <h2 className="!mt-0">Туры на Байкал от иркутского туроператора</h2>
            <p>Байкал Трэвэл Компани — туроператор из Иркутска (реестр РТО {SITE.rto}). Мы сами разрабатываем программы, сами возим и сами отвечаем за каждый день. Зимой — туры на байкальский лёд с ледовым сафари на хивусах, ночёвками на Ольхоне и выходом на мыс Хобой; летом — Ольхон, Кругобайкальская железная дорога, восточный берег Бурятии, круизы на теплоходе и банные туры.</p>
            <p>К нам едут из Москвы, Санкт-Петербурга, Новосибирска, Красноярска и соседних регионов. Тур начинается со встречи в аэропорту Иркутска: подсказываем удобные рейсы, помогаем с билетами, продумываем первый день так, чтобы разница во времени не мешала. Группы до восьми человек, гарантированные заезды, оплата частями через Яндекс Сплит.</p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
