import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { EN_CATEGORY_NAMES } from "@/lib/i18n";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  type WCProduct,
  type WCCategory,
} from "@/lib/woocommerce";

const KNOWN_SLUGS = Object.keys(EN_CATEGORY_NAMES);

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories({ hide_empty: true }).catch(() => []);
  const apiSlugs = categories.map((c) => c.slug);
  // Always pre-render known slugs so the routes exist even if WooCommerce is slow at build time
  const merged = [...new Set([...apiSlugs, ...KNOWN_SLUGS])];
  return merged.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Use getCategories (same cached bulk call used by the page component)
  const categories = await getCategories({ hide_empty: true }).catch(() => []);
  const cat = categories.find((c) => c.slug === slug) ?? null;
  if (!cat) return { title: "Category" };
  const displayName = EN_CATEGORY_NAMES[cat.slug] ?? cat.name;
  return {
    title: displayName,
    description: `Explore our ${displayName} collection. Premium wall coverings for interiors and exteriors. Miami, FL.`,
  };
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ProductCard({ product }: { product: WCProduct }) {
  const img = product.images[0];
  return (
    <div className="group bg-white border border-brand-border overflow-hidden hover:shadow-[0_4px_24px_rgba(215,118,39,0.12)] transition-shadow duration-300">
      <a href={`/en/product/${product.slug}`} className="block">
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
              View details
            </span>
          </div>
        </div>
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-heading text-sm lg:text-base uppercase tracking-wide text-brand-dark leading-tight">
            {product.name}
          </h3>
        </div>
      </a>
      <div className="px-4 pb-4 pt-2">
        <a
          href={waUrl(`Hello, I'd like a quote for: ${product.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-brand-orange text-white text-center text-[10px] font-body font-semibold uppercase tracking-widest py-3 hover:bg-brand-orange-hover transition-colors duration-300"
        >
          QUOTE →
        </a>
      </div>
    </div>
  );
}

function CategoryHeader({ cat }: { cat: WCCategory }) {
  const displayName = EN_CATEGORY_NAMES[cat.slug] ?? cat.name;
  return (
    <section className="relative bg-brand-footer py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/productos.webp"
          alt="Wall covering products"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <nav className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/40 mb-8">
          <a href="/en" className="hover:text-white transition-colors">Home</a>
          <span>·</span>
          <a href="/en/catalog" className="hover:text-white transition-colors">Catalog</a>
          <span>·</span>
          <span className="text-brand-orange">{displayName}</span>
        </nav>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="font-body text-brand-orange text-xs uppercase tracking-[0.25em] mb-4">
              Collection
            </p>
            <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide leading-tight">
              {displayName}
            </h1>
          </div>
          {cat.count > 0 && (
            <p className="font-body text-white/40 text-sm uppercase tracking-widest flex-shrink-0">
              {cat.count} {cat.count === 1 ? "product" : "products"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function EnCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Load full category list (likely already in data cache from the same request path)
  const allCategories = await getCategories({ hide_empty: true }).catch(() => []);
  const cat = allCategories.find((c) => c.slug === slug)
    ?? await getCategoryBySlug(slug).catch(() => null);

  // Only 404 when the API responded and confirmed the slug doesn't exist.
  // If allCategories is empty the API failed — render a graceful fallback instead
  // of caching a permanent 404 for 1 hour.
  if (!cat && allCategories.length > 0) notFound();

  const catDisplayName = cat
    ? (EN_CATEGORY_NAMES[cat.slug] ?? cat.name)
    : (EN_CATEGORY_NAMES[slug] ?? slug);

  if (!cat) {
    return (
      <>
        <Nav />
        <main>
          <section className="relative bg-brand-footer py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image src="/img/productos.webp" alt="Wall covering products" fill priority className="object-cover" />
              <div className="absolute inset-0 bg-black/70" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
              <nav className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/40 mb-8">
                <a href="/en" className="hover:text-white transition-colors">Home</a>
                <span>·</span>
                <a href="/en/catalog" className="hover:text-white transition-colors">Catalog</a>
                <span>·</span>
                <span className="text-brand-orange">{catDisplayName}</span>
              </nav>
              <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide leading-tight">{catDisplayName}</h1>
            </div>
          </section>
          <section className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 text-center">
              <p className="font-body text-brand-muted text-lg mb-8">Products are loading. Please try again in a moment.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/en/catalog" className="inline-flex items-center justify-center border border-brand-dark text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-300">View full catalog →</a>
                <a href={`https://wa.me/16452481030?text=${encodeURIComponent(`Hello, I'm interested in ${catDisplayName}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-brand-orange text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange-hover transition-colors duration-300">Quote on WhatsApp →</a>
              </div>
            </div>
          </section>
        </main>
        <Footer categories={allCategories} locale="en" />
      </>
    );
  }

  // Bulk fetch — same URL as /en/catalog, shared by Next.js data cache across all category pages
  const allProducts = await getProducts({ per_page: 100 }).catch(() => [] as WCProduct[]);
  const products = allProducts.filter((p) => p.categories.some((c) => c.id === cat.id));

  return (
    <>
      <Nav />
      <main>
        <CategoryHeader cat={cat} />

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-brand-muted text-lg mb-8">
                  No products in this category yet.
                </p>
                <a
                  href={waUrl(`Hello, I'm interested in the ${cat.name} category`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Check availability
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="flex flex-col lg:flex-row lg:items-stretch border-b border-brand-border">
              <div className="flex-1 py-16 lg:py-24 lg:pr-16 lg:border-r lg:border-brand-border">
                <p className="font-body text-xs uppercase tracking-[0.25em] text-brand-orange mb-5">
                  Start today
                </p>
                <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-brand-dark leading-[1.08]">
                  Ready to<br />
                  <span className="text-brand-orange">transform</span><br />
                  your space?
                </h2>
              </div>

              <div className="flex-1 lg:flex-none lg:w-[42%] py-16 lg:py-24 lg:pl-16 flex flex-col justify-center gap-6">
                <p className="font-body text-brand-muted text-base leading-relaxed">
                  Our experts will help you choose the perfect{" "}
                  <span className="text-brand-dark font-semibold">{catDisplayName}</span>{" "}
                  model. Free quote and personalized advice.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={waUrl(`Hello, I'd like advice on ${catDisplayName}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    QUOTE ON WHATSAPP
                  </a>
                  <a
                    href="/en/catalog"
                    className="inline-flex items-center justify-center gap-2 border border-brand-border text-brand-dark px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-dark transition-colors duration-300"
                  >
                    View catalog →
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-14 gap-y-6 py-10">
              {[
                { value: "30+", label: "Years of experience" },
                { value: "4.9★", label: "Google Reviews" },
                { value: "100%", label: "Certified materials" },
                { value: "USA", label: "Nationwide shipping" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="font-heading text-2xl text-brand-orange leading-none">{s.value}</span>
                  <span className="font-body text-brand-muted text-[11px] uppercase tracking-widest leading-snug">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer categories={allCategories} locale="en" />
    </>
  );
}
