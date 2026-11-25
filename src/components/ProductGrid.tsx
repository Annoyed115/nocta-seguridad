"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const STEP = 8; // phones show 8 products, then 8 more per tap; wider screens show them all

export function ProductGrid({ products }: { products: Product[] }) {
  const [shown, setShown] = useState(STEP);

  return (
    <div className="px-4 py-10 md:px-[3.4%] md:py-16">
      <ul className="fade-in grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-6">
        {products.map((p, i) => (
          <li key={p.id} className={i >= shown ? "max-md:hidden" : i >= STEP ? "fade-in" : undefined}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      {shown < products.length && (
        <div className="mt-8 text-center md:hidden">
          <button type="button" onClick={() => setShown((n) => n + STEP)} className="chip">
            Cargar más productos
          </button>
        </div>
      )}
    </div>
  );
}
