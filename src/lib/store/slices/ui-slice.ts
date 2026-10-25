import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  /** True after cart, wishlist, and commerce have been read from localStorage. */
  storeReady: boolean;
}

const initialState: UIState = {
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  storeReady: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.cartOpen = action.payload;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    setStoreReady(state) {
      state.storeReady = true;
    },
  },
});

export const { setCartOpen, setMobileMenuOpen, setSearchOpen, setStoreReady } = uiSlice.actions;

export default uiSlice.reducer;
