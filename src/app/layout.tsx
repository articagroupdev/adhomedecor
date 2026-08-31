import type { Metadata } from "next";
import { Alata, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aydhomedecor.com"),
  verification: {
    google: "TRBkJRny3yqb8x-rdf_WwVZnlCn4fRtotcI3q7Wy4Rk",
  },
  title: {
    default: "AD Home Decor",
    template: "%s — AD Home Decor",
  },
  description:
    "La solución integral en decoración de tus espacios. Especialistas en Wall Panels, Láminas de PVC, Flat Panels, PU Stone y Listones Decorativos. Miami, FL.",
  keywords: [
    "wall panels Miami",
    "láminas de PVC Miami",
    "flat panels decorativos",
    "PU stone revestimiento",
    "listones decorativos",
    "revestimientos interiores Miami",
    "AD Home Decor",
    "decoración de interiores Miami",
  ],
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
  openGraph: {
    siteName: "AD Home Decor",
    title: "AD Home Decor — Especialistas en Revestimientos, Miami FL",
    description:
      "La solución integral en decoración de tus espacios. Especialistas en Wall Panels, Láminas de PVC, Flat Panels y PU Stone. Miami, Florida.",
    locale: "es_US",
    type: "website",
    images: [
      {
        url: "/img/logo-home-decor.webp",
        alt: "AD Home Decor — Revestimientos premium Miami FL",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://aydhomedecor.com/#organization",
      "name": "AD Home Decor",
      "url": "https://aydhomedecor.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aydhomedecor.com/img/logo-home-decor.webp",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-645-248-1030",
        "contactType": "customer service",
        "availableLanguage": ["English", "Spanish"],
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "8524 NW 72nd St",
        "addressLocality": "Miami",
        "addressRegion": "FL",
        "postalCode": "33166",
        "addressCountry": "US",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://aydhomedecor.com/#website",
      "url": "https://aydhomedecor.com",
      "name": "AD Home Decor",
      "description":
        "Especialistas en revestimientos premium: Wall Panels, Láminas de PVC, Flat Panels y PU Stone. Miami, FL.",
      "publisher": { "@id": "https://aydhomedecor.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate":
            "https://aydhomedecor.com/catalogo/buscar?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteLinksSearchBox",
      "url": "https://aydhomedecor.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target":
          "https://aydhomedecor.com/catalogo/buscar?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${alata.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google tag bootstrap — plain inline script so it runs during HTML
            parse, before hydration. This guarantees window.gtag is a function
            the instant any click handler needs it; events queue in dataLayer
            until gtag.js finishes loading. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17865925990');`,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17865925990"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-body text-brand-dark bg-white">
        {children}
      </body>
    </html>
  );
}
