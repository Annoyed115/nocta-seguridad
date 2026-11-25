import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/catalogo` },
    ...catalog.flatMap((c) => [
      { url: `${SITE_URL}/catalogo/${c.slug}` },
      ...c.products.map((p) => ({ url: `${SITE_URL}${p.href}` })),
    ]),
  ];
}
