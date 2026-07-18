import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem, ShippingMethod } from "@/types";

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  shippingMethod: ShippingMethod;
  customOfferVariantIds: string[];
}

export const CART_STORAGE_KEY = "luxe.cart.v1";

export const COUPONS: Record<string, number> = {
  LUXE10: 10,
  WELCOME15: 15,
  VIP25: 25,
};

export const emptyCartState = (): CartState => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,
  shippingMethod: "standard",
  customOfferVariantIds: [],
});

export function loadCartFromStorage(): CartState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CartState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      couponCode: parsed.couponCode ?? null,
      couponDiscount: typeof parsed.couponDiscount === "number" ? parsed.couponDiscount : 0,
      customOfferVariantIds: Array.isArray(parsed.customOfferVariantIds)
        ? parsed.customOfferVariantIds
        : [],
      shippingMethod:
        parsed.shippingMethod === "express" || parsed.shippingMethod === "standard"
          ? parsed.shippingMethod
          : "standard",
    };
  } catch {
    return null;
  }
}

export function saveCartToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: emptyCartState(),
  reducers: {
    hydrateCart(_state, action: PayloadAction<CartState>) {
      return action.payload;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const existing = state.items.find(
        (item) =>
          item.productId === incoming.productId && item.variantId === incoming.variantId,
      );
      if (existing) {
        existing.quantity = Math.min(existing.quantity + incoming.quantity, existing.stock);
      } else {
        state.items.push({
          ...incoming,
          quantity: Math.min(incoming.quantity, incoming.stock),
        });
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; variantId: string; quantity: number }>,
    ) {
      const { id, variantId, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id && i.variantId === variantId);
      if (!item) return;
      item.quantity = Math.max(1, Math.min(quantity, item.stock));
    },
    removeItem(state, action: PayloadAction<{ id: string; variantId: string }>) {
      const { id, variantId } = action.payload;
      state.items = state.items.filter((i) => !(i.id === id && i.variantId === variantId));
      if (!state.items.some((item) => item.variantId === variantId)) {
        state.customOfferVariantIds = state.customOfferVariantIds.filter(
          (candidate) => candidate !== variantId,
        );
      }
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
      state.couponDiscount = 0;
      state.shippingMethod = "standard";
      state.customOfferVariantIds = [];
    },
    applyCoupon(state, action: PayloadAction<string>) {
      const code = action.payload.toUpperCase().trim();
      const discount = COUPONS[code];
      if (discount) {
        state.couponCode = code;
        state.couponDiscount = discount;
      } else {
        state.couponCode = null;
        state.couponDiscount = 0;
      }
    },
    removeCoupon(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    setShippingMethod(state, action: PayloadAction<ShippingMethod>) {
      state.shippingMethod = action.payload;
    },
    activateCustomOffer(state, action: PayloadAction<string[]>) {
      state.customOfferVariantIds = [...new Set(action.payload)];
    },
  },
});

export const {
  hydrateCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  setShippingMethod,
  activateCustomOffer,
} = cartSlice.actions;

export default cartSlice.reducer;
