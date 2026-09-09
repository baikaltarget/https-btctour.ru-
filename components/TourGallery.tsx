"use client";
import { useEffect, useState } from "react";
import TourImage from "./TourImage";

/**
 * Галерея тура: крупное фото + миниатюры, все кликабельны — открывают полноэкранный просмотр
 * с возможностью переключаться стрелками/клавиатурой. Без внешних библиотек.
 */
export default function TourGallery({ images, alt, seedBase = 0 }: { images: string[]; alt: string; seedBase?: number }) {
  const list = images.length ? images : [undefined];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = (i: number) => { setIndex(i); setOpen(true); };
  const next = () => setIndex((i) => (i + 1) % list.length);
  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <button type="button" onClick={() => show(0)} className="relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xs" aria-label="Открыть фото на весь экран">
        <TourImage src={list[0]} alt={alt} seed={seedBase} sizes="(max-width: 1024px) 100vw, 800px" priority />
        <span className="absolute bottom-3 right-3 rounded-xs bg-ice-900/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">Увеличить</span>
      </button>

      {list.length > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {list.slice(1).map((src, i) => (
            <button key={src} type="button" onClick={() => show(i + 1)} className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xs" aria-label="Открыть фото на весь экран">
              <TourImage src={src} alt={`${alt} — фото ${i + 2}`} seed={i} sizes="200px" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ice-900/95 p-4" role="dialog" aria-modal="true" aria-label="Просмотр фото" onClick={() => setOpen(false)}>
          <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
          {list.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6" aria-label="Предыдущее фото">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6" aria-label="Следующее фото">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={list[index]} alt={`${alt} — фото ${index + 1}`} className="max-h-[90vh] max-w-[92vw] rounded-xs object-contain" onClick={(e) => e.stopPropagation()} />
          {list.length > 1 && <p className="absolute bottom-4 text-sm text-white/70">{index + 1} / {list.length}</p>}
        </div>
      )}
    </>
  );
}
