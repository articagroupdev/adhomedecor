import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AYD Home Decor",
    template: "%s — AYD Home Decor",
  },
  description:
    "Your complete solution for home decor and wall coverings. Specialists in Wall Panels, PVC Sheets, Flat Panels, PU Stone and Decorative Strips. Miami, FL.",
  openGraph: {
    siteName: "AYD Home Decor",
    title: "AYD Home Decor — Wall Coverings Specialists, Miami FL",
    description:
      "Your complete solution for home decor and wall coverings. Specialists in Wall Panels, PVC Sheets, Flat Panels and PU Stone. Miami, Florida.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/img/productos.webp",
        width: 1200,
        height: 630,
        alt: "AYD Home Decor — Premium Wall Coverings Miami FL",
      },
    ],
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}
