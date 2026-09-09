import type { MetadataRoute } from "next";
import { SITE, categories, tours, regions, getPosts, tourUrl } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const d = SITE.domain, now = new Date();
  const u = (p: string, priority = 0.6, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({ url: d + p, lastModified: now, changeFrequency, priority });
  return [
    u("/", 1), u("/baikal/", 0.9),
    ...categories.map((c) => u(`/baikal/${c.slug}/`, 0.8)),
    ...tours.filter((t) => t.status === "active").map((t) => u(tourUrl(t), 0.8)),
    u("/napravleniya/", 0.5), ...regions.map((r) => u(`/${r.slug}/`, 0.5)),
    ...regions.flatMap((r) => r.tours.filter((t) => t.status === "active").map((t) => u(`/${r.slug}/tury/${t.slug}/`, 0.5))),
    u("/o-kompanii/", 0.5, "monthly"), u("/kontakty/", 0.5, "monthly"), u("/agentam/", 0.4, "monthly"), u("/corporate/", 0.5, "monthly"), u("/world/", 0.3, "monthly"),
    u("/blog/", 0.5), ...getPosts().map((p) => u(`/blog/${p.slug}/`, 0.6, "monthly")),
    u("/en/", 0.6), u("/en/baikal/", 0.6), u("/en/contacts/", 0.4), ...tours.filter((t) => t.status === "active" && t.type !== "excursion").map((t) => u("/en" + tourUrl(t), 0.5)),
  ];
}
