export type Locale = "es" | "en";

export function getLocale(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "es";
}

/** Maps the current pathname to its equivalent in the other locale. */
export function getOtherLocaleUrl(pathname: string): string {
  if (pathname.startsWith("/en")) {
    if (pathname === "/en") return "/";
    const rest = pathname.slice(3); // strips '/en'
    if (rest.startsWith("/catalog/")) return rest.replace("/catalog/", "/catalogo/");
    if (rest === "/catalog") return "/catalogo";
    if (rest.startsWith("/product/")) return rest.replace("/product/", "/producto/");
    if (rest === "/about") return "/nosotros";
    if (rest === "/contact") return "/contacto";
    if (rest === "/faq") return "/faq";
    return "/";
  } else {
    if (pathname === "/") return "/en";
    if (pathname.startsWith("/catalogo/")) return pathname.replace("/catalogo/", "/en/catalog/");
    if (pathname === "/catalogo") return "/en/catalog";
    if (pathname.startsWith("/producto/")) return pathname.replace("/producto/", "/en/product/");
    if (pathname === "/nosotros") return "/en/about";
    if (pathname === "/contacto") return "/en/contact";
    if (pathname === "/faq") return "/en/faq";
    return "/en";
  }
}

/** English display names for WooCommerce category slugs. */
export const EN_CATEGORY_NAMES: Record<string, string> = {
  "wallpanels-interior":    "Interior Wallpanels",
  "wallpanels-exterior":    "Exterior Wallpanels",
  "wallpanel-lego":         "Lego Wallpanel",
  "laminas-de-pvc":         "PVC Sheets",
  "flat-panels":            "Flat Panels",
  "pu-stone-piedra":        "PU Stone",
  "liston-decorativo":      "Decorative Strips",
  "corner-para-wallpanels": "Corner for Wallpanels",
  "sitema-de-luces":        "Lighting System",
  "grama-artificial":       "Artificial Grass",
  "herramientas":           "Tools",
};

/** Converts a Spanish path to its English equivalent (for building links). */
export function toEnPath(href: string): string {
  if (href === "/") return "/en";
  if (href.startsWith("/catalogo/")) return href.replace("/catalogo/", "/en/catalog/");
  if (href === "/catalogo") return "/en/catalog";
  if (href.startsWith("/producto/")) return href.replace("/producto/", "/en/product/");
  if (href === "/nosotros") return "/en/about";
  if (href === "/contacto") return "/en/contact";
  if (href === "/faq") return "/en/faq";
  return href;
}
