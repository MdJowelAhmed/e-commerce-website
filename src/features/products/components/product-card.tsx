"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { toggleWishlist } from "@/lib/store/slices/wishlist-slice";
import { calculateDiscount, cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export function ProductCard({ product, priority, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);
  const inWishlist = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.productId === product.id),
  );
  const discount = calculateDiscount(product.price, product.comparePrice);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        href={`/product/${product.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
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

          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5">
              {product.isNew && <Badge>New</Badge>}
              {discount > 0 && (
                <Badge variant="accent">-{discount}%</Badge>
              )}
            </div>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  inWishlist && "fill-rose-500 text-rose-500",
                )}
              />
            </button>
          </div>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 18, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-3 bottom-3 hidden md:block"
              >
                <Button
                  type="button"
                  className="w-full shadow-lg"
                  onClick={handleQuickAdd}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Quick add
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {product.brand}
            </span>
            <StarRating value={product.rating} showValue />
          </div>
          <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>

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
      </Link>
    </motion.article>
  );
}
