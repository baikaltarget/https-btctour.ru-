import { NextResponse } from "next/server";
/**
 * Заявки → Telegram. В Vercel → Settings → Environment Variables добавить:
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата/группы, куда слать (узнать через @userinfobot или getUpdates)
 * Пока ключей нет — заявка пишется в лог Vercel (Functions → Logs) и форма возвращает ок, чтобы не потерять лид.
 */
/** Источник заявки: метки Директа и переходы. Пустая строка, если человек пришёл напрямую. */
function utmLine(u?: Record<string, string>) {
  if (!u || !Object.keys(u).length) return "";
  const order = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid", "referrer", "landing"];
  const parts = order.filter((k) => u[k]).map((k) => `  ${k}: ${u[k]}`);
  return parts.length ? "Источник:\n" + parts.join("\n") : "";
}

export async function POST(req: Request) {
  let data: Record<string, string> & { utm?: Record<string, string> } = {};
  try { data = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }
  if (data.website) return NextResponse.json({ ok: true }); // honeypot
  if (!data.phone || String(data.phone).replace(/\D/g, "").length < 6) return NextResponse.json({ ok: false, error: "phone" }, { status: 400 });
  const lines = [
    "🧊 Заявка с btctour.ru",
    `Имя: ${data.name || "—"}`,
    `Телефон: ${data.phone}`,
    data.dates ? `Даты: ${data.dates}` : "",
    data.people ? `Человек: ${data.people}` : "",
    data.tour ? `Тур: ${data.tour}` : "",
    `Откуда: ${data.source || "—"}`,
    data.page ? `Страница: https://btctour.ru${data.page}` : "",
    `Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Irkutsk" })} (Иркутск)`,
    utmLine(data.utm),
  ].filter(Boolean);
  const text = lines.join("\n");
  // Каналы независимы: падение одного не должно лишать заказчика заявки.
  const [tg, mail] = await Promise.all([sendTelegram(text), sendEmail(text, data)]);
  if (!tg && !mail) {
    console.error("[LEAD — не доставлено ни одним каналом]\n" + text);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  if (!tg) console.error("[LEAD — Telegram не доставил, письмо ушло]");
  if (!mail) console.error("[LEAD — почта не доставила, Telegram ушёл]");
  return NextResponse.json({ ok: true, delivered: true, channels: { telegram: tg, email: mail } });
}

/** Отправка в Telegram. Возвращает true, если сообщение доставлено. */
async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) { console.log("[LEAD — Telegram не настроен]\n" + text); return false; }
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text }),
    });
    if (!r.ok) { console.error("[LEAD — Telegram error]", await r.text(), "\n" + text); return false; }
    return true;
  } catch (e) { console.error("[LEAD — Telegram exception]", String(e), "\n" + text); return false; }
}

/** Дублирование на почту через Resend. Работает, если заданы RESEND_API_KEY и LEAD_EMAIL_TO. */
async function sendEmail(text: string, data: Record<string, unknown>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY, to = process.env.LEAD_EMAIL_TO;
  if (!key || !to) return false;
  const from = process.env.LEAD_EMAIL_FROM || "Сайт BTCTOUR <zayavki@btctour.ru>";
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: to.split(",").map((x) => x.trim()).filter(Boolean),
        reply_to: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(phone) ? phone : undefined,
        subject: `Заявка с сайта: ${name || "без имени"}${phone ? " — " + phone : ""}`,
        text,
      }),
    });
    if (!r.ok) { console.error("[LEAD — Resend error]", await r.text()); return false; }
    return true;
  } catch (e) { console.error("[LEAD — Resend exception]", String(e)); return false; }
}
