import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { WishlistItem } from "@/types";

export interface WishlistState {
  items: WishlistItem[];
}

export const WISHLIST_STORAGE_KEY = "luxe.wishlist.v1";

export const emptyWishlistState = (): WishlistState => ({ items: [] });

export function loadWishlistFromStorage(): WishlistState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WishlistState;
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return null;
  }
}

export function saveWishlistToStorage(state: WishlistState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: emptyWishlistState(),
  reducers: {
    hydrateWishlist(_state, action: PayloadAction<WishlistState>) {
      return action.payload;
    },
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const existing = state.items.findIndex((i) => i.productId === action.payload.productId);
      if (existing >= 0) {
        state.items.splice(existing, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { hydrateWishlist, toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
