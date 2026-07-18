import { NextResponse } from "next/server";

import { PRODUCTS } from "@/lib/mock-data/products";
import { fuzzySearchProducts } from "@/lib/search";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return NextResponse.json(PRODUCTS.slice(0, 6));

  const host = process.env.MEILISEARCH_HOST;
  const key = process.env.MEILISEARCH_API_KEY;

  if (host) {
    try {
      const response = await fetch(`${host.replace(/\/$/, "")}/indexes/products/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(key ? { Authorization: `Bearer ${key}` } : {}),
        },
        body: JSON.stringify({ q: query, limit: 8, attributesToHighlight: [] }),
        cache: "no-store",
      });
      if (response.ok) {
        const payload = (await response.json()) as { hits?: Product[] };
        return NextResponse.json(payload.hits ?? []);
      }
    } catch {
      // The local fuzzy index keeps search available when Meilisearch is offline.
    }
  }

  return NextResponse.json(fuzzySearchProducts(PRODUCTS, query, 8));
}
