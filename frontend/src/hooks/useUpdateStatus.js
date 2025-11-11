import axios from "axios";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../config/constant";

// Hook contract:
// - Call inside a component to get a function: updateStatus(orderId, shopOrderId, status)
// - It performs the API call and optionally dispatches updated data
export const useUpdateStatus = () => {
  const dispatch = useDispatch();

  const updateStatus = useCallback(async (orderId, shopOrderId, status) => {
    try {
      const { data: resp } = await axios.put(
        `${BASE_URL}/api/order/update-order-status/${orderId}/${shopOrderId}`,
        { status },
        { withCredentials: true }
      );
      if (resp?.success) {
        console.log("Order status updated successfully");
      }
      return resp;
    } catch (error) {
      console.log(error?.message);
      throw error;
    }
  }, [dispatch]);

  return updateStatus;
};
