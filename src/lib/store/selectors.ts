import { createSelector } from "@reduxjs/toolkit";

import {
  EXPRESS_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  getCustomOfferDiscount,
  getMembershipDiscount,
  STANDARD_SHIPPING_FEE,
  TAX_RATE,
} from "@/lib/constants";

import type { RootState } from "./store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCouponCode = (state: RootState) => state.cart.couponCode;
export const selectCouponDiscount = (state: RootState) => state.cart.couponDiscount;
export const selectShippingMethod = (state: RootState) => state.cart.shippingMethod;
export const selectCustomOfferVariantIds = (state: RootState) =>
  state.cart.customOfferVariantIds;
export const selectMembershipTier = (state: RootState) =>
  state.commerce.membershipTier;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartLineCount = createSelector(selectCartItems, (items) => items.length);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectCartTotals = createSelector(
  [
    selectCartSubtotal,
    selectCartItems,
    selectCouponDiscount,
    selectShippingMethod,
    selectCustomOfferVariantIds,
    selectMembershipTier,
  ],
  (
    subtotal,
    items,
    couponDiscount,
    shippingMethod,
    customOfferVariantIds,
    membershipTier,
  ) => {
    const customOfferSubtotal = items
      .filter((item) => customOfferVariantIds.includes(item.variantId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const customOfferDiscount = getCustomOfferDiscount(customOfferSubtotal);
    const couponDiscountAmount = (subtotal * couponDiscount) / 100;
    const customOfferDiscountAmount =
      (customOfferSubtotal * customOfferDiscount) / 100;
    const membershipDiscount = getMembershipDiscount(membershipTier);
    // Membership applies to the remaining amount after Custom Offer discount.
    const membershipBase = Math.max(0, subtotal - customOfferDiscountAmount);
    const membershipDiscountAmount = (membershipBase * membershipDiscount) / 100;
    const stackedDiscountAmount = customOfferDiscountAmount + membershipDiscountAmount;
    const useCoupon = couponDiscountAmount > stackedDiscountAmount;
    const discountAmount = useCoupon ? couponDiscountAmount : stackedDiscountAmount;
    const discountSource = useCoupon
      ? "coupon"
      : customOfferDiscountAmount > 0 && membershipDiscountAmount > 0
        ? "stacked"
        : membershipDiscountAmount > 0
          ? "membership"
          : "custom-offer";
    const subtotalAfterDiscount = subtotal - discountAmount;

    let shipping = 0;
    if (subtotal > 0) {
      if (shippingMethod === "express") {
        shipping = EXPRESS_SHIPPING_FEE;
      } else if (subtotalAfterDiscount < FREE_SHIPPING_THRESHOLD) {
        shipping = STANDARD_SHIPPING_FEE;
      }
    }

    const tax = +(subtotalAfterDiscount * TAX_RATE).toFixed(2);
    const total = +(subtotalAfterDiscount + shipping + tax).toFixed(2);
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount);

    return {
      subtotal: +subtotal.toFixed(2),
      discount: +discountAmount.toFixed(2),
      discountSource,
      customOfferSubtotal: +customOfferSubtotal.toFixed(2),
      customOfferDiscount,
      customOfferDiscountAmount: +customOfferDiscountAmount.toFixed(2),
      membershipDiscount,
      membershipDiscountAmount: +membershipDiscountAmount.toFixed(2),
      membershipTier,
      subtotalAfterDiscount: +subtotalAfterDiscount.toFixed(2),
      shipping,
      tax,
      total,
      amountToFreeShipping: +amountToFreeShipping.toFixed(2),
      shippingMethod,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
  },
);

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectIsInWishlist = (productId: string) =>
  createSelector(selectWishlistItems, (items) =>
    items.some((item) => item.productId === productId),
  );
