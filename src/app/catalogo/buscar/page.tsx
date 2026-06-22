import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/woocommerce";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Búsqueda — Catálogo",
  description: "Resultados de búsqueda en el catálogo de AD Home Decor.",
};

export default async function BuscarPage() {
  const categories = await getCategories({ hide_empty: true }).catch(() => []);

  return (
    <>
      <Nav />
      <main>
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="font-body text-brand-muted text-lg">Cargando...</p>
          </div>
        }>
          <SearchClient />
        </Suspense>
      </main>
      <Footer categories={categories} />
    </>
  );
}
