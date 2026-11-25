import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/CatalogView";
import { findCategory, getCatalog } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getCatalog()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const category = await findCategory(categoria);
  return category
    ? { title: category.title, description: `${category.title}. Cotice por WhatsApp.`, alternates: { canonical: `/catalogo/${categoria}` } }
    : {};
}

// No Suspense: generateStaticParams lists every category, so each page is built whole and prefetched whole. Behind a
// Suspense fallback a tap on a chip showed a blank page first, and the panel and pill had nothing to glide to.
export default async function CategoryPage({ params }: PageProps<"/catalogo/[categoria]">) {
  const { categoria } = await params;
  const catalog = await getCatalog();
  if (!catalog.some((c) => c.slug === categoria)) notFound();
  return <CatalogView catalog={catalog} active={categoria} />;
}
