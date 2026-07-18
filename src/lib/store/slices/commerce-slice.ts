import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { StockAlert } from "@/types";

export interface CommerceState {
  compareIds: string[];
  recentlyViewedIds: string[];
  stockAlerts: StockAlert[];
  loyaltyPoints: number;
  referralCode: string;
  signedInEmail: string | null;
}

export const COMMERCE_STORAGE_KEY = "luxe.commerce.v1";

export const emptyCommerceState = (): CommerceState => ({
  compareIds: [],
  recentlyViewedIds: [],
  stockAlerts: [],
  loyaltyPoints: 240,
  referralCode: "LUXE-BD-240",
  signedInEmail: null,
});

export function loadCommerceFromStorage(): CommerceState | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(COMMERCE_STORAGE_KEY) ?? "null",
    ) as Partial<CommerceState> | null;
    if (!parsed) return null;
    return {
      ...emptyCommerceState(),
      ...parsed,
      compareIds: Array.isArray(parsed.compareIds) ? parsed.compareIds.slice(0, 4) : [],
      recentlyViewedIds: Array.isArray(parsed.recentlyViewedIds)
        ? parsed.recentlyViewedIds.slice(0, 8)
        : [],
      stockAlerts: Array.isArray(parsed.stockAlerts) ? parsed.stockAlerts : [],
    };
  } catch {
    return null;
  }
}

export function saveCommerceToStorage(state: CommerceState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COMMERCE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore private mode and quota errors.
  }
}

const commerceSlice = createSlice({
  name: "commerce",
  initialState: emptyCommerceState(),
  reducers: {
    hydrateCommerce(_state, action: PayloadAction<CommerceState>) {
      return action.payload;
    },
    toggleCompare(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.compareIds.includes(id)) {
        state.compareIds = state.compareIds.filter((item) => item !== id);
      } else if (state.compareIds.length < 4) {
        state.compareIds.push(id);
      }
    },
    clearCompare(state) {
      state.compareIds = [];
    },
    addRecentlyViewed(state, action: PayloadAction<string>) {
      state.recentlyViewedIds = [
        action.payload,
        ...state.recentlyViewedIds.filter((id) => id !== action.payload),
      ].slice(0, 8);
    },
    addStockAlert(state, action: PayloadAction<StockAlert>) {
      state.stockAlerts = [
        action.payload,
        ...state.stockAlerts.filter(
          (alert) =>
            !(
              alert.productId === action.payload.productId &&
              alert.variantId === action.payload.variantId
            ),
        ),
      ];
    },
    signInAndSync(state, action: PayloadAction<string>) {
      state.signedInEmail = action.payload;
      state.loyaltyPoints += 25;
    },
    addLoyaltyPoints(state, action: PayloadAction<number>) {
      state.loyaltyPoints = Math.max(0, state.loyaltyPoints + action.payload);
    },
  },
});

export const {
  hydrateCommerce,
  toggleCompare,
  clearCompare,
  addRecentlyViewed,
  addStockAlert,
  signInAndSync,
  addLoyaltyPoints,
} = commerceSlice.actions;

export default commerceSlice.reducer;
