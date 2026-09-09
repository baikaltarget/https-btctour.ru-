export default function Logo({ light = false }: { light?: boolean }) {
  const c = light ? "text-white" : "text-ice-800";
  return (
    <span className={`inline-flex items-baseline gap-2 no-underline ${c}`}>
      <span className="font-display text-2xl font-semibold tracking-tight leading-none">BTC<span className="text-dawn-400">.</span>tour</span>
      <span className={`hidden sm:inline text-[11px] leading-tight ${light ? "text-ice-100/80" : "text-ice-600"}`}>Байкал Трэвэл<br />Компани</span>
    </span>
  );
}
