import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: []
    },
    reducers: {
        addToCart: (state, action) => {
            const optInCart = state.cart.find((opt) => opt.item_id === action.payload.item_id);
            if (optInCart) {
                optInCart.quantity = optInCart.quantity + 0.5;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        updateCart: (state, action) => {
            state.cart = action.payload;
        },
        incrementQuantity: (state, action) => {
            const opt = state.cart.find((opt) => opt.item_id === action.payload);
            opt.quantity = opt.quantity + 0.5;
        },
        decrementQuantity: (state, action) => {
            const opt = state.cart.find((opt) => opt.item_id === action.payload);
            if (opt.quantity === 1) {
                const removeItem = state.cart.filter((opt) => opt.item_id !== action.payload);
                state.cart = removeItem;
            } else {
                opt.quantity = opt.quantity - 0.5;
            }
        },
        removeFromCart: (state, action) => {
            const removeItem = state.cart.filter((opt) => opt.item_id !== action.payload);
            state.cart = removeItem;
        },
        clearCart: (state) => {
            state.cart = []; // 👈 this empties the cart
        },
    }
});

export const { addToCart, updateCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;