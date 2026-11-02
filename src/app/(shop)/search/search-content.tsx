"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/products/components/product-card";
import { performAiSemanticSearch, type AiSearchResult } from "@/lib/ai-search";
import { PRODUCTS } from "@/lib/mock-data/products";
import type { Product } from "@/types";

const SUGGESTED_QUERIES = [
  "Men's linen shirt under ৳3,000 for summer",
  "Warm wool jacket for winter",
  "Silk evening dress for wedding party",
  "Minimalist leather watch under ৳5,000",
  "Casual cotton t-shirt under ৳2,000",
];

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setResults(PRODUCTS.slice(0, 8));
      setAiResult(null);
      return;
    }

    setLoading(true);
    // Instant semantic matching
    setTimeout(() => {
      const res = performAiSemanticSearch(trimmed);
      setAiResult(res);
      setResults(res.products);
      setLoading(false);
    }, 150);
  };

  useEffect(() => {
    runSearch(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      runSearch(query);
    }
  };

  const handleSelectChip = (prompt: string) => {
    setQuery(prompt);
    router.push(`/search?q=${encodeURIComponent(prompt)}`);
    runSearch(prompt);
  };

  const handleClear = () => {
    setQuery("");
    router.push("/search");
    runSearch("");
  };

  return (
    <div className="container-wide py-10 md:py-16">
      {/* Hero Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>Luxe Neural AI Search Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl"
        >
          AI Semantic & Natural Language Search
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-sm text-muted-foreground sm:text-base"
        >
          Describe whatever you are looking for in natural human phrases or Bengali. Our AI detects category, budget, occasion, and aesthetics.
        </motion.p>

        {/* Big Search Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="relative mt-8 flex items-center shadow-lg rounded-2xl border-2 border-primary/40 bg-card p-1.5 focus-within:border-primary transition-all"
        >
          <div className="grid h-10 w-10 place-items-center text-primary pl-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Men's linen shirt under ৳3,000 for summer beach party..."
            className="flex-1 bg-transparent px-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 outline-none border-none focus:outline-none focus:ring-0 shadow-none h-11"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-2 text-muted-foreground hover:text-foreground p-1 transition"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <Button type="submit" className="rounded-xl px-5 h-11 font-semibold gap-1.5">
            <span>Search</span>
            <ArrowRight className="h-4 w-4 hidden sm:inline" />
          </Button>
        </motion.form>

        {/* Suggested Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Try searching:
          </span>
          {SUGGESTED_QUERIES.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSelectChip(prompt)}
              className="rounded-full border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground/80 hover:border-primary hover:bg-secondary transition-all"
            >
              {prompt}
            </button>
          ))}
        </motion.div>
      </div>

      {/* AI Intent Breakdown & Diagnostics Card */}
      {aiResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mt-10 max-w-4xl rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 via-secondary/20 to-primary/5 p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  AI Intent Parser Result
                </p>
                <p className="text-xs text-foreground font-semibold">
                  {aiResult.explanation}
                </p>
              </div>
            </div>

            <Badge variant="secondary" className="self-start sm:self-auto font-mono text-[11px]">
              {results.length} matches found
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {aiResult.parsedIntent.category && (
              <span className="inline-flex items-center gap-1 rounded-md bg-background px-2.5 py-1 border font-medium text-foreground">
                <Tag className="h-3 w-3 text-primary" />
                Category: <strong className="capitalize">{aiResult.parsedIntent.category}</strong>
              </span>
            )}
            {aiResult.parsedIntent.maxPrice && (
              <span className="inline-flex items-center gap-1 rounded-md bg-background px-2.5 py-1 border font-medium text-foreground">
                <span>💰</span>
                Max Budget: <strong>৳{aiResult.parsedIntent.maxPrice.toLocaleString()}</strong>
              </span>
            )}
            {aiResult.parsedIntent.colors && aiResult.parsedIntent.colors.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-background px-2.5 py-1 border font-medium text-foreground">
                <span>🎨</span>
                Colors: <strong>{aiResult.parsedIntent.colors.join(", ")}</strong>
              </span>
            )}
            {aiResult.parsedIntent.occasions && aiResult.parsedIntent.occasions.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-background px-2.5 py-1 border font-medium text-foreground">
                <span>✨</span>
                Theme: <strong>{aiResult.parsedIntent.occasions.join(", ")}</strong>
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Results Grid */}
      <div className="mt-12">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-lg font-bold font-display text-foreground">
            {query.trim() ? `Search Results for "${query}"` : "Featured Collections"}
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing {results.length} items
          </span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-12 text-center max-w-md mx-auto">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-4 font-semibold text-foreground">No direct matches found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a broader prompt, like "summer shirt", "silk dress", or "leather wallet".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="mt-4 rounded-xl text-xs gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
