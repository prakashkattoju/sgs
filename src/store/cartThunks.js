// src/store/cartThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateCart } from "./cartSlice";
import { CheckProductStatus } from "../services/Productsservices";

export const verifyCartItems = createAsyncThunk(
  "cart/verifyCartItems",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const cartItems = state.cart.cart;

    const availableItems = [];
    const removedItems = [];

    // Loop each cart item and check availability from API
    for (const item of cartItems) {
      try {
        const res = await CheckProductStatus(item.product_id)
        // You can change this check based on your API field
        if (res.status === "1" || res.status === 1) {
          availableItems.push(item);
        } else {
          removedItems.push(item);
        }
      } catch (err) {
        console.error("Error checking product:", err);
        removedItems.push(item); // assume unavailable on error
      }
    }

    // Update Redux cart with available items
    dispatch(updateCart(availableItems));
    
    return { availableItems, removedItems };
  }
);
