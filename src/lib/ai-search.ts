import { PRODUCTS } from "@/lib/mock-data/products";
import type { Product } from "@/types";

export interface AiSearchResult {
  query: string;
  parsedIntent: {
    category?: string;
    maxPrice?: number;
    colors?: string[];
    occasions?: string[];
    keywords: string[];
  };
  explanation: string;
  products: Product[];
}

export function performAiSemanticSearch(query: string): AiSearchResult {
  const q = query.toLowerCase().trim();

  // Extract Price Constraints (e.g. "under 3000", "below 5000", "less than 10000", "3000 taka")
  let maxPrice: number | undefined;
  const priceMatch = q.match(/(?:under|below|less than|within|upto|sub)\s*(?:৳|tk|taka)?\s*(\d+[\d,]*)/i)
    || q.match(/(\d+[\d,]*)\s*(?:৳|tk|taka)/i);

  if (priceMatch && priceMatch[1]) {
    maxPrice = parseInt(priceMatch[1].replace(/,/g, ""), 10);
  }

  // Extract Category
  let category: string | undefined;
  if (q.includes("men") || q.includes("man") || q.includes("male") || q.includes("chele")) {
    category = "men";
  } else if (q.includes("women") || q.includes("woman") || q.includes("female") || q.includes("meye") || q.includes("dress")) {
    category = "women";
  } else if (q.includes("watch") || q.includes("bag") || q.includes("accessory") || q.includes("jewelry") || q.includes("belt")) {
    category = "accessories";
  } else if (q.includes("shoe") || q.includes("boot") || q.includes("loafer") || q.includes("footwear")) {
    category = "shoes";
  }

  // Extract Colors
  const KNOWN_COLORS = ["black", "white", "navy", "blue", "camel", "beige", "brown", "green", "silver", "gold", "gray", "grey"];
  const detectedColors = KNOWN_COLORS.filter((color) => q.includes(color));

  // Extract Occasions / Seasons
  const OCCASIONS = ["summer", "winter", "wedding", "party", "formal", "casual", "dinner", "office", "holiday", "beach"];
  const detectedOccasions = OCCASIONS.filter((occ) => q.includes(occ));

  // Filter & Score Products
  const scored = PRODUCTS.map((product) => {
    let score = 0;
    const name = product.name.toLowerCase();
    const desc = product.description.toLowerCase();
    const prodCategory = product.category.toLowerCase();
    const tags = product.tags.map((t) => t.toLowerCase());

    // Category matching
    if (category && (prodCategory === category || tags.includes(category))) {
      score += 30;
    }

    // Price matching
    if (maxPrice !== undefined) {
      if (product.price <= maxPrice) {
        score += 25;
      } else {
        score -= 40; // Penalize products exceeding budget
      }
    }

    // Color matching
    detectedColors.forEach((c) => {
      if (product.colors.some((col) => col.name.toLowerCase().includes(c) || col.id.toLowerCase().includes(c))) {
        score += 20;
      }
    });

    // Occasion / Tag matching
    detectedOccasions.forEach((occ) => {
      if (tags.some((t) => t.includes(occ)) || desc.includes(occ) || name.includes(occ)) {
        score += 20;
      }
    });

    // Word token matching
    const tokens = q.split(/\s+/).filter((w) => w.length > 2);
    tokens.forEach((t) => {
      if (name.includes(t)) score += 15;
      if (tags.some((tag) => tag.includes(t))) score += 10;
      if (desc.includes(t)) score += 5;
    });

    return { product, score };
  });

  const matchingResults = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);

  const fallback = PRODUCTS.slice(0, 4);
  const finalProducts = matchingResults.length > 0 ? matchingResults.slice(0, 6) : fallback;

  // Build AI Explanation
  const reasons: string[] = [];
  if (category) reasons.push(`Category: ${category.toUpperCase()}`);
  if (maxPrice) reasons.push(`Budget ≤ ৳${maxPrice.toLocaleString()}`);
  if (detectedColors.length) reasons.push(`Color: ${detectedColors.join(", ")}`);
  if (detectedOccasions.length) reasons.push(`Theme: ${detectedOccasions.join(", ")}`);

  const explanation = reasons.length > 0
    ? `AI Semantic Filter: ${reasons.join(" • ")} (Found ${matchingResults.length || finalProducts.length} matches)`
    : `AI Semantic Search: Matched relevant luxury pieces for "${query}"`;

  return {
    query,
    parsedIntent: {
      category,
      maxPrice,
      colors: detectedColors,
      occasions: detectedOccasions,
      keywords: q.split(/\s+/),
    },
    explanation,
    products: finalProducts,
  };
}

