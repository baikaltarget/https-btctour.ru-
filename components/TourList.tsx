import type { Tour } from "@/lib/content";
import TourRow from "./TourRow";
export default function TourList({ tours, offset = 0 }: { tours: Tour[]; offset?: number }) {
  if (!tours.length) return <p className="text-ink/70">Туров в этом разделе пока нет — позвоните, соберём индивидуально.</p>;
  return <div className="border-b border-ice-200">{tours.map((t, i) => <TourRow key={t.slug} t={t} index={i + offset} />)}</div>;
}
