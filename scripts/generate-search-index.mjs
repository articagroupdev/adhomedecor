import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const WP_URL = process.env.WP_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WP_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.error("ERROR: Missing WP_URL, WC_CONSUMER_KEY or WC_CONSUMER_SECRET in .env.local");
  process.exit(1);
}

const WC_BASE = `${WP_URL}/wp-json/wc/v3`;
const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64");
const HEADERS = {
  Authorization: `Basic ${auth}`,
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

async function fetchWC(endpoint, params = {}) {
  const url = new URL(`${WC_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await new Promise(r => setTimeout(r, attempt * 2000));
      const res = await fetch(url.toString(), {
        headers: HEADERS,
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`WC API ${res.status} ${endpoint}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      console.warn(`  attempt ${attempt + 1} failed: ${e.message}`);
    }
  }
  throw lastErr;
}

async function fetchAllPages(endpoint, baseParams = {}) {
  const all = [];
  let page = 1;
  while (true) {
    const items = await fetchWC(endpoint, { ...baseParams, per_page: 100, page });
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    console.log(`  ${endpoint} page ${page}: ${items.length} items`);
    if (items.length < 100) break;
    page++;
  }
  return all;
}

async function main() {
  const dataDir = resolve(process.cwd(), "src/data");
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log("\nFetching categories...");
  const categories = await fetchAllPages("/products/categories", {
    hide_empty: 0,
    orderby: "name",
    order: "asc",
  });
  writeFileSync(resolve(dataDir, "wc-categories.json"), JSON.stringify(categories));
  console.log(`  ✓ ${categories.length} categories → src/data/wc-categories.json`);

  // ── Products ────────────────────────────────────────────────────────────────
  console.log("\nFetching products...");
  const products = await fetchAllPages("/products", { status: "publish" });
  writeFileSync(resolve(dataDir, "wc-products.json"), JSON.stringify(products));
  console.log(`  ✓ ${products.length} products → src/data/wc-products.json`);

  // ── Search index (minimal fields for client-side search) ────────────────────
  const searchIndex = products.map((p) => ({
    name: p.name ?? "",
    slug: p.slug ?? "",
    image: p.images?.[0]
      ? { src: p.images[0].src, alt: p.images[0].alt || p.name || "" }
      : null,
    category: p.categories?.[0]
      ? { name: p.categories[0].name, slug: p.categories[0].slug }
      : null,
  }));
  writeFileSync(resolve(process.cwd(), "public/search-data.json"), JSON.stringify(searchIndex));
  console.log(`  ✓ ${searchIndex.length} products → public/search-data.json`);

  console.log("\nPrebuild complete.\n");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
