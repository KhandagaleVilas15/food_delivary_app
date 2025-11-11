import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopByCity, setShopByCityLoading, setShopByCityError } from "../redux/slices/shopSlice";
import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../config/constant";

export const useGetShopByCity = (city) => {
    const dispatch = useDispatch();
    
    const fetchShop = useCallback(async () => {
        if (!city || city.trim() === "") {
            dispatch(setShopByCity([]));
            dispatch(setShopByCityError(null));
            return;
        }
        
        try {
            dispatch(setShopByCityLoading(true));
            dispatch(setShopByCityError(null));
            
            console.log('Fetching shops for city:', city);
            const { data } = await axios.get(`${BASE_URL}/api/shop/get-shop-by-city/${encodeURIComponent(city)}`, { 
                withCredentials: true 
            });
            
            if (data.success) {
                console.log('Shops fetched successfully:', data.data);
                toast.success(`Shops fetched successfully for ${city}`);
                dispatch(setShopByCity(data.data || []));
            } else {
                const errorMsg = data.message || `No shops found in ${city}`;
                console.log("Failed to fetch shops:", errorMsg);
                dispatch(setShopByCityError(errorMsg));
                toast.error(errorMsg);
                dispatch(setShopByCity([]));
            }
        } catch (error) {
            console.error("Error fetching shops by city:", error);
            const errorMsg = error.response?.data?.message || error.message || `Network error while fetching shops for ${city}`;
            dispatch(setShopByCityError(errorMsg));
            toast.error(errorMsg);
            dispatch(setShopByCity([]));
        } finally {
            dispatch(setShopByCityLoading(false));
        }
    }, [dispatch, city]);
    
    useEffect(() => {
        fetchShop();
    }, [fetchShop]);

    return fetchShop;
};