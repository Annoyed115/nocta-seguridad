# NOCTA Seguridad

**Español** · [English](#english)

Sitio web conceptual para una empresa de seguridad electrónica: alarmas, cámaras, cercas eléctricas y motores para puertas.

> **Proyecto conceptual.** NOCTA es una marca ficticia. Los teléfonos, el correo, las direcciones y las opiniones son de ejemplo. Las fotos de productos pertenecen a sus fabricantes.

## Lo destacado

- **Apertura en 3D**: el letrero octogonal gira, se detiene y vuela hasta la barra (React Three Fiber). Solo aparece en la primera visita, y respeta `prefers-reduced-motion`.
- **Catálogo con transiciones**: la foto de la tarjeta viaja hasta la página del producto y regresa, también con el botón "atrás" del navegador (React `<ViewTransition>`).
- **Pantalla de carga** del catálogo, que se llena por tramos mientras cargan las fotos.
- **Cambio de categoría** con un barrido del subtítulo según la dirección, y una píldora que se desliza entre las categorías.
- **Cotizar por WhatsApp** con el saludo según la hora de Colombia ("Buenos días" / "Buenas tardes") y el nombre del producto.
- SEO técnico: metadatos por página, sitemap, robots y datos estructurados de migas de pan.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 + PostgreSQL · Three.js

## Correr en local

```bash
npm install                                  # también corre prisma generate
npx prisma dev --name nocta --detach         # Postgres local; copia su URL a .env como DATABASE_URL
npx prisma migrate dev                       # crea las tablas
npx prisma db seed                           # carga categorías y productos (prisma/catalog.json)
npm run dev
npm test
```

## Publicar (Neon + Vercel)

1. **Neon**: crea un proyecto y copia la cadena de conexión *pooled* (el host contiene `-pooler`) y la directa.
2. **Vercel**: importa el repositorio y define `DATABASE_URL` (pooled) y `DATABASE_URL_UNPOOLED` (directa). El script `vercel-build` corre `prisma migrate deploy && prisma db seed && next build`, así que las tablas y el catálogo se crean solos.

## Estructura

| Ruta | Qué hay |
| --- | --- |
| `src/app/page.tsx` | Inicio, sección por sección |
| `src/app/catalogo/` | Catálogo, categorías y producto |
| `src/components/Intro.tsx` · `IntroSign.tsx` | La apertura en 3D |
| `src/components/CatalogLoader.tsx` | La pantalla de carga del catálogo |
| `src/lib/quote.ts` | Mensaje de WhatsApp según la hora |
| `src/lib/site.ts` | Datos de contacto (de ejemplo) |
| `prisma/` | Esquema, productos y seed |

---

<a id="english"></a>

# NOCTA Seguridad (English)

Concept website for an electronic security company: alarms, cameras, electric fences and gate motors. The site itself is in Spanish (Colombian market).

> **Concept project.** NOCTA is a fictional brand. Phone numbers, email, addresses and reviews are placeholders. Product photos belong to their manufacturers.

## Highlights

- **3D opening**: the octagonal sign spins, settles and flies into the header (React Three Fiber). Shown on the first visit only; honours `prefers-reduced-motion`.
- **Catalogue transitions**: the card's photo glides into the product page and back, including with the browser's back button (React `<ViewTransition>`).
- **Catalogue loading screen** that fills in steps while the photos load.
- **Category switch** with a directional swipe of the subtitle and a pill that slides between categories.
- **Quote via WhatsApp** with a greeting based on the time of day in Colombia ("Buenos días" / "Buenas tardes") and the product name.
- Technical SEO: per-page metadata, sitemap, robots and breadcrumb structured data.

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 + PostgreSQL · Three.js

## Run locally

```bash
npm install                                  # also runs prisma generate
npx prisma dev --name nocta --detach         # local Postgres; put its URL in .env as DATABASE_URL
npx prisma migrate dev                       # create the tables
npx prisma db seed                           # load categories and products (prisma/catalog.json)
npm run dev
npm test
```

## Deploy (Neon + Vercel)

1. **Neon**: create a project and copy the *pooled* connection string (host contains `-pooler`) and the direct one.
2. **Vercel**: import the repository and set `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct). The `vercel-build` script runs `prisma migrate deploy && prisma db seed && next build`, so tables and catalogue are created on deploy.

## Structure

| Path | What |
| --- | --- |
| `src/app/page.tsx` | Home page, section by section |
| `src/app/catalogo/` | Catalogue, categories and product page |
| `src/components/Intro.tsx` · `IntroSign.tsx` | The 3D opening |
| `src/components/CatalogLoader.tsx` | The catalogue loading screen |
| `src/lib/quote.ts` | Time-of-day WhatsApp message |
| `src/lib/site.ts` | Contact details (placeholders) |
| `prisma/` | Schema, products and seed |
