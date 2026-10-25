import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductGridSkeleton } from "@/features/products/components/product-card-skeleton";
import { ProductsGrid } from "@/features/products/components/products-grid";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; sale?: string; search?: string }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : params.sale === "true"
      ? "On sale"
      : params.search
        ? `Search: ${params.search}`
        : "Shop";
  return {
    title,
    description: category
      ? `Shop ${category} at Luxe.`
      : "Browse the full collection.",
  };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <ProductsGrid />
    </Suspense>
  );
}
