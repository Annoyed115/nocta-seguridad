import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { fold } from "../src/lib/quote";
import catalog from "./catalog.json";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  for (const [position, { products, ...category }] of catalog.categories.entries()) {
    const { id: categoryId } = await db.category.upsert({
      where: { slug: category.slug },
      update: { ...category, position },
      create: { ...category, position },
    });
    for (const product of products) {
      const data = { ...product, categoryId, search: fold(`${product.name} ${category.title}`) };
      await db.product.upsert({ where: { name: product.name }, update: data, create: data });
    }
  }
  console.log(`Seeded ${catalog.categories.length} categories, ${catalog.categories.flatMap((c) => c.products).length} products.`);
}

main().finally(() => db.$disconnect());
