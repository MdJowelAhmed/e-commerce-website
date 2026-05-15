import { createSelector } from "@reduxjs/toolkit";

import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  TAX_RATE,
} from "@/lib/constants";

import type { RootState } from "./store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCouponCode = (state: RootState) => state.cart.couponCode;
export const selectCouponDiscount = (state: RootState) => state.cart.couponDiscount;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectCartTotals = createSelector(
  [selectCartSubtotal, selectCouponDiscount],
  (subtotal, couponDiscount) => {
    const discountAmount = (subtotal * couponDiscount) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const shipping =
      subtotal === 0 || subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_FEE;
    const tax = +(subtotalAfterDiscount * TAX_RATE).toFixed(2);
    const total = +(subtotalAfterDiscount + shipping + tax).toFixed(2);
    return {
      subtotal: +subtotal.toFixed(2),
      discount: +discountAmount.toFixed(2),
      shipping,
      tax,
      total,
    };
  },
);

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectIsInWishlist = (productId: string) =>
  createSelector(selectWishlistItems, (items) =>
    items.some((item) => item.productId === productId),
  );
