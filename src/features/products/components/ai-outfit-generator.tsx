"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface AiOutfitGeneratorProps {
  currentProduct: Product;
}

type OutfitVibe = "casual" | "evening" | "minimalist";

const VIBES: { id: OutfitVibe; label: string; desc: string }[] = [
  { id: "casual", label: "Casual Contemporary", desc: "Effortless daytime elegance" },
  { id: "evening", label: "Evening Statement", desc: "Refined monochrome & tailored finish" },
  { id: "minimalist", label: "Minimalist Luxe", desc: "Clean lines & subtle textural depth" },
];

export function AiOutfitGenerator({ currentProduct }: AiOutfitGeneratorProps) {
  const dispatch = useAppDispatch();
  const [activeVibe, setActiveVibe] = useState<OutfitVibe>("casual");
  const [generating, setGenerating] = useState(false);

  // AI selects matching items based on selected theme & product category
  const outfitProducts = useMemo(() => {
    const others = PRODUCTS.filter((p) => p.id !== currentProduct.id);

    let paired: Product[] = [];
    if (activeVibe === "casual") {
      paired = others.filter((p) => p.category === "men" || p.category === "accessories").slice(0, 2);
    } else if (activeVibe === "evening") {
      paired = others.filter((p) => p.category === "women" || p.category === "accessories").slice(0, 2);
    } else {
      paired = others.slice(2, 4);
    }

    if (paired.length < 2) {
      paired = others.slice(0, 2);
    }

    return [currentProduct, ...paired];
  }, [currentProduct, activeVibe]);

  const handleSwitchVibe = (vibe: OutfitVibe) => {
    if (vibe === activeVibe) return;
    setGenerating(true);
    setTimeout(() => {
      setActiveVibe(vibe);
      setGenerating(false);
    }, 350);
  };

  const rawTotal = outfitProducts.reduce((sum, p) => sum + p.price, 0);
  const discountAmount = Math.round(rawTotal * 0.15); // 15% discount for full look
  const bundlePrice = rawTotal - discountAmount;

  const handleAddOutfitToBag = () => {
    outfitProducts.forEach((p) => {
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
          price: Math.round(p.price * 0.85), // 15% savings
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

    toast.success(`Complete AI Outfit added to bag with 15% bundle savings!`);
    dispatch(setCartOpen(true));
  };

  const stylistNotes = {
    casual: `Our AI Stylist paired the ${currentProduct.name} with relaxed tailored essentials. This ensemble harmonizes muted natural tones for an elevated yet effortless daytime silhouette.`,
    evening: `For refined evening settings, the ${currentProduct.name} is elevated by sharper structural cuts and contrasting dark hues, creating a sharp, commanding presence.`,
    minimalist: `Understated luxury at its core. By stripping away visual clutter, this combination highlights premium textiles and impeccable drape.`,
  };

  return (
    <section id="ai-outfit-generator" className="mt-14 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-9 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            </span>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">
              Luxe AI Stylist
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-1 text-foreground">
            Complete the Look — AI Outfit Generator
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated 3-piece aesthetic combinations styled by our neural fashion model to complement this piece.
          </p>
        </div>

        {/* Style Mood Selector */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-secondary/50 border">
          {VIBES.map((v) => (
            <button
              key={v.id}
              onClick={() => handleSwitchVibe(v.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeVibe === v.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Outfit Items & AI Styling Summary */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Outfit Pieces Cards */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {outfitProducts.map((item, idx) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl border bg-card p-3 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-secondary mb-3">
                  <Image
                    src={item.images[0]?.url || ""}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, 30vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 rounded-md bg-foreground/90 text-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                      This Piece
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {idx === 0 ? "Anchor Item" : idx === 1 ? "Complement" : "Accent Piece"}
                    </span>
                    <p className="font-semibold text-xs text-foreground line-clamp-1 mt-0.5">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-primary mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Stylist Note */}
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <Wand2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-foreground/90">
              <span className="font-semibold text-primary">Stylist Editorial: </span>
              {stylistNotes[activeVibe]}
            </p>
          </div>
        </div>

        {/* Pricing Card & One-Click Add */}
        <div className="lg:col-span-4 rounded-3xl border bg-card p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                3-Piece Ensemble
              </span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-xs">
                15% Outfit Savings
              </Badge>
            </div>

            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                {formatCurrency(bundlePrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(rawTotal)}
              </span>
            </div>

            <p className="text-xs text-emerald-600 font-medium mt-1">
              You save {formatCurrency(discountAmount)} on this curated look
            </p>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground border-t pt-4">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Individually tailored items matched in tone</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Complimentary luxury packaging included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Eligible for free express delivery</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleAddOutfitToBag}
            className="w-full mt-6 gap-2 h-11"
            disabled={generating}
          >
            <ShoppingBag className="h-4 w-4" />
            Add Complete Outfit to Bag
          </Button>
        </div>
      </div>
    </section>
  );
}

