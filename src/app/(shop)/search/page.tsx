import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageContent } from "./search-content";

export const metadata: Metadata = {
  title: "AI Semantic Search | Luxe",
  description:
    "Search products using natural language and AI understanding. Find luxury pieces by budget, occasion, style, or color.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-wide py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading AI Search Engine...</p>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

