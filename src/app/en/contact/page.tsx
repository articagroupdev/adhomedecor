import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getCategories } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact us for quotes, technical advice or any questions about our premium wall coverings in Miami, FL.",
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

const contactItems = [
  {
    label: "Phone",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
      </svg>
    ),
    content: (
      <div className="space-y-1">
        <a href="tel:+16452481030" className="font-body text-brand-muted text-sm hover:text-brand-orange transition-colors block">
          +1 (645) 248-1030
        </a>
        <a href="tel:+17869068062" className="font-body text-brand-muted text-sm hover:text-brand-orange transition-colors block">
          +1 (786) 906-8062
        </a>
      </div>
    ),
  },
  {
    label: "Email",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    content: (
      <a href="mailto:manager@aydhomedecor.com" className="font-body text-brand-muted text-sm hover:text-brand-orange transition-colors">
        manager@aydhomedecor.com
      </a>
    ),
  },
  {
    label: "Location",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    content: (
      <p className="font-body text-brand-muted text-sm">
        8524 NW 72nd St,<br />Miami, FL 33166
      </p>
    ),
  },
  {
    label: "Hours",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-brand-orange">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content: (
      <div className="font-body text-brand-muted text-sm space-y-0.5">
        <p>Mon – Sat: 9:00 AM – 5:00 PM</p>
        <p>Sunday: 9:00 AM – 3:00 PM</p>
      </div>
    ),
  },
];

export default async function EnContactPage() {
  const categories = await getCategories({ hide_empty: true }).catch(() => []);

  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="relative bg-brand-footer pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/img/DSC02516-2.webp"
              alt="AD Home Decor contact"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
              <a href="/en" className="font-body text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors duration-200">
                Home
              </a>
              <span className="text-white/25 text-[10px]">/</span>
              <span className="font-body text-[10px] uppercase tracking-widest text-brand-orange">Contact</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.25em] text-brand-orange mb-4">
                  We&apos;re here to help
                </p>
                <h1 className="font-heading text-white text-4xl lg:text-6xl uppercase tracking-wide leading-tight">
                  Let&apos;s talk about your project
                </h1>
              </div>
              <p className="font-body text-white/50 text-sm max-w-xs lg:text-right leading-relaxed pb-1">
                Free quote, personalized advice and response within minutes on WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Main section: info + form */}
        <section className="bg-brand-surface py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

              {/* Left: contact info */}
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">Contact information</p>
                <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark mb-8">
                  Our team is ready
                </h2>
                <p className="font-body text-brand-muted text-base leading-relaxed mb-10">
                  If you have questions about our wall coverings, need technical advice
                  or want to quote a project, we&apos;re here to help.
                </p>

                <div className="space-y-6 mb-10">
                  {contactItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-heading text-brand-dark text-[10px] uppercase tracking-widest mb-1.5">
                          {item.label}
                        </p>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: form */}
              <div>
                <div className="bg-white border border-brand-border p-8 lg:p-10">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-2">Contact form</p>
                  <h2 className="font-heading text-2xl uppercase tracking-wide text-brand-dark mb-8">
                    Send us a message
                  </h2>
                  <ContactForm locale="en" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Map + location */}
        <section className="bg-white border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-orange mb-3">Visit us</p>
                <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-wide text-brand-dark mb-5">
                  Our Showroom in Miami
                </h2>
                <p className="font-body text-brand-muted text-base leading-relaxed mb-8">
                  Visit our store and discover firsthand the wide selection of
                  wall coverings we have for you. Our team will advise you to
                  find the perfect solution for your project.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-brand-orange" />
                    <span className="font-body text-brand-dark text-sm">8524 NW 72nd St, Miami, FL 33166</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-brand-orange" />
                    <span className="font-body text-brand-muted text-sm">Monday – Saturday: 9:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-brand-orange" />
                    <span className="font-body text-brand-muted text-sm">Sunday: 9:00 AM – 3:00 PM</span>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=8524+NW+72nd+St+Miami+FL+33166"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-dark text-brand-dark px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  View on Google Maps →
                </a>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden border border-brand-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.4673862660685!2d-80.35398762462747!3d25.82051657737406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9be8e4d3b89cb%3A0x4e7df3d3f3e4e8a0!2s8524+NW+72nd+St%2C+Miami%2C+FL+33166!5e0!3m2!1ses!2sus!4v1700000000000!5m2!1ses!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AD Home Decor Location"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-brand-footer py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="flex flex-wrap justify-between gap-x-8 gap-y-8">
              {[
                { value: "30+", label: "Years of experience" },
                { value: "4.9★", label: "Google Reviews" },
                { value: "100%", label: "Certified materials" },
                { value: "USA", label: "Nationwide shipping" },
                { value: "24h", label: "Guaranteed response" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="font-heading text-2xl text-brand-orange leading-none">{s.value}</span>
                  <span className="font-body text-white/40 text-[11px] uppercase tracking-widest leading-snug">{s.label}</span>
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
