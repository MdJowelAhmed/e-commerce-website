"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartItems } from "@/lib/store/selectors";
import { removeItem, updateQuantity } from "@/lib/store/slices/cart-slice";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);

  return (
    <div className="container-wide py-10 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Bag</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
            Your shopping bag
          </h1>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </motion.div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border bg-background">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.variantId}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4 border-b p-5 last:border-b-0 sm:flex-row sm:items-start"
                >
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary sm:w-28"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="text-base font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.colorName} · {item.sizeLabel}
                      </p>
                      <div className="mt-3 inline-flex items-center rounded-full border">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                variantId: item.variantId,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-secondary"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                variantId: item.variantId,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-secondary"
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="text-right">
                        <p className="text-base font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        {item.comparePrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCurrency(item.comparePrice * item.quantity)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeItem({ id: item.id, variantId: item.variantId }))
                        }
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border bg-secondary/30 py-24 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-background">
        <ShoppingBag className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">Your bag is empty</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Looks like you haven't added anything yet. Discover our new arrivals and best sellers.
      </p>
      <Button asChild className="mt-2">
        <Link href="/products">Start shopping</Link>
      </Button>
    </motion.div>
  );
}
