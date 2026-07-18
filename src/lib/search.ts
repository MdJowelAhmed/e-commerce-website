import type { Product } from "@/types";

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      previous = saved;
    }
  }
  return row[b.length];
}

export function fuzzySearchProducts(products: Product[], query: string, limit = 8) {
  const needle = normalize(query);
  if (!needle) return products.slice(0, limit);

  return products
    .map((product) => {
      const fields = [product.name, product.brand, product.category, ...product.tags].map(normalize);
      const words = fields.flatMap((field) => field.split(" "));
      const exact = fields.some((field) => field.includes(needle));
      const closest = Math.min(...words.map((word) => editDistance(needle, word)));
      const threshold = Math.max(1, Math.floor(needle.length * 0.35));
      return { product, score: exact ? 0 : closest <= threshold ? closest + 1 : Infinity };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => a.score - b.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((item) => item.product);
}
