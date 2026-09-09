"use client";
import { useState } from "react";
import LeadForm from "./LeadForm";
/** Квиз подбора тура: 4 шага → форма. Ответы уходят в Telegram вместе с заявкой. */
const STEPS = [
  { key: "season", q: "Когда хотите поехать?", options: ["Новый год", "Январь–март (лёд)", "Лето", "Пока не решил(а)"] },
  { key: "days", q: "Сколько дней есть?", options: ["3 дня", "4–5 дней", "6–7 дней", "8+ дней"] },
  { key: "who", q: "С кем едете?", options: ["Вдвоём", "Семья с детьми", "Компания друзей", "Один/одна"] },
  { key: "style", q: "Что важнее?", options: ["Лёд и виды", "Комфорт и баня", "Активности", "Гастрономия"] },
];
export default function Quiz() {
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const done = i >= STEPS.length;
  return (
    <section id="podbor" className="wrap py-14 md:py-20">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
        <div>
          <h2>Подобрать тур за минуту</h2>
          <p className="mt-3 max-w-md text-ink/80">Четыре вопроса — и менеджер пришлёт два-три подходящих варианта с ценой и датами. Никаких рассылок.</p>
        </div>
        <div className="rounded-xs border border-ice-200 bg-white p-5 md:p-7">
          {!done ? (
            <div>
              <p className="mb-1 text-sm text-ice-600">Шаг {i + 1} из {STEPS.length}</p>
              <p className="mb-4 font-display text-xl font-semibold text-ice-800">{STEPS[i].q}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {STEPS[i].options.map((o) => (
                  <button key={o} type="button" onClick={() => { setAns({ ...ans, [STEPS[i].key]: o }); setI(i + 1); }} className="rounded-xs border border-ice-200 px-4 py-3 text-left text-[15px] font-medium text-ice-900 hover:border-ice-600">{o}</button>
                ))}
              </div>
              {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="mt-4 text-sm text-ice-600">← Назад</button>}
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-ice-600">{Object.values(ans).join(" · ")}</p>
              <p className="mb-4 font-display text-xl font-semibold text-ice-800">Куда прислать варианты?</p>
              <LeadForm source={"quiz: " + Object.values(ans).join(", ")} compact />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
