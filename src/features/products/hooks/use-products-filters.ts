"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { ProductsQuery } from "@/lib/store/services/api";

const ARRAY_KEYS = new Set(["colors", "sizes", "brands"]);

/**
 * Hook that synchronizes product listing filters with URL search params.
 * Returns a typed query object and a setter that updates the URL.
 */
export function useProductsFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const filters = useMemo<ProductsQuery>(() => {
    const out: ProductsQuery = {};
    const cat = params.get("category");
    const search = params.get("search");
    const sort = params.get("sort") as ProductsQuery["sort"];
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    const colors = params.get("colors");
    const sizes = params.get("sizes");
    const brands = params.get("brands");
    const sale = params.get("sale");
    const featured = params.get("featured");
    const page = params.get("page");

    if (cat) out.category = cat;
    if (search) out.search = search;
    if (sort) out.sort = sort;
    if (minPrice) out.minPrice = Number(minPrice);
    if (maxPrice) out.maxPrice = Number(maxPrice);
    if (colors) out.colors = colors.split(",").filter(Boolean);
    if (sizes) out.sizes = sizes.split(",").filter(Boolean);
    if (brands) out.brands = brands.split(",").filter(Boolean);
    if (sale === "true") out.sale = true;
    if (featured === "true") out.featured = true;
    if (page) out.page = Number(page);
    return out;
  }, [params]);

  const updateFilters = useCallback(
    (updates: Partial<ProductsQuery>, options: { resetPage?: boolean } = {}) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === false) {
          sp.delete(key);
          return;
        }
        if (Array.isArray(value)) {
          if (value.length === 0) sp.delete(key);
          else sp.set(key, value.join(","));
          return;
        }
        sp.set(key, String(value));
      });
      if (options.resetPage !== false && !("page" in updates)) sp.delete("page");
      router.push(`/products?${sp.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const clearFilters = useCallback(() => {
    router.push("/products", { scroll: false });
  }, [router]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    params.forEach((value, key) => {
      if (key === "sort" || key === "page" || key === "search") return;
      if (ARRAY_KEYS.has(key)) count += value.split(",").filter(Boolean).length;
      else count += 1;
    });
    return count;
  }, [params]);

  return { filters, updateFilters, clearFilters, activeFilterCount };
}
