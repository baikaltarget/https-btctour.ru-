import Image from "next/image";
/** Обложка тура. Пока фото нет — ледяной паттерн из фирменной палитры (заменяется полем image в site.json). */
export default function TourImage({ src, alt, seed = 0, className = "", sizes = "(max-width: 768px) 100vw, 40vw", priority = false }: { src?: string; alt: string; seed?: number; className?: string; sizes?: string; priority?: boolean }) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover ${className}`} priority={priority} />;
  const hues = ["#1F6C7D", "#0F3A4A", "#4C93A5", "#164F5D"];
  const a = hues[seed % hues.length], b = hues[(seed + 2) % hues.length];
  return (
    <svg className={`absolute inset-0 h-full w-full ${className}`} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt}>
      <defs><linearGradient id={`g${seed}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <rect width="400" height="260" fill={`url(#g${seed})`} />
      <g stroke="#F3F8FA" strokeOpacity=".55" strokeWidth="1.2" fill="none">
        <path d={`M0 ${120 + (seed * 17) % 60} L70 ${100 + (seed * 9) % 50} L130 ${150 + (seed * 13) % 40} L210 ${90 + (seed * 7) % 70} L290 ${140 + (seed * 11) % 50} L400 ${80 + (seed * 5) % 80}`} />
        <path d={`M${60 + (seed * 23) % 100} 0 L${110 + (seed * 19) % 80} 120 L${90 + (seed * 29) % 120} 260`} />
        <path d={`M${230 + (seed * 31) % 100} 0 L${260 + (seed * 13) % 60} 140 L${300 + (seed * 17) % 80} 260`} />
      </g>
    </svg>
  );
}
