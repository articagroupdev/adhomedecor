"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SearchProduct {
  name: string;
  slug: string;
  image: { src: string; alt: string } | null;
  category: { name: string; slug: string } | null;
}

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;

function ProductCard({ product }: { product: SearchProduct }) {
  return (
    <div className="group bg-white border border-brand-border overflow-hidden hover:shadow-[0_4px_24px_rgba(215,118,39,0.12)] transition-shadow duration-300">
      <a href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-surface">
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-300" />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <span className="bg-white text-brand-dark font-body text-[10px] uppercase tracking-widest px-4 py-2 font-semibold">
              Ver detalles
            </span>
          </div>
        </div>
        <div className="px-4 pt-4 pb-1">
          {product.category && (
            <p className="font-body text-brand-orange text-[10px] uppercase tracking-widest mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-heading text-sm lg:text-base uppercase tracking-wide text-brand-dark leading-tight">
            {product.name}
          </h3>
        </div>
      </a>
      <div className="px-4 pb-4 pt-2">
        <a
          href={waUrl(`Hola, me interesa cotizar: ${product.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-brand-orange text-white text-center text-[10px] font-body font-semibold uppercase tracking-widest py-3 hover:bg-brand-orange-hover transition-colors duration-300"
        >
          COTIZAR →
        </a>
      </div>
    </div>
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [index, setIndex] = useState<SearchProduct[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/search-data.json")
      .then((r) => r.json())
      .then((data) => { setIndex(data); setLoading(false); })
      .catch(() => { setIndex([]); setLoading(false); });
  }, []);

  const results = index
    ? (query
        ? index.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.name.toLowerCase().includes(query.toLowerCase())
          )
        : [])
    : [];

  return (
    <>
      {/* Hero dinámico con el query */}
      <section className="relative bg-brand-footer py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/img/IMG_8085.webp" alt="Catálogo AD Home Decor" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <nav className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/40 mb-8">
            <a href="/" className="hover:text-white transition-colors">Inicio</a>
            <span>·</span>
            <a href="/catalogo" className="hover:text-white transition-colors">Catálogo</a>
            <span>·</span>
            <span className="text-brand-orange">Búsqueda</span>
          </nav>
          <p className="font-body text-brand-orange text-xs uppercase tracking-[0.25em] mb-4">
            Resultados de búsqueda
          </p>
          <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide leading-tight">
            {query ? <>&ldquo;{query}&rdquo;</> : "Búsqueda"}
          </h1>
          {query && !loading && (
            <p className="font-body text-white/60 text-lg mt-4">
              {results.length} {results.length === 1 ? "producto encontrado" : "productos encontrados"}
            </p>
          )}
        </div>
      </section>

      {/* Resultados */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-body text-brand-muted text-lg">Buscando productos...</p>
            </div>
          ) : !query ? (
            <div className="text-center py-20">
              <p className="font-body text-brand-muted text-lg mb-4">
                Escribe un término para buscar productos.
              </p>
              <a
                href="/catalogo"
                className="font-body text-xs uppercase tracking-widest text-brand-orange border-b border-brand-orange/40 pb-0.5 hover:border-brand-orange transition-colors"
              >
                Ver todo el catálogo →
              </a>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-brand-muted text-lg mb-4">
                No encontramos productos para <strong>&ldquo;{query}&rdquo;</strong>.
              </p>
              <a
                href="/catalogo"
                className="font-body text-xs uppercase tracking-widest text-brand-orange border-b border-brand-orange/40 pb-0.5 hover:border-brand-orange transition-colors"
              >
                Ver todo el catálogo →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
