import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ChevronLeftIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { ProductTabs } from "@/components/ProductTabs";
import { QuoteCta } from "@/components/QuoteCta";
import { CATEGORY_TEXT, findCategory, getCatalog, INSTALL_TEXT } from "@/lib/catalog";
import { quoteLink } from "@/lib/quote";
import { breadcrumbLd } from "@/lib/site";

type Props = PageProps<"/catalogo/[categoria]/[producto]">;

export async function generateStaticParams() {
  return (await getCatalog()).flatMap((c) => c.products.map((p) => ({ categoria: c.slug, producto: p.slug })));
}

async function find(params: Props["params"]) {
  const { categoria, producto } = await params;
  const category = await findCategory(categoria);
  const product = category?.products.find((p) => p.slug === producto);
  return category && product ? { category, product } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await find(params);
  if (!found) return {};
  const { category, product } = found;
  return {
    title: product.name,
    description: `${product.name} (${category.title.toLowerCase()}). ${CATEGORY_TEXT[category.slug] ?? ""}`,
    alternates: { canonical: product.href },
    openGraph: { images: product.image },
  };
}

/** One product page. The prototype's price, stars and options wait for real data; the rest comes from the catalogue. */
// No Suspense: generateStaticParams lists every product, so each page is built whole and prefetched whole, and the
// photo can glide from its card (and back) instead of meeting a blank fallback.
export default async function ProductPage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  const { category, product } = found;
  // The 4 products after this one in its category, wrapping round: every product gets linked from its neighbours, not only the first four.
  const at = category.products.findIndex((p) => p.id === product.id);
  const related = [...category.products.slice(at + 1), ...category.products.slice(0, at)].slice(0, 4);
  const crumb = "transition-colors duration-200 hover:text-primary";

  return (
    <div className="px-4 pb-24 pt-4 md:px-[5.2%] md:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbLd([["Inicio", "/"], ["Catálogo", "/catalogo"], [category.title, `/catalogo/${category.slug}`], [product.name, product.href]]),
        }}
      />
      <nav aria-label="Ruta" className="hidden font-body text-sm text-muted md:block">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/" className={crumb}>Inicio</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/catalogo" className={crumb}>Catálogo</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/catalogo/${category.slug}`} className={crumb}>{category.title}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-black">{product.name}</li>
        </ol>
      </nav>
      <Link href={`/catalogo/${category.slug}`} className="-ml-1 inline-flex min-h-11 items-center gap-1 font-body text-sm text-muted md:hidden">
        <ChevronLeftIcon className="size-5" />
        {category.title}
      </Link>

      <div className="mt-2 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,0.9fr)_1fr] md:gap-16">
        {/* The card's photo glides into this one (ProductCard.tsx). */}
        <ViewTransition name={`product-${product.id}`} share="morph" default="none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e8e8e8]">
            <Image src={product.image} alt={product.name} fill preload sizes="(min-width: 768px) 42vw, 92vw" className="object-contain p-8 mix-blend-multiply" />
          </div>
        </ViewTransition>
        <div>
          <p className="font-body text-sm font-semibold uppercase text-primary">{category.title}</p>
          <h1 className="mt-3 text-[8.5vw] font-black uppercase leading-[1.02] md:text-[3.3vw]">{product.name}</h1>
          <p className="mt-5 font-body text-lg font-semibold">Precio: le cotizamos por WhatsApp</p>
          <QuoteCta href={quoteLink(product.name)} />
        </div>
      </div>

      <ProductTabs
        tabs={[
          { label: "Descripción", text: CATEGORY_TEXT[category.slug] ?? category.title },
          { label: "Instalación", text: INSTALL_TEXT },
        ]}
      />

      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <h2 className="text-center text-[9vw] font-black uppercase leading-none text-primary md:text-[3.3vw]">Productos relacionados</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-5">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} morph={false} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
