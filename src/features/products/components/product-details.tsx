"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  Bell,
  Gift,
  Heart,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cart-slice";
import {
  addRecentlyViewed,
  addStockAlert,
  addToCustomOffer,
  toggleCompare,
} from "@/lib/store/slices/commerce-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { toggleWishlist } from "@/lib/store/slices/wishlist-slice";
import { calculateDiscount, cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

import { AiOutfitGenerator } from "./ai-outfit-generator";
import { InlineAiOutfit } from "./inline-ai-outfit";
import { FrequentlyBoughtTogether } from "./frequently-bought-together";
import { ProductGallery } from "./product-gallery";
import { ProductSocialShare } from "./product-social-share";
import { SizeGuideDialog } from "./size-guide-dialog";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const inWishlist = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.productId === product.id),
  );

  const availableSizes = product.sizes.filter((size) => size.available);
  const requiresSizeChoice = availableSizes.length > 1;
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [sizeId, setSizeId] = useState(requiresSizeChoice ? "" : (availableSizes[0]?.id ?? ""));
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [ctaInView, setCtaInView] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const inCompare = useAppSelector((s) => s.commerce.compareIds.includes(product.id));
  const inCustomOffer = useAppSelector((s) =>
    s.commerce.customOfferItems.some((item) => item.productId === product.id),
  );

  useEffect(() => {
    dispatch(addRecentlyViewed(product.id));
  }, [dispatch, product.id]);

  const selectedColor = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const selectedSize = product.sizes.find((s) => s.id === sizeId);

  const variant = useMemo(() => {
    if (sizeId) {
      return (
        product.variants.find((v) => v.colorId === colorId && v.sizeId === sizeId) ??
        product.variants[0]
      );
    }
    return product.variants.find((v) => v.colorId === colorId) ?? product.variants[0];
  }, [product.variants, colorId, sizeId]);

  useEffect(() => {
    setQuantity(1);
  }, [variant?.id]);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCtaInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const galleryImages = useMemo(() => {
    if (!variant?.imageId) return product.images;
    const idx = product.images.findIndex((img) => img.id === variant.imageId);
    if (idx <= 0) return product.images;
    return [product.images[idx], ...product.images.filter((_, i) => i !== idx)];
  }, [product.images, variant?.imageId]);

  const displayPrice = selectedSize ? variant.price : product.price;
  const displayCompare = selectedSize ? variant.comparePrice : product.comparePrice;
  const discount = calculateDiscount(displayPrice, displayCompare);
  const inStock = Boolean(selectedSize?.available && variant.stock > 0 && variant.sizeId === selectedSize.id);
  const needsSize = requiresSizeChoice && !selectedSize;

  const focusSize = () => {
    sizeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast.message("Choose a size first");
  };

  const handleAddToCart = () => {
    if (needsSize || !selectedSize || !selectedColor) {
      focusSize();
      return;
    }
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

  const handleStockAlert = (event: React.FormEvent) => {
    event.preventDefault();
    if (!alertEmail.includes("@") || !variant) {
      toast.error("Enter a valid email address");
      return;
    }
    dispatch(
      addStockAlert({
        productId: product.id,
        variantId: variant.id,
        email: alertEmail,
        createdAt: new Date().toISOString(),
      }),
    );
    setAlertEmail("");
    toast.success("We will notify you when this item is back");
  };

  return (
    <div className="container-wide py-10 pb-28 lg:py-14 lg:pb-14">
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
              key={displayPrice}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl tracking-tight"
            >
              {formatCurrency(displayPrice)}
            </motion.span>
            {displayCompare && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(displayCompare)}
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

          <div ref={sizeSectionRef} className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Size
                {needsSize && <span className="ml-2 text-xs font-normal text-accent">Select one</span>}
              </p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs font-medium text-foreground underline underline-offset-4"
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
                  aria-pressed={isActive}
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

          {!inStock && (
            <form onSubmit={handleStockAlert} className="mt-5 rounded-xl border bg-secondary/40 p-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Bell className="h-4 w-4" />
                Back-in-stock alert
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(event) => setAlertEmail(event.target.value)}
                  placeholder="you@email.com"
                  className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" variant="secondary">Notify me</Button>
              </div>
            </form>
          )}

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
                {needsSize ? (
                  <span className="text-muted-foreground">Choose a size to see availability</span>
                ) : inStock ? (
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

          <div ref={ctaRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!needsSize && !inStock}
              >
                <ShoppingBag className="h-4 w-4" />
                {needsSize ? "Select a size" : inStock ? "Add to bag" : "Sold out"}
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
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                variant="outline"
                onClick={() => {
                  dispatch(toggleCompare(product.id));
                  toast.success(inCompare ? "Removed from compare" : "Added to compare");
                }}
                className="w-full sm:w-auto"
              >
                <Scale className="h-4 w-4" />
                {inCompare ? "Comparing" : "Compare"}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                variant="outline"
                onClick={() => {
                  dispatch(addToCustomOffer(product.id));
                  toast.success(
                    inCustomOffer
                      ? `${product.name} quantity increased`
                      : `${product.name} added to Custom Offer`,
                  );
                }}
                className="w-full sm:w-auto"
              >
                <Gift className="h-4 w-4" />
                {inCustomOffer ? "In offer" : "Offer"}
              </Button>
            </motion.div>
          </div>

          {/* AI Outfit & Look Pairing Card (Immediate Above-The-Fold Visibility) */}
          <InlineAiOutfit currentProduct={product} />

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ServicePill
              icon={Truck}
              title="Free shipping"
              subtitle={`Over ${formatCurrency(FREE_SHIPPING_THRESHOLD)}`}
            />
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
            <Separator className="my-4" />
            <ProductSocialShare productName={product.name} />
          </div>
        </motion.div>
      </div>

      {/* Luxe AI Stylist Outfit Generator */}
      <AiOutfitGenerator currentProduct={product} />

      <FrequentlyBoughtTogether currentProduct={product} />
      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
      {!ctaInView && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
              <Image
                src={galleryImages[0]?.url ?? product.images[0].url}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(displayPrice)}</p>
            </div>
            <Button type="button" onClick={handleAddToCart} disabled={!needsSize && !inStock}>
              {needsSize ? "Select size" : inStock ? "Add" : "Sold out"}
            </Button>
          </div>
        </div>
      )}
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
