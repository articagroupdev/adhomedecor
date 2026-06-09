"use client";

import { useRef } from "react";

const reviews = [
  {
    name: "Evelyn Vargas",
    text: "Excelente atención... Muy buenas recomendaciones. ¡Me encantó!",
    textEn: "Excellent service and great recommendations. I loved it!",
    time: "hace 8 meses",
    timeEn: "8 months ago",
    initials: "EV",
    color: "bg-rose-500",
  },
  {
    name: "C. Janette Jordan",
    text: "Excelente atención y bellísimas láminas PVC, muy recomendados.",
    textEn: "Excellent service and beautiful PVC sheets — highly recommended.",
    time: "hace 8 meses",
    timeEn: "8 months ago",
    initials: "CJ",
    color: "bg-teal-600",
  },
  {
    name: "Mary Lo Mariceth",
    text: "Excelente atención de todos, en especial el señor Andrés, muy amable y me ayudó en todo lo que yo estaba necesitando.",
    textEn: "Outstanding service from everyone, especially Mr. Andrés — very kind and helpful with everything I needed.",
    time: "hace 8 meses",
    timeEn: "8 months ago",
    initials: "M",
    color: "bg-purple-600",
  },
  {
    name: "Posture Lift",
    text: "Ótimo atendimento, materiales de primera calidad. Muy satisfecho con el resultado.",
    textEn: "Great service and top-quality materials. Very satisfied with the result.",
    time: "hace 8 meses",
    timeEn: "8 months ago",
    initials: "P",
    color: "bg-blue-600",
  },
  {
    name: "Maureen",
    text: "¡Excelente servicio y materiales! Los wallpanels quedaron perfectos en nuestra sala.",
    textEn: "Excellent service and materials! The wall panels look perfect in our living room.",
    time: "hace 8 meses",
    timeEn: "8 months ago",
    initials: "M",
    color: "bg-emerald-600",
  },
  {
    name: "Linda Faneitte",
    text: "Excelente servicios, calidad, precio y atención. ¡1000% recomendado!",
    textEn: "Excellent service, quality, pricing and attention. 1000% recommended!",
    time: "hace 8 meses",
    timeEn: "8 months ago",
    initials: "LF",
    color: "bg-amber-600",
  },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Stars({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "w-6 h-6" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={`${cls} text-amber-400`}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel({ locale = "es" }: { locale?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    if (!trackRef.current) return;
    const card = trackRef.current.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : 300;
    trackRef.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  const isEn = locale === "en";

  return (
    <section className="py-16 bg-brand-surface">

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-2">
              {isEn ? "Reviews" : "Reseñas"}
            </p>
            <h2 className="font-heading text-2xl lg:text-3xl uppercase tracking-wide text-brand-dark leading-tight">
              {isEn ? "What our customers say" : "Lo que dicen nuestros clientes"}
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-xl px-5 py-3.5 shadow-sm border border-brand-border self-start lg:self-auto">
            <GoogleIcon />
            <div className="w-px h-8 bg-brand-border" />
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-heading text-2xl text-brand-dark leading-none">4.9</span>
                <Stars size="sm" />
              </div>
              <p className="font-body text-[10px] text-brand-muted uppercase tracking-widest">Google Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 md:px-8 lg:px-16 xl:px-24">

        <button
          onClick={() => scroll("prev")}
          aria-label={isEn ? "Previous" : "Anterior"}
          className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-border bg-white hover:bg-brand-dark hover:border-brand-dark text-brand-dark hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-scroll scroll-smooth snap-x snap-mandatory flex-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white border border-brand-border rounded-xl p-4 flex-shrink-0 snap-start flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all duration-300"
              style={{ width: "calc(33.333% - 8px)", minWidth: "240px" }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Stars />
                  <GoogleIcon />
                </div>
                <p className="font-body text-brand-dark text-[13px] leading-relaxed line-clamp-3 mb-3">
                  &ldquo;{isEn ? r.textEn : r.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-brand-border">
                <div className={`${r.color} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-[10px] font-semibold font-body">{r.initials}</span>
                </div>
                <div>
                  <p className="font-body text-brand-dark text-xs font-semibold leading-tight">{r.name}</p>
                  <p className="font-body text-brand-muted text-[10px] mt-0.5">
                    {isEn ? r.timeEn : r.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("next")}
          aria-label={isEn ? "Next" : "Siguiente"}
          className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-border bg-white hover:bg-brand-dark hover:border-brand-dark text-brand-dark hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

      </div>
    </section>
  );
}
