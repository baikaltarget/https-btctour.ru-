import type { MetadataRoute } from "next";
import { SITE, categories, tours, regions, getPosts, tourUrl } from "@/lib/content";
import { enTours } from "@/lib/en";
/**
 * Дата последнего изменения содержания сайта (цены, программы, тексты страниц).
 * Правится руками при заметных правках контента.
 *
 * Зачем не new Date(): сайт пересобирается каждую ночь ради публикации статей по расписанию
 * (.github/workflows/publish.yml). Со временем сборки в lastmod у всех адресов ежедневно
 * менялась бы дата обновления, хотя менялась одна статья, и подсказка для поисковика теряла смысл.
 */
const CONTENT_UPDATED = "2026-09-18";

export default function sitemap(): MetadataRoute.Sitemap {
  const d = SITE.domain;
  const u = (p: string, priority = 0.6, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly", lastModified: string = CONTENT_UPDATED) => ({ url: d + p, lastModified, changeFrequency, priority });
  return [
    u("/", 1), u("/baikal/", 0.9),
    ...categories.map((c) => u(`/baikal/${c.slug}/`, 0.8)),
    ...tours.filter((t) => t.status === "active" && t.type !== "helicopter").map((t) => u(tourUrl(t), 0.8)),
    u("/napravleniya/", 0.5), ...regions.map((r) => u(`/${r.slug}/`, 0.5)),
    ...regions.flatMap((r) => r.tours.filter((t) => t.status === "active").map((t) => u(`/${r.slug}/tury/${t.slug}/`, 0.5))),
    u("/o-kompanii/", 0.5, "monthly"), u("/kontakty/", 0.5, "monthly"), u("/agentam/", 0.4, "monthly"), u("/corporate/", 0.5, "monthly"), u("/world/", 0.3, "monthly"),
    u("/blog/", 0.5), ...getPosts().map((p) => u(`/blog/${p.slug}/`, 0.6, "monthly", p.date)), // у статьи — её собственная дата
    u("/en/", 0.6), u("/en/baikal/", 0.6), u("/en/contacts/", 0.4), // Английские адреса берём из enTours(): страница существует ровно тогда, когда для тура есть перевод в site.en.json.
    ...enTours().map((x) => u(`/en/baikal/tury/${x.t.slug}/`, 0.5)),
  ];
}
