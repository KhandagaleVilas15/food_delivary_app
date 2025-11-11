import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setMyOrders, setOrdersLoading, setOrdersError } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

export const useGetUserOrders = () => {
    const dispatch = useDispatch();
    
    const fetchUserOrders = useCallback(async () => {
        try {
            dispatch(setOrdersLoading(true));
            dispatch(setOrdersError(null));
            
            const { data } = await axios.get(`${BASE_URL}/api/order/my-orders`, { withCredentials: true });
            if (data.success) {
                console.log(data, "User orders fetched successfully");
                dispatch(setMyOrders(data.data || []));
            } else {
                const errorMsg = data.message || "Failed to fetch user orders";
                console.log("Failed to fetch user orders:", errorMsg);
                dispatch(setOrdersError(errorMsg));
                dispatch(setMyOrders([]));
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching orders";
            dispatch(setOrdersError(errorMsg));
            dispatch(setMyOrders([]));
        } finally {
            dispatch(setOrdersLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    return fetchUserOrders;
}