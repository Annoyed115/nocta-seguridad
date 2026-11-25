import Link from "next/link";
import type { Catalog } from "@/lib/catalog";
import { breadcrumbLd } from "@/lib/site";
import { ProductGrid } from "./ProductGrid";

/** The catalogue: grey header with the category chips (scroll sideways on phones), then the cards. */
export function CatalogView({ catalog, active }: { catalog: Catalog; active?: string }) {
  const category = catalog.find((c) => c.slug === active);
  const products = category ? category.products : catalog.flatMap((c) => c.products);
  const trail: [string, string][] = [["Inicio", "/"], ["Catálogo", "/catalogo"]];
  if (category) trail.push([category.title, `/catalogo/${category.slug}`]);
  // Chips to the right of the current one swipe the subtitle up, chips to the left swipe it down (globals.css).
  const order = ["", ...catalog.map((c) => c.slug)];
  const toward = (slug: string) => [order.indexOf(slug) < order.indexOf(active ?? "") ? "cat-prev" : "cat-next"];
  const chip = (slug: string, label: string) => {
    const current = (active ?? "") === slug;
    return (
      <Link key={slug} href={`/catalogo${slug && `/${slug}`}`} transitionTypes={toward(slug)} aria-current={current ? "page" : undefined} className="chip md:text-base">
        {label}
        {current && <span aria-hidden className="chip-pill" />}
      </Link>
    );
  };

  return (
    <>
      <section className="catalog-head bg-card px-4 pb-6 pt-10 md:mx-[1.2%] md:mt-6 md:px-[3%] md:pb-10 md:pt-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd(trail) }} />
        {/* Each category page gets its own title (the category under CATÁLOGO), not five pages all titled "Catálogo". */}
        <h1 className="text-center font-black uppercase leading-none">
          <span data-catalog-title className="block text-[13vw] text-primary md:text-[5vw]">
            Catálogo
          </span>
          {category && <span className="catalog-sub mt-3 block text-lg md:mt-4 md:text-[1.8vw]">{category.title}</span>}
        </h1>
        <nav
          aria-label="Categorías"
          className="catalog-chips -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-14 md:flex-wrap md:justify-center md:gap-5 md:px-0"
        >
          {chip("", "Todos")}
          {catalog.map((c) => chip(c.slug, c.name))}
        </nav>
      </section>
      {/* a fresh grid per category, so it fades in when the category changes */}
      <ProductGrid key={active ?? "todos"} products={products} />
    </>
  );
}
