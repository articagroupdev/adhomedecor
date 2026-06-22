import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/woocommerce";

export const dynamic = "force-static";

const BASE = "https://aydhomedecor.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories({ hide_empty: true }).catch(() => []),
    getProducts({ per_page: 100 }).catch(() => []),
  ]);

  const staticEs = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/catalogo`, priority: 0.9 },
    { url: `${BASE}/nosotros`, priority: 0.7 },
    { url: `${BASE}/faq`, priority: 0.6 },
    { url: `${BASE}/contacto`, priority: 0.6 },
  ];

  const staticEn = [
    { url: `${BASE}/en`, priority: 1.0 },
    { url: `${BASE}/en/catalog`, priority: 0.9 },
    { url: `${BASE}/en/about`, priority: 0.7 },
    { url: `${BASE}/en/faq`, priority: 0.6 },
    { url: `${BASE}/en/contact`, priority: 0.6 },
  ];

  const categoryEs = categories.map((c) => ({
    url: `${BASE}/catalogo/${c.slug}`,
    priority: 0.8,
  }));

  const categoryEn = categories.map((c) => ({
    url: `${BASE}/en/catalog/${c.slug}`,
    priority: 0.8,
  }));

  const productEs = products.map((p) => ({
    url: `${BASE}/producto/${p.slug}`,
    priority: 0.7,
  }));

  const productEn = products.map((p) => ({
    url: `${BASE}/en/product/${p.slug}`,
    priority: 0.7,
  }));

  const now = new Date();
  const all = [
    ...staticEs,
    ...staticEn,
    ...categoryEs,
    ...categoryEn,
    ...productEs,
    ...productEn,
  ];

  return all.map((entry) => ({ ...entry, lastModified: now }));
}
