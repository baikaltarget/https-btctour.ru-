/**
 * Маска телефона для поля «Телефон или Telegram».
 * Важно: поле принимает и ник в Telegram, поэтому маска применяется только
 * когда человек явно вводит номер — то есть начал с цифры или плюса.
 * Ввод, начинающийся с @ или букв, не трогаем совсем.
 */
export function formatPhone(raw: string): string {
  const first = raw.trim()[0];
  if (!first) return raw;
  if (!/[\d+]/.test(first)) return raw; // @nickname, имя в Telegram, e-mail — оставляем как есть

  const hadPlus = raw.trim().startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return hadPlus ? "+" : "";

  // Без плюса считаем номер российским: 8… и 9… приводим к +7
  if (!hadPlus && digits[0] === "8") digits = "7" + digits.slice(1);
  else if (!hadPlus && digits[0] === "9") digits = "7" + digits;
  const isRu = digits[0] === "7";
  if (!isRu) return "+" + digits.slice(0, 15); // иностранный номер — просто плюс и цифры

  const d = digits.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = "+7";
  if (p[0]) out += ` (${p[0]}`;
  if (p[0].length === 3) out += ")";
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}

/** Похоже ли введённое на телефон, который можно набрать. */
export function isCallable(v: string): boolean {
  const d = v.replace(/\D/g, "");
  return d.length >= 10;
}
