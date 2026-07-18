"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Gift, Heart, Scale, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { ActionTooltip } from "@/components/shared/action-tooltip";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import {
  addToCustomOffer,
  toggleCompare,
} from "@/lib/store/slices/commerce-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { toggleWishlist } from "@/lib/store/slices/wishlist-slice";
import { calculateDiscount, cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

import { QuickViewDialog } from "./quick-view-dialog";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export function ProductCard({ product, priority, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const inWishlist = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.productId === product.id),
  );
  const discount = calculateDiscount(product.price, product.comparePrice);
  const inCompare = useAppSelector((s) => s.commerce.compareIds.includes(product.id));
  const inCustomOffer = useAppSelector((s) =>
    s.commerce.customOfferItems.some((item) => item.productId === product.id),
  );

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? product.images[0];

  const handleQuickAdd = () => {
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes.find((s) => s.available) ?? product.sizes[0];
    const variant =
      product.variants.find(
        (v) => v.colorId === defaultColor.id && v.sizeId === defaultSize.id,
      ) ?? product.variants[0];

    dispatch(
      addItem({
        id: product.id,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        imageUrl: primaryImage.url,
        price: variant.price,
        comparePrice: variant.comparePrice,
        quantity: 1,
        variantId: variant.id,
        colorId: defaultColor.id,
        colorName: defaultColor.name,
        sizeId: defaultSize.id,
        sizeLabel: defaultSize.label,
        stock: variant.stock,
      }),
    );
    dispatch(setCartOpen(true));
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = () => {
    dispatch(
      toggleWishlist({
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        imageUrl: primaryImage.url,
        price: product.price,
        comparePrice: product.comparePrice,
        addedAt: new Date().toISOString(),
      }),
    );
    toast.success(inWishlist ? "Removed from wishlist" : "Saved to wishlist");
  };

  const iconBtnClass =
    "grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 block">
          <motion.div
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "object-cover transition-opacity duration-500",
                hovered && product.images.length > 1 ? "opacity-0" : "opacity-100",
              )}
              priority={priority}
            />
          </motion.div>

          {product.images.length > 1 && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "object-cover transition-opacity duration-500",
                hovered ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.isNew && <Badge>New</Badge>}
            {discount > 0 && <Badge variant="accent">-{discount}%</Badge>}
          </div>
          <div className="pointer-events-auto flex flex-col gap-2">
            <ActionTooltip
              label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={iconBtnClass}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    inWishlist && "fill-rose-500 text-rose-500",
                  )}
                />
              </button>
            </ActionTooltip>

            <ActionTooltip label={inCompare ? "Remove from compare" : "Compare products"}>
              <button
                type="button"
                onClick={() => {
                  dispatch(toggleCompare(product.id));
                  toast.success(inCompare ? "Removed from compare" : "Added to compare");
                }}
                aria-label={inCompare ? "Remove from compare" : "Add to compare"}
                className={iconBtnClass}
              >
                <Scale className={cn("h-4 w-4", inCompare && "text-accent")} />
              </button>
            </ActionTooltip>

            <ActionTooltip
              label={
                inCustomOffer
                  ? "Already in Custom Offer · tap to add more"
                  : "Add to Custom Offer"
              }
            >
              <button
                type="button"
                onClick={() => {
                  dispatch(addToCustomOffer(product.id));
                  toast.success(
                    inCustomOffer
                      ? `${product.name} quantity increased`
                      : `${product.name} added to Custom Offer`,
                  );
                }}
                aria-label="Add to custom offer"
                className={iconBtnClass}
              >
                <Gift className={cn("h-4 w-4", inCustomOffer && "fill-accent text-accent")} />
              </button>
            </ActionTooltip>
          </div>
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10">
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 18, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="hidden md:block"
              >
                <div className="grid grid-cols-2 gap-2">
                  <ActionTooltip label="Quick view product details" side="top">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => setQuickViewOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </ActionTooltip>
                  <ActionTooltip label="Add to shopping bag" side="top">
                    <Button type="button" className="w-full shadow-lg" onClick={handleQuickAdd}>
                      <ShoppingBag className="h-4 w-4" />
                      Add
                    </Button>
                  </ActionTooltip>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-2 md:hidden">
            <ActionTooltip label="Quick view product details" side="top">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-full shadow-lg"
                onClick={() => setQuickViewOpen(true)}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
            </ActionTooltip>
            <ActionTooltip label="Add to shopping bag" side="top">
              <Button
                type="button"
                size="sm"
                className="w-full shadow-lg"
                onClick={handleQuickAdd}
              >
                <ShoppingBag className="h-4 w-4" />
                Add
              </Button>
            </ActionTooltip>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {product.brand}
          </span>
          <StarRating value={product.rating} showValue />
        </div>
        <h3 className="line-clamp-1 text-sm font-medium">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
          <div className="flex -space-x-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className="h-3.5 w-3.5 rounded-full border border-background ring-1 ring-border"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
      <QuickViewDialog product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </motion.article>
  );
}
