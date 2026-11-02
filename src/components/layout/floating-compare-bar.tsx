"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Scale, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCompare, toggleCompare } from "@/lib/store/slices/commerce-slice";

export function FloatingCompareBar() {
  const mounted = useMounted();
  const dispatch = useAppDispatch();
  const compareIds = useAppSelector((s) => s.commerce.compareIds);

  if (!mounted || compareIds.length === 0) return null;

  const compareProducts = compareIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-md"
        role="region"
        aria-label="Product comparison dock"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left info & thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 pl-2 shrink-0">
              <Scale className="h-4 w-4 text-primary" />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-none">Compare</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {compareProducts.length} of 4 items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {compareProducts.map((p) => (
                <div
                  key={p.id}
                  className="group relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-secondary"
                >
                  <Image
                    src={p.images[0]?.url ?? ""}
                    alt={p.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                  <button
                    onClick={() => dispatch(toggleCompare(p.id))}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    title={`Remove ${p.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearCompare())}
              className="h-8 text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            >
              Clear
            </Button>
            <Button size="sm" asChild className="h-8 gap-1.5 text-xs px-3 shadow-sm">
              <Link href="/compare">
                <span>Compare</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

