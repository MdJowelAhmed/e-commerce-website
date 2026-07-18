"use client";

import { useMemo } from "react";

import { ProductCard } from "@/features/products/components/product-card";
import { useAppSelector } from "@/lib/store/hooks";
import type { Product } from "@/types";

export function RecentlyViewedSection({
  products,
  currentProductId,
}: {
  products: Product[];
  currentProductId?: string;
}) {
  const ids = useAppSelector((state) => state.commerce.recentlyViewedIds);
  const items = useMemo(
    () =>
      ids
        .filter((id) => id !== currentProductId)
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product))
        .slice(0, 4),
    [currentProductId, ids, products],
  );

  if (items.length === 0) return null;

  return (
    <section className="container-wide border-t py-12 lg:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your history</p>
      <h2 className="mt-2 font-display text-3xl">Recently viewed</h2>
      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
