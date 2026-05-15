import { NextResponse } from "next/server";

import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { PRODUCTS } from "@/lib/mock-data/products";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? Number.MAX_SAFE_INTEGER);
  const colors = (searchParams.get("colors")?.split(",") ?? []).filter(Boolean);
  const sizes = (searchParams.get("sizes")?.split(",") ?? []).filter(Boolean);
  const brands = (searchParams.get("brands")?.split(",") ?? []).filter(Boolean);
  const sale = searchParams.get("sale") === "true";
  const featured = searchParams.get("featured") === "true";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Math.min(48, Math.max(1, Number(searchParams.get("perPage") ?? PRODUCTS_PER_PAGE)));

  let items: Product[] = [...PRODUCTS];

  if (category) items = items.filter((p) => p.category === category);
  if (search) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.tags.some((t) => t.toLowerCase().includes(search)),
    );
  }
  items = items.filter((p) => p.price >= minPrice && p.price <= maxPrice);
  if (colors.length) {
    items = items.filter((p) => p.colors.some((c) => colors.includes(c.id)));
  }
  if (sizes.length) {
    items = items.filter((p) => p.sizes.some((s) => sizes.includes(s.id) && s.available));
  }
  if (brands.length) {
    items = items.filter((p) => brands.includes(p.brand));
  }
  if (sale) items = items.filter((p) => p.isOnSale);
  if (featured) items = items.filter((p) => p.isFeatured);

  items.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.reviewCount - a.reviewCount;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

  return NextResponse.json({
    items: paginated,
    total,
    page: safePage,
    perPage,
    totalPages,
  });
}
