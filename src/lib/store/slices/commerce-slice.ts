import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { MembershipTier } from "@/lib/constants";
import type { StockAlert } from "@/types";

export interface CustomOfferItem {
  productId: string;
  quantity: number;
}

export interface CommerceState {
  compareIds: string[];
  recentlyViewedIds: string[];
  stockAlerts: StockAlert[];
  loyaltyPoints: number;
  referralCode: string;
  signedInEmail: string | null;
  customOfferItems: CustomOfferItem[];
  membershipTier: MembershipTier;
  membershipExpiresAt: string | null;
}

export const COMMERCE_STORAGE_KEY = "luxe.commerce.v1";

export const emptyCommerceState = (): CommerceState => ({
  compareIds: [],
  recentlyViewedIds: [],
  stockAlerts: [],
  loyaltyPoints: 240,
  referralCode: "LUXE-BD-240",
  signedInEmail: null,
  customOfferItems: [],
  membershipTier: "none",
  membershipExpiresAt: null,
});

export function loadCommerceFromStorage(): CommerceState | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(COMMERCE_STORAGE_KEY) ?? "null",
    ) as Partial<CommerceState> | null;
    if (!parsed) return null;
    const membershipIsActive =
      typeof parsed.membershipExpiresAt === "string" &&
      new Date(parsed.membershipExpiresAt).getTime() > Date.now();
    return {
      ...emptyCommerceState(),
      ...parsed,
      compareIds: Array.isArray(parsed.compareIds) ? parsed.compareIds.slice(0, 4) : [],
      recentlyViewedIds: Array.isArray(parsed.recentlyViewedIds)
        ? parsed.recentlyViewedIds.slice(0, 8)
        : [],
      stockAlerts: Array.isArray(parsed.stockAlerts) ? parsed.stockAlerts : [],
      customOfferItems: Array.isArray(parsed.customOfferItems)
        ? parsed.customOfferItems.filter(
            (item): item is CustomOfferItem =>
              typeof item?.productId === "string" && typeof item?.quantity === "number",
          )
        : [],
      membershipTier:
        membershipIsActive &&
        (parsed.membershipTier === "silver" ||
          parsed.membershipTier === "gold" ||
          parsed.membershipTier === "platinum")
          ? parsed.membershipTier
          : "none",
      membershipExpiresAt:
        membershipIsActive && typeof parsed.membershipExpiresAt === "string"
          ? parsed.membershipExpiresAt
          : null,
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
    signOut(state) {
      state.signedInEmail = null;
    },
    addLoyaltyPoints(state, action: PayloadAction<number>) {
      state.loyaltyPoints = Math.max(0, state.loyaltyPoints + action.payload);
    },
    addToCustomOffer(state, action: PayloadAction<string>) {
      const existing = state.customOfferItems.find(
        (item) => item.productId === action.payload,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.customOfferItems.push({ productId: action.payload, quantity: 1 });
      }
    },
    updateCustomOfferQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      const item = state.customOfferItems.find(
        (entry) => entry.productId === action.payload.productId,
      );
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
    },
    removeFromCustomOffer(state, action: PayloadAction<string>) {
      state.customOfferItems = state.customOfferItems.filter(
        (item) => item.productId !== action.payload,
      );
    },
    clearCustomOffer(state) {
      state.customOfferItems = [];
    },
    activateMembership(state, action: PayloadAction<Exclude<MembershipTier, "none">>) {
      state.membershipTier = action.payload;
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      state.membershipExpiresAt = expiresAt.toISOString();
    },
    cancelMembership(state) {
      state.membershipTier = "none";
      state.membershipExpiresAt = null;
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
  signOut,
  addLoyaltyPoints,
  addToCustomOffer,
  updateCustomOfferQuantity,
  removeFromCustomOffer,
  clearCustomOffer,
  activateMembership,
  cancelMembership,
} = commerceSlice.actions;

export default commerceSlice.reducer;
