"use client";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useGetCatalogFacetsQuery } from "@/lib/store/services/api";
import { formatCurrency } from "@/lib/utils";

import { useProductsFilters } from "../hooks/use-products-filters";

export function ProductFilters({ onClose }: { onClose?: () => void }) {
  const { filters, updateFilters, clearFilters, activeFilterCount } = useProductsFilters();
  const { data: facets, isError, refetch, isLoading } = useGetCatalogFacetsQuery();

  const allColors = facets?.colors ?? [];
  const allSizes = facets?.sizes ?? [];
  const allBrands = facets?.brands ?? [];
  const categories = facets?.categories ?? [];
  const priceMax = facets?.priceMax ?? 0;

  const [price, setPrice] = useState<[number, number]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 0,
  ]);

  useEffect(() => {
    if (!facets) return;
    setPrice([filters.minPrice ?? 0, filters.maxPrice ?? facets.priceMax]);
  }, [facets, filters.minPrice, filters.maxPrice]);

  const toggleArray = (key: "colors" | "sizes" | "brands", value: string) => {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({ [key]: next } as never);
  };

  return (
    <aside className="space-y-1">
      <div className="flex items-center justify-between border-b py-3">
        <h3 className="text-sm font-semibold">
          Filters {activeFilterCount > 0 && (
            <span className="ml-1 text-xs text-muted-foreground">({activeFilterCount})</span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => {
            clearFilters();
            setPrice([0, priceMax]);
            onClose?.();
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      </div>

      {isError && (
        <div className="py-4 text-sm text-muted-foreground">
          <p>Filters could not be loaded.</p>
          <button type="button" onClick={() => refetch()} className="mt-2 underline">
            Try again
          </button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["category", "price", "color"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {isLoading && <p className="text-xs text-muted-foreground">Loading filters…</p>}
            {categories.map((cat) => (
              <label
                key={cat.slug}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={filters.category === cat.slug}
                  onCheckedChange={(checked) =>
                    updateFilters({ category: checked ? cat.slug : undefined })
                  }
                />
                <span className="flex-1">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="overflow-visible px-1 pt-3">
              <Slider
              value={priceMax > 0 ? price : [0, 0]}
              min={0}
              max={priceMax || 1}
              step={5}
              disabled={!facets}
              onValueChange={(v) => setPrice([v[0], v[1]])}
              onValueCommit={(v) =>
                updateFilters({
                  minPrice: v[0] > 0 ? v[0] : undefined,
                  maxPrice: v[1] < priceMax ? v[1] : undefined,
                })
              }
            />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(price[0])}</span>
              <span>{formatCurrency(price[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-2">
              {allColors.map((c) => {
                const active = filters.colors?.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={Boolean(active)}
                    onClick={() => toggleArray("colors", c.id)}
                    className={`relative h-9 w-9 rounded-full border transition-all ${
                      active
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => {
                const active = filters.sizes?.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={Boolean(active)}
                    onClick={() => toggleArray("sizes", s.id)}
                    className={`min-w-[3rem] rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {allBrands.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.brands?.includes(b) ?? false}
                  onCheckedChange={() => toggleArray("brands", b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other">
          <AccordionTrigger>Other</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={filters.sale ?? false}
                onCheckedChange={(checked) =>
                  updateFilters({ sale: checked ? true : undefined })
                }
              />
              On sale
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={filters.featured ?? false}
                onCheckedChange={(checked) =>
                  updateFilters({ featured: checked ? true : undefined })
                }
              />
              Featured
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {onClose && (
        <Button className="mt-6 w-full" onClick={onClose}>
          Show results
        </Button>
      )}
    </aside>
  );
}
