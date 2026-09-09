import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/tury/", "/oplata/", "/politika/", "/*?*"] }], sitemap: SITE.domain + "/sitemap.xml", host: SITE.domain };
}
