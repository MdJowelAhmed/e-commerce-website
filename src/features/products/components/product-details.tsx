"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { toggleWishlist } from "@/lib/store/slices/wishlist-slice";
import { calculateDiscount, cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

import { ProductGallery } from "./product-gallery";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const inWishlist = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.productId === product.id),
  );

  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [sizeId, setSizeId] = useState(
    product.sizes.find((s) => s.available)?.id ?? product.sizes[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const selectedColor = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const selectedSize = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];

  const variant = useMemo(
    () =>
      product.variants.find((v) => v.colorId === colorId && v.sizeId === sizeId) ??
      product.variants[0],
    [product.variants, colorId, sizeId],
  );

  useEffect(() => {
    setQuantity(1);
  }, [variant?.id]);

  const galleryImages = useMemo(() => {
    if (!variant?.imageId) return product.images;
    const idx = product.images.findIndex((img) => img.id === variant.imageId);
    if (idx <= 0) return product.images;
    return [product.images[idx], ...product.images.filter((_, i) => i !== idx)];
  }, [product.images, variant?.imageId]);

  const discount = calculateDiscount(variant.price, variant.comparePrice);
  const inStock = variant.stock > 0 && selectedSize.available;

  const handleAddToCart = () => {
    if (!inStock) return;
    dispatch(
      addItem({
        id: product.id,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        imageUrl: galleryImages[0]?.url ?? product.images[0].url,
        price: variant.price,
        comparePrice: variant.comparePrice,
        quantity,
        variantId: variant.id,
        colorId: selectedColor.id,
        colorName: selectedColor.name,
        sizeId: selectedSize.id,
        sizeLabel: selectedSize.label,
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
        imageUrl: galleryImages[0]?.url ?? product.images[0].url,
        price: product.price,
        comparePrice: product.comparePrice,
        addedAt: new Date().toISOString(),
      }),
    );
    toast.success(inWishlist ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGallery images={galleryImages} productName={product.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>{product.brand}</span>
            <span>·</span>
            <span>{product.category}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} size="md" showValue />
            <span className="text-sm text-muted-foreground">
              · {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <motion.span
              key={variant.price}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl tracking-tight"
            >
              {formatCurrency(variant.price)}
            </motion.span>
            {variant.comparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(variant.comparePrice)}
                </span>
                <Badge variant="accent">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{product.shortDescription}</p>

          <Separator className="my-6" />

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Color</p>
              <p className="text-xs text-muted-foreground">{selectedColor.name}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  className={cn(
                    "relative h-10 w-10 rounded-full border transition-all",
                    c.id === colorId
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "hover:scale-110",
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                >
                  {c.id === colorId && (
                    <Check
                      className={cn(
                        "absolute inset-0 m-auto h-4 w-4",
                        isLightColor(c.hex) ? "text-foreground" : "text-white",
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Size</p>
              <button
                type="button"
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isActive = s.id === sizeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => s.available && setSizeId(s.id)}
                    disabled={!s.available}
                    className={cn(
                      "relative min-w-14 rounded-full border px-4 py-2 text-sm transition",
                      isActive && "border-foreground bg-foreground text-background",
                      !isActive && s.available && "hover:border-foreground/40",
                      !s.available &&
                        "cursor-not-allowed text-muted-foreground line-through opacity-60",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">Quantity</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary"
                  disabled={quantity <= 1}
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(variant.stock, q + 1))}
                  className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary"
                  disabled={quantity >= variant.stock}
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm">
                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    In stock — {variant.stock} available
                  </span>
                ) : (
                  <span className="text-destructive">Out of stock</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingBag className="h-4 w-4" />
                {inStock ? "Add to bag" : "Sold out"}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                variant="outline"
                onClick={handleWishlist}
                className="w-full sm:w-auto"
              >
                <Heart className={cn("h-4 w-4", inWishlist && "fill-rose-500 text-rose-500")} />
                {inWishlist ? "Saved" : "Save"}
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ServicePill icon={Truck} title="Free shipping" subtitle="Over $75" />
            <ServicePill icon={RefreshCw} title="30-day returns" subtitle="Easy & free" />
            <ServicePill icon={ShieldCheck} title="Secure checkout" subtitle="SSL encrypted" />
          </div>

          <Separator className="my-8" />

          <div className="space-y-4 text-sm">
            <div>
              <h2 className="font-semibold">Description</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
            <div>
              <h2 className="font-semibold">Highlights</h2>
              <ul className="mt-2 space-y-1.5">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ServicePill({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background p-3 text-xs">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{title}</p>
        <p className="truncate text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
}
