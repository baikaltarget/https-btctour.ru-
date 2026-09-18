/**
 * Сообщает Яндексу о статьях, опубликованных сегодня, по протоколу IndexNow.
 * Запускается из .github/workflows/publish.yml после пересборки сайта.
 *
 * Как это работает: на сайте лежит файл public/<ключ>.txt с этим же ключом внутри —
 * так поисковик проверяет, что адреса отправляет владелец сайта. Ключ не секретный.
 *
 * Проверить, ничего не отправляя: DRY_RUN=1 node scripts/indexnow.mjs
 * Отправить конкретные адреса руками: node scripts/indexnow.mjs /blog/mys-khoboy/
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const KEY = "da0b997c5c2c70696d381b034e0cdfd8";
const HOST = "btctour.ru";
const ENDPOINT = "https://yandex.com/indexnow";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Irkutsk", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const manual = process.argv.slice(2).filter((a) => a.startsWith("/"));

const published = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ slug: f.replace(/\.md$/, ""), date: String(matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8")).data.date || "").slice(0, 10) }))
  .filter((p) => p.date === today)
  .map((p) => `/blog/${p.slug}/`);

const paths = manual.length ? manual : published;

if (paths.length === 0) {
  console.log(`Сегодня (${today}) публикаций нет, отправлять нечего.`);
  process.exit(0);
}

// Вместе со статьёй отправляем список блога и карту сайта: у них тоже изменилось содержимое.
const urlList = [...paths, "/blog/", "/sitemap.xml"].map((p) => `https://${HOST}${p}`);
console.log(`Дата ${today}, отправляем ${urlList.length} адресов:`);
urlList.forEach((u) => console.log("  " + u));

if (process.env.DRY_RUN === "1") {
  console.log("DRY_RUN=1 — запрос не отправлен.");
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`Ответ поисковика: ${res.status} ${res.statusText}`);
// 200 и 202 — принято. Остальное — повод посмотреть логи, но сборку не роняем: статья уже на сайте.
if (![200, 202].includes(res.status)) {
  console.log(await res.text().catch(() => ""));
  process.exit(1);
}
