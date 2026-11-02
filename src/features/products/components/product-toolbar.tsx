"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/store/hooks";
import { setSearchOpen } from "@/lib/store/slices/ui-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CatalogFacets } from "@/lib/catalog";
import { useGetCatalogFacetsQuery } from "@/lib/store/services/api";
import { debounce, formatCurrency } from "@/lib/utils";

import { useProductsFilters } from "../hooks/use-products-filters";

interface ProductToolbarProps {
  total: number;
  onOpenFilters: () => void;
}

export function ProductToolbar({ total, onOpenFilters }: ProductToolbarProps) {
  const dispatch = useAppDispatch();
  const { filters, updateFilters, activeFilterCount, clearFilters } = useProductsFilters();
  const { data: facets } = useGetCatalogFacetsQuery();
  const [search, setSearch] = useState(filters.search ?? "");

  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        updateFilters({ search: value || undefined });
      }, 350),
    [updateFilters],
  );

  const chips = useFilterChips(filters, updateFilters, facets);

  return (
    <div className="flex flex-col gap-3 border-b pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search products"
            className="h-10 pl-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateFilters({ search: undefined });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => dispatch(setSearchOpen(true))}
          className="h-10 gap-1.5 text-xs text-primary border-primary/30 bg-primary/5 hover:bg-primary/10 font-semibold"
          title="Open AI Natural Language Search"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Natural Search</span>
        </Button>
        <Button variant="outline" className="lg:hidden" onClick={onOpenFilters}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="-mr-1.5 h-5 px-1.5 text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {total} {total === 1 ? "product" : "products"}
        </span>
        <Select
          value={filters.sort ?? "newest"}
          onValueChange={(value) => updateFilters({ sort: value as never })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-3 py-1 text-xs font-medium"
            >
              {chip.label}
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {chip.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function useFilterChips(
  filters: ReturnType<typeof useProductsFilters>["filters"],
  updateFilters: ReturnType<typeof useProductsFilters>["updateFilters"],
  facets: CatalogFacets | undefined,
) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.category) {
    const name =
      facets?.categories.find((category) => category.slug === filters.category)?.name ??
      filters.category;
    chips.push({
      key: "category",
      label: name,
      onRemove: () => updateFilters({ category: undefined }),
    });
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    const min = formatCurrency(filters.minPrice ?? 0);
    const max = filters.maxPrice != null ? formatCurrency(filters.maxPrice) : "Any";
    chips.push({
      key: "price",
      label: `${min} – ${max}`,
      onRemove: () => updateFilters({ minPrice: undefined, maxPrice: undefined }),
    });
  }
  for (const id of filters.colors ?? []) {
    const name = facets?.colors.find((color) => color.id === id)?.name ?? id;
    chips.push({
      key: `color-${id}`,
      label: name,
      onRemove: () => updateFilters({ colors: (filters.colors ?? []).filter((color) => color !== id) }),
    });
  }
  for (const id of filters.sizes ?? []) {
    const label = facets?.sizes.find((size) => size.id === id)?.label ?? id;
    chips.push({
      key: `size-${id}`,
      label: label,
      onRemove: () => updateFilters({ sizes: (filters.sizes ?? []).filter((size) => size !== id) }),
    });
  }
  for (const brand of filters.brands ?? []) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      onRemove: () => updateFilters({ brands: (filters.brands ?? []).filter((item) => item !== brand) }),
    });
  }
  if (filters.sale) {
    chips.push({ key: "sale", label: "On sale", onRemove: () => updateFilters({ sale: undefined }) });
  }
  if (filters.featured) {
    chips.push({
      key: "featured",
      label: "Featured",
      onRemove: () => updateFilters({ featured: undefined }),
    });
  }
  return chips;
}
