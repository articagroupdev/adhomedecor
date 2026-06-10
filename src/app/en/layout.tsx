import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AD Home Decor",
    template: "%s — AD Home Decor",
  },
  description:
    "Your complete solution for home decor and wall coverings. Specialists in Wall Panels, PVC Sheets, Flat Panels, PU Stone and Decorative Strips. Miami, FL.",
  openGraph: {
    siteName: "AD Home Decor",
    title: "AD Home Decor — Wall Coverings Specialists, Miami FL",
    description:
      "Your complete solution for home decor and wall coverings. Specialists in Wall Panels, PVC Sheets, Flat Panels and PU Stone. Miami, Florida.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/img/logo-home-decor.webp",
        alt: "AD Home Decor — Premium Wall Coverings Miami FL",
      },
    ],
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}
