import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { WishlistItem } from "@/types";

export interface WishlistState {
  items: WishlistItem[];
}

const STORAGE_KEY = "luxe.wishlist.v1";

function loadInitialState(): WishlistState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as WishlistState;
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

function persist(state: WishlistState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const initialState: WishlistState = loadInitialState();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const existing = state.items.findIndex((i) => i.productId === action.payload.productId);
      if (existing >= 0) {
        state.items.splice(existing, 1);
      } else {
        state.items.unshift(action.payload);
      }
      persist(state);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state);
    },
    clearWishlist(state) {
      state.items = [];
      persist(state);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
