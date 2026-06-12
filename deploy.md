# Deploy automático: GitHub Actions → cPanel (FTP + file watcher)

Guía para proyectos Next.js con servidor personalizado (`server.js`) corriendo en cPanel con Phusion Passenger (Namecheap Stellar Business u hosting similar **sin SSH habilitado**).

---

## El problema que esto resuelve

En cPanel con Phusion Passenger, el servidor Node.js **no se reinicia solo** cuando subes archivos nuevos. El proceso viejo sigue corriendo con el build anterior en memoria. Esto causaba que después de cada deploy:

- El sitio mostraba **APPLICATION ERROR** (el servidor servía HTML con hashes de chunks viejos mientras los archivos nuevos ya estaban en disco)
- Había que entrar a cPanel → Node.js App → **Restart** manualmente en cada deploy para que los cambios se vieran

Intentamos varias alternativas que no funcionaron en Namecheap Stellar Business:
- **SSH + git pull**: el hosting no tiene shell SSH habilitado
- **cPanel UAPI `NodeJS/restart_app`**: el módulo no está instalado en este hosting (`Failed to load module NodeJS`)
- **Endpoint HTTP `/_restart` en server.js**: Apache interceptaba la llamada antes de llegar a Node.js
- **`tmp/restart.txt`**: Passenger no monitorea este archivo para apps Node.js en esta configuración

**La solución que funcionó: file watcher en `server.js`.**

---

## Cómo funciona

Cada vez que haces `git push` a `main`, GitHub Actions:

1. Instala dependencias y corre `npm run build` (genera `.next/`)
2. Sube todos los archivos al servidor por FTP (solo los que cambiaron)
3. Al final sube un archivo `.restart` con la fecha/hora actual vía Python FTP
4. `server.js` tiene un `setInterval` que cada 5 segundos compara el `mtime` del archivo `.restart`
5. Cuando detecta que cambió, llama `process.exit(1)` → Phusion Passenger reinicia el proceso automáticamente
6. El sitio vuelve con el nuevo build sin intervención manual

**Por qué funciona:** en lugar de intentar llamar al servidor desde afuera (HTTP, API, SSH), el propio proceso Node.js se monitorea a sí mismo desde adentro. El file watcher es una lectura de disco cada 5 segundos, no depende de ninguna API externa ni de que Apache deje pasar la petición.

---

## Requisitos previos

- Repo en GitHub
- Hosting con cPanel y Node.js App configurada (Phusion Passenger)
- Acceso FTP al servidor
- Node.js App ya creada y corriendo en cPanel apuntando a la carpeta del proyecto

---

## Paso 1 — `server.js`

El servidor custom que usa Next.js en producción. Se le agregaron dos cosas clave respecto a un `server.js` estándar de Next.js:

1. `const fs = require('fs')` — necesario para leer el archivo `.restart`
2. El bloque `setInterval` con el file watcher — el corazón del reinicio automático

**Cómo funciona el watcher:** al arrancar el servidor, guarda el `mtime` (fecha de modificación) del archivo `.restart`. Cada 5 segundos lo compara con el valor guardado. Si cambió, llama `process.exit(1)`. Passenger detecta que el proceso murió y lo reinicia con el nuevo build ya disponible en disco.

```js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = false
const port = process.env.PORT || 3000
const app = next({ dev, conf: { distDir: '.next' } })
const handle = app.getRequestHandler()

// Watch .restart file — when FTP uploads it after a deploy, exit so Passenger restarts
const RESTART_FILE = '.restart'
let lastMtime = (() => {
  try { return fs.statSync(RESTART_FILE).mtimeMs } catch { return 0 }
})()

setInterval(() => {
  try {
    const mtime = fs.statSync(RESTART_FILE).mtimeMs
    if (mtime !== lastMtime) {
      console.log('Restart file updated, restarting...')
      process.exit(1)
    }
  } catch {}
}, 5000)

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`)
    })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
```

**Por qué `process.exit(1)` y no `process.exit(0)`:** Passenger trata cualquier exit como señal de reinicio, pero el exit code 1 deja claro que fue un reinicio forzado, no un cierre limpio.

---

## Paso 2 — `next.config.mjs`

No hay nada especial requerido. La configuración actual del proyecto funciona tal cual. Lo importante es que **NO uses `output: 'standalone'`** ya que el `server.js` custom lee directamente la carpeta `.next/`.

Referencia de la config actual:

```js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // ...
  },
  reactStrictMode: true,
  transpilePackages: ['gsap', 'locomotive-scroll'],
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react', 'react-icons'],
  },
  async redirects() { /* ... */ },
  async headers() { /* ... */ },
}
export default nextConfig
```

---

## Paso 3 — GitHub Actions: `.github/workflows/deploy.yml`

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: ${{ secrets.FTP_SERVER_DIR }}
          dangerous-clean-slate: false
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
            .env
            .env.local
            .env*
            deploy_key
            deploy_key.pub
            .restart

      - name: Trigger restart
        run: |
          python3 - <<'EOF'
          import ftplib, os, io
          from datetime import datetime, timezone

          server    = os.environ['FTP_SERVER'].replace('ftp://', '').replace('ftps://', '').strip().rstrip('/')
          username  = os.environ['FTP_USERNAME']
          password  = os.environ['FTP_PASSWORD']
          directory = os.environ['FTP_SERVER_DIR']

          content = datetime.now(timezone.utc).isoformat().encode()
          with ftplib.FTP(server) as ftp:
              ftp.login(username, password)
              ftp.cwd(directory)
              ftp.storbinary('STOR .restart', io.BytesIO(content))
          print("Restart trigger uploaded OK")
          EOF
        env:
          FTP_SERVER: ${{ secrets.FTP_SERVER }}
          FTP_SERVER_DIR: ${{ secrets.FTP_SERVER_DIR }}
          FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
          FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
```

