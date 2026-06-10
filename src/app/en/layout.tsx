import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AYD Home Decor",
    template: "%s — AYD Home Decor",
  },
  description:
    "Your complete solution for home decor and wall coverings. Specialists in Wall Panels, PVC Sheets, Flat Panels, PU Stone and Decorative Strips. Miami, FL.",
  openGraph: {
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}
