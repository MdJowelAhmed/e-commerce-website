"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useProductsFilters } from "../hooks/use-products-filters";

interface ProductsPaginationProps {
  page: number;
  totalPages: number;
}

export function ProductsPagination({ page, totalPages }: ProductsPaginationProps) {
  const { updateFilters } = useProductsFilters();
  if (totalPages <= 1) return null;

  const goto = (next: number) =>
    updateFilters({ page: next > 1 ? next : undefined }, { resetPage: false });

  const pages = buildPageList(page, totalPages);

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goto(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goto(p)}
            className={cn(
              "h-10 min-w-10 rounded-full border px-3 text-sm font-medium transition-colors",
              p === page
                ? "border-foreground bg-foreground text-background"
                : "border-input bg-background hover:bg-secondary",
            )}
          >
            {p}
          </button>
        ),
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => goto(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
