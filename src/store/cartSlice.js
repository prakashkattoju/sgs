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
                optInCart.itemUnitValue = action.payload.itemUnit === "KG" || action.payload.itemUnit === "G" ? optInCart.itemUnitValue : optInCart.itemUnitValue++;
            } else {
                state.cart.push({ ...action.payload, itemUnitValue: action.payload.itemUnit === "KG" || action.payload.itemUnit === "G" ? action.payload.itemUnitValue : 1 });
            }
        },
        updateCart: (state, action) => {
            state.cart = action.payload;
        },

        incrementQuantity: (state, action) => {
            const opt = state.cart.find((opt) => opt.item_id === action.payload);
            opt.itemUnitValue++;
            opt.totalPrice = opt.itemUnitValue * opt.price;
        },

        decrementQuantity: (state, action) => {
            const opt = state.cart.find((opt) => opt.item_id === action.payload);
            if (opt.itemUnitValue === 1) {
                const removeItem = state.cart.filter((opt) => opt.item_id !== action.payload);
                state.cart = removeItem;
            } else {
                opt.itemUnitValue--;
                opt.totalPrice = opt.itemUnitValue * opt.price;
            }
        },
        removeFromCart: (state, action) => {
            const removeItem = state.cart.filter((opt) => opt.item_id != action.payload);
            state.cart = removeItem;
        },
        clearCart: (state) => {
            state.cart = []; // 👈 this empties the cart
        },
    }
});

export const { addToCart, updateCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;