"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectCartCount,
  selectCartItems,
  selectCartTotals,
} from "@/lib/store/selectors";
import { removeItem, updateQuantity } from "@/lib/store/slices/cart-slice";
import { setCartOpen } from "@/lib/store/slices/ui-slice";
import { cn, formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.cartOpen);
  const items = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const totals = useAppSelector(selectCartTotals);

  const progress = Math.min(
    100,
    Math.round(
      ((totals.subtotalAfterDiscount) / FREE_SHIPPING_THRESHOLD) * 100,
    ),
  );
  const remaining = totals.amountToFreeShipping;

  return (
    <Sheet open={open} onOpenChange={(v) => dispatch(setCartOpen(v))}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5" />
            Your Bag
            <span className="text-sm font-normal text-muted-foreground">
              ({cartCount} {cartCount === 1 ? "item" : "items"})
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review the items you've added to your cart and proceed to checkout.
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 && (
          <div className="border-b bg-secondary/40 px-6 py-3 text-sm">
            {remaining > 0 ? (
              <p className="text-foreground/80">
                Add <span className="font-semibold">{formatCurrency(remaining)}</span> more for{" "}
                <span className="font-semibold">free shipping</span>
              </p>
            ) : (
              <p className="text-success">You've unlocked free shipping</p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-amber-500"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence initial={false} mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Your bag is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Browse the collection and find something you love.
                </p>
                <Button className="mt-2" onClick={() => dispatch(setCartOpen(false))} asChild>
                  <Link href="/products">
                    Shop now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.ul layout className="divide-y">
                {items.map((item) => (
                  <motion.li
                    key={`${item.id}-${item.variantId}`}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 p-5"
                  >
                    <Link
                      href={`/product/${item.productSlug}`}
                      onClick={() => dispatch(setCartOpen(false))}
                      className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-secondary"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.productSlug}`}
                            onClick={() => dispatch(setCartOpen(false))}
                            className="line-clamp-2 text-sm font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.colorName} · {item.sizeLabel}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(removeItem({ id: item.id, variantId: item.variantId }))
                          }
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-full border">
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
                            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
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
                            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
                            disabled={item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          {item.comparePrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatCurrency(item.comparePrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-t bg-background p-5"
          >
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className={cn("font-medium text-foreground", totals.shipping === 0 && "text-success")}>
                  {totals.shipping === 0 ? "FREE" : formatCurrency(totals.shipping)}
                </span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Estimated total</span>
              <span className="text-2xl font-semibold tracking-tight">
                {formatCurrency(totals.total)}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button variant="outline" asChild onClick={() => dispatch(setCartOpen(false))}>
                <Link href="/cart">View bag</Link>
              </Button>
              <Button asChild onClick={() => dispatch(setCartOpen(false))}>
                <Link href="/checkout">
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
