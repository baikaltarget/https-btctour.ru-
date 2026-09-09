// Прогон по собранным страницам: h1, title, description, canonical, JSON-LD. Запуск после `next build`: npm run seo-check
import fs from "fs"; import path from "path";
const dir = ".next/server/app"; const rows = []; let bad = 0;
function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) rows.push(p); } }
walk(dir);
for (const p of rows.sort()) {
  const h = fs.readFileSync(p, "utf8"); const route = p.replace(dir, "").replace(/\.html$/, "").replace(/\/index$/, "/") || "/";
  const h1 = (h.match(/<h1[^>]*>/g) || []).length; const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; const desc = (h.match(/name="description" content="([^"]*)"/) || [])[1] || "";
  const canon = /rel="canonical"/.test(h); const ld = (h.match(/application\/ld\+json/g) || []).length; const noindex = /noindex/.test(h);
  const issues = []; if (h1 !== 1) issues.push(`h1=${h1}`); if (title.length < 30 || title.length > 100) issues.push(`title=${title.length}`); if (desc.length < 80 || desc.length > 200) issues.push(`desc=${desc.length}`); if (!canon) issues.push("no canonical"); if (!ld && !noindex) issues.push("no jsonld");
  if (issues.length) bad++;
  console.log((issues.length ? "!! " : "ok ") + route.padEnd(52) + (noindex ? "noindex " : "") + `t${title.length} d${desc.length} ld${ld} ` + issues.join(", "));
}
console.log(`\n${rows.length} pages, ${bad} with issues`);
