import type { Metadata } from "next";
import { Alata, DM_Sans } from "next/font/google";
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
  title: {
    default: "AD Home Decor",
    template: "%s — AD Home Decor",
  },
  description:
    "La solución integral en decoración de tus espacios. Especialistas en Wall Panels, Láminas de PVC, Flat Panels, PU Stone y Listones Decorativos. Miami, FL.",
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
      <body className="min-h-full flex flex-col font-body text-brand-dark bg-white">
        {children}
      </body>
    </html>
  );
}
