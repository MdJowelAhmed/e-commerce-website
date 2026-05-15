import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductGridSkeleton } from "@/features/products/components/product-card-skeleton";
import { ProductsGrid } from "@/features/products/components/products-grid";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full collection.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <ProductsGrid />
    </Suspense>
  );
}
