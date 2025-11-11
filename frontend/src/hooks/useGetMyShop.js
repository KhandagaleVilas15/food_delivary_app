import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopData, setShopLoading, setShopError } from "../redux/slices/shopSlice";
import { useEffect, useCallback, useRef } from "react";
import { BASE_URL } from "../config/constant";
import toast from "react-hot-toast";

export const useGetShopByOwner = () => {
    const dispatch = useDispatch();
    const didFetchRef = useRef(false); // guard to prevent duplicate fetch in React StrictMode
    
    const fetchShop = useCallback(async () => {
        try {
            dispatch(setShopLoading(true));
            dispatch(setShopError(null));
            
            const { data } = await axios.get(`${BASE_URL}/api/shop/get-shop`, { withCredentials: true });
            if (data.success) {
                console.log("Fetched shop data:", data.data);
                toast.success(data?.message || "Shop data fetched successfully");
                dispatch(setShopData(data.data));
            } else {
                const errorMsg = data.message || "Failed to fetch shop data";
                console.log("Failed to fetch shop data:", errorMsg);
                toast.error(errorMsg);
                dispatch(setShopError(errorMsg));
                dispatch(setShopData(null));
            }
        } catch (error) {
            console.error("Error fetching shop data:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching shop data";
            toast.error(errorMsg);
            dispatch(setShopError(errorMsg));
            dispatch(setShopData(null));
        } finally {
            dispatch(setShopLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        if (didFetchRef.current) return; // Skip duplicate effect in dev StrictMode
        didFetchRef.current = true;
        fetchShop();
    }, [fetchShop]);

    return fetchShop;
}