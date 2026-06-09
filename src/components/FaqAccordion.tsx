"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  category: string;
  items: FaqItem[];
}

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-brand-border transition-colors duration-200 ${open ? "border-brand-orange/30" : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span
          className={`font-heading text-sm lg:text-base uppercase tracking-wide leading-snug transition-colors duration-200 ${
            open ? "text-brand-orange" : "text-brand-dark group-hover:text-brand-orange"
          }`}
        >
          {item.q}
        </span>
        <span
          className={`flex-none mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
            open
              ? "border-brand-orange bg-brand-orange text-white rotate-45"
              : "border-brand-border text-brand-muted group-hover:border-brand-orange group-hover:text-brand-orange"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>

      {/* Smooth height animation via CSS grid */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-brand-muted text-sm leading-relaxed pb-6 max-w-2xl">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="space-y-10 lg:space-y-14">
      {groups.map((group) => (
        <div key={group.category} id={group.category.toLowerCase().replace(/\s+/g, "-")}>
          {/* Category heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-5 bg-brand-orange rounded-full flex-none" />
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange">
              {group.category}
            </h3>
          </div>

          {/* Items */}
          <div className="border-t border-brand-border">
            {group.items.map((item, i) => (
              <AccordionItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
