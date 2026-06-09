import type { Metadata } from "next";
import { Alata, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
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
    title: "AD Home Decor",
    description:
      "Especialistas en revestimientos modernos para interiores y exteriores. Miami, Florida.",
    locale: "es_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") ?? "es";

  return (
    <html
      lang={locale}
      className={`${alata.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-brand-dark bg-white">
        {children}
      </body>
    </html>
  );
}
