import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/woocommerce";
import EnSearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search — Catalog",
  description: "Search results in the AD Home Decor catalog.",
};

export default async function EnCatalogSearchPage() {
  const categories = await getCategories({ hide_empty: true }).catch(() => []);

  return (
    <>
      <Nav />
      <main>
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="font-body text-brand-muted text-lg">Loading...</p>
          </div>
        }>
          <EnSearchClient />
        </Suspense>
      </main>
      <Footer categories={categories} locale="en" />
    </>
  );
}
