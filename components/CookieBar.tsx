"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "btctour-cookie-ok";

/** Плашка про cookie. Показывается один раз: выбор запоминается в localStorage. */
export default function CookieBar({ lang = "ru" }: { lang?: "ru" | "en" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      // приватный режим или заблокированное хранилище — плашку просто не показываем
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {
      // не смогли запомнить — ничего страшного, просто закрываем
    }
    setShow(false);
  };

  if (!show) return null;

  const t =
    lang === "en"
      ? {
          text: "We use cookies and Yandex Metrica to collect anonymous usage statistics and to keep the site working properly.",
          more: "Privacy policy",
          href: "/politika/",
          button: "Got it",
          aria: "Cookie notice",
        }
      : {
          text: "Мы используем cookie и Яндекс Метрику, чтобы сайт работал корректно и чтобы собирать обезличенную статистику посещений.",
          more: "Политика конфиденциальности",
          href: "/politika/",
          button: "Хорошо",
          aria: "Уведомление об использовании cookie",
        };

  return (
    <div
      role="region"
      aria-label={t.aria}
      className="fixed inset-x-0 bottom-14 z-50 px-3 pb-3 md:bottom-0 md:px-5 md:pb-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-ice-200 bg-white/98 p-4 shadow-[0_20px_60px_-20px_rgba(10,39,51,.45)] backdrop-blur sm:flex-row sm:items-center sm:gap-5">
        <p className="min-w-0 text-[14px] leading-relaxed text-ink/85">
          {t.text}{" "}
          <Link href={t.href} className="whitespace-nowrap text-ice-700 underline">
            {t.more}
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn-dawn shrink-0 justify-center sm:w-auto"
        >
          {t.button}
        </button>
      </div>
    </div>
  );
}
