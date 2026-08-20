"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getOtherLocaleUrl } from "@/lib/i18n";
import WhatsAppLink from "@/components/WhatsAppLink";

// ── Constants ──────────────────────────────────────────────────────────────────

const PHONE = "+1 (645) 248-1030";
const PHONE_TEL = "+16452481030";

const WA_ES = `https://wa.me/16452481030?text=${encodeURIComponent("Hola, me interesa conocer más sobre sus productos")}`;
const WA_EN = `https://wa.me/16452481030?text=${encodeURIComponent("Hello, I'm interested in learning more about your products")}`;

// ── Nav data ───────────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  href: string;
  diamond?: boolean;
  children?: { label: string; href: string }[];
};

const mainNavItemsEs: NavItem[] = [
  {
    label: "Wallpanels",
    href: "/catalogo/wallpanels-interior",
    children: [
      { label: "Wallpanels Interior", href: "/catalogo/wallpanels-interior" },
      { label: "Wallpanels Exterior", href: "/catalogo/wallpanels-exterior" },
      { label: "Wallpanel Lego", href: "/catalogo/wallpanel-lego" },
      { label: "Ver toda la colección", href: "/catalogo" },
    ],
  },
  { label: "Láminas de PVC", href: "/catalogo/laminas-de-pvc" },
  { label: "Flat Panels", href: "/catalogo/flat-panels" },
  { label: "PU Stone – Piedra", href: "/catalogo/pu-stone-piedra" },
  { label: "Listón Decorativo", href: "/catalogo/liston-decorativo" },
  {
    label: "Más",
    href: "/catalogo",
    children: [
      { label: "Corner para Wallpanels", href: "/catalogo/corner-para-wallpanels" },
      { label: "Sistema de Luces", href: "/catalogo/sitema-de-luces" },
      { label: "Grama Artificial", href: "/catalogo/grama-artificial" },
      { label: "Herramientas", href: "/catalogo/herramientas" },
      { label: "Ver todo el catálogo", href: "/catalogo" },
    ],
  },
];

const mainNavItemsEn: NavItem[] = [
  {
    label: "Wallpanels",
    href: "/en/catalog/wallpanels-interior",
    children: [
      { label: "Interior Wallpanels", href: "/en/catalog/wallpanels-interior" },
      { label: "Exterior Wallpanels", href: "/en/catalog/wallpanels-exterior" },
      { label: "Lego Wallpanel", href: "/en/catalog/wallpanel-lego" },
      { label: "View full collection", href: "/en/catalog" },
    ],
  },
  { label: "PVC Sheets", href: "/en/catalog/laminas-de-pvc" },
  { label: "Flat Panels", href: "/en/catalog/flat-panels" },
  { label: "PU Stone", href: "/en/catalog/pu-stone-piedra" },
  { label: "Decorative Strips", href: "/en/catalog/liston-decorativo" },
  {
    label: "More",
    href: "/en/catalog",
    children: [
      { label: "Corner for Wallpanels", href: "/en/catalog/corner-para-wallpanels" },
      { label: "Lighting System", href: "/en/catalog/sitema-de-luces" },
      { label: "Artificial Grass", href: "/en/catalog/grama-artificial" },
      { label: "Tools", href: "/en/catalog/herramientas" },
      { label: "View all catalog", href: "/en/catalog" },
    ],
  },
];

const quickSearchLinksEs = [
  { label: "Wallpanels Interior", href: "/catalogo/wallpanels-interior" },
  { label: "Wallpanels Exterior", href: "/catalogo/wallpanels-exterior" },
  { label: "Wallpanel Lego", href: "/catalogo/wallpanel-lego" },
  { label: "Láminas de PVC", href: "/catalogo/laminas-de-pvc" },
  { label: "Flat Panels", href: "/catalogo/flat-panels" },
  { label: "PU Stone – Piedra", href: "/catalogo/pu-stone-piedra" },
  { label: "Listón Decorativo", href: "/catalogo/liston-decorativo" },
  { label: "Corner para Wallpanels", href: "/catalogo/corner-para-wallpanels" },
  { label: "Grama Artificial", href: "/catalogo/grama-artificial" },
  { label: "Herramientas", href: "/catalogo/herramientas" },
];

