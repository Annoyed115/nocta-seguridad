import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Product } from "@/lib/catalog";

/**
 * A catalogue card: the whole card opens the product page, where its photo glides into the large one (globals.css .morph).
 * `morph={false}` for cards that share a page with that large photo (related products), so they stay put.
 */
export function ProductCard({ product, morph = true }: { product: Product; morph?: boolean }) {
  const photo = (
    <span className="relative block aspect-square overflow-hidden rounded-sm bg-[#e8e8e8]">
      <Image
        src={product.image}
        alt=""
        fill
        sizes="(min-width: 1280px) 15vw, (min-width: 768px) 30vw, 45vw"
        className="object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
      />
    </span>
  );

  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col rounded-md border border-line bg-white p-2.5 transition-shadow duration-300 hover:shadow-lg"
    >
      {morph ? (
        <ViewTransition name={`product-${product.id}`} share="morph" default="none">
          {photo}
        </ViewTransition>
      ) : (
        photo
      )}
      <span className="mt-3 font-body text-sm leading-snug">{product.name}</span>
    </Link>
  );
}
