"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "./services/api";
import cartReducer from "./slices/cart-slice";
import uiReducer from "./slices/ui-slice";
import wishlistReducer from "./slices/wishlist-slice";

export const rootReducer = combineReducers({
  ui: uiReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  [api.reducerPath]: api.reducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [],
        },
      }).concat(api.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

let _store: AppStore | undefined;

export const getStore = (): AppStore => {
  if (!_store) {
    _store = makeStore();
    setupListeners(_store.dispatch);
  }
  return _store;
};
