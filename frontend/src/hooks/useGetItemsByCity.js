import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setItemsByCity, setItemsLoading, setItemsError } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";
import toast from "react-hot-toast";

export const useGetItemsByCity = (city) => {
    const dispatch = useDispatch();
    
    const fetchItems = useCallback(async () => {
        if (!city || city.trim() === "") {
            dispatch(setItemsByCity([]));
            dispatch(setItemsError(null));
            return;
        }
        
        try {
            dispatch(setItemsLoading(true));
            dispatch(setItemsError(null));
            
            const { data } = await axios.get(`${BASE_URL}/api/item/getItems/${encodeURIComponent(city)}`, { withCredentials: true });
            if (data.success) {
                dispatch(setItemsByCity(data.data || []));
            } else {
                const errorMsg = data.message || `No items found for city: ${city}`;
                console.log("Failed to fetch items by city:", errorMsg);
                dispatch(setItemsError(errorMsg));
                toast.error(errorMsg);
                dispatch(setItemsByCity([]));
            }
        } catch (error) {
            console.error("Error fetching items by city:", error);
            const errorMsg = error.response?.data?.message || error.message || `Network error while fetching items for ${city}`;
            dispatch(setItemsError(errorMsg));
            toast.error(errorMsg);
            dispatch(setItemsByCity([]));
        } finally {
            dispatch(setItemsLoading(false));
        }
    }, [dispatch, city]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return fetchItems;
}