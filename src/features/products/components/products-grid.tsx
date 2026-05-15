"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  ProductGridSkeleton,
} from "@/features/products/components/product-card-skeleton";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductsPagination } from "@/features/products/components/products-pagination";
import { ProductToolbar } from "@/features/products/components/product-toolbar";
import { useListProductsQuery } from "@/lib/store/services/api";

import { useProductsFilters } from "../hooks/use-products-filters";

export function ProductsGrid() {
  const { filters, clearFilters } = useProductsFilters();
  const { data, isFetching } = useListProductsQuery(filters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="container-wide py-10 lg:py-14">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {filters.category ? `Shop · ${filters.category}` : "Shop"}
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight md:text-5xl">
          {filters.category
            ? capitalize(filters.category)
            : "The collection"}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <ProductFilters />
        </div>
        <div>
          <ProductToolbar
            total={data?.total ?? 0}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetContent side="left" className="w-full overflow-y-auto p-6 sm:max-w-md">
              <ProductFilters onClose={() => setMobileFiltersOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="mt-6">
            {isFetching && !data ? (
              <ProductGridSkeleton count={8} />
            ) : data && data.items.length > 0 ? (
              <motion.div
                key={JSON.stringify(filters)}
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
              >
                {data.items.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            ) : (
              <EmptyState onReset={clearFilters} />
            )}

            {data && (
              <ProductsPagination
                page={data.page}
                totalPages={data.totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-24 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
        <PackageOpen className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No products match your filters</h3>
      <p className="text-sm text-muted-foreground">Try removing a filter or two to see more.</p>
      <Button variant="outline" onClick={onReset} className="mt-2">
        Clear all filters
      </Button>
    </motion.div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
