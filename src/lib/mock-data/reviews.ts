import type { Review } from "@/types";

export const REVIEWS: Record<string, Review[]> = {
  "p-001": [
    {
      id: "r-001",
      author: "Amelia R.",
      rating: 5,
      title: "Truly worth every penny",
      body: "The drape is unbelievable - I get stopped on the street weekly. Sizing runs true.",
      createdAt: "2026-03-02T12:00:00.000Z",
      verified: true,
    },
    {
      id: "r-002",
      author: "Sophie M.",
      rating: 4,
      title: "Beautiful, slightly oversized",
      body: "Size down if you want a more tailored silhouette. Otherwise stunning.",
      createdAt: "2026-02-22T08:00:00.000Z",
      verified: true,
    },
  ],
  "p-002": [
    {
      id: "r-003",
      author: "James K.",
      rating: 5,
      title: "Genuine luxury",
      body: "Construction is impeccable. They will easily last 20 years with proper care.",
      createdAt: "2026-01-30T15:00:00.000Z",
      verified: true,
    },
  ],
  "p-003": [
    {
      id: "r-004",
      author: "Liam W.",
      rating: 5,
      title: "My new favorite sweater",
      body: "Soft, lightweight, holds its shape. I bought a second one.",
      createdAt: "2025-12-12T10:00:00.000Z",
      verified: true,
    },
  ],
};

export function getReviewsForProduct(productId: string): Review[] {
  return REVIEWS[productId] ?? [];
}
