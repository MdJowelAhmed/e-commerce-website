import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
}

const initialState: UIState = {
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
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
  },
});

export const { setCartOpen, setMobileMenuOpen, setSearchOpen } = uiSlice.actions;

export default uiSlice.reducer;
