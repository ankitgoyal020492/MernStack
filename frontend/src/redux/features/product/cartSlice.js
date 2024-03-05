import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: sessionStorage.getItem("shippingInfo") && sessionStorage.getItem("shippingInfo") !== undefined ? JSON.parse(sessionStorage.getItem("shippingInfo")) : {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        name:"",
        phoneNo:"",
    },
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.loading = true;
            const index = state.cartItems.findIndex(
                (i) => i.productId === action.payload.productId
            );

            if (index !== -1) state.cartItems[index] = action.payload;
            else state.cartItems.push(action.payload);
            state.loading = false;
            localStorage.setItem("cartItems", JSON.stringify(current(state).cartItems));
        },

        removeCartItem: (state, action) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(
                (i) => i.productId !== action.payload
            );
            state.loading = false;
            localStorage.setItem("cartItems", JSON.stringify(current(state).cartItems));
        },

        calculatePrice: (state) => {
            const subtotal = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            state.subtotal = subtotal;
            state.shippingCharges = subtotal > 0 ? (state.subtotal > 1000 ? 0 : 200) : 0;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
        },

        discountApplied: (state, action) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            sessionStorage.setItem("shippingInfo", JSON.stringify(current(state).shippingInfo));
        },
        resetCart: () => initialState,
    },
});

export const {
    addToCart,
    removeCartItem,
    calculatePrice,
    discountApplied,
    saveShippingInfo,
    resetCart,
} = cartSlice.actions;