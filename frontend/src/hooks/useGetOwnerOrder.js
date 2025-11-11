import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setOwnerOrders, setOwnerOrdersLoading, setOwnerOrdersError } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

export const useGetOwnerOrders = () => {
    const dispatch = useDispatch();
    
    const fetchOwnerOrders = useCallback(async () => {
        try {
            dispatch(setOwnerOrdersLoading(true));
            dispatch(setOwnerOrdersError(null));
            
            const { data } = await axios.get(`${BASE_URL}/api/order/owner-orders`, { withCredentials: true });
            if (data.success) {
                console.log(data, "Owner orders fetched successfully");
                dispatch(setOwnerOrders(data.orders || []));
            } else {
                const errorMsg = data.message || "Failed to fetch owner orders";
                console.log("Failed to fetch owner orders:", errorMsg);
                dispatch(setOwnerOrdersError(errorMsg));
                dispatch(setOwnerOrders([]));
            }
        } catch (error) {
            console.error("Error fetching owner orders:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching owner orders";
            dispatch(setOwnerOrdersError(errorMsg));
            dispatch(setOwnerOrders([]));
        } finally {
            dispatch(setOwnerOrdersLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchOwnerOrders();
    }, [fetchOwnerOrders]);

    return fetchOwnerOrders;
}