**Por qué `.restart` está en el exclude del FTP principal:** si se subiera junto con el resto de archivos, el servidor se reiniciaría en medio del deploy cuando `.next/` todavía está incompleto en el servidor. Eso causa APPLICATION ERROR. Al excluirlo del FTP principal y subirlo en un step separado al final, garantizamos que el reinicio ocurre solo cuando todos los archivos ya están en el servidor.

**Por qué Python y no `curl`:** `curl` con FTP construye URLs donde el path del directorio puede romper el formato si contiene caracteres especiales o barras iniciales (`/Artica/` → `ftp://host//Artica/`). Python's `ftplib` conecta al servidor, navega al directorio con `cwd()`, y sube el archivo directamente sin construir URLs, lo que evita todos esos problemas.

---

## Paso 4 — GitHub Secrets

Ve al repo en GitHub → **Settings** → **Secrets and variables** → **Actions** y crea estos secrets:

| Secret | Valor | Ejemplo |
|---|---|---|
| `FTP_SERVER` | Hostname del servidor FTP | `articagroup.us` |
| `FTP_USERNAME` | Usuario FTP (normalmente el email de cPanel) | `info@articagroup.us` |
| `FTP_PASSWORD` | Contraseña FTP | `tu_contraseña` |
| `FTP_SERVER_DIR` | Ruta de la carpeta de la app en el servidor | `/Artica/` |

**Dónde encontrar los datos FTP:**
- cPanel → **FTP Accounts** (o los mismos datos de acceso a cPanel)
- `FTP_SERVER`: el dominio o la IP del servidor
- `FTP_SERVER_DIR`: la carpeta raíz de la Node.js App (la que aparece en cPanel → Node.js App → Application root), con `/` al final

---

## Paso 5 — Variables de entorno en cPanel

Las variables de entorno del proyecto van en **cPanel → Node.js App → Environment Variables** (NO en GitHub Secrets). Estas persisten en el servidor entre deploys.

Ejemplo para este proyecto:

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key para envío de emails |
| `PORT` | Puerto del servidor (cPanel lo asigna, generalmente no hace falta ponerlo) |

**Importante:** el `.env` del proyecto está en `.gitignore` y nunca se sube al repo ni por FTP. Las variables van exclusivamente en la sección de cPanel.

---

## Paso 6 — Primera vez: activar el file watcher

La primera vez que se despliega el `server.js` con el file watcher, Passenger no reinicia automáticamente el proceso (porque el proceso viejo sigue corriendo sin el watcher). Hay que hacer **un único Restart manual** en cPanel → Node.js App → Restart.

A partir de ese momento, todos los deploys futuros reinician solos.

---

## Flujo completo después de la configuración inicial

```
Haces cambios en el código
        ↓
git add . && git commit -m "cambio" && git push
        ↓
GitHub Actions detecta el push a main
        ↓
npm ci → npm run build → FTP upload (solo archivos cambiados, ~1-3 min)
        ↓
Python sube .restart con timestamp del momento
        ↓
server.js detecta el cambio en .restart (cada 5 seg)
        ↓
process.exit(1) → Passenger reinicia el proceso
        ↓
El sitio vuelve con el nuevo build (~15-30 seg de reinicio)
```

---

## Tiempos aproximados

| Situación | Tiempo |
|---|---|
| Primer deploy (sube todo) | 8-12 minutos |
| Deploy normal (solo cambios) | 1-3 minutos |
| Reinicio del servidor (Next.js startup) | 15-30 segundos |

---

## Errores comunes y soluciones

| Error | Causa | Solución |
|---|---|---|
| `socket.gaierror: Name or service not known` | `FTP_SERVER` tiene `ftp://` como prefijo | Poner solo el hostname: `articagroup.us` |
| `curl exit code 3` al subir `.restart` | URL FTP malformada | Usar Python `ftplib` (ya está en el workflow) |
| `Failed to load module NodeJS` en cPanel API | El módulo NodeJS de la API de cPanel no está instalado | No usar cPanel UAPI, usar el file watcher |
| Site muestra APPLICATION ERROR después del deploy | El server.js viejo (sin watcher) sigue corriendo | Dar Restart manual una sola vez en cPanel |
| Deploy tarda mucho | Muchos archivos cambiaron | Normal en el primer deploy; los siguientes son rápidos |

---

## Notas importantes

- `node_modules/` **nunca** se sube — está en `.gitignore` y en el exclude del FTP. Se instala en el servidor una sola vez vía cPanel → Node.js App → Run NPM Install.
- `.env` **nunca** se sube — las variables van en cPanel Node.js App.
- `.next/` **sí** se sube — el build se hace en GitHub Actions y se sube el resultado compilado. El servidor solo lee `.next/`, no vuelve a compilar.
- Si cambias `package.json` (nueva dependencia), después del deploy hay que ir a cPanel → Node.js App → Run NPM Install manualmente. Considera automatizarlo si es frecuente.
- El archivo `.restart` en el servidor no contiene nada sensible — solo la fecha/hora del último deploy.
