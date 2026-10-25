"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSearchOpen } from "@/lib/store/slices/ui-slice";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function SearchDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.searchOpen);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
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
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (response.ok) setResults((await response.json()) as Product[]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 180 : 0);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [open, query]);

  return (
    <Dialog open={open} onOpenChange={(v) => dispatch(setSearchOpen(v))}>
      <DialogContent className="top-[10%] max-w-2xl translate-y-0 gap-0 p-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 border-b px-5 py-4">
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
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[activeIndex] ? `search-result-${results[activeIndex].id}` : undefined}
            placeholder="Search the collection…"
            aria-label="Search products"
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
        <div className="max-h-[60vh] overflow-y-auto p-2">
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
                  ? "Searching…"
                  : query.trim()
                    ? <>No matches for <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span></>
                    : "Search by name, brand, or tag."}
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
                {!query.trim() && (
                  <li className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Popular pieces
                  </li>
                )}
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
                        "flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors",
                        i === activeIndex ? "bg-secondary" : "hover:bg-secondary",
                      )}
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={p.images[0].url}
                          alt={p.images[0].alt}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(p.price)}</span>
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
