"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const color = product.colors[0];
  const size = product.sizes.find((item) => item.available) ?? product.sizes[0];
  const variant =
    product.variants.find((item) => item.colorId === color?.id && item.sizeId === size?.id) ??
    product.variants[0];

  const addToBag = () => {
    if (!color || !size || !variant || variant.stock < 1) return;
    dispatch(
      addItem({
        id: product.id,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        imageUrl: product.images[0].url,
        price: variant.price,
        comparePrice: variant.comparePrice,
        quantity: 1,
        variantId: variant.id,
        colorId: color.id,
        colorName: color.name,
        sizeId: size.id,
        sizeLabel: size.label,
        stock: variant.stock,
      }),
    );
    onOpenChange(false);
    dispatch(setCartOpen(true));
    toast.success(`${product.name} added to bag`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Quick view: {product.name}</DialogTitle>
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] bg-secondary">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              sizes="(min-width: 768px) 384px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {product.brand}
            </p>
            <h2 className="mt-2 font-display text-3xl">{product.name}</h2>
            <p className="mt-3 text-xl font-semibold">{formatCurrency(variant?.price ?? product.price)}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
            <p className="mt-5 text-xs text-muted-foreground">
              Default selection: {color?.name} / {size?.label}
            </p>
            <div className="mt-6 grid gap-3">
              <Button onClick={addToBag} disabled={!variant || variant.stock < 1}>
                <ShoppingBag className="h-4 w-4" />
                {variant?.stock ? "Quick add to bag" : "Out of stock"}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                  <Eye className="h-4 w-4" />
                  View all options
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
