# Brother Studios — web

Sitio portfolio inmersivo (Next.js 16 · React 19 · Tailwind 4) para **brotherstudio.pro**.
Estética dark-futurista con acento coral `#DE4959`, bilingüe ES/EN, inspirado en vertex3d.asia.

## Correr en local

```bash
pnpm install
pnpm dev          # http://localhost:3000  (redirige a /es)
pnpm build        # build de producción
pnpm start        # sirve el build
```

## Estructura

```
src/
  app/
    [lang]/            # routing bilingüe (es | en)
      layout.tsx       # <html lang>, fonts, metadata + hreflang
      page.tsx         # compone todas las secciones
    globals.css        # design tokens (color/tipografía) dark + coral
  proxy.ts             # redirige / -> /es (negociación Accept-Language)
  lib/                 # i18n, fonts (next/font), utils (cn, formatPrice)
  content/             # 👉 TODO EL CONTENIDO EDITABLE vive acá
    site.ts            # email, Calendly URL, redes  (PLACEHOLDERS)
    dictionary.ts      # textos de UI (ES + EN)
    services.ts        # servicios
    products.ts        # productos "enlatados" con precio  (PLACEHOLDERS)
    projects.ts        # showcase
    proof.ts           # testimonios, métricas, logos, proceso
  components/
    layout/            # Header, Footer, LanguageSwitcher
    sections/          # Hero, Manifesto, Services, Work, Products, Process, Proof, Contact
    ui/                # Button, SectionHeading, SocialIcons
```

## Para reemplazar contenido por el real

Editá los archivos en `src/content/`. Cada texto está en `{ es, en }`. Los precios,
entregables, screenshots y la URL de Calendly están marcados como `PLACEHOLDER`.

## Estado / roadmap

- [x] **M0** Fundación: diseño, i18n, contenido, todas las secciones (estático, SEO)
- [ ] **M1** Calendly por producto (prefill + UTM) + página `/agendar`
- [ ] **M2** Movimiento cinematográfico (Lenis + GSAP, cursor magnético, footer "decrypt")
- [ ] **M3** Escena WebGL + showcase scroll-scrub + preloader
- [ ] **M4** Navegación por gestos (MediaPipe, opt-in, lazy)
- [ ] **M5** Performance / accesibilidad / SEO
- [ ] **M6** Swap de contenido real + QA
- [ ] **M7** Deploy VPS Hostinger (standalone + PM2 + Nginx + SSL) → brotherstudio.pro
```
