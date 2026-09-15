import { NextResponse, type NextRequest } from "next/server";
import site from "@/content/site.json";

const CANONICAL_HOST = new URL(site.site.domain).host; // btctour.ru

/**
 * Технические адреса (*.vercel.app и превью-деплои) закрываем от поисковиков.
 * Иначе они индексируются как полная копия сайта и конкурируют с основным доменом.
 * Боевой домен работает как обычно.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const res = NextResponse.next();
  const isCanonical = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;
  if (!isCanonical) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img/|.*\\.(?:webp|png|jpg|jpeg|svg|ico|xml|txt)$).*)"],
};
