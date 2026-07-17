import { type Middleware } from "@reduxjs/toolkit";

import { saveCartToStorage, type CartState } from "./slices/cart-slice";
import { saveWishlistToStorage, type WishlistState } from "./slices/wishlist-slice";

/**
 * Persist cart / wishlist to localStorage after mutations (not inside reducers).
 */
export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const type = (action as { type?: string }).type ?? "";

  if (type.startsWith("cart/") && type !== "cart/hydrateCart") {
    saveCartToStorage(store.getState().cart as CartState);
  }
  if (type.startsWith("wishlist/") && type !== "wishlist/hydrateWishlist") {
    saveWishlistToStorage(store.getState().wishlist as WishlistState);
  }

  return result;
};
