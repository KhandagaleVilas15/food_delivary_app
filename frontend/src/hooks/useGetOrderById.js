import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setOrdersLoading, setOrdersError, setOrderDetailsById, setOrderDetailsByIdError, setOrderDetailsByIdLoading } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

export const useGetOrderById = (orderId) => {
    const dispatch = useDispatch();

    const fetchOrderById = useCallback(async () => {
        try {
            dispatch(setOrdersLoading(true));
            dispatch(setOrdersError(null));

            const { data } = await axios.get(`${BASE_URL}/api/order/get-order-by-id/${orderId}`, { withCredentials: true });
            if (data.success) {
                console.log(data, "User orders fetched successfully");
                dispatch(setOrderDetailsById(data.data || {}));
            } else {
                const errorMsg = data.message || "Failed to fetch user orders";
                console.log("Failed to fetch user orders:", errorMsg);
                dispatch(setOrderDetailsByIdError(errorMsg));
                dispatch(setOrderDetailsById(null));
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching orders";
            dispatch(setOrderDetailsByIdError(errorMsg));
            dispatch(setOrderDetailsById(null));
        } finally {
            dispatch(setOrderDetailsByIdLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchOrderById();
    }, [fetchOrderById]);

    return fetchOrderById;
}