"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const dispatch = useAppDispatch();

  // Find 2 complementary products from the catalog
  const bundleItems = useMemo(() => {
    const candidates = PRODUCTS.filter(
      (p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.category === "accessories"),
    );
    const selected = candidates.slice(0, 2);
    return [currentProduct, ...selected];
  }, [currentProduct]);

  // Which items are checked (default all selected)
  const [selectedIds, setSelectedIds] = useState<string[]>(bundleItems.map((i) => i.id));

  if (bundleItems.length < 2) return null;

  const toggleItem = (id: string) => {
    if (id === currentProduct.id) return; // Keep primary product selected
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const activeProducts = bundleItems.filter((p) => selectedIds.includes(p.id));
  const rawTotal = activeProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = activeProducts.length >= 2 ? Math.round(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - bundleDiscount;

  const handleAddBundleToBag = () => {
    activeProducts.forEach((p) => {
      const v = p.variants[0];
      const color = p.colors[0] ?? { id: "default", name: "Standard" };
      const size = p.sizes[0] ?? { id: "standard", label: "One Size" };
      dispatch(
        addItem({
          id: p.id,
          productId: p.id,
          productSlug: p.slug,
          name: p.name,
          imageUrl: p.images[0]?.url ?? "",
          price: activeProducts.length >= 2 ? Math.round(p.price * 0.9) : p.price,
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

    toast.success(`Added ${activeProducts.length} items to bag with 10% bundle savings!`);
    dispatch(setCartOpen(true));
  };

  return (
    <div className="mt-12 rounded-3xl border bg-card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
            Bundle & Save
          </span>
          <h3 className="font-display text-2xl font-semibold tracking-tight mt-0.5">
            Frequently Bought Together
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
          10% Extra Bundle Discount
        </span>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row items-center gap-8 justify-between">
        {/* Product Cards Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {bundleItems.map((prod, index) => {
            const isChecked = selectedIds.includes(prod.id);
            return (
              <div key={prod.id} className="flex items-center gap-3">
                <div
                  onClick={() => toggleItem(prod.id)}
                  className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer w-36 sm:w-44 text-center ${
                    isChecked
                      ? "border-primary/80 bg-primary/5 shadow-sm"
                      : "border-border/60 opacity-60 bg-muted/20"
                  }`}
                >
                  <div className="relative aspect-square w-24 sm:w-28 overflow-hidden rounded-xl bg-secondary mb-2">
                    <Image
                      src={prod.images[0]?.url ?? ""}
                      alt={prod.name}
                      fill
                      sizes="120px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-1.5 right-1.5 h-5 w-5 rounded-md border flex items-center justify-center ${
                        isChecked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-input text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <p className="font-medium text-xs text-foreground line-clamp-1 w-full">
                    {prod.name}
                  </p>
                  <p className="text-xs font-semibold text-primary mt-0.5">
                    {formatCurrency(prod.price)}
                  </p>
                </div>

                {index < bundleItems.length - 1 && (
                  <div className="h-8 w-8 rounded-full border bg-secondary/50 flex items-center justify-center text-muted-foreground shrink-0">
                    <Plus className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pricing Summary & Action */}
        <div className="w-full lg:w-72 rounded-2xl border bg-secondary/30 p-5 flex flex-col justify-between shrink-0">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {activeProducts.length} items selected
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(finalTotal)}
              </span>
              {bundleDiscount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(rawTotal)}
                </span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <p className="text-xs text-emerald-600 font-medium mt-1">
                You save {formatCurrency(bundleDiscount)} with this bundle
              </p>
            )}
          </div>

          <Button
            onClick={handleAddBundleToBag}
            className="w-full mt-5 gap-2"
            disabled={activeProducts.length === 0}
          >
            <ShoppingBag className="h-4 w-4" />
            Add Bundle to Bag
          </Button>
        </div>
      </div>
    </div>
  );
}
