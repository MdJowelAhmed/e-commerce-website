"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  hydrateCart,
  loadCartFromStorage,
} from "./slices/cart-slice";
import {
  hydrateCommerce,
  loadCommerceFromStorage,
} from "./slices/commerce-slice";
import {
  hydrateWishlist,
  loadWishlistFromStorage,
} from "./slices/wishlist-slice";
import { type AppStore, makeStore } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const cart = loadCartFromStorage();
    if (cart) store.dispatch(hydrateCart(cart));

    const wishlist = loadWishlistFromStorage();
    if (wishlist) store.dispatch(hydrateWishlist(wishlist));

    const commerce = loadCommerceFromStorage();
    if (commerce) store.dispatch(hydrateCommerce(commerce));

    return setupListeners(store.dispatch);
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
