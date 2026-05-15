"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectWishlistItems } from "@/lib/store/selectors";
import { addItem } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { removeFromWishlist } from "@/lib/store/slices/wishlist-slice";
import { formatCurrency } from "@/lib/utils";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const mounted = useMounted();

  if (!mounted) return null;

  const moveToBag = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const color = product.colors[0];
    const size = product.sizes.find((s) => s.available) ?? product.sizes[0];
    const variant =
      product.variants.find((v) => v.colorId === color.id && v.sizeId === size.id) ??
      product.variants[0];
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
    dispatch(removeFromWishlist(productId));
    dispatch(setCartOpen(true));
    toast.success(`${product.name} added to bag`);
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Saved for later</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">Wishlist</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="group relative overflow-hidden rounded-2xl border bg-background"
              >
                <Link
                  href={`/product/${item.productSlug}`}
                  className="relative block aspect-[4/5] bg-secondary"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromWishlist(item.productId))}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="p-4">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="line-clamp-1 text-sm font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-semibold">{formatCurrency(item.price)}</span>
                    {item.comparePrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(item.comparePrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => moveToBag(item.productId)}
                    className="mt-3 w-full"
                    variant="outline"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Move to bag
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border bg-secondary/30 py-24 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-background">
        <Heart className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Save your favorites here so you can come back to them anytime.
      </p>
      <Button asChild className="mt-2">
        <Link href="/products">Browse the collection</Link>
      </Button>
    </motion.div>
  );
}
