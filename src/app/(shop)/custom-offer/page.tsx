"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  Gift,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CUSTOM_OFFER_TIERS,
  getCustomOfferDiscount,
} from "@/lib/constants";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  activateCustomOffer,
  addItem,
} from "@/lib/store/slices/cart-slice";
import {
  addToCustomOffer,
  clearCustomOffer,
  removeFromCustomOffer,
  updateCustomOfferQuantity,
} from "@/lib/store/slices/commerce-slice";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function CustomOfferPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.commerce.customOfferItems);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(PRODUCTS.map((product) => product.category)))],
    [],
  );
  const products = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (!needle ||
          product.name.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle) ||
          product.tags.some((tag) => tag.toLowerCase().includes(needle))),
    );
  }, [category, query]);

  const selectedProducts = selected
    .map((item) => {
      const product = PRODUCTS.find((candidate) => candidate.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(
      (
        item,
      ): item is {
        product: Product;
        quantity: number;
      } => Boolean(item),
    );
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = getCustomOfferDiscount(subtotal);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const nextTier = [...CUSTOM_OFFER_TIERS]
    .reverse()
    .find((tier) => tier.minimum > subtotal);

  const addOfferToBag = () => {
    if (selectedProducts.length === 0) {
      toast.error("Select at least one product");
      return;
    }

    const variantIds: string[] = [];
    selectedProducts.forEach(({ product, quantity }) => {
      const color = product.colors[0];
      const size = product.sizes.find((option) => option.available) ?? product.sizes[0];
      const variant =
        product.variants.find(
          (option) => option.colorId === color?.id && option.sizeId === size?.id,
        ) ?? product.variants[0];
      if (!color || !size || !variant || variant.stock < 1) return;
      variantIds.push(variant.id);
      dispatch(
        addItem({
          id: product.id,
          productId: product.id,
          productSlug: product.slug,
          name: product.name,
          imageUrl: product.images[0].url,
          price: product.price,
          comparePrice: product.comparePrice,
          quantity: Math.min(quantity, variant.stock),
          variantId: variant.id,
          colorId: color.id,
          colorName: color.name,
          sizeId: size.id,
          sizeLabel: size.label,
          stock: variant.stock,
        }),
      );
    });
    dispatch(activateCustomOffer(variantIds));
    toast.success(
      discount > 0
        ? `${discount}% Custom Offer discount applied`
        : "Custom Offer added to your bag",
    );
    router.push("/cart");
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <header className="rounded-3xl bg-foreground px-6 py-10 text-background md:px-10">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-background/70">
          <Sparkles className="h-4 w-4" />
          Build your bundle
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
          Your products. Your Custom Offer.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-background/70">
          Mix products from any category. Spend over ৳2,000 for 5%, ৳5,000 for
          10%, or ৳10,000 for 15% off your selected bundle.
        </p>
        <div className="mt-7 grid max-w-2xl grid-cols-3 gap-2">
          {[...CUSTOM_OFFER_TIERS].reverse().map((tier) => (
            <div
              key={tier.minimum}
              className={cn(
                "rounded-xl border border-background/20 p-3",
                subtotal >= tier.minimum && "border-success bg-success/15",
              )}
            >
              <p className="text-lg font-semibold">{tier.discount}% off</p>
              <p className="text-xs text-background/60">
                {formatCurrency(tier.minimum)}+
              </p>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="flex flex-col gap-4 border-b pb-5">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search all products"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={category === item ? "default" : "outline"}
                  className="capitalize"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => {
              const item = selected.find((entry) => entry.productId === product.id);
              const selectedQty = item?.quantity ?? 0;
              const outOfStock = product.stock < 1;

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  className={cn(
                    "group flex gap-3 rounded-2xl border bg-background p-2.5 transition",
                    item && "border-foreground ring-1 ring-foreground",
                    outOfStock && "opacity-55",
                  )}
                >
                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() =>
                      item
                        ? dispatch(removeFromCustomOffer(product.id))
                        : dispatch(addToCustomOffer(product.id))
                    }
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-32 sm:w-28"
                    aria-label={item ? `Remove ${product.name}` : `Select ${product.name}`}
                  >
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      fill
                      sizes="112px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span
                      className={cn(
                        "absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full border transition",
                        item
                          ? "border-foreground bg-foreground text-background"
                          : "border-white/80 bg-black/30 text-transparent backdrop-blur",
                      )}
                    >
                      <Check className="h-3.5 w-3.5 text-background" />
                    </span>
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {product.brand}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-medium leading-snug">
                      {product.name}
                    </h2>
                    <p className="mt-auto pt-2 text-sm font-semibold tracking-tight">
                      {formatCurrency(product.price)}
                    </p>

                    {item ? (
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-full border"
                          onClick={() =>
                            selectedQty === 1
                              ? dispatch(removeFromCustomOffer(product.id))
                              : dispatch(
                                  updateCustomOfferQuantity({
                                    productId: product.id,
                                    quantity: selectedQty - 1,
                                  }),
                                )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">
                          {selectedQty}
                        </span>
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-full border"
                          disabled={selectedQty >= product.stock}
                          onClick={() =>
                            dispatch(
                              updateCustomOfferQuantity({
                                productId: product.id,
                                quantity: Math.min(product.stock, selectedQty + 1),
                              }),
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <Badge variant="secondary" className="ml-auto">
                          Selected
                        </Badge>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 w-fit"
                        disabled={outOfStock}
                        onClick={() => dispatch(addToCustomOffer(product.id))}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {outOfStock ? "Out of stock" : "Select"}
                      </Button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <Gift className="h-5 w-5" />
                Your offer
              </h2>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(clearCustomOffer())}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {selectedProducts.length === 0 ? (
              <div className="py-10 text-center">
                <Gift className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Select products to build your offer.
                </p>
              </div>
            ) : (
              <div className="mt-4 max-h-[38vh] space-y-3 overflow-y-auto pr-1">
                {selectedProducts.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 rounded-xl bg-secondary/50 p-2">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.price * quantity)}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          className="grid h-6 w-6 place-items-center rounded-full border"
                          onClick={() =>
                            quantity === 1
                              ? dispatch(removeFromCustomOffer(product.id))
                              : dispatch(
                                  updateCustomOfferQuantity({
                                    productId: product.id,
                                    quantity: quantity - 1,
                                  }),
                                )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs">{quantity}</span>
                        <button
                          type="button"
                          className="grid h-6 w-6 place-items-center rounded-full border"
                          disabled={quantity >= product.stock}
                          onClick={() =>
                            dispatch(
                              updateCustomOfferQuantity({
                                productId: product.id,
                                quantity: Math.min(product.stock, quantity + 1),
                              }),
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive"
                          onClick={() => dispatch(removeFromCustomOffer(product.id))}
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 space-y-2 border-t pt-4 text-sm">
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <SummaryRow
                label={`Discount${discount ? ` (${discount}%)` : ""}`}
                value={`-${formatCurrency(discountAmount)}`}
                highlight={discount > 0}
              />
              <SummaryRow label="Offer total" value={formatCurrency(total)} strong />
            </div>

            {nextTier && (
              <p className="mt-4 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
                Add {formatCurrency(nextTier.minimum - subtotal)} more to unlock{" "}
                <strong className="text-foreground">{nextTier.discount}% off</strong>.
              </p>
            )}
            {discount === 15 && (
              <Badge variant="success" className="mt-4">
                Maximum 15% discount unlocked
              </Badge>
            )}

            <Button
              type="button"
              size="lg"
              className="mt-5 w-full"
              disabled={selectedProducts.length === 0}
              onClick={addOfferToBag}
            >
              <ShoppingBag className="h-4 w-4" />
              Add offer to bag
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
  strong,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={cn("flex justify-between", strong && "border-t pt-3 text-base")}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(strong && "font-semibold", highlight && "text-success")}>
        {value}
      </span>
    </div>
  );
}
