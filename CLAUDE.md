@AGENTS.md

# Project File Organization

Keep every file in its proper place — never leave images or temp files loose in the project root.

- **`src/components/`** — React components (PascalCase)
- **`src/app/`** — Next.js pages & routes
- **`src/lib/`** — utilities, API clients
- **`public/img/`** — static images used on the site
- **`capture/`** — screenshots from Playwright/MCP/browser tools (not for production)
- **Project root** — config files only (`next.config.ts`, `tsconfig.json`, `.env.local`, etc.)

Any `.png`, `.jpg`, or `.jpeg` produced by a tool (Playwright screenshot, MCP capture, etc.) goes into `capture/`. If the user provides an image for use on the site, it goes into `public/img/`.
