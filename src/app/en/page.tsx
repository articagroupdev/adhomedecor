import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import HeroSlider from "@/components/HeroSlider";
import ProductExplorer from "@/components/ProductExplorer";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Footer from "@/components/Footer";
import {
  getCategories,
  getProducts,
  type WCCategory,
  type WCProduct,
} from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "AYD Home Decor — Wall Coverings Specialists Miami, FL",
  description:
    "The complete solution for your home décor. Specialists in Wall Panels, PVC Sheets, Flat Panels, PU Stone and Decorative Strips. Miami, Florida.",
};

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;
const DEFAULT_WA = waUrl("Hello, I'm interested in learning more about your products");

const BENTO_ITEMS = [
  { slug: "laminas-pvc",         label: "PVC Sheets",         img: "/img/cat-laminas-pvc.jpg" },
  { slug: "wallpanels-exterior", label: "Exterior Wallpanels", img: "/img/cat-wallpanels-exterior.jpg" },
  { slug: "wallpanels-interior", label: "Interior Wallpanels", img: "/img/cat-wallpanels-interior.jpg" },
  { slug: "pu-stone",            label: "PU Stone",            img: "/img/cat-pu-stone.jpg" },
  { slug: "flat-panels",         label: "Flat Panels",         img: "/img/cat-flat-panels.jpg" },
] as const;

const PVC_FALLBACK_GRADIENTS = [
  "from-slate-100 via-stone-200 to-slate-300",
  "from-amber-100 via-yellow-200 to-amber-300",
  "from-zinc-800 via-zinc-700 to-zinc-900",
  "from-zinc-900 via-stone-800 to-zinc-950",
];

