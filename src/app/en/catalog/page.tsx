export const revalidate = 3600;
export const dynamic = "force-static";

import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppLink from "@/components/WhatsAppLink";
import { EN_CATEGORY_NAMES } from "@/lib/i18n";
import {
  getCategories,
  getProducts,
  type WCCategory,
  type WCProduct,
} from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse our complete catalog of wall coverings: Wall Panels, PVC Sheets, Flat Panels, PU Stone and more.",
};

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type CategoryWithProduct = { cat: WCCategory; product: WCProduct | null };

function CategoryCard({ cat, product }: CategoryWithProduct) {
  const displayName = EN_CATEGORY_NAMES[cat.slug] ?? cat.name;
  const imgSrc = cat.image?.src ?? product?.images?.[0]?.src ?? null;
  const imgAlt = cat.image?.alt || product?.images?.[0]?.alt || displayName;
  return (
    <a href={`/en/catalog/${cat.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-800">
        {imgSrc ? (
          <Image src={imgSrc} alt={imgAlt} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-900 transition-transform duration-700 group-hover:scale-[1.06]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <p className="font-heading text-white text-sm lg:text-base uppercase tracking-widest mb-1 leading-tight">{displayName}</p>
          {cat.count > 0 && (
            <p className="font-body text-white/60 text-xs mb-3">{cat.count} {cat.count === 1 ? "product" : "products"}</p>
          )}
          <span className="inline-block bg-brand-orange text-white text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            VIEW MODELS →
          </span>
        </div>
      </div>
    </a>
  );
}

export default async function EnCatalogPage() {
  const categories = await getCategories({ hide_empty: true }).catch(() => [] as WCCategory[]);
  // Single bulk fetch to avoid N per-category calls on serverless
  const allProducts = await getProducts({ per_page: 100 }).catch(() => [] as WCProduct[]);
  const firstProductByCatId = new Map<number, WCProduct>();
  for (const product of allProducts) {
    for (const c of product.categories) {
      if (!firstProductByCatId.has(c.id)) firstProductByCatId.set(c.id, product);
    }
  }
  const categoriesWithProducts: CategoryWithProduct[] = categories.map((cat) => ({
    cat,
    product: cat.image ? null : (firstProductByCatId.get(cat.id) ?? null),
  }));

  return (
    <>
      <Nav />
      <main>
        <section className="relative bg-brand-footer py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/img/IMG_8085.webp" alt="AD Home Decor Catalog" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <nav className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/40 mb-8">
              <a href="/en" className="hover:text-white transition-colors">Home</a>
              <span>·</span>
              <span className="text-brand-orange">Catalog</span>
            </nav>
            <p className="font-body text-brand-orange text-xs uppercase tracking-[0.25em] mb-4">Collections</p>
            <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide max-w-2xl leading-tight">Our Catalog</h1>
            <p className="font-body text-white/60 text-lg mt-5 max-w-xl leading-relaxed">
              Explore all our wall covering lines. From Wall Panels to PVC Sheets — solutions for every space.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            {categoriesWithProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-body text-brand-muted text-lg">Categories are loading. Please try again in a moment.</p>
                <WhatsAppLink href={waUrl("Hello, I'd like to see your catalog")} className="inline-flex items-center gap-2 mt-8 bg-[#25D366] text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors">
                  <WhatsAppIcon className="w-4 h-4" />
                  Contact on WhatsApp
                </WhatsAppLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {categoriesWithProducts.map(({ cat, product }) => <CategoryCard key={cat.slug} cat={cat} product={product} />)}
              </div>
            )}
          </div>
        </section>

        <section className="bg-brand-surface border-t border-brand-border py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">Can't find what you're looking for?</p>
            <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark mb-6">Ask us directly</h2>
            <p className="font-body text-brand-muted max-w-lg mx-auto mb-8 leading-relaxed">
              We have additional stock and custom products available. Message us on WhatsApp and we'll help you out.
            </p>
            <WhatsAppLink href={waUrl("Hello, I'd like to know more about your products and availability")} className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300">
              <WhatsAppIcon className="w-5 h-5" />
              GET A QUOTE ON WHATSAPP
            </WhatsAppLink>
          </div>
        </section>
      </main>
      <Footer categories={categories} locale="en" />
    </>
  );
}