const quickSearchLinksEn = [
  { label: "Interior Wallpanels", href: "/en/catalog/wallpanels-interior" },
  { label: "Exterior Wallpanels", href: "/en/catalog/wallpanels-exterior" },
  { label: "Lego Wallpanel", href: "/en/catalog/wallpanel-lego" },
  { label: "PVC Sheets", href: "/en/catalog/laminas-de-pvc" },
  { label: "Flat Panels", href: "/en/catalog/flat-panels" },
  { label: "PU Stone", href: "/en/catalog/pu-stone-piedra" },
  { label: "Decorative Strips", href: "/en/catalog/liston-decorativo" },
  { label: "Corner for Wallpanels", href: "/en/catalog/corner-para-wallpanels" },
  { label: "Artificial Grass", href: "/en/catalog/grama-artificial" },
  { label: "Tools", href: "/en/catalog/herramientas" },
];

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// ── Dropdown item ──────────────────────────────────────────────────────────────

function DropdownItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          className={`flex items-center gap-1 font-body text-sm whitespace-nowrap transition-colors duration-200 hover:text-brand-orange ${
            item.diamond ? "text-brand-orange font-semibold" : "text-brand-dark"
          }`}
        >
          {item.diamond && <span className="text-brand-orange text-[10px]">◆</span>}
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <Link
        href={item.href}
        className="flex items-center gap-1 font-body text-sm whitespace-nowrap text-brand-dark hover:text-brand-orange transition-colors duration-200"
      >
        {item.label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Link>

      {open && (
        <div className="absolute top-full left-0 mt-0 pt-2 z-50">
          <ul className="bg-white border border-brand-border shadow-lg py-2 min-w-[220px]">
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block px-5 py-2.5 font-body text-xs text-brand-dark hover:bg-brand-surface hover:text-brand-orange transition-colors duration-150"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

// ── Mobile accordion item ──────────────────────────────────────────────────────

function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onClose}
          className={`flex items-center gap-2 font-body text-sm py-3.5 border-b border-brand-border transition-colors ${
            item.diamond
              ? "text-brand-orange font-semibold"
              : "text-brand-dark hover:text-brand-orange"
          }`}
        >
          {item.diamond && <span>◆</span>}
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full font-body text-sm text-brand-dark py-3.5 border-b border-brand-border"
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="bg-brand-surface py-1">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className="block px-5 py-2.5 font-body text-xs text-brand-muted hover:text-brand-orange transition-colors"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Main Nav component ─────────────────────────────────────────────────────────

export default function Nav() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "es";
  const switchUrl = getOtherLocaleUrl(pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const waUrl = locale === "en" ? WA_EN : WA_ES;
  const mainNavItems = locale === "en" ? mainNavItemsEn : mainNavItemsEs;
  const quickSearchLinks = locale === "en" ? quickSearchLinksEn : quickSearchLinksEs;

  const utilityLinks = locale === "en"
    ? [{ label: "Catalog", href: "/en/catalog" }, { label: "About", href: "/en/about" }, { label: "FAQ", href: "/en/faq" }, { label: "Contact", href: "/en/contact" }]
    : [{ label: "Catálogo", href: "/catalogo" }, { label: "Nosotros", href: "/nosotros" }, { label: "FAQ", href: "/faq" }, { label: "Contacto", href: "/contacto" }];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    if (searchOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const base = locale === "en" ? "/en/catalog/search" : "/catalogo/buscar";
      window.location.href = `${base}?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50">
      {/* ── Row 1: Promo bar ─────────────────────────────────────────────── */}
      <div className="bg-brand-footer text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between h-9">
            {/* Left — Google rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-3.5 h-3.5 text-[#FBBC05]" />
                ))}
              </div>
              <span className="font-body text-xs text-white/70 tracking-wide">
                4.9 · Google Reviews
              </span>
            </div>

            {/* Right — Social icons */}
            <div className="hidden md:flex items-center gap-3">
              <a href="https://www.instagram.com/adhomedecorusa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/50 hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@aydhomedecor" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/50 hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.82 1.56V6.79a4.85 4.85 0 01-1.05-.1z" />
                </svg>
              </a>
              <WhatsAppLink href={waUrl} aria-label="WhatsApp" className="text-white/50 hover:text-[#25D366] transition-colors duration-200">
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Utility bar ───────────────────────────────────────────── */}
      <div className="hidden lg:block bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between h-10">
            {/* Left: dispatch info */}
            <div className="hidden lg:flex items-center divide-x divide-brand-border">
              <div className="flex items-center gap-1.5 pr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-brand-orange">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="font-body text-xs text-brand-muted">
                  {locale === "en" ? "Shipping across USA" : "Envío a todo USA"}
                </span>
              </div>
              <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-1.5 px-4 text-brand-muted hover:text-brand-dark transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-brand-orange">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                </svg>
                <span className="font-body text-xs">
                  {locale === "en" ? `Need help? ${PHONE}` : `¿Necesitas ayuda? ${PHONE}`}
                </span>
              </a>
            </div>

            {/* Right: utility links */}
            <div className="flex items-center gap-4 ml-auto">
              <nav className="hidden lg:flex items-center divide-x divide-brand-border">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 first:pl-0 font-body text-xs uppercase tracking-widest text-brand-muted hover:text-brand-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Main nav ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center h-[64px]">
            {/* Left — logo */}
            <div className="flex-1 flex items-center">
              <Link href={locale === "en" ? "/en" : "/"} aria-label="AD Home Decor — Inicio">
                <Image
                  src="/img/logo-home-decor.webp"
                  alt="AD Home Decor"
                  width={160}
                  height={56}
                  priority
                  style={{ width: "auto", height: "50px" }}
                />
              </Link>
            </div>

            {/* Center — nav links */}
            <ul className="hidden xl:flex items-center gap-5 flex-shrink-0">
              {mainNavItems.map((item) => (
                <DropdownItem key={item.label} item={item} />
              ))}
            </ul>

            {/* Right — search + icons */}
            <div className="flex-1 flex items-center justify-end gap-1">
              {/* Search icon */}
              <button
                onClick={openSearch}
                className="p-2 text-brand-muted hover:text-brand-dark transition-colors duration-200"
                aria-label={locale === "en" ? "Search products" : "Buscar productos"}
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Language switcher */}
              <div ref={langRef} className="hidden md:block relative">
                <button
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label={locale === "en" ? "Change language" : "Cambiar idioma"}
                  className="flex items-center gap-1.5 border border-brand-border px-2.5 py-1 text-brand-muted hover:border-brand-dark hover:text-brand-dark transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span className="font-body text-xs font-semibold uppercase tracking-widest">
                    {locale === "en" ? "EN" : "ES"}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <ul className="bg-white border border-brand-border shadow-lg py-1 min-w-[140px]">
                      <li>
                        <Link
                          href={locale === "es" ? pathname : switchUrl}
                          onClick={() => setLangOpen(false)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-xs transition-colors duration-150 ${
                            locale === "es"
                              ? "text-brand-dark bg-brand-surface font-semibold"
                              : "text-brand-muted hover:bg-brand-surface hover:text-brand-orange"
                          }`}
                        >
                          <span className="text-base">🇪🇸</span>
                          <span className="uppercase tracking-widest">Español</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={locale === "en" ? pathname : switchUrl}
                          onClick={() => setLangOpen(false)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-xs transition-colors duration-150 ${
                            locale === "en"
                              ? "text-brand-dark bg-brand-surface font-semibold"
                              : "text-brand-muted hover:bg-brand-surface hover:text-brand-orange"
                          }`}
                        >
                          <span className="text-base">🇺🇸</span>
                          <span className="uppercase tracking-widest">English</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Hamburger (< xl) */}
              <button
                onClick={() => setMenuOpen(true)}
                className="xl:hidden p-2 text-brand-dark ml-1"
                aria-label={locale === "en" ? "Open menu" : "Abrir menú"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* ── Mobile side drawer ───────────────────────────────────────────────── */}
    <div
      className={`xl:hidden fixed inset-0 z-[150] bg-black/50 transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={() => setMenuOpen(false)}
      aria-hidden="true"
    />

    <div
      className={`xl:hidden fixed top-0 right-0 h-full w-[300px] bg-white z-[160] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      aria-label={locale === "en" ? "Navigation menu" : "Menú de navegación"}
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border flex-shrink-0">
        <Link href={locale === "en" ? "/en" : "/"} onClick={() => setMenuOpen(false)}>
          <Image
            src="/img/logo-home-decor.webp"
            alt="AD Home Decor"
            width={120}
            height={42}
            style={{ width: "auto", height: "38px" }}
          />
        </Link>
        <button
          onClick={() => setMenuOpen(false)}
          className="p-2 text-brand-muted hover:text-brand-dark transition-colors"
          aria-label={locale === "en" ? "Close menu" : "Cerrar menú"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <ul>
          {mainNavItems.map((item) => (
            <MobileNavItem key={item.label} item={item} onClose={() => setMenuOpen(false)} />
          ))}
        </ul>

        {/* Utility links */}
        <div className="mt-6 pt-6 flex flex-wrap gap-x-5 gap-y-3">
          {utilityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-body text-xs uppercase tracking-widest text-brand-muted hover:text-brand-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language switcher in drawer */}
        <div className="mt-6 pt-4 border-t border-brand-border flex items-center gap-3">
          <Link
            href={locale === "es" ? pathname : switchUrl}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-1.5 font-body text-xs uppercase tracking-widest px-3 py-2 border transition-colors ${
              locale === "es"
                ? "border-brand-orange text-brand-orange bg-brand-orange/5"
                : "border-brand-border text-brand-muted hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            <span className="text-sm">🇪🇸</span> ES
          </Link>
          <Link
            href={locale === "en" ? pathname : switchUrl}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-1.5 font-body text-xs uppercase tracking-widest px-3 py-2 border transition-colors ${
              locale === "en"
                ? "border-brand-orange text-brand-orange bg-brand-orange/5"
                : "border-brand-border text-brand-muted hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            <span className="text-sm">🇺🇸</span> EN
          </Link>
        </div>
      </div>

      {/* CTAs at bottom */}
      <div className="flex-shrink-0 px-6 py-6 border-t border-brand-border flex flex-col gap-3">
        <WhatsAppLink
          href={waUrl}
          className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-widest"
        >
          <WhatsAppIcon className="w-4 h-4" />
          {locale === "en" ? "Quote on WhatsApp" : "Cotizar por WhatsApp"}
        </WhatsAppLink>
        <a
          href={`tel:${PHONE_TEL}`}
          className="flex items-center justify-center gap-2.5 border border-brand-border text-brand-dark px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
          </svg>
          {PHONE}
        </a>
      </div>
    </div>

    {/* ── Search Modal ─────────────────────────────────────────────────────── */}
    {searchOpen && (
      <div
        className="fixed inset-0 z-[200] flex items-start justify-center px-4"
        role="dialog"
        aria-modal="true"
        aria-label={locale === "en" ? "Search products" : "Buscar productos"}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSearch} />

        <div className="relative z-10 w-full max-w-2xl bg-white shadow-2xl mt-[108px] animate-[fadeDown_0.2s_ease-out]">
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 pt-8 pb-0">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-orange">
              {locale === "en" ? "Search the catalog" : "Buscar en el catálogo"}
            </p>
            <button onClick={closeSearch} className="p-1.5 text-brand-muted hover:text-brand-dark transition-colors" aria-label={locale === "en" ? "Close search" : "Cerrar búsqueda"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="px-8 pt-5 pb-6 border-b border-brand-border">
            <div className="flex items-center gap-4">
              <SearchIcon className="w-6 h-6 text-brand-muted flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "en" ? "E.g. wallpanel, PVC sheet, stone..." : "Ej. wallpanel, lámina PVC, piedra..."}
                className="flex-1 font-heading text-2xl text-brand-dark bg-transparent outline-none placeholder:text-transparent sm:placeholder:text-stone-300 tracking-tight"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="p-1 text-brand-muted hover:text-brand-dark transition-colors flex-shrink-0" aria-label={locale === "en" ? "Clear" : "Limpiar"}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Quick links */}
          <div className="px-8 py-6">
            <p className="font-body text-[10px] uppercase tracking-widest text-brand-muted mb-4">
              {locale === "en" ? "Popular collections" : "Colecciones populares"}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSearchLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-xs text-brand-dark border border-brand-border px-4 py-2 hover:border-brand-orange hover:text-brand-orange transition-colors duration-150"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-8 pb-6 flex items-center gap-4 text-brand-muted">
            <span className="font-body text-[10px] uppercase tracking-widest">
              {locale === "en" ? "Press" : "Presiona"}{" "}
              <kbd className="border border-brand-border px-1.5 py-0.5 text-[10px] font-body rounded">Enter</kbd>{" "}
              {locale === "en" ? "to search" : "para buscar"}
            </span>
            <span className="font-body text-[10px] uppercase tracking-widest">
              <kbd className="border border-brand-border px-1.5 py-0.5 text-[10px] font-body rounded">Esc</kbd>{" "}
              {locale === "en" ? "to close" : "para cerrar"}
            </span>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
