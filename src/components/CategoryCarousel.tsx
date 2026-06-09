"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { WCCategory } from "@/lib/woocommerce";

const CAT_GRADIENTS: Record<string, string> = {
  "laminas-pvc":          "from-slate-400 to-slate-700",
  "wallpanels-interior":  "from-amber-700 to-amber-950",
  "wallpanels-exterior":  "from-stone-500 to-stone-800",
  "flat-panels":          "from-zinc-500 to-zinc-900",
  "pu-stone":             "from-yellow-700 to-stone-700",
  "sistema-luces":        "from-indigo-700 to-indigo-950",
  "liston-decorativo":    "from-orange-700 to-amber-900",
  "corner-wallpanels":    "from-neutral-500 to-neutral-800",
};
const FALLBACK = "from-stone-500 to-stone-800";

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      className="w-5 h-5"
    >
      {dir === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      )}
    </svg>
  );
}

export default function CategoryCarousel({ categories }: { categories: WCCategory[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = categories.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const prev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const next = () => scrollToIndex(Math.min(total - 1, activeIndex + 1));

  // Keep active index in sync when user drags / touch-scrolls
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cardWidth = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
      setActiveIndex(Math.round(track.scrollLeft / (cardWidth + 16))); // 16 = gap-4
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused || total === 0) return;
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % total;
        const track = trackRef.current;
        if (track) {
          const card = track.children[next] as HTMLElement | undefined;
          if (card) track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [paused, total]);

  return (
    <section
      className="py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">
              Categorías
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark">
              Explora por colección
            </h2>
            <p className="font-body text-brand-muted text-sm mt-2 max-w-lg">
              Encuentra el revestimiento perfecto para cada espacio de tu hogar o proyecto.
            </p>
          </div>

          {/* Arrow buttons — visible on md+ */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-8">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Categoría anterior"
              className="w-11 h-11 border border-brand-border flex items-center justify-center text-brand-dark hover:border-brand-orange hover:text-brand-orange transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              onClick={next}
              disabled={activeIndex >= total - 1}
              aria-label="Categoría siguiente"
              className="w-11 h-11 border border-brand-border flex items-center justify-center text-brand-dark hover:border-brand-orange hover:text-brand-orange transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronIcon dir="right" />
            </button>
          </div>
        </div>
      </div>

      {/* Track — starts at page margin, overflows right */}
      <div className="pl-4 md:pl-8 lg:pl-16 xl:pl-24">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
          // Extra right padding so last card doesn't flush against edge
          style={{ paddingRight: "clamp(1rem, 5vw, 6rem)" }}
        >
          {categories.map((cat) => {
            const gradient = CAT_GRADIENTS[cat.slug] ?? FALLBACK;
            return (
              <a
                key={cat.slug}
                href={`/catalogo/${cat.slug}`}
                className="group relative flex-none snap-start w-[78vw] sm:w-[48vw] md:w-[34vw] lg:w-[26vw] xl:w-[22vw] overflow-hidden block"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Background image or gradient fallback */}
                {cat.image ? (
                  <Image
                    src={cat.image.src}
                    alt={cat.image.alt || cat.name}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 34vw, 22vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-[1.05]`}
                  />
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Product count pill */}
                {cat.count > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="font-body text-[9px] uppercase tracking-widest text-white/70 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                      {cat.count} productos
                    </span>
                  </div>
                )}

                {/* Card footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-heading text-white text-sm uppercase tracking-widest mb-3 leading-tight">
                    {cat.name}
                  </p>
                  <span className="inline-flex items-center gap-1.5 bg-brand-orange text-white text-[10px] font-body font-semibold uppercase tracking-widest px-4 py-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    VER MODELOS
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Dot / dash indicators */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mt-6 flex items-center gap-2">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Ir a categoría ${i + 1}`}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-brand-orange"
                : "w-3 bg-brand-border hover:bg-brand-muted"
            }`}
          />
        ))}

        {/* Counter */}
        <span className="ml-auto font-body text-xs text-brand-muted tabular-nums">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
