import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet AYD Home Decor, specialists in premium wall coverings in Miami, Florida. Our mission, vision and values.",
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

export default async function EnAboutPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/img/DSC02556.webp"
              alt="AYD Home Decor showroom"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 w-full pt-32 lg:pt-36">
            <p className="font-body text-white/40 text-xs uppercase tracking-widest">
              <a href="/en" className="hover:text-white transition-colors duration-200">Home</a>
              <span className="mx-2">·</span>
              <span className="text-white/70">About Us</span>
            </p>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 w-full pb-20">
            <div className="max-w-3xl">
              <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight mb-0">
                Constant innovation and the highest quality standard in wall coverings
              </h1>
            </div>
          </div>

          <div className="relative z-10 pb-10 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-white/35">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
              <span className="font-body text-[10px] uppercase tracking-widest">Scroll</span>
            </div>
          </div>
        </section>

        {/* Story 01 */}
        <section className="bg-brand-footer text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div>
                <p className="font-body text-white/25 text-sm tracking-widest mb-8">01</p>
                <h2 className="font-heading text-2xl lg:text-3xl xl:text-4xl leading-snug mb-6">
                  Passion for interior design and innovation in every space
                </h2>
                <p className="font-body text-white/55 text-[15px] leading-relaxed mb-8 max-w-md">
                  AYD Home Decor was born from the conviction that every home deserves the best finishes.
                  We are specialists in selecting the finest wall coverings to offer solutions that combine
                  luxury, functionality and durability in every project in Miami, Florida.
                </p>
                <a
                  href="/en/catalog"
                  className="font-body text-sm text-white/70 border-b border-white/25 hover:text-white hover:border-white pb-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  View our products →
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src="/img/DXCUeSNjpRI_3.webp" alt="AYD Home Decor" fill className="object-cover" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden mt-10">
                  <Image src="/img/DXCUeSNjpRI_6.webp" alt="AYD Home Decor" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story 02 */}
        <section className="bg-brand-footer text-white border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="relative aspect-video lg:aspect-[4/3] overflow-hidden order-2 lg:order-1">
                <Image src="/img/DXCUeSNjpRI_17.webp" alt="AYD Home Decor" fill className="object-cover" />
              </div>
              <div className="order-1 lg:order-2">
                <p className="font-body text-white/25 text-sm tracking-widest mb-8">02</p>
                <h2 className="font-heading text-2xl lg:text-3xl xl:text-4xl leading-snug mb-6">
                  The highest quality materials with luxury finishes
                </h2>
                <p className="font-body text-white/55 text-[15px] leading-relaxed mb-8 max-w-md">
                  We are passionate about finding and offering only top-quality materials.
                  Our PVC panels and sheets feature premium finishes, are 100% waterproof
                  and have the durability to transform any space for years to come.
                </p>
                <a
                  href="/en/catalog"
                  className="font-body text-sm text-white/70 border-b border-white/25 hover:text-white hover:border-white pb-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  Explore materials →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Story 03 */}
        <section className="bg-brand-footer text-white border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div>
                <p className="font-body text-white/25 text-sm tracking-widest mb-8">03</p>
                <h2 className="font-heading text-2xl lg:text-3xl xl:text-4xl leading-snug mb-6">
                  Fast and affordable installation for any project
                </h2>
                <p className="font-body text-white/55 text-[15px] leading-relaxed mb-8 max-w-md">
                  We believe renovating your home shouldn&apos;t be complicated. Our products are designed
                  for simple DIY installation — no major construction needed.
                  Transforming your spaces has never been so easy and affordable.
                </p>
                <a
                  href={waUrl("Hello, I'd like more information about product installation")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/70 border-b border-white/25 hover:text-white hover:border-white pb-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  Consult an expert →
                </a>
              </div>
              <div className="relative aspect-video lg:aspect-[4/3] overflow-hidden">
                <Image src="/img/DXCUeSNjpRI_18.webp" alt="AYD Home Decor" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Location / Showroom */}
        <section className="py-20 lg:py-28 bg-brand-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

              <div className="overflow-hidden w-full aspect-[3/4] lg:aspect-[4/5]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/img/Showroom.mp4" type="video/mp4" />
                </video>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">Visit us</p>
                <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark mb-5">
                  Our Showroom in Miami
                </h2>
                <p className="font-body text-brand-muted text-base leading-relaxed mb-10">
                  Visit our Miami store and discover firsthand the wide selection of
                  wall coverings we have for you. Our team is ready to advise you and
                  help you find the perfect solution for your project.
                </p>

                <div className="space-y-6 mb-10">
                  {[
                    {
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      ),
                      label: "Address",
                      content: <p className="font-body text-brand-muted text-sm">8524 NW 72nd St, Miami, FL 33166</p>,
                    },
                    {
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      label: "Hours",
                      content: (
                        <div className="font-body text-brand-muted text-sm space-y-0.5">
                          <p>Mon – Sat: 9:00 AM – 5:00 PM</p>
                          <p>Sunday: 9:00 AM – 3:00 PM</p>
                        </div>
                      ),
                    },
                    {
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                        </svg>
                      ),
                      label: "Phone",
                      content: (
                        <div className="flex flex-col gap-0.5">
                          <a href="tel:+16452481030" className="font-body text-brand-muted text-sm hover:text-brand-orange transition-colors">+1 (645) 248-1030</a>
                          <a href="tel:+17869068062" className="font-body text-brand-muted text-sm hover:text-brand-orange transition-colors">+1 (786) 906-8062</a>
                        </div>
                      ),
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-heading text-brand-dark text-xs uppercase tracking-wide mb-1.5">{item.label}</p>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://maps.google.com/?q=8524+NW+72nd+St+Miami+FL+33166"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-brand-dark text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-300"
                  >
                    View on map →
                  </a>
                  <a
                    href={waUrl("Hello, I'd like to schedule a showroom visit")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange-hover transition-colors duration-300"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Schedule a visit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="text-center mb-14">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">Our pillars</p>
              <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark">
                Our Purpose & Aspiration
              </h2>
              <p className="mt-4 font-body text-brand-muted text-base max-w-xl mx-auto leading-relaxed">
                Turning ordinary spaces into design masterpieces, leading the wall covering market in South Florida.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  num: "01",
                  title: "100% Waterproof",
                  desc: "All our products are completely waterproof, ideal for bathrooms, kitchens and outdoor areas.",
                },
                {
                  num: "02",
                  title: "Premium Finish",
                  desc: "Luxury designs that elevate any space, with textures and finishes of the highest level.",
                },
                {
                  num: "03",
                  title: "Fast Installation",
                  desc: "Easy DIY installation systems that allow you to renovate spaces in hours, with no major construction.",
                },
                {
                  num: "04",
                  title: "Strength & Durability",
                  desc: "High-durability materials that maintain their impeccable appearance under daily use and over time.",
                },
              ].map((v) => (
                <div
                  key={v.num}
                  className="border border-brand-border p-7 hover:border-brand-orange/40 hover:shadow-[0_4px_24px_rgba(215,118,39,0.08)] transition-all duration-300"
                >
                  <p className="font-body text-brand-orange/60 text-xs uppercase tracking-widest mb-5">{v.num}</p>
                  <h3 className="font-heading text-brand-dark text-sm uppercase tracking-wide mb-3 leading-snug">{v.title}</h3>
                  <p className="font-body text-brand-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <ReviewsCarousel locale="en" />

        {/* Final CTA */}
        <section className="py-24 bg-brand-surface border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">Contact us</p>
            <h2 className="font-heading text-3xl sm:text-4xl xl:text-5xl uppercase tracking-tight text-brand-dark leading-[1.08] mb-6">
              Ready to transform<br className="hidden sm:block" /> your home?
            </h2>
            <p className="font-body text-brand-muted text-base max-w-xl mx-auto leading-relaxed mb-10">
              Get a free quote from our experts and discover how to bring luxury design to every corner of your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={waUrl("Hello, I'd like to know more about your products")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-orange text-white px-10 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-orange-hover transition-colors duration-300"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Quote on WhatsApp
              </a>
              <a
                href="/en/catalog"
                className="inline-flex items-center justify-center gap-2.5 border border-brand-dark text-brand-dark px-10 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-300"
              >
                View catalog →
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer categories={categories} locale="en" />
    </>
  );
}