const latestItems = [
  { label: "Interior Wallpanels", sub: "Natural elegance", gradient: "from-amber-800 to-amber-950" },
  { label: "PVC Sheets", sub: "Waterproof & modern", gradient: "from-slate-400 to-slate-700" },
  { label: "Flat Panels", sub: "Clean contemporary lines", gradient: "from-zinc-600 to-zinc-900" },
  { label: "PU Stone", sub: "The beauty of natural rock", gradient: "from-stone-500 to-amber-800" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <p className="text-brand-orange font-body text-xs uppercase tracking-[0.2em] mb-3">{eyebrow}</p>
      <h2 className="font-heading text-3xl lg:text-5xl uppercase tracking-wide text-brand-dark">{title}</h2>
      {subtitle && <p className="mt-4 text-brand-muted font-body text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <HeroSlider />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 w-full pt-16 pb-14 md:py-20">
        <div className="max-w-2xl">
          <p className="font-body text-brand-orange text-xs uppercase tracking-[0.25em] mb-5">
            Miami, Florida · Wall Covering Specialists
          </p>
          <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-7xl leading-[1.02] tracking-tight mb-6">
            THE ULTIMATE SOLUTION FOR YOUR HOME DÉCOR
          </h1>
          <p className="font-body text-white/75 text-lg leading-relaxed mb-10 max-w-lg">
            We specialize in wall coverings. Find the widest variety of
            Wall Panels, PVC Sheets and Decorative Strips to create
            unique and modern spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/en/catalog"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-brand-orange text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange-hover transition-colors duration-300"
            >
              VIEW CATALOG
            </a>
            <a
              href={DEFAULT_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto border border-white text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors duration-300"
            >
              <WhatsAppIcon className="w-4 h-4" />
              GET A QUOTE ON WHATSAPP
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-white/25" />
        <span className="font-body text-white/40 text-[10px] uppercase tracking-[0.2em]">Explore</span>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-brand-surface border-y border-brand-border py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-6 lg:gap-x-14 place-items-center [&>div:last-child]:col-span-2 lg:[&>div:last-child]:col-span-1">
          {[
            { label: "30+ Years of Experience", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> },
            { label: "Professional Installation", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg> },
            { label: "Certified Products", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg> },
            { label: "Shipping Across USA", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
            { label: "Free Quote", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg> },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 text-center">
              <span className="text-brand-orange">{item.icon}</span>
              <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-brand-dark max-w-[110px] leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertiseSection() {
  return (
    <section className="relative overflow-hidden min-h-[560px] lg:min-h-[680px] flex items-center">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover object-center">
        <source src="/img/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-20 lg:py-28">
        <div className="max-w-lg">
          <h2 className="font-heading text-white text-3xl lg:text-5xl leading-snug tracking-tight mb-5">
            We Are Experts in Modern & Quality Wall Coverings.
          </h2>
          <div className="w-10 h-px bg-brand-orange mb-4" />
          <p className="font-body text-white/75 text-sm leading-relaxed mb-2">
            At <span className="text-white font-semibold">AD HOME DECOR</span>, our mission is to
            simplify the renovation of your spaces without compromising luxury or durability.
          </p>
          <p className="font-body text-white/65 text-sm leading-relaxed mb-8">
            We specialize in distributing the highest quality wall panels and PVC sheets,
            offering a fast, clean and affordable alternative to traditional materials.
          </p>
          <a
            href="/en/about"
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-body text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-brand-orange-hover transition-colors duration-300"
          >
            Learn more →
          </a>
        </div>
      </div>
    </section>
  );
}

function NewArrivals({ products }: { products: WCProduct[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-2">
              PVC Sheets · New Collection
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl text-brand-dark tracking-tight">
              The latest, for every wall.
            </h2>
          </div>
          <a
            href="/en/catalog/laminas-pvc"
            className="hidden md:inline-flex items-center gap-2 bg-brand-orange text-white font-body text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-orange-hover transition-colors duration-200"
          >
            Explore collection →
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {products.map((product, i) => {
            const img = product.images[0];
            const fallback = PVC_FALLBACK_GRADIENTS[i % PVC_FALLBACK_GRADIENTS.length];
            return (
              <div key={product.slug} className="group relative">
                <a href={`/en/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />
                <div className="relative aspect-square overflow-hidden bg-brand-surface mb-4">
                  {img ? (
                    <Image src={img.src} alt={img.alt || product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${fallback} transition-transform duration-500 group-hover:scale-[1.04]`} />
                  )}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-white text-brand-dark font-body text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">New</span>
                  </div>
                  <div className="absolute inset-0 flex items-end p-4 pointer-events-none group-hover:pointer-events-auto z-20">
                    <a
                      href={waUrl(`Hello, I'd like a quote for: ${product.name}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-orange text-white text-center font-body text-[10px] font-semibold uppercase tracking-widest py-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    >
                      QUOTE →
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-widest text-brand-muted mb-1">PVC Sheet</p>
                  <h3 className="font-heading text-base uppercase tracking-wide text-brand-dark mb-1 group-hover:text-brand-orange transition-colors duration-200">{product.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 md:hidden text-center">
          <a href="/en/catalog/laminas-pvc" className="inline-flex items-center gap-2 bg-brand-orange text-white font-body text-xs font-semibold uppercase tracking-widest px-7 py-3.5">
            Explore collection →
          </a>
        </div>
      </div>
    </section>
  );
}

function LatestRow() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-2">Collections</p>
            <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark">The latest in wall coverings</h2>
          </div>
          <a href="/en/catalog" className="hidden md:block font-body text-xs uppercase tracking-widest text-brand-dark border-b border-brand-dark hover:text-brand-orange hover:border-brand-orange transition-colors duration-200 pb-0.5">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {latestItems.map((item) => (
            <a key={item.label} href="/en/catalog" className="group block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} transition-transform duration-700 group-hover:scale-105`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-heading text-white text-sm uppercase tracking-widest">{item.label}</p>
                  <p className="font-body text-white/60 text-xs mt-1">{item.sub}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

type BentoItem = { slug: string; label: string; img: string };

function BentoCard({ item, className = "" }: { item: BentoItem; className?: string }) {
  return (
    <a href={`/en/catalog/${item.slug}`} className={`group relative block overflow-hidden ${className}`}>
      <Image src={item.img} alt={item.label} fill sizes="(max-width: 768px) 50vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        <p className="font-heading text-white text-sm lg:text-base uppercase tracking-widest mb-3 leading-tight">{item.label}</p>
        <span className="inline-block bg-brand-orange text-white text-[10px] font-body font-semibold uppercase tracking-widest px-4 py-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          VIEW MODELS
        </span>
      </div>
    </a>
  );
}

function CategoryBento({ categories }: { categories: WCCategory[] }) {
  const items: BentoItem[] = BENTO_ITEMS.map((def) => {
    const api = categories.find((c) => c.slug === def.slug);
    return { slug: def.slug, label: def.label, img: api?.image?.src ?? def.img };
  });
  const [c1, c2, c3, c4, c5] = items;
  return (
    <section className="py-20 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="text-center mb-12">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">Wall Coverings</p>
          <h2 className="font-heading text-3xl lg:text-4xl tracking-tight text-brand-dark max-w-3xl mx-auto leading-tight mb-3">
            Bringing Luxury, Durability and Natural Beauty to Every Corner.
          </h2>
          <p className="font-body text-brand-dark/70 text-base lg:text-lg max-w-xl mx-auto mb-1">
            Discover a new generation of wall coverings.
          </p>
          <p className="font-body text-brand-muted text-sm max-w-2xl mx-auto">
            100% waterproof, durable materials with textures that faithfully replicate marble and natural stone.
          </p>
        </div>
        <div className="hidden lg:flex flex-col gap-3">
          <div className="flex gap-3 h-[520px]">
            <div className="w-[58%] flex-shrink-0 h-full"><BentoCard item={c1} className="h-full" /></div>
            <div className="flex-1 flex flex-col gap-3">
              <BentoCard item={c2} className="flex-1" />
              <BentoCard item={c3} className="flex-1" />
            </div>
          </div>
          <div className="flex gap-3 h-[300px]">
            <div className="w-[58%] flex-shrink-0 h-full"><BentoCard item={c4} className="h-full" /></div>
            <div className="flex-1 h-full"><BentoCard item={c5} className="h-full" /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <BentoCard item={c1} className="aspect-[3/4]" />
          <BentoCard item={c2} className="aspect-[3/4]" />
          <BentoCard item={c3} className="aspect-[3/4]" />
          <BentoCard item={c4} className="aspect-[3/4]" />
          <BentoCard item={c5} className="col-span-2 aspect-[16/9]" />
        </div>
      </div>
    </section>
  );
}

function CollectionSpotlight() {
  return (
    <section className="py-14 lg:py-20 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 space-y-16 lg:space-y-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          <div className="relative w-full lg:w-[55%] aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden flex-shrink-0">
            <Image src="/img/Wallpanels Interior.webp" alt="Interior Wallpanels — AYD Home Decor" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          </div>
          <div className="w-full lg:w-[45%]">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">Featured Collection</p>
            <h2 className="font-heading text-4xl lg:text-5xl uppercase tracking-wide text-brand-dark mb-6 leading-tight">Interior Wallpanels</h2>
            <p className="font-body text-brand-muted text-base lg:text-lg leading-relaxed mb-8">
              Transform any space with our high-end wallpanel collection. Natural textures and premium finishes designed to create unique environments that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/en/catalog/wallpanels-interior" className="inline-flex items-center justify-center bg-brand-footer text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange transition-colors duration-300">VIEW COLLECTION</a>
              <a href={DEFAULT_WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-brand-border text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors duration-300">QUOTE</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-20 items-center">
          <div className="relative w-full lg:w-[55%] aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden flex-shrink-0">
            <Image src="/img/Láminas de PVC.webp" alt="PVC Sheets — AYD Home Decor" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          </div>
          <div className="w-full lg:w-[45%]">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">Premium Line</p>
            <h2 className="font-heading text-4xl lg:text-5xl uppercase tracking-wide text-brand-dark mb-6 leading-tight">PVC Sheets</h2>
            <p className="font-body text-brand-muted text-base lg:text-lg leading-relaxed mb-8">
              Durability and elegance in perfect harmony. Waterproof, easy to clean and available in a wide range of finishes to suit any decorating style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/en/catalog/laminas-pvc" className="inline-flex items-center justify-center bg-brand-footer text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange transition-colors duration-300">VIEW COLLECTION</a>
              <a href={DEFAULT_WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-brand-border text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors duration-300">QUOTE</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ products }: { products: WCProduct[] }) {
  return (
    <section className="py-20 bg-brand-surface-2">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <SectionHeader
          eyebrow="Most popular"
          title="Featured Products"
          subtitle="Our most sought-after collections by customers in South Florida."
        />
        <div className="flex gap-4 overflow-x-scroll snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0 md:snap-none" style={{ scrollbarWidth: "none" }}>
          {products.map((product) => {
            const img = product.images[0];
            const cat = product.categories[0];
            return (
              <div key={product.slug} className="flex-shrink-0 snap-start w-[72vw] md:w-auto group bg-white border border-brand-border overflow-hidden hover:shadow-[0_4px_24px_rgba(215,118,39,0.12)] transition-shadow duration-300">
                <a href={`/en/product/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-brand-surface">
                    {img ? (
                      <Image src={img.src} alt={img.alt || product.name} fill sizes="(max-width: 768px) 72vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-400" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      <span className="bg-white text-brand-dark font-body text-[10px] uppercase tracking-widest px-4 py-2 font-semibold">View details</span>
                    </div>
                  </div>
                  <div className="px-4 pt-4 pb-2">
                    {cat && <p className="font-body text-[10px] uppercase tracking-widest text-brand-muted mb-1">{cat.name}</p>}
                    <h3 className="font-heading text-base uppercase tracking-wide text-brand-dark">{product.name}</h3>
                  </div>
                </a>
                <div className="px-4 pb-4 pt-2">
                  <a href={waUrl(`Hello, I'd like a quote for: ${product.name}`)} target="_blank" rel="noopener noreferrer" className="block w-full bg-brand-orange text-white text-center text-[10px] font-body font-semibold uppercase tracking-widest py-3 hover:bg-brand-orange-hover transition-colors duration-300">
                    QUOTE →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <a href="/en/catalog" className="inline-flex items-center gap-3 border border-brand-dark text-brand-dark px-10 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange hover:border-brand-orange hover:text-white transition-all duration-300">
            VIEW ALL PRODUCTS
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-stretch border-b border-brand-border">
          <div className="flex-1 py-16 lg:py-24 lg:pr-16 lg:border-r lg:border-brand-border">
            <p className="font-body text-xs uppercase tracking-[0.25em] text-brand-orange mb-5">Start today</p>
            <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-brand-dark leading-[1.08]">
              Ready to<br />
              <span className="text-brand-orange">transform</span><br />
              your space?
            </h2>
          </div>
          <div className="flex-1 lg:flex-none lg:w-[42%] py-16 lg:py-24 lg:pl-16 flex flex-col justify-center gap-6">
            <p className="font-body text-brand-muted text-base leading-relaxed">
              Free quote. Our team guides you in the perfect selection for your project — from concept to installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={DEFAULT_WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 bg-brand-orange text-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange-hover transition-colors duration-300">
                <WhatsAppIcon className="w-4 h-4" />
                Get a free quote
              </a>
              <a href="/en/catalog" className="inline-flex items-center justify-center gap-2 border border-brand-border text-brand-dark px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-dark transition-colors duration-300">
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
  );
}

export default async function EnHomePageEn() {
  const categories = await getCategories({ hide_empty: true }).catch(() => [] as WCCategory[]);
  const pvcCategory = categories.find((c) => c.slug === "laminas-pvc");

  const [featuredProducts, pvcProducts, ...explorerProductArrays] = await Promise.all([
    getProducts({ featured: true, per_page: 8 }).catch(() => [] as WCProduct[]),
    pvcCategory
      ? getProducts({ category: pvcCategory.id, per_page: 4, orderby: "date", order: "desc" }).catch(() => [] as WCProduct[])
      : getProducts({ per_page: 4, orderby: "date", order: "desc" }).catch(() => [] as WCProduct[]),
    ...categories.map((cat) => getProducts({ category: cat.id, per_page: 4 }).catch(() => [] as WCProduct[])),
  ]);

  const displayProducts = featuredProducts.length > 0
    ? featuredProducts
    : await getProducts({ per_page: 8 }).catch(() => [] as WCProduct[]);

  const productsBySlug = Object.fromEntries(categories.map((cat, i) => [cat.slug, explorerProductArrays[i] ?? []]));
  const explorerTabs = categories.map((cat) => ({ slug: cat.slug, label: cat.name }));

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <NewArrivals products={pvcProducts} />
        <ExpertiseSection />
        <CategoryBento categories={categories} />
        <ProductExplorer tabs={explorerTabs} productsBySlug={productsBySlug} locale="en" />
        <CollectionSpotlight />
        <FeaturedProducts products={displayProducts} />
        <ReviewsCarousel />
        <FinalCTA />
      </main>
      <Footer categories={categories} locale="en" />
    </>
  );
}
