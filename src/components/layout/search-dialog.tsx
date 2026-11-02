"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { performAiSemanticSearch, type AiSearchResult } from "@/lib/ai-search";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSearchOpen } from "@/lib/store/slices/ui-slice";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

const AI_SAMPLE_PROMPTS = [
  "Summer cotton shirt under ৳3,000",
  "Warm wool overcoat for winter",
  "Silk evening dress for party",
  "Minimalist leather watch under ৳5,000",
];

export function SearchDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.searchOpen);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [isAiMode, setIsAiMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setAiResult(null);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, results]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const openResult = (product: Product) => {
    router.push(`/product/${product.slug}`);
    dispatch(setSearchOpen(false));
  };

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setAiResult(null);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      if (isAiMode) {
        // Run AI Semantic Query Matcher
        const res = performAiSemanticSearch(trimmed);
        setAiResult(res);
        setResults(res.products);
        setLoading(false);
      } else {
        // Standard keyword search
        fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
          .then((r) => r.json())
          .then((data) => setResults(data as Product[]))
          .finally(() => setLoading(false));
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [open, query, isAiMode]);

  return (
    <Dialog open={open} onOpenChange={(v) => dispatch(setSearchOpen(v))}>
      <DialogContent className="top-[10%] max-w-2xl translate-y-0 gap-0 p-0 rounded-3xl border shadow-2xl overflow-hidden">
        <DialogTitle className="sr-only">Search products</DialogTitle>

        {/* Top Mode Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 bg-secondary/30 border-b text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="font-semibold text-primary">Luxe AI Semantic Search</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAiMode(true)}
              className={cn(
                "px-2.5 py-1 rounded-full font-medium transition",
                isAiMode
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              AI Natural Mode
            </button>
            <button
              type="button"
              onClick={() => setIsAiMode(false)}
              className={cn(
                "px-2.5 py-1 rounded-full font-medium transition",
                !isAiMode
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Exact Keyword
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(setSearchOpen(false));
                router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
              }}
              className="px-2 py-1 rounded-full text-primary hover:bg-primary/10 transition font-medium"
              title="Open full AI search page"
            >
              Full Page ↗
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b px-5 py-3.5 bg-background">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (!results.length) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => Math.min(results.length - 1, index + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(0, index - 1));
              } else if (event.key === "Enter" && results[activeIndex]) {
                event.preventDefault();
                openResult(results[activeIndex]);
              }
            }}
            placeholder={
              isAiMode
                ? "Try 'Summer cotton shirt under ৳3000' or 'Party dress'..."
                : "Search by keyword..."
            }
            className="h-auto border-0 px-0 py-0 text-base shadow-none focus-visible:ring-0"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* AI Quick Prompt Chips */}
        {!query && isAiMode && (
          <div className="p-3 border-b bg-secondary/15">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Natural Language Suggestions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {AI_SAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuery(prompt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-background hover:bg-primary/10 hover:border-primary/40 text-xs font-medium text-foreground transition text-left"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Explanation Banner */}
        {aiResult && query.trim() && (
          <div className="px-5 py-2.5 bg-primary/5 border-b flex items-center justify-between text-xs">
            <span className="text-primary font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {aiResult.explanation}
            </span>
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
              AI Parsed
            </Badge>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-[55vh] overflow-y-auto p-2">
          <AnimatePresence mode="wait" initial={false}>
            {results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-5 py-10 text-center text-sm text-muted-foreground"
              >
                {loading
                  ? "Analyzing natural query…"
                  : query.trim()
                    ? <>No matches found for &ldquo;{query}&rdquo;</>
                    : "Type in plain English or Bangla to find products with AI."}
              </motion.div>
            ) : (
              <motion.ul
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                id="search-results"
                role="listbox"
                className="space-y-1"
              >
                {results.map((p, i) => (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <button
                      id={`search-result-${p.id}`}
                      type="button"
                      role="option"
                      aria-selected={i === activeIndex}
                      ref={(node) => {
                        itemRefs.current[i] = node;
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => openResult(p)}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors",
                        i === activeIndex ? "bg-secondary" : "hover:bg-secondary",
                      )}
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-secondary shrink-0">
                        <Image
                          src={p.images[0].url}
                          alt={p.images[0].alt}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                          {isAiMode && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20">
                              AI Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.shortDescription}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{formatCurrency(p.price)}</span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
