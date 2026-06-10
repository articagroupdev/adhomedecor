export const revalidate = 3600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { EN_CATEGORY_NAMES } from "@/lib/i18n";
import { getProductBySlug, getProducts, getCategories } from "@/lib/woocommerce";

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;

export async function generateStaticParams() {
  const products = await getProducts({ per_page: 100 }).catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description:
      product.short_description.replace(/<[^>]+>/g, "").slice(0, 160) ||
      `${product.name} — Premium wall coverings in Miami, FL.`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].src }] : [],
    },
  };
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function EnProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug).catch(() => null),
    getCategories({ hide_empty: true }).catch(() => []),
  ]);

  if (!product) notFound();

  const cat = product.categories[0];
  const catDisplayName = cat ? (EN_CATEGORY_NAMES[cat.slug] ?? cat.name) : null;
  const wa = waUrl(`Hello, I'd like a quote for: ${product.name}`);

  return (
    <>
      <Nav />
      <main>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-12 lg:py-16">
          <nav className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-brand-muted mb-10">
            <a href="/en" className="hover:text-brand-dark transition-colors">Home</a>
            <span>·</span>
            <a href="/en/catalog" className="hover:text-brand-dark transition-colors">Catalog</a>
            {catDisplayName && cat && (
              <>
                <span>·</span>
                <a
                  href={`/en/catalog/${cat.slug}`}
                  className="hover:text-brand-dark transition-colors"
                >
                  {catDisplayName}
                </a>
              </>
            )}
            <span>·</span>
            <span className="text-brand-dark">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <ProductGallery images={product.images} />

            <div>
              {catDisplayName && (
                <p className="font-body text-brand-orange text-xs uppercase tracking-[0.2em] mb-3">
                  {catDisplayName}
                </p>
              )}

              <h1 className="font-heading text-3xl lg:text-5xl uppercase tracking-wide text-brand-dark leading-tight mb-6">
                {product.name}
              </h1>

              {product.attributes.length > 0 && (
                <div className="border-t border-brand-border pt-6 mb-8 space-y-3">
                  {product.attributes.map((attr) => (
                    <div key={attr.name} className="flex gap-3">
                      <span className="font-heading text-[10px] uppercase tracking-widest text-brand-dark w-28 flex-shrink-0 pt-0.5">
                        {attr.name}
                      </span>
                      <span className="font-body text-sm text-brand-muted">
                        {attr.options.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: "✓", label: "Certified materials" },
                  { icon: "✓", label: "Ships across USA" },
                  { icon: "✓", label: "Free quote" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 bg-brand-surface border border-brand-border px-3 py-2 rounded-sm">
                    <span className="text-brand-orange font-body text-xs font-semibold">{b.icon}</span>
                    <span className="font-body text-[10px] uppercase tracking-widest text-brand-dark">{b.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  QUOTE ON WHATSAPP
                </a>
                {cat && (
                  <a
                    href={`/en/catalog/${cat.slug}`}
                    className="inline-flex items-center justify-center border border-brand-border text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors duration-300"
                  >
                    VIEW COLLECTION
                  </a>
                )}
              </div>

              {/* product.description omitted — WooCommerce content is in Spanish */}
            </div>
          </div>
        </div>

        <section className="bg-white border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="flex flex-col lg:flex-row lg:items-stretch border-b border-brand-border">
              <div className="flex-1 py-16 lg:py-24 lg:pr-16 lg:border-r lg:border-brand-border">
                <p className="font-body text-xs uppercase tracking-[0.25em] text-brand-orange mb-5">
                  Get in touch
                </p>
                <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-brand-dark leading-[1.08]">
                  Questions<br />
                  <span className="text-brand-orange">about this</span><br />
                  product?
                </h2>
              </div>

              <div className="flex-1 lg:flex-none lg:w-[42%] py-16 lg:py-24 lg:pl-16 flex flex-col justify-center gap-6">
                <p className="font-body text-brand-muted text-base leading-relaxed">
                  Our team responds within minutes. Free quote and personalized advice for your project.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    ASK NOW
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

      <Footer categories={categories} locale="en" />
    </>
  );
}
