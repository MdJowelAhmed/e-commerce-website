"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, Check, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface InlineAiOutfitProps {
  currentProduct: Product;
}

export function InlineAiOutfit({ currentProduct }: InlineAiOutfitProps) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  // Automatically find 2 best matching items for this product
  const pairedItems = useMemo(() => {
    const others = PRODUCTS.filter((p) => p.id !== currentProduct.id);
    let matched: Product[] = [];

    if (currentProduct.category === "men") {
      // Pair with accessories or other men's essentials
      matched = others.filter((p) => p.category === "accessories" || p.category === "men").slice(0, 2);
    } else if (currentProduct.category === "women") {
      matched = others.filter((p) => p.category === "accessories" || p.category === "women").slice(0, 2);
    } else {
      matched = others.slice(0, 2);
    }

    if (matched.length < 2) {
      matched = others.slice(0, 2);
    }

    return matched;
  }, [currentProduct]);

  const fullLookProducts = [currentProduct, ...pairedItems];

  const rawTotal = fullLookProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = Math.round(rawTotal * 0.15); // 15% bundle savings
  const bundlePrice = rawTotal - bundleDiscount;

  const handleAddFullLook = () => {
    fullLookProducts.forEach((p) => {
      const v = p.variants[0];
      const color = p.colors[0] ?? { id: "default", name: "Standard" };
      const size = p.sizes[0] ?? { id: "standard", label: "Standard" };

      dispatch(
        addItem({
          id: `${p.id}-${v?.id || "outfit"}`,
          productId: p.id,
          productSlug: p.slug,
          name: p.name,
          imageUrl: p.images[0]?.url || "",
          price: Math.round(p.price * 0.85), // 15% discount
          comparePrice: p.price,
          quantity: 1,
          variantId: v?.id ?? `${p.id}-v1`,
          colorId: color.id,
          colorName: color.name,
          sizeId: size.id,
          sizeLabel: size.label,
          stock: p.stock,
        }),
      );
    });

    setAdded(true);
    toast.success(`Complete 3-Piece Outfit added to bag with 15% savings!`);
    dispatch(setCartOpen(true));

    setTimeout(() => setAdded(false), 3000);
  };

  const scrollToFullGenerator = () => {
    const el = document.getElementById("ai-outfit-generator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mt-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-secondary/20 to-background p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Luxe AI Stylist
              </span>
              <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                Save 15% Bundle
              </Badge>
            </div>
            <p className="text-xs font-semibold text-foreground">
              Complete the Look Ensemble
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToFullGenerator}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          <span>More vibes</span>
          <ArrowDown className="h-3 w-3" />
        </button>
      </div>

      {/* 3 Items Row */}
      <div className="mt-3.5 flex items-center justify-between gap-2">
        {fullLookProducts.map((prod, idx) => (
          <div key={prod.id} className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <div className="relative aspect-square w-14 sm:w-16 rounded-xl border bg-background overflow-hidden shadow-xs hover:border-primary transition">
                <Image
                  src={prod.images[0]?.url || ""}
                  alt={prod.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-0 left-0 bg-primary/90 text-primary-foreground text-[8px] font-semibold px-1 py-0.5 rounded-br">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-foreground truncate max-w-full">
                {prod.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatCurrency(prod.price)}
              </p>
            </div>

            {idx < fullLookProducts.length - 1 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground shrink-0 text-xs">
                <Plus className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pricing and Action */}
      <div className="mt-4 pt-3 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold font-display text-foreground">
              {formatCurrency(bundlePrice)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(rawTotal)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            AI Bundle Savings: -{formatCurrency(bundleDiscount)} (15% OFF)
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddFullLook}
          className="w-full sm:w-auto h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-sm"
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add Full Look to Bag</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
