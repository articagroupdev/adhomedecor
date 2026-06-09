import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  getCategories,
  getProducts,
  type WCCategory,
  type WCProduct,
} from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora nuestro catálogo completo de revestimientos: Wall Panels, Láminas de PVC, Flat Panels, PU Stone y más.",
};

function SearchResultCard({ product }: { product: WCProduct }) {
  const img = product.images[0];
  const cat = product.categories[0];
  return (
    <div className="group bg-white border border-brand-border overflow-hidden hover:shadow-[0_4px_24px_rgba(215,118,39,0.12)] transition-shadow duration-300">
      <a href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-surface">
          {img ? (
            <Image
              src={img.src}
              alt={img.alt || product.name}
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
          {cat && (
            <p className="font-body text-brand-orange text-[10px] uppercase tracking-widest mb-1">{cat.name}</p>
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

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type CategoryWithProduct = {
  cat: WCCategory;
  product: WCProduct | null;
};

function CategoryCard({ cat, product }: CategoryWithProduct) {
  // Priority: category image → first product image → gradient fallback
  const imgSrc = cat.image?.src ?? product?.images?.[0]?.src ?? null;
  const imgAlt = cat.image?.alt || product?.images?.[0]?.alt || cat.name;

  return (
    <a href={`/catalogo/${cat.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-800">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={imgAlt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-900 transition-transform duration-700 group-hover:scale-[1.06]" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <p className="font-heading text-white text-sm lg:text-base uppercase tracking-widest mb-1 leading-tight">
            {cat.name}
          </p>
          {cat.count > 0 && (
            <p className="font-body text-white/60 text-xs mb-3">
              {cat.count} {cat.count === 1 ? "producto" : "productos"}
            </p>
          )}
          <span className="inline-block bg-brand-orange text-white text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            VER MODELOS →
          </span>
        </div>
      </div>
    </a>
  );
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const categories = await getCategories({ hide_empty: true }).catch(
    () => [] as WCCategory[]
  );

  // Search mode
  if (query) {
    const results = await getProducts({ search: query, per_page: 24 }).catch(() => [] as WCProduct[]);

    return (
      <>
        <Nav />
        <main>
          {/* Hero */}
          <section className="relative bg-brand-footer py-20 lg:py-28 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image src="/img/IMG_8085.webp" alt="Catálogo AYD Home Decor" fill priority className="object-cover" />
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
              <p className="font-body text-brand-orange text-xs uppercase tracking-[0.25em] mb-4">Resultados de búsqueda</p>
              <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide leading-tight">
                &ldquo;{query}&rdquo;
              </h1>
              <p className="font-body text-white/60 text-lg mt-4">
                {results.length} {results.length === 1 ? "producto encontrado" : "productos encontrados"}
              </p>
            </div>
          </section>

          {/* Results grid */}
          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
              {results.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-body text-brand-muted text-lg mb-4">
                    No encontramos productos para <strong>&ldquo;{query}&rdquo;</strong>.
                  </p>
                  <a href="/catalogo" className="font-body text-xs uppercase tracking-widest text-brand-orange border-b border-brand-orange/40 pb-0.5 hover:border-brand-orange transition-colors">
                    Ver todo el catálogo →
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                  {results.map((product) => (
                    <SearchResultCard key={product.slug} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer categories={categories} />
      </>
    );
  }

  // Default: category listing
  // Fetch one recent product per category in parallel for the card images
  const categoriesWithProducts: CategoryWithProduct[] = await Promise.all(
    categories.map(async (cat) => {
      // Skip if the category already has its own image
      if (cat.image) return { cat, product: null };
      try {
        const [product] = await getProducts({
          category: cat.id,
          per_page: 1,
          orderby: "date",
          order: "desc",
        });
        return { cat, product: product ?? null };
      } catch {
        return { cat, product: null };
      }
    })
  );

  return (
    <>
      <Nav />
      <main>
        {/* Hero banner */}
        <section className="relative bg-brand-footer py-20 lg:py-28 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/IMG_8085.webp"
              alt="Catálogo AYD Home Decor"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <nav className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/40 mb-8">
              <a href="/" className="hover:text-white transition-colors">Inicio</a>
              <span>·</span>
              <span className="text-brand-orange">Catálogo</span>
            </nav>
            <p className="font-body text-brand-orange text-xs uppercase tracking-[0.25em] mb-4">
              Colecciones
            </p>
            <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide max-w-2xl leading-tight">
              Nuestro Catálogo
            </h1>
            <p className="font-body text-white/60 text-lg mt-5 max-w-xl leading-relaxed">
              Explora todas nuestras líneas de revestimiento. Desde Wall Panels
              hasta Láminas de PVC — soluciones para cada espacio.
            </p>
          </div>
        </section>

        {/* Categories grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            {categoriesWithProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-body text-brand-muted text-lg">
                  Las categorías se están cargando. Intenta de nuevo en unos momentos.
                </p>
                <a
                  href={waUrl("Hola, me interesa conocer su catálogo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 bg-[#25D366] text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Consultar por WhatsApp
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {categoriesWithProducts.map(({ cat, product }) => (
                  <CategoryCard key={cat.slug} cat={cat} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-surface border-t border-brand-border py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">
              ¿No encuentras lo que buscas?
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark mb-6">
              Consúltanos directamente
            </h2>
            <p className="font-body text-brand-muted max-w-lg mx-auto mb-8 leading-relaxed">
              Tenemos stock adicional y productos personalizados disponibles. Escríbenos por WhatsApp y te asesoramos.
            </p>
            <a
              href={waUrl("Hola, me interesa conocer más sobre sus productos y disponibilidad")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300"
            >
              <WhatsAppIcon className="w-5 h-5" />
              COTIZAR POR WHATSAPP
            </a>
          </div>
        </section>
      </main>

      <Footer categories={categories} />
    </>
  );
}
