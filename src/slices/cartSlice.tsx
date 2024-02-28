import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartItems, postChangeCart } from "../api/cartApi";
import { CartItem, CartItemList } from "types";

export const getCartItemsAsync = createAsyncThunk("getCartItemsAsync", async () => {
  return getCartItems();
});

export const postChangeCartAsync = createAsyncThunk(
  "postCartItemsAsync",
  (param: CartItem) => {
    return postChangeCart(param);
  }
);

const initState: CartItemList[] = [];

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItemsAsync.fulfilled, (state, action) => { return action.payload; })
      .addCase(postChangeCartAsync.fulfilled, (state, action) => { return action.payload; });
  },
});

export default cartSlice.reducer;
