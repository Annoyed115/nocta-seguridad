import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";
import { slugify } from "./quote";

export async function getCatalog() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog");
  const categories = await db.category.findMany({
    orderBy: { position: "asc" },
    select: {
      slug: true,
      name: true,
      title: true,
      // seed order = prisma/catalog.json order, which puts each category's headline products first
      products: { orderBy: { id: "asc" }, select: { id: true, name: true, image: true } },
    },
  });
  return categories.map((c) => ({
    ...c,
    products: c.products.map((p) => ({ ...p, slug: slugify(p.name), href: `/catalogo/${c.slug}/${slugify(p.name)}` })),
  }));
}

export type Catalog = Awaited<ReturnType<typeof getCatalog>>;
export type Product = Catalog[number]["products"][number];

export async function findCategory(slug: string) {
  return (await getCatalog()).find((c) => c.slug === slug);
}

/** What each category is for, in NOCTA's words; shown on its product pages. */
export const CATEGORY_TEXT: Record<string, string> = {
  camaras:
    "Cámaras Hikvision, Dahua e IMOU con grabación en DVR. Mire su casa o su negocio desde el celular, también de noche.",
  alarmas:
    "Sensores en puertas y ventanas, detectores de movimiento y sirena. Si la alarma se activa, la señal llega a nuestro monitoreo, de día o de noche.",
  cercas:
    "Panel electrificador, alambre acerado y avisos de peligro: un perímetro que se nota antes de que alguien intente entrar.",
  motores:
    "Motores para puertas corredizas de hasta 1.200 kg, brazos para puertas batientes, controles remotos, fotoceldas y control de acceso.",
};

export const INSTALL_TEXT =
  "Visitamos su casa o su negocio, le recomendamos los equipos y los dejamos instalados y funcionando. Monitoreo y apoyo las 24 horas.";
