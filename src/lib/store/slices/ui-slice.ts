import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  filtersOpen: boolean;
}

const initialState: UIState = {
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  filtersOpen: false,
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
    setFiltersOpen(state, action: PayloadAction<boolean>) {
      state.filtersOpen = action.payload;
    },
    closeAllOverlays(state) {
      state.cartOpen = false;
      state.mobileMenuOpen = false;
      state.searchOpen = false;
      state.filtersOpen = false;
    },
  },
});

export const {
  setCartOpen,
  setMobileMenuOpen,
  setSearchOpen,
  setFiltersOpen,
  closeAllOverlays,
} = uiSlice.actions;

export default uiSlice.reducer;
