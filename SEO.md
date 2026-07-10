# SEO — AD Home Decor

Guía de todas las configuraciones aplicadas para indexación y sitelinks en Google.

---

## Archivos clave

### 1. `src/app/layout.tsx` — Base de todo el SEO

**Metadata global** (genera los `<meta>` tags en cada página):
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://aydhomedecor.com"), // ← CRÍTICO: URL base correcta
  verification: { google: "TRBkJRny3yqb8x-rdf_WwVZnlCn4fRtotcI3q7Wy4Rk" },
  title: { default: "AD Home Decor", template: "%s — AD Home Decor" },
  description: "La solución integral en decoración...",
  openGraph: { siteName: "AD Home Decor", ... },
};
```

**Structured Data JSON-LD** (le dice a Google quién es el negocio):
```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",        // Nombre, dirección, teléfono, logo
      "name": "AD Home Decor",
      "telephone": "+1-645-248-1030",
      "address": { "addressLocality": "Miami", "addressRegion": "FL" },
    },
    {
      "@type": "WebSite",             // Nombre del sitio + búsqueda interna
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://aydhomedecor.com/catalogo/buscar?q={search_term_string}",
      },
    },
    {
      "@type": "SiteLinksSearchBox",  // Activa el cuadro de búsqueda en resultados
    },
  ],
};
```

> **Por qué importa:** `Organization` alimenta el panel de conocimiento de Google.
> `WebSite` + `SiteLinksSearchBox` son los que habilitan los sub-enlaces (Catálogo,
> Nosotros, etc.) bajo el resultado principal.

---

### 2. `src/app/sitemap.ts` — Descubrimiento de páginas

Next.js genera `/sitemap.xml` automáticamente al buildear. Incluye:
- Páginas estáticas ES y EN (`/`, `/catalogo`, `/nosotros`, `/faq`, `/contacto`)
- Páginas de categoría (`/catalogo/laminas-de-pvc`, etc.)
- Páginas de producto (`/producto/[slug]`)
- Equivalentes en inglés (`/en/...`)

```typescript
export const dynamic = "force-static"; // ← Requerido para output: export
```

> **Por qué importa:** Sin sitemap, Google descubre páginas solo siguiendo enlaces.
> Con sitemap, indexa todas las páginas aunque no tengan links entrantes.

---

### 3. `public/robots.txt` — Instrucciones al crawler

```
User-agent: *
Allow: /
Disallow: /wp-admin/

Sitemap: https://aydhomedecor.com/sitemap.xml
```

> **Por qué importa:** `Disallow: /wp-admin/` evita que Google pierda presupuesto
> de rastreo en el backend de WordPress. La línea `Sitemap:` le dice a cualquier
> crawler dónde encontrar el mapa del sitio sin necesidad de Search Console.

---

### 4. `src/app/[page]/page.tsx` — Metadata por página

Cada página exporta su propio metadata para título y descripción únicos:

```typescript
// Ejemplo: src/app/catalogo/[slug]/page.tsx
export async function generateMetadata({ params }) {
  return {
    title: cat.name,           // "Láminas de PVC" → aparece en la pestaña y en Google
    description: cat.description,
  };
}
```

> **Por qué importa:** Google usa el `<title>` y `<meta description>` como el
> texto que aparece en los resultados de búsqueda. Cada página debe tener uno único.

---

## Flujo completo al hacer push

```
git push → GitHub Actions
  ↓
npm run build (genera src/data/*.json desde WooCommerce)
  ↓
npx next build → genera out/ con:
  • index.html (con JSON-LD + meta tags)
  • sitemap.xml (todas las URLs)
  • robots.txt
  • HTML estático de cada página
  ↓
lftp → sube out/ a public_html/ en el hosting
  ↓
Google Crawler (próxima visita):
  robots.txt → qué rastrear
  sitemap.xml → qué páginas existen
  <head> de cada página → título, descripción, og:image
  JSON-LD → estructura del negocio, sitelinks, búsqueda
```

---

## Lo que hace Google automáticamente (no controlable)

| Elemento | Cómo lo influencias desde el código |
|----------|-------------------------------------|
| Aparecer en resultados | Sitemap enviado + páginas sin `noindex` |
| Sitelinks (sub-enlaces) | `SiteLinksSearchBox` schema + navegación clara |
| Panel de conocimiento | `Organization` schema con nombre, dirección, teléfono |
| Cuadro de búsqueda en Google | `SearchAction` en `WebSite` schema |
| Posición en el ranking | Títulos únicos, descripciones relevantes, velocidad del sitio |

> Los sitelinks pueden tardar **2-8 semanas** en aparecer en sitios nuevos.
> Google los genera cuando el sitio tiene suficiente tráfico e historial.

---

## Acciones manuales (solo una vez)

1. ✅ Verificar sitio en **Google Search Console** (meta tag en `layout.tsx`)
2. ✅ Enviar `sitemap.xml` en Search Console → Sitemaps
3. ✅ Solicitar indexación de homepage en Search Console → Inspección de URLs

Todo lo demás es automático desde el código.

---

## Checklist de verificación

- [ ] `metadataBase` apunta a `https://aydhomedecor.com` (no a Vercel u otro dominio)
- [ ] Cada `page.tsx` tiene `title` y `description` únicos
- [ ] `sitemap.ts` tiene `export const dynamic = "force-static"`
- [ ] `robots.txt` tiene la línea `Sitemap: https://aydhomedecor.com/sitemap.xml`
- [ ] JSON-LD incluye `Organization`, `WebSite` y `SiteLinksSearchBox`
- [ ] No hay `noindex` en ninguna página de producción
- [ ] `out/sitemap.xml` existe tras el build
