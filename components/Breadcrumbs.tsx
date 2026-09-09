import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
export type Crumb = { name: string; href: string };
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Главная", href: "/" }, ...items];
  return (
    <nav aria-label="Хлебные крошки" className="wrap pt-5 text-sm text-ice-600">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i < all.length - 1 ? <Link href={c.href} className="no-underline hover:underline">{c.name}</Link> : <span className="text-ink/70" aria-current="page">{c.name}</span>}
            {i < all.length - 1 && <span aria-hidden="true" className="text-ice-200">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
