"use client";

import { useState } from "react";
import Image from "next/image";
import type { WCProduct } from "@/lib/woocommerce";
import WhatsAppLink from "@/components/WhatsAppLink";

interface Tab { slug: string; label: string; }

interface Props {
  tabs: Tab[];
  productsBySlug: Record<string, WCProduct[]>;
  locale?: string;
}

const waMsg = (name: string, locale = "es") =>
  `https://wa.me/16452481030?text=${encodeURIComponent(
    locale === "en" ? `Hello, I'd like a quote for: ${name}` : `Hola, me interesa cotizar: ${name}`
  )}`;

export default function ProductExplorer({ tabs, productsBySlug, locale = "es" }: Props) {
  const [active, setActive] = useState(tabs[0]?.slug ?? "");
  const activeTab = tabs.find((t) => t.slug === active);
  const products = (productsBySlug[active] ?? []).slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">
            {locale === "en" ? "Catalog" : "Catálogo"}
          </p>
          <h2 className="font-heading text-3xl lg:text-5xl uppercase tracking-wide text-brand-dark">
            {locale === "en" ? "Explore Our Products" : "Explora Nuestros Productos"}
          </h2>
          <p className="mt-4 text-brand-muted font-body text-base max-w-xl mx-auto leading-relaxed">
            {locale === "en"
              ? "Discover the materials that will make a difference in your next project. Innovation and style for every corner."
              : "Descubre los materiales que marcarán la diferencia en tu próximo proyecto. Innovación y estilo para cada rincón."}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-scroll pb-1 mb-12 md:flex-wrap md:justify-center [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActive(tab.slug)}
              className={`flex-shrink-0 px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-widest rounded-full border transition-all duration-200 cursor-pointer ${
                active === tab.slug
                  ? "bg-brand-orange border-brand-orange text-white shadow-[0_4px_16px_rgba(215,118,39,0.30)]"
                  : "bg-white border-brand-border text-brand-dark hover:border-brand-orange hover:text-brand-orange"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid — always 4 cards */}
        <div
          className="flex gap-4 overflow-x-scroll snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 md:snap-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.length === 0 ? (
            <div className="w-full flex items-center justify-center py-20 md:col-span-full">
              <p className="font-body text-brand-muted text-sm">
                {locale === "en" ? "No products available in this category." : "No hay productos disponibles en esta categoría."}
              </p>
            </div>
          ) : (
            products.map((product) => {
              const img = product.images[0];
              return (
                <div
                  key={product.slug}
                  className="flex-shrink-0 snap-start w-[72vw] md:w-auto group bg-white border border-brand-border overflow-hidden hover:border-brand-orange/40 hover:shadow-[0_8px_32px_rgba(215,118,39,0.10)] transition-all duration-300"
                >
                  <a href={locale === "en" ? `/en/product/${product.slug}` : `/producto/${product.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-brand-surface">
                      {img ? (
                        <Image
                          src={img.src}
                          alt={img.alt || product.name}
                          fill
                          sizes="(max-width: 768px) 72vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-300" />
                      )}
                    </div>
                  </a>
                  <div className="p-4 lg:p-5">
                    <h3 className="font-heading text-brand-dark text-[13px] uppercase tracking-wide leading-snug mb-4 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <WhatsAppLink
                      href={waMsg(product.name, locale)}
                      className="flex items-center justify-center gap-1.5 bg-brand-orange text-white text-[10px] font-body font-semibold uppercase tracking-widest py-2.5 hover:bg-brand-orange-hover transition-colors duration-200"
                    >
                      {locale === "en" ? "QUOTE →" : "COTIZAR →"}
                    </WhatsAppLink>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Per-category CTA */}
        <div className="flex justify-center mt-10">
          <a
            href={locale === "en" ? `/en/catalog/${active}` : `/catalogo/${active}`}
            className="inline-flex items-center gap-3 border border-brand-dark text-brand-dark font-body text-xs font-semibold uppercase tracking-widest px-10 py-4 hover:bg-brand-dark hover:text-white transition-all duration-300"
          >
            {locale === "en" ? "View all products" : "Ver todos los productos"}
            {activeTab && (
              <span className="text-brand-orange group-hover:text-white">
                — {activeTab.label}
              </span>
            )}
            →
          </a>
        </div>

      </div>
    </section>
  );
}
