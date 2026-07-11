# AD Home Decor — Frontend Headless

> Sitio web estático generado con **Next.js 16 + output: "export"**, conectado a un backend **WordPress/WooCommerce** como headless CMS. Desplegado en hosting compartido (Giappy Corp / LiteSpeed) vía **GitHub Actions + FTP**.

🌐 **[aydhomedecor.com](https://aydhomedecor.com)**

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.7 (App Router, static export) |
| UI | React 19 + Tailwind CSS v4 |
| Animaciones | Motion (Framer Motion v12) |
| Backend / CMS | WordPress + WooCommerce (headless) |
| Tipografías | Alata + DM Sans (Google Fonts) |
| Deploy | GitHub Actions → FTP → LiteSpeed |
| SEO | JSON-LD, sitemap.xml, Google Search Console |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  aydhomedecor.com                   │
│                  (public_html/)                     │
│                                                     │
│   ┌──────────────────┐   ┌───────────────────────┐  │
│   │   Next.js static │   │  WordPress + WC PHP   │  │
│   │   *.html, _next/ │   │  wp-admin/, wp-json/  │  │
│   │   sitemap.xml    │   │  wp-content/, *.php   │  │
│   └──────────────────┘   └───────────────────────┘  │
│            ▲                        ▲               │
│            └──────── .htaccess ─────┘               │
│                    (enruta según path)              │
└─────────────────────────────────────────────────────┘

Build time:
  scripts/generate-search-index.mjs
    → src/data/wc-categories.json
    → src/data/wc-products.json
    → public/search-data.json
  npx next build
    → out/ (HTML estático completo)
```

---

## Características

- **Bilingüe (ES/EN)** — rutas `/` y `/en/` con contenido independiente
- **Catálogo dinámico** — categorías y productos desde WooCommerce, generados estáticamente en build
- **Búsqueda client-side** — sin servidor, usando `search-data.json` precalculado
- **SEO completo** — JSON-LD (Organization, WebSite, SiteLinksSearchBox), sitemap.xml, robots.txt
- **CI/CD automático** — cada push a `main` construye y despliega solo el contenido de `out/`
- **WordPress coexiste** — Next.js y WP comparten `public_html/` sin conflictos

---

## Estructura del proyecto

```
aydhomedecor/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Metadata global + JSON-LD
│   │   ├── page.tsx                # Home ES
│   │   ├── sitemap.ts              # Genera /sitemap.xml
│   │   ├── catalogo/               # Catálogo ES
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx     # Categoría individual
│   │   │   └── buscar/             # Búsqueda client-side
│   │   ├── producto/[slug]/        # Página de producto ES
│   │   ├── nosotros/, faq/, contacto/
│   │   └── en/                     # Espejo en inglés
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSlider.tsx
│   │   ├── CategoryCarousel.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductExplorer.tsx
│   │   ├── ReviewsCarousel.tsx
│   │   ├── FaqAccordion.tsx
│   │   └── ContactForm.tsx
│   ├── lib/
│   │   ├── woocommerce.ts          # API client + lector de JSON prebuild
│   │   └── i18n.ts                 # Utilidades de internacionalización
│   └── data/                       # Generado por prebuild (committed al repo)
│       ├── wc-categories.json
│       └── wc-products.json
├── public/
│   ├── img/                        # Imágenes estáticas del sitio
│   ├── search-data.json            # Índice de búsqueda (generado por prebuild)
│   └── robots.txt
├── scripts/
│   └── generate-search-index.mjs  # Prebuild: llama a WooCommerce API
├── .github/workflows/
│   └── deploy.yml                  # CI/CD: build + deploy FTP
├── next.config.ts
└── .htaccess                       # En el servidor (no en repo)
```

---

## Desarrollo local

### Requisitos

- Node.js 20+
- Acceso a la API de WooCommerce (`.env.local`)

### Variables de entorno

Crea `.env.local` en la raíz:

```env
WP_URL=https://aydhomedecor.com
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx
```

### Comandos

```bash
# Instalar dependencias
npm install

# Generar datos de build desde WooCommerce (solo necesario al actualizar productos)
node --env-file=.env.local scripts/generate-search-index.mjs

# Servidor de desarrollo
npm run dev

# Build estático completo (incluye prebuild)
npm run build

# Previsualizar el output estático
npx serve out
```

> **Nota:** `npm run build` ejecuta automáticamente el prebuild (`scripts/generate-search-index.mjs`) antes de `next build`. El prebuild requiere acceso a la API de WooCommerce desde tu máquina local.

---

## Build & Deploy

### Flujo automático (GitHub Actions)

```
git push main
    ↓
GitHub Actions (.github/workflows/deploy.yml)
    ↓
npm ci
    ↓
npx next build          ← usa src/data/*.json del repo (no llama a la API)
    ↓
out/                    ← HTML estático generado
    ↓
lftp mirror --reverse   ← sube out/ → public_html/ via FTP
    ↓
aydhomedecor.com actualizado
```

### Por qué `npx next build` en CI y no `npm run build`

El CI usa `npx next build` directamente para **saltar el hook `prebuild`**. El script `generate-search-index.mjs` intenta llamar a la API de WooCommerce, pero las IPs de GitHub Actions están bloqueadas por el firewall del hosting (devuelven 415). En su lugar, los datos (`src/data/*.json` y `public/search-data.json`) están **committed al repositorio** y Next.js los lee desde disco durante el build.

### Secrets requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `FTP_HOST` | Host FTP del hosting |
| `FTP_USERNAME` | Usuario FTP |
| `FTP_PASSWORD` | Contraseña FTP |

---

## Cómo actualizar el catálogo

Los productos y categorías **no se actualizan automáticamente** — son datos estáticos generados en build. Para reflejar cambios en WooCommerce:

```bash
# 1. Regenerar datos localmente
node --env-file=.env.local scripts/generate-search-index.mjs

# 2. Commitear los JSON actualizados
git add src/data/ public/search-data.json
git commit -m "data: refresh product catalog"
git push
```

GitHub Actions hará el build y deploy automáticamente.

---

## SEO

### Configuración aplicada

| Elemento | Archivo | Descripción |
|----------|---------|-------------|
| Metadata global | `src/app/layout.tsx` | `title`, `description`, `keywords`, `openGraph`, `metadataBase` |
| Verificación Google | `src/app/layout.tsx` | `verification.google` (meta tag HTML) |
| JSON-LD | `src/app/layout.tsx` | `Organization`, `WebSite`, `SiteLinksSearchBox` |
| Sitemap | `src/app/sitemap.ts` | Auto-genera `/sitemap.xml` con todas las páginas ES + EN |
| Robots | `public/robots.txt` | Permite todo excepto `/wp-admin/`, incluye referencia al sitemap |
| Metadata por página | Cada `page.tsx` | `generateMetadata()` con título y descripción únicos |

### JSON-LD implementado

```json
{
  "@graph": [
    { "@type": "Organization" },      // → Panel de conocimiento de Google
    { "@type": "WebSite" },           // → Búsqueda interna en resultados
    { "@type": "SiteLinksSearchBox" } // → Cuadro de búsqueda en sitelinks
  ]
}
```

> Los **sitelinks** (sub-enlaces bajo el resultado principal) aparecen cuando Google acumula suficiente historial de clics — normalmente 2-8 semanas después de la indexación.

---

## Routing en el servidor (.htaccess)

Next.js y WordPress coexisten en `public_html/` gracias a reglas mod_rewrite en `.htaccess`:

```
Request llega
    ↓
¿Es _next/, wp-content/, wp-includes/?  → servir directamente [L]
    ↓
¿El archivo existe físicamente?          → servir directamente [L]
    ↓
¿Es /wp-json/?                          → /index.php [L]  (WooCommerce API)
    ↓
¿Es /wp-admin/?                         → servir directamente [L]
    ↓
¿Existe /path.html?                     → servir /path.html [L]  (Next.js clean URLs)
    ↓
Fallback                                → /index.html [L]  (SPA)
```

> **Importante para LiteSpeed:** Usar `[L]` en lugar de `[END]`. LiteSpeed no soporta la flag `[END]` de Apache.

---

## Componentes principales

| Componente | Descripción |
|-----------|-------------|
| `Nav` | Navegación principal con menú móvil y selector de idioma |
| `HeroSlider` | Slider animado en el home con productos destacados |
| `CategoryCarousel` | Carrusel de categorías con scroll horizontal |
| `ProductGallery` | Grid de productos con lightbox de imágenes |
| `ProductExplorer` | Explorador de productos por categoría con filtros |
| `ReviewsCarousel` | Carrusel de reseñas de clientes |
| `FaqAccordion` | Preguntas frecuentes con acordeón animado |
| `ContactForm` | Formulario de contacto con integración WhatsApp |

---

## Decisiones de arquitectura

**¿Por qué static export y no servidor Node?**
El hosting es compartido (Giappy Corp / cPanel), que no soporta procesos Node persistentes. Static export genera HTML puro que LiteSpeed sirve directamente sin runtime.

**¿Por qué datos committed al repo en lugar de API en CI?**
El firewall del hosting bloquea las IPs de GitHub Actions con error 415. Committing los JSON prebuild permite builds reproducibles sin acceso de red a WooCommerce.

**¿Por qué WordPress y Next.js en el mismo dominio?**
Evita problemas de CORS en la API de WooCommerce y mantiene un solo dominio para SEO. La coexistencia es posible porque Next.js genera `.html` y WordPress usa `.php` — no hay conflictos de archivos.
