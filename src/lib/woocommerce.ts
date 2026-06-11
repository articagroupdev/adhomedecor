// Server-side only — never import in client components

const WC_BASE = `${process.env.WP_URL}/wp-json/wc/v3`;

function authHeader(): string {
  const token = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString("base64");
  return `Basic ${token}`;
}

const requestCache = new Map<string, Promise<any>>();

async function wc<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const url = new URL(`${WC_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }
  const urlStr = url.toString();

  if (requestCache.has(urlStr)) {
    return requestCache.get(urlStr) as Promise<T>;
  }

  const promise = (async () => {
    const res = await fetch(urlStr, {
      headers: { 
        Authorization: authHeader(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(25000),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`WC API ${res.status}: ${endpoint}`);
    }
    return res.json();
  })();

  requestCache.set(urlStr, promise);

  // Remove from cache if the request fails, so it can be retried if needed
  promise.catch(() => {
    requestCache.delete(urlStr);
  });

  return promise as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface WCImage {
  id: number;
  src: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: WCImage | null;
  count: number;
  parent: number;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  description_en: string;
  images: WCImage[];
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  related_ids: number[];
  sku: string;
  status: string;
}

// ── Category queries ───────────────────────────────────────────────────────────

export async function getCategories(opts?: {
  per_page?: number;
  parent?: number;
  hide_empty?: boolean;
}): Promise<WCCategory[]> {
  return wc<WCCategory[]>("/products/categories", {
    per_page: opts?.per_page ?? 100,
    hide_empty: opts?.hide_empty ?? true ? 1 : 0,
    ...(opts?.parent !== undefined ? { parent: opts.parent } : {}),
    orderby: "name",
    order: "asc",
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<WCCategory | null> {
  const cats = await wc<WCCategory[]>("/products/categories", { slug });
  return cats[0] ?? null;
}

// ── Product queries ────────────────────────────────────────────────────────────

export async function getProducts(opts?: {
  per_page?: number;
  page?: number;
  category?: number;
  featured?: boolean;
  orderby?: string;
  order?: string;
  search?: string;
  fields?: string;
}): Promise<WCProduct[]> {
  return wc<WCProduct[]>("/products", {
    per_page: opts?.per_page ?? 12,
    page: opts?.page ?? 1,
    status: "publish",
    ...(opts?.category !== undefined ? { category: opts.category } : {}),
    ...(opts?.featured ? { featured: 1 } : {}),
    ...(opts?.search ? { search: opts.search } : {}),
    ...(opts?.fields ? { _fields: opts.fields } : {}),
    orderby: opts?.orderby ?? "date",
    order: opts?.order ?? "desc",
  });
}

export async function getProductBySlug(
  slug: string
): Promise<WCProduct | null> {
  const products = await wc<WCProduct[]>("/products", { slug, status: "publish" });
  return products[0] ?? null;
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  try {
    return await wc<WCProduct>(`/products/${id}`);
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  ids: number[]
): Promise<WCProduct[]> {
  if (ids.length === 0) return [];
  const subset = ids.slice(0, 4);
  const results = await Promise.all(subset.map((id) => getProductById(id)));
  return results.filter(Boolean) as WCProduct[];
}
