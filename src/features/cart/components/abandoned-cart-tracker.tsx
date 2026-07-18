"use client";

import { useEffect } from "react";

import { useAppSelector } from "@/lib/store/hooks";

const STORAGE_KEY = "luxe.abandoned-cart.v1";

export function AbandonedCartTracker() {
  const items = useAppSelector((state) => state.cart.items);
  const email = useAppSelector((state) => state.commerce.signedInEmail);

  useEffect(() => {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        email,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        recoveryDueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        channel: email ? "email" : "onsite",
        status: "scheduled-demo",
      }),
    );
  }, [email, items]);

  return null;
}
