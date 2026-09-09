"use client";
import { useState } from "react";
import site from "@/content/site.json";

type Props = { source: string; tour?: string; dates?: string[]; dark?: boolean; compact?: boolean; lang?: "ru" | "en" };
export default function LeadForm({ source, tour, dates, dark, compact, lang = "ru" }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  const t = lang === "en"
    ? { name: "Name", phone: "Phone or Telegram", date: "Preferred dates", people: "Travellers", btn: "Request a call", ok: "Thanks — we will get back to you shortly.", fail: "Could not send. Please call or write to Telegram.", consent: "By submitting you agree to the privacy policy", any: "any" }
    : { name: "Имя", phone: "Телефон или Telegram", date: "Даты", people: "Сколько человек", btn: "Жду звонка", ok: "Спасибо, заявка ушла. Перезвоним в течение 15 минут в рабочее время.", fail: "Не отправилось. Позвоните нам или напишите в Telegram.", consent: "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности", any: "любые" };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot
    setState("sending");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(fd), source, tour, page: typeof window !== "undefined" ? window.location.pathname : "" }) });
      if (!r.ok) throw new Error(await r.text());
      setState("ok");
    } catch (e) { setErr(String(e)); setState("err"); }
  }
  const input = `w-full rounded-xs border px-3 py-2.5 text-base outline-none focus:border-dawn-400 ${dark ? "border-white/20 bg-white/10 text-white placeholder:text-ice-100/50" : "border-ice-200 bg-white text-ink placeholder:text-ink/40"}`;
  if (state === "ok") return <p className={`rounded-xs p-4 ${dark ? "bg-white/10 text-white" : "bg-ice-100 text-ice-900"}`} role="status">{t.ok}</p>;
  return (
    <form onSubmit={submit} className="grid gap-3" aria-label={lang === "en" ? "Request a call" : "Заявка на звонок"}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
        <label className="grid gap-1 text-sm"><span className={dark ? "text-ice-100/80" : "text-ice-800"}>{t.name}</span><input name="name" required className={input} autoComplete="name" /></label>
        <label className="grid gap-1 text-sm"><span className={dark ? "text-ice-100/80" : "text-ice-800"}>{t.phone}</span><input name="phone" required inputMode="tel" className={input} autoComplete="tel" placeholder="+7" /></label>
      </div>
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm"><span className={dark ? "text-ice-100/80" : "text-ice-800"}>{t.date}</span>
            {dates && dates.length ? (
              <select name="dates" className={input} defaultValue=""><option value="">{t.any}</option>{dates.map((d) => <option key={d} value={d}>{d}</option>)}</select>
            ) : <input name="dates" className={input} placeholder={lang === "en" ? "e.g. late February" : "например, конец февраля"} />}
          </label>
          <label className="grid gap-1 text-sm"><span className={dark ? "text-ice-100/80" : "text-ice-800"}>{t.people}</span><input name="people" inputMode="numeric" className={input} placeholder="2" /></label>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn-dawn disabled:opacity-60">{state === "sending" ? "…" : t.btn}</button>
        <span className={`text-xs ${dark ? "text-ice-100/60" : "text-ink/60"}`}>{t.consent}</span>
      </div>
      {state === "err" && <p className="text-sm text-red-600" role="alert">{t.fail} <a href={`tel:${site.site.phoneRaw}`}>{site.site.phone}</a><span className="sr-only">{err}</span></p>}
    </form>
  );
}
