import { CATEGORIES } from "@/lib/mock-data/categories";
import { PRODUCTS } from "@/lib/mock-data/products";

export interface CatalogFacets {
  categories: { slug: string; name: string; count: number }[];
  colors: { id: string; name: string; hex: string }[];
  sizes: { id: string; label: string }[];
  brands: string[];
  priceMax: number;
}

/** Filter options derived from the same catalog the product API serves. */
export function getCatalogFacets(): CatalogFacets {
  const colors = new Map<string, { id: string; name: string; hex: string }>();
  const sizes = new Map<string, { id: string; label: string }>();
  const brands = new Set<string>();
  let priceMax = 0;

  for (const product of PRODUCTS) {
    priceMax = Math.max(priceMax, product.price);
    brands.add(product.brand);
    for (const color of product.colors) colors.set(color.id, color);
    for (const size of product.sizes) {
      sizes.set(size.id, { id: size.id, label: size.label });
    }
  }

  const categories = CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: PRODUCTS.filter((product) => product.category === category.slug).length,
  })).filter((category) => category.count > 0);

  const roundedMax = Math.max(10, Math.ceil(priceMax / 10) * 10);

  return {
    categories,
    colors: Array.from(colors.values()),
    sizes: Array.from(sizes.values()),
    brands: Array.from(brands).sort((a, b) => a.localeCompare(b)),
    priceMax: roundedMax,
  };
}
