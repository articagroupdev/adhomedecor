import Image from "next/image";
import type { WCCategory } from "@/lib/woocommerce";
import { EN_CATEGORY_NAMES } from "@/lib/i18n";

const WA = `https://wa.me/16452481030?text=${encodeURIComponent("Hola, me interesa conocer más sobre sus productos")}`;

const navLinksEs = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contacto" },
];

const navLinksEn = [
  { label: "Home", href: "/en" },
  { label: "About", href: "/en/about" },
  { label: "Catalog", href: "/en/catalog" },
  { label: "FAQ", href: "/en/faq" },
  { label: "Contact", href: "/en/contact" },
];

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer({ categories, locale = "es" }: { categories: WCCategory[]; locale?: string }) {
  const navLinks = locale === "en" ? navLinksEn : navLinksEs;
  const catBase = locale === "en" ? "/en/catalog" : "/catalogo";

  return (
    <footer className="bg-brand-footer text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div>
            <div className="mb-5">
              <Image
                src="/img/logo-home-decor.webp"
                alt="AD Home Decor"
                width={140}
                height={56}
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="font-body text-white/55 text-sm leading-relaxed mb-6">
              {locale === "en"
                ? "AD HOME DECOR is your specialist in premium wall panels and PVC sheets."
                : "AD HOME DECOR es su especialista en paneles de pared y láminas de PVC de alta calidad."}
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/adhomedecorusa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/55 hover:border-brand-orange hover:text-brand-orange transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@aydhomedecor" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/55 hover:border-brand-orange hover:text-brand-orange transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.82 1.56V6.79a4.85 4.85 0 01-1.05-.1z" />
                </svg>
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/55 hover:border-[#25D366] hover:text-[#25D366] transition-colors duration-300">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-xs uppercase tracking-widest text-white mb-6">
              {locale === "en" ? "Navigation" : "Navegación"}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-xs uppercase tracking-widest text-white mb-6">
              {locale === "en" ? "Categories" : "Categorías"}
            </h3>
            <ul className="space-y-3">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <a href={`${catBase}/${cat.slug}`} className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200">
                    {locale === "en" ? (EN_CATEGORY_NAMES[cat.slug] ?? cat.name) : cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xs uppercase tracking-widest text-white mb-6">
              {locale === "en" ? "Contact" : "Contacto"}
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                </svg>
                <div className="flex flex-col gap-1">
                  <a href="tel:+16452481030" className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200">+1 (645) 248-1030</a>
                  <a href="tel:+17869068062" className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200">+1 (786) 906-8062</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:manager@aydhomedecor.com" className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200">manager@aydhomedecor.com</a>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="font-body text-sm text-white/55 leading-relaxed">8524 NW 72nd St<br />Miami, FL 33166</p>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-body text-sm text-white/55 leading-relaxed">
                  {locale === "en" ? (
                    <>
                      <p>Mon–Sat: 9:00am – 5:00pm</p>
                      <p>Sun: 9:00am – 3:00pm</p>
                    </>
                  ) : (
                    <>
                      <p>Lun–Sáb: 9:00am – 5:00pm</p>
                      <p>Dom: 9:00am – 3:00pm</p>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="font-body text-[10px] text-white/35 uppercase tracking-widest">
            {locale === "en"
              ? "Copyright © 2026, AD HOME DECOR. All rights reserved."
              : "Copyright © 2026, AD HOME DECOR. Todos los derechos reservados."}
          </p>
        </div>
      </div>
    </footer>
  );
}
