import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import shopReducer from "../slices/shopSlice";
import mapReducer from "../slices/mapSlice";



const store = configureStore({
    reducer: {
        // Add your slices here
        user: userReducer,
        shop: shopReducer,
        map: mapReducer,
    },
});
export default store;