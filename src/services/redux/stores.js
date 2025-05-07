import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./cartSlice/productSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
  },
});
