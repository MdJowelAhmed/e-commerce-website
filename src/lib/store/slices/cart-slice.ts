import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem } from "@/types";

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
}

const STORAGE_KEY = "luxe.cart.v1";

function loadInitialState(): CartState {
  if (typeof window === "undefined") {
    return { items: [], couponCode: null, couponDiscount: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], couponCode: null, couponDiscount: 0 };
    const parsed = JSON.parse(raw) as CartState;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      couponCode: parsed.couponCode ?? null,
      couponDiscount: typeof parsed.couponDiscount === "number" ? parsed.couponDiscount : 0,
    };
  } catch {
    return { items: [], couponCode: null, couponDiscount: 0 };
  }
}

function persistState(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

const initialState: CartState = loadInitialState();

const COUPONS: Record<string, number> = {
  LUXE10: 10,
  WELCOME15: 15,
  VIP25: 25,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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
      persistState(state);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; variantId: string; quantity: number }>,
    ) {
      const { id, variantId, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id && i.variantId === variantId);
      if (!item) return;
      const next = Math.max(1, Math.min(quantity, item.stock));
      item.quantity = next;
      persistState(state);
    },
    removeItem(state, action: PayloadAction<{ id: string; variantId: string }>) {
      const { id, variantId } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.id === id && i.variantId === variantId),
      );
      persistState(state);
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
      state.couponDiscount = 0;
      persistState(state);
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
      persistState(state);
    },
    removeCoupon(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
      persistState(state);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon } =
  cartSlice.actions;

export default cartSlice.reducer;
