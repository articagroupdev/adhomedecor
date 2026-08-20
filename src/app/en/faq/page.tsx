import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FaqAccordion, { type FaqGroup } from "@/components/FaqAccordion";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getCategories, type WCCategory } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to your questions about PVC panels, wall panels, installation, shipping and more. AD Home Decor · Miami, Florida.",
};

const waUrl = (msg: string) =>
  `https://wa.me/16452481030?text=${encodeURIComponent(msg)}`;

const DEFAULT_WA = waUrl("Hello, I have a question about your products");

const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "Product & Materials",
    items: [
      {
        q: "Are the PVC panels 100% waterproof?",
        a: "Yes, completely. Our PVC panels are ideal for humid environments like bathrooms and kitchens, as they prevent the growth of mold and mildew.",
      },
      {
        q: "What kind of maintenance do they require?",
        a: "Virtually none. They only need occasional cleaning with a damp cloth. They are stain-resistant and do not discolor over time.",
      },
      {
        q: "Are they fire-resistant?",
        a: "Yes. Our panels are manufactured with fire-retardant properties, providing an additional layer of safety for your home or business.",
      },
      {
        q: "Are the PVC panels safe and non-toxic?",
        a: "Absolutely safe. Our panels are manufactured under strict quality controls and do not emit toxic gases. They are ideal for residential and commercial interiors, providing a safe environment for the whole family.",
      },
    ],
  },
  {
    category: "Installation & Finishes",
    items: [
      {
        q: "How easy is the installation?",
        a: "Installation is fast and clean. It requires no major construction work. The panels are designed to be lightweight and can be placed directly on the existing wall.",
      },
      {
        q: "Are PVC panels a more affordable option than marble or ceramic?",
        a: "Yes, considerably. PVC is not only more affordable in the initial purchase, but the greatest savings come from installation, which is faster and less costly as it requires no specialized labor or wet construction preparation.",
      },
      {
        q: "How faithful is the marble-effect finish to natural stone?",
        a: "Fidelity is our priority. We use high-definition printing technology to replicate the veins and textures of quarry stone in great detail. The finish is smooth and glossy (or matte), offering a visual luxury identical to real marble.",
      },
      {
        q: "Can I install the panels over existing tiles?",
        a: "Yes, that is one of the greatest advantages. Our panels can be fixed directly over tiles, brick, or existing paint, as long as the surface is clean and dry. This avoids the costly and messy demolition process.",
      },
    ],
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function EnFaqPage() {
  const categories = await getCategories({ hide_empty: true }).catch(
    () => [] as WCCategory[]
  );

  const totalQuestions = FAQ_GROUPS.reduce((s, g) => s + g.items.length, 0);

  return (
    <>
      <Nav />
      <main>
        <section className="relative bg-brand-footer pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/img/IMG_8084.webp"
              alt="AD Home Decor showroom"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
              <a
                href="/en"
                className="font-body text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors duration-200"
              >
                Home
              </a>
              <span className="text-white/25 text-[10px]">/</span>
              <span className="font-body text-[10px] uppercase tracking-widest text-brand-orange">
                FAQ
              </span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">
                  Help Center
                </p>
                <h1 className="font-heading text-4xl lg:text-6xl uppercase tracking-wide text-white leading-tight">
                  Frequently<br className="hidden lg:block" /> Asked Questions
                </h1>
              </div>
              <p className="font-body text-white/50 text-sm max-w-xs lg:text-right leading-relaxed pb-1">
                {totalQuestions} answers to the most common questions about our products and services.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20 items-start">

              <aside className="hidden lg:block sticky top-28">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-4">
                  Categories
                </p>
                <nav className="space-y-1">
                  {FAQ_GROUPS.map((group) => (
                    <a
                      key={group.category}
                      href={`#${group.category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block font-body text-sm text-brand-muted hover:text-brand-orange transition-colors duration-200 py-1.5 border-l-2 border-transparent hover:border-brand-orange pl-3"
                    >
                      {group.category}
                    </a>
                  ))}
                </nav>

                <div className="mt-10 pt-8 border-t border-brand-border">
                  <p className="font-body text-xs text-brand-muted leading-relaxed mb-4">
                    Can&apos;t find your answer?
                  </p>
                  <WhatsAppLink
                    href={DEFAULT_WA}
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-body text-[10px] font-semibold uppercase tracking-widest px-4 py-2.5 hover:bg-[#1da851] transition-colors duration-200"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    Message us
                  </WhatsAppLink>
                </div>
              </aside>

              <FaqAccordion groups={FAQ_GROUPS} />
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-surface border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-4">
                More questions?
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark mb-4">
                Chat with us on WhatsApp
              </h2>
              <p className="font-body text-brand-muted text-base leading-relaxed mb-8">
                Our team responds within 24 hours. Tell us about your project and we&apos;ll advise you with no commitment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppLink
                  href={DEFAULT_WA}
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Send a message
                </WhatsAppLink>
                <a
                  href="/en/catalog"
                  className="inline-flex items-center gap-3 border border-brand-border text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors duration-300"
                >
                  View catalog →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer categories={categories} locale="en" />
    </>
  );
}
