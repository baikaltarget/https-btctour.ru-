import { NextResponse } from "next/server";
/**
 * Заявки → Telegram. В Vercel → Settings → Environment Variables добавить:
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата/группы, куда слать (узнать через @userinfobot или getUpdates)
 * Пока ключей нет — заявка пишется в лог Vercel (Functions → Logs) и форма возвращает ок, чтобы не потерять лид.
 */
export async function POST(req: Request) {
  let data: Record<string, string> = {};
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
  ].filter(Boolean);
  const text = lines.join("\n");
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) { console.log("[LEAD — Telegram не настроен]\n" + text); return NextResponse.json({ ok: true, delivered: false }); }
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, text }) });
  if (!r.ok) { console.error("[LEAD — Telegram error]", await r.text(), "\n" + text); return NextResponse.json({ ok: false, error: "telegram" }, { status: 502 }); }
  return NextResponse.json({ ok: true, delivered: true });
}
