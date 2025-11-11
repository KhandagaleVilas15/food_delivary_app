import { createSlice } from "@reduxjs/toolkit";

// Get shop from localStorage if it exists
const getShopFromStorage = () => {
    try {
        const shop = localStorage.getItem('shopInfo');
        return shop ? JSON.parse(shop) : null;
    } catch (error) {
        return null;
    }
};

const shopSlice = createSlice({
    name: "shop",
    initialState: {
        shopInfo: getShopFromStorage(), // Initialize from localStorage
        shopByCity: [],
        loading: false,
        shopByCityLoading: false,
        error: null,
        shopByCityError: null,
    },
    reducers: {
        setShopData: (state, action) => {
            state.shopInfo = action.payload;
            state.loading = false;
            state.error = null;
            if (action.payload) {
                localStorage.setItem('shopInfo', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('shopInfo');
            }
        },
        setShopByCity: (state, action) => {
            state.shopByCity = action.payload;
            state.shopByCityLoading = false;
            state.shopByCityError = null;
        },
        clearShopData: (state) => {
            state.shopInfo = null;
            state.error = null;
            state.shopByCityError = null;
            localStorage.removeItem('shopInfo');
        },
        setShopLoading: (state, action) => {
            state.loading = action.payload;
        },
        setShopError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setShopByCityLoading: (state, action) => {
            state.shopByCityLoading = action.payload;
        },
        setShopByCityError: (state, action) => {
            state.shopByCityError = action.payload;
            state.shopByCityLoading = false;
        }
    },
});

export const { 
    setShopData, clearShopData, setShopLoading, setShopError, setShopByCity,
    setShopByCityLoading, setShopByCityError
} = shopSlice.actions;

export default shopSlice.reducer;