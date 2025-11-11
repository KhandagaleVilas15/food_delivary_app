import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setCurrentOrders, setCurrentOrdersLoading, setCurrentOrdersError } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

// Proper hook for fetching current orders
export const useGetCurrentOrders = () => {
    const dispatch = useDispatch();
    
    const fetchCurrentOrders = useCallback(async () => {
        try {
            dispatch(setCurrentOrdersLoading(true));
            dispatch(setCurrentOrdersError(null));
            
            const { data } = await axios.get(`${BASE_URL}/api/order/current-order`, { withCredentials: true });
            if (data.success) {
                console.log(data, "Current orders fetched successfully");
                dispatch(setCurrentOrders(data.data));
            } else {
                const errorMsg = data.message || "No current orders found";
                console.log("Failed to fetch current orders:", errorMsg);
                dispatch(setCurrentOrdersError(errorMsg));
                dispatch(setCurrentOrders(null));
            }
        } catch (error) {
            console.error("Error fetching current orders:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching current orders";
            dispatch(setCurrentOrdersError(errorMsg));
            dispatch(setCurrentOrders(null));
        } finally {
            dispatch(setCurrentOrdersLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCurrentOrders();
    }, [fetchCurrentOrders]);

    // Return the fetch function so it can be called manually when needed
    return fetchCurrentOrders;
